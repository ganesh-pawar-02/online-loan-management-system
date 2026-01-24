import React, { useEffect, useState } from 'react';
import AdminSidebar from './AdminSidebar'; // Use the AdminSidebar component
import AdminNavbar from './AdminNavbar'; // Use the AdminNavbar component
import StackedBarChart from '../components/charts/BarChart';
import StackedAreaChart from '../components/charts/AreaChart';
import BiaxialLineChart from '../components/charts/LineChart';
import { useTheme } from '@mui/material/styles';
import TwoSimplePieChart from "../components/charts/PieChart";
import PieChartWithPaddingAngle from "../components/charts/PieChartPadding";
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import { useCallback } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { Box } from '@mui/material';
import axios from 'axios';

const AdminDashboard = ({ transactionData }) => {



    const [registeredUsersCount, setRegisteredUsersCount] = useState(0);
    const [LoanAppliedCount, setLoanAppliedCount] = useState(0);
    const [KycAppliedCount, setKycAppliedCount] = useState(0);
    const [walletBalance, setWalletBalance] = useState(0);

    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';


    const fetchWalletBalance = useCallback(async () => {
        try {
            const token = sessionStorage.getItem('authToken');
            if (!token) {
                throw new Error('Authentication token is missing. Please log in.');
            }
            const response = await fetch('http://65.2.80.0:8080/wallet/balance', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                const errorMsg = await response.text();
                throw new Error(errorMsg || 'Failed to fetch wallet balance');
            }
            const data = await response.json();
            setWalletBalance(data); // Set the wallet balance
        } catch (err) {
            console.error('Error fetching wallet balance:', err);
            toast.error('Error fetching wallet balance!');
        }
    }, []);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await axios.get('http://65.2.80.0:8080/api/users/AllUsers/count');
                setRegisteredUsersCount(response.data);

                const responseL = await axios.get('http://65.2.80.0:8080/loan-applications/Loancount');
                setLoanAppliedCount(responseL.data);

                const responseK = await axios.get('http://65.2.80.0:8080/kyc/kyccount');
                setKycAppliedCount(responseK.data);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        };

        fetchDashboardData();
        fetchWalletBalance();
    }, []);

    return (

        <Box className="min-h-screen flex flex-col">
            <AdminNavbar isAuthenticated={true} />
            <Box className="flex flex-row flex-grow">
                <Box className="w-1/5 bg-gray-100 p-4">
                    <AdminSidebar />
                </Box>
                <Box className="w-4/5 p-6">
                    <div className="grid grid-cols-6 gap-4">
                        <div className="col-span-7">
                            <div className="grid grid-cols-3 gap-4">
                                <div className={`rounded-lg flex justify-center p-2 shadow-md min-h-[100px] ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                                    <div className="flex">
                                        <div className="bg-purple-100 rounded-full my-5 p-5">
                                            <AccountBalanceWalletIcon className="text-purple-500" />
                                        </div>
                                        <div className="ml-5 mt-6">
                                            <div className="font-semibold text-xl">{LoanAppliedCount}</div>
                                            <div className="text-xs text-slate-500 font-semibold">Loan Applications</div>
                                        </div>
                                    </div>
                                </div>
                                <div className={`rounded-lg flex justify-center p-2 shadow-md min-h-[100px] ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                                    <div className="flex">
                                        <div className="bg-blue-100 rounded-full my-5 p-5">
                                            <CreditScoreIcon className="text-blue-500" />
                                        </div>
                                        <div className="ml-5 mt-6">
                                            <div className="font-semibold text-xl">{registeredUsersCount}</div>
                                            <div className="text-xs text-slate-500 font-semibold">User Accounts</div>
                                        </div>
                                    </div>
                                </div>
                                <div className={`rounded-lg flex justify-center p-2 shadow-md min-h-[100px] ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                                    <div className="flex">
                                        <div className="bg-blue-100 rounded-full my-5 p-5">
                                            <NoteAltIcon className="text-blue-500" />
                                        </div>
                                        <div className="ml-5 mt-6">
                                            <div className="font-semibold text-xl">{KycAppliedCount}</div>
                                            <div className="text-xs text-slate-500 font-semibold">Kyc Applications</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={`mt-4 rounded-lg flex justify-center p-2 shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                                <BiaxialLineChart transactionData={transactionData} />
                            </div>

                            {/* Pie Charts */}
                            <div className="grid grid-cols-2 gap-4 mt-4">
                                <div className={`rounded-lg flex justify-center p-1 shadow-md min-h-[50px] ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                                    <div className="flex">
                                        <div className="bg-yellow-100 rounded-full my-2 p-1">
                                            <AccountBalanceIcon className="text-yellow-500" />
                                        </div>

                                        <div className="ml-5 mt-1">
                                            <div className="font-semibold text-lg">₹{walletBalance}</div> {/* Display wallet balance */}
                                            <div className="text-xs text-slate-500 font-semibold">Total Balance</div>
                                        </div>
                                    </div>
                                </div>

                                <div className={`rounded-lg flex justify-center p-1 shadow-md min-h-[50px] ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                                    <div className="flex">
                                        <div className="bg-yellow-100 rounded-full my-2 p-1">
                                            <AccountBalanceIcon className="text-yellow-500" />
                                        </div>

                                        <div className="ml-5 mt-1">
                                            <div className="font-semibold text-lg">₹{walletBalance}</div> {/* Display wallet balance */}
                                            <div className="text-xs text-slate-500 font-semibold">Balance remained</div>
                                        </div>
                                    </div>
                                </div>

                            </div>

                        </div>
                    </div>
                </Box>
            </Box>
        </Box>
    );
};

export default AdminDashboard;