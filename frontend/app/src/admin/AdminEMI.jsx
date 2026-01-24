import React, { useEffect, useState } from "react";
import { Box, Card, CircularProgress } from "@mui/material";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import DataGridTable from "../components/DataGridTable";
import axios from "axios"; // Import axios

const AdminEmi = () => {
    const [emiTransactions, setEmiTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [recordColumns, setRecordColumns] = useState([]);

    // Define columns to only include the desired fields
    const columns = [
        { field: "transaction_id", headerName: "Transaction ID", width: 150 },
        { field: "amount", headerName: "Amount", width: 150 },
        { field: "transaction_date", headerName: "Date", width: 150 },
        { field: "transaction_status", headerName: "Status", width: 150 },
        { field: "transaction_type", headerName: "Type", width: 150 }
    ];

    // Fetch EMI Received transactions from the API
    const fetchEmiReceivedTransactions = async () => {
        try {
            const response = await axios.get("http://65.2.80.0:8080/transactions/emi-received", {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("authToken")}`, // Pass token here
                },
            });

            // Map the response to the format required by the DataGrid (using the response data directly)
            const transactions = response.data.map((transaction) => ({
                id: transaction.id, // Ensure each row has an id property
                transaction_id: transaction.id,
                amount: transaction.amount,
                transaction_date: transaction.date,
                transaction_status: transaction.status,
                transaction_type: transaction.type,
            }));

            setEmiTransactions(transactions); // Set the transactions to state
        } catch (error) {
            console.error("Error fetching EMI received transactions:", error);
        } finally {
            setLoading(false); // Stop loading spinner after data is fetched
        }
    };

    useEffect(() => {
        fetchEmiReceivedTransactions(); // Fetch the EMI transactions when component mounts
        setRecordColumns(columns); // Set columns without action column
    }, []);

    return (
        <Box className="min-h-screen flex flex-col">
            {/* Navbar */}
            <AdminNavbar isAuthenticated={true} />

            <Box className="flex flex-row flex-grow">
                {/* Sidebar */}
                <Box className="w-1/5 bg-gray-100 p-4">
                    <AdminSidebar />
                </Box>

                {/* Main Content */}
                <Box className="w-4/5 p-6">
                    <Card sx={{ p: 4, boxShadow: 3 }}>
                        <h1 className="text-2xl font-bold text-blue-600 mb-4">
                            EMI Received Transactions
                        </h1>

                        {/* Data Grid Table */}
                        {!loading ? (
                            <DataGridTable
                                data={emiTransactions}
                                columns={recordColumns}
                            />
                        ) : (
                            <Box className="flex justify-center items-center h-40">
                                <CircularProgress />
                            </Box>
                        )}
                    </Card>
                </Box>
            </Box>
        </Box>
    );
};

export default AdminEmi;
