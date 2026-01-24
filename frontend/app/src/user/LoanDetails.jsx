import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserSidebar from './UserSidebar'; // Your Sidebar component
import Navbar from './Navbar';           // Your Navbar component
import {
  Box,
  Card,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
} from '@mui/material';
import { green, yellow, red } from '@mui/material/colors';
import toast, { Toaster } from 'react-hot-toast'; // For notifications

const LoanDetails = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2; // Number of loans per page

  const API_LOANS_DETAILS_URL = 'http://65.2.80.0:8080/loans/details';

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        setLoading(true);

        // Retrieve JWT token from session storage
        const token = sessionStorage.getItem('authToken');
        const headers = { 'Content-Type': 'application/json' };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        } else {
          throw new Error('Authentication token is missing. Please log in.');
        }

        // Fetch data from API
        const response = await axios.get(API_LOANS_DETAILS_URL, { headers });
        const data = response.data;
        console.log('API Response Data:', data);

        // Set up formatters
        const currencyFormatter = new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
          minimumFractionDigits: 2,
        });
        const dateFormatter = new Intl.DateTimeFormat('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        });
        const formatDate = (dateString) => {
          if (!dateString) return 'N/A';
          const date = new Date(dateString);
          return isNaN(date.getTime()) ? 'Invalid Date' : dateFormatter.format(date);
        };

        // Format and transform loan data
        const formattedData = data.map((loan) => ({
          ...loan,
          loanAmountFormatted: currencyFormatter.format(loan.loanAmount),
          emiAmountFormatted: currencyFormatter.format(loan.emiAmount),
          startDateFormatted: formatDate(loan.startDate),
          endDateFormatted: formatDate(loan.endDate),
          lastEMIDateFormatted: formatDate(loan.lastEmiDate),
          nextEMIDateFormatted: formatDate(loan.nextEmiDate),
          statusFormatted:
            loan.status === 'APPROVED'
              ? 'Active'
              : loan.status === 'PENDING'
                ? 'Pending'
                : loan.status === 'REJECTED'
                  ? 'Closed'
                  : loan.status,
        }));

        setLoans(formattedData);
      } catch (err) {
        console.error('Error fetching loans:', err.response || err);
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          'Error fetching loan details. Please try again later.';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, []);

  // Calculate pagination details
  const totalPages = Math.ceil(loans.length / itemsPerPage);
  const indexOfLastLoan = currentPage * itemsPerPage;
  const indexOfFirstLoan = indexOfLastLoan - itemsPerPage;
  const currentLoans = loans.slice(indexOfFirstLoan, indexOfLastLoan);

  const handlePageChange = (event, pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return (
      <Box display="flex" minHeight="100vh" justifyContent="center" alignItems="center">
        <Typography variant="h6">Loading Loan Details...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" minHeight="100vh" justifyContent="center" alignItems="center">
        <Toaster />
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="min-h-screen flex flex-col">
      <Toaster />
      {/* Navbar */}
      <Navbar isAuthenticated={true} />

      <Box className="flex flex-row flex-grow">
        {/* Sidebar */}
        <Box className="w-1/5 bg-gray-100 p-4">
          <UserSidebar />
        </Box>

        {/* Main Content */}
        <Box width="80%" p={4}>
          <Card sx={{ mb: 4, boxShadow: 3 }}>
            <Typography
              variant="h5"
              fontWeight="bold"
              gutterBottom
              sx={{ mt: 3, ml: 2, color: "#1976d2" }} // Set the color to blue
            >
            LOAN DETAILS
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Loan Amount</TableCell>
                    <TableCell>EMI Amount</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>Start Date</TableCell>
                    <TableCell>End Date</TableCell>
                    <TableCell>Total EMI</TableCell>
                    <TableCell>Paid EMI</TableCell>
                    <TableCell>Remaining EMI</TableCell>
                    <TableCell>Last EMI Date</TableCell>
                    <TableCell>Next EMI Date</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loans.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={11} align="center">
                        No loan records found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentLoans.map((loan) => (
                      <TableRow key={loan.id}>
                        <TableCell>{loan.loanAmountFormatted}</TableCell>
                        <TableCell>{loan.emiAmountFormatted}</TableCell>
                        <TableCell>{loan.duration}</TableCell>
                        <TableCell>{loan.startDateFormatted}</TableCell>
                        <TableCell>{loan.endDateFormatted}</TableCell>
                        <TableCell>{loan.totalEMI}</TableCell>
                        <TableCell>{loan.paidEMI}</TableCell>
                        <TableCell>{loan.remainingEMI}</TableCell>
                        <TableCell>{loan.lastEMIDateFormatted}</TableCell>
                        <TableCell>{loan.nextEMIDateFormatted}</TableCell>
                        <TableCell>
                          <Typography
                            sx={{
                              color:
                                loan.statusFormatted === 'Active'
                                  ? green[600]
                                  : loan.statusFormatted === 'Pending'
                                    ? yellow[800]
                                    : red[600],
                            }}
                          >
                            {loan.statusFormatted}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>

          {/* Render Pagination only if there are records */}
          {loans.length > 0 && (
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default LoanDetails;
