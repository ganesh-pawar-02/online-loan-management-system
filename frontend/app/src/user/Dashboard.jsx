import React, { useState, useEffect } from 'react';
import UserSidebar from './UserSidebar';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
  Button,
  Grid,
} from '@mui/material';
import { green, yellow, red } from '@mui/material/colors';
import Navbar from './Navbar';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [loanStatus, setLoanStatus] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 5;

  // URLs for the APIs
  const API_TRANSACTIONS_URL = 'http://65.2.80.0:8080/transactions';
  const API_LOANS_SUMMARY_URL = 'http://65.2.80.0:8080/loans/summary';

  const startLoading = () => setLoading(true);
  const endLoading = () => setLoading(false);

  // Function to fetch transactions using Axios
  const fetchTransactions = async () => {
    try {
      startLoading();
      const token = sessionStorage.getItem('authToken');
      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await axios.get(API_TRANSACTIONS_URL, { headers });
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error.response || error);
      toast.error('Error fetching transactions. Please try again later.');
    } finally {
      endLoading();
    }
  };

  // Function to fetch loan summary using Axios
  const fetchLoanSummary = async () => {
    try {
      startLoading();
      const token = sessionStorage.getItem('authToken');
      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await axios.get(API_LOANS_SUMMARY_URL, { headers });
      setLoanStatus(response.data);
    } catch (error) {
      console.error('Error fetching loan summary:', error.response || error);
      toast.error('Error fetching loan summary. Please try again later.');
    } finally {
      endLoading();
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchLoanSummary();
  }, []);

  // Pagination calculations
  const indexOfLastTransaction = currentPage * itemsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - itemsPerPage;
  const currentTransactions = transactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(transactions.length / itemsPerPage);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Typography variant="h6">Loading Dashboard...</Typography>
      </Box>
    );
  }

  return (
    <Box className="min-h-screen flex flex-col">
      <Toaster />
      {/* Navbar Component */}
      <Navbar isAuthenticated={true} />

      <Box className="flex flex-row flex-grow">
        {/* Sidebar */}
        <Box className="w-1/5 bg-gray-100 p-4">
          <UserSidebar />
        </Box>
        {/* Main Content */}
        <Box width="80%" p={4}>
          {/* Transaction History */}
          <Card sx={{ mb: 4, boxShadow: 3 }}>
            <CardContent>
              <Typography
                variant="h5"
                fontWeight="bold"
                gutterBottom
                sx={{ mt: 1, ml: 2, color: "#1976d2" }} // Set the color to blue
              >
                TRANSACTION HISTORY
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell>₹{transaction.amount}</TableCell>
                        <TableCell>{transaction.type}</TableCell>
                        <TableCell>
                          <Typography
                            sx={{
                              color:
                                transaction.status === 'COMPLETED'
                                  ? green[600]
                                  : transaction.status === 'PENDING'
                                  ? yellow[800]
                                  : red[600],
                            }}
                          >
                            {transaction.status}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                sx={{ mt: 2, justifyContent: 'center', display: 'flex' }}
              />
            </CardContent>
          </Card>

          {/* Loan Status */}
          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h5" fontWeight="bold">
                  Loan Status
                </Typography>
                <Button variant="contained" color="primary">
                  View All
                </Button>
              </Box>
              <Grid container spacing={2}>
                {loanStatus.map((item, index) => {
                  const color =
                    item.status === 'APPROVED'
                      ? green[600]
                      : item.status === 'PENDING'
                      ? yellow[800]
                      : red[600];

                  return (
                    <Grid item xs={12} md={4} key={index}>
                      <Card sx={{ boxShadow: 2 }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box
                              sx={{
                                width: 40,
                                height: 40,
                                bgcolor: color,
                                borderRadius: '50%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                color: 'white',
                                mr: 2,
                              }}
                            >
                              {item.status[0]}
                            </Box>
                            <Box>
                              <Typography variant="h6" fontWeight="bold">
                                {item.count}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {item.status.charAt(0) + item.status.slice(1).toLowerCase()} Loans
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Total: ₹{item.totalAmount}
                              </Typography>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
