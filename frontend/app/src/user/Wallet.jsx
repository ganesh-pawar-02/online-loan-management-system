import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Card, Typography, Button, TextField, Grid, Container } from '@mui/material';
import Navbar from './Navbar';
import UserSidebar from './UserSidebar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Wallet = () => {
  const [walletBalance, setWalletBalance] = useState(0);
  const [amount, setAmount] = useState('');
  const [action, setAction] = useState('');

  useEffect(() => {
    fetchWalletBalance();
  }, []);

  const fetchWalletBalance = async () => {
    try {
      const token = sessionStorage.getItem('authToken');
      const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
      const response = await axios.get('http://65.2.80.0:8080/wallet/balance', { headers });
      setWalletBalance(response.data);
    } catch (error) {
      toast.error('Error fetching wallet balance');
    }
  };

  const handleSubmit = async () => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast.error('Please enter a valid amount!');
      return;
    }

    try {
      const token = sessionStorage.getItem('authToken');
      const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

      if (action === 'add') {
        await axios.post('http://65.2.80.0:8080/wallet/add-funds', { amount: numericAmount }, { headers });
        toast.success('Funds added successfully!');
      } else if (action === 'withdraw') {
        await axios.post('http://65.2.80.0:8080/wallet/withdraw-funds', { amount: numericAmount }, { headers });
        toast.success('Funds withdrawn successfully!');
      }

      fetchWalletBalance();
    } catch (error) {
      toast.error('Transaction failed!');
    } finally {
      setAmount('');
      setAction('');
    }
  };

  return (
    <Box className="min-h-screen flex flex-col">
      <Navbar isAuthenticated={true} />

      <Box className="flex flex-row flex-grow">
        <Box className="w-1/5 bg-gray-100 p-4">
          <UserSidebar />
        </Box>

           
          {/* Main Content */}
        <Container maxWidth="md" sx={{ mt: 5 }}>
          <Card sx={{ p: 4, boxShadow: 3 }}>
            <Typography variant="h4" color="primary" gutterBottom>
             WALLET MANAGEMENT
            </Typography>
            <Typography variant="body1" color="textSecondary" gutterBottom>
              Manage your wallet balance with ease.
            </Typography>

            {/* Display current balance */}
            <Card
              sx={{
                p: 2,
                my: 3,
                textAlign: 'center',
                borderRadius: '3px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#f8f9fa',
                border: '2px solid #1976d2', // Added border
              }}
            >
              <Typography variant="h5" color="textPrimary">
                Current Balance: ₹{walletBalance}
              </Typography>
            </Card>

            {/* Buttons to choose action */}
            <Grid container spacing={2} justifyContent="center" sx={{ mb: 3 }}>
              <Grid item>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => setAction('add')}
                  sx={{
                    fontSize: '16px',
                    padding: '10px 20px',
                    borderRadius: '6px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  Add Funds
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => setAction('withdraw')}
                  sx={{
                    fontSize: '16px',
                    padding: '10px 20px',
                    borderRadius: '6px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  Withdraw Funds
                </Button>
              </Grid>
            </Grid>

            {/* Input field and submit button for the selected action */}
            {action && (
              <Card
                sx={{
                  p: 3,
                  mt: 3,
                  textAlign: 'center',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  backgroundColor: '#fff',
                  border: '1px solid #1976d2', // Added border
                }}
              >
                <TextField
                  label={`Enter amount to ${action}`}
                  variant="outlined"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  fullWidth
                  sx={{ mb: 2 }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  sx={{
                    width: '200px',
                    fontSize: '16px',
                    padding: '10px 20px',
                    borderRadius: '6px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  {action === 'add' ? 'Add Funds' : 'Withdraw Funds'}
                </Button>
              </Card>
            )}
          </Card>
        </Container>
      </Box>
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
    </Box>
  );
};

export default Wallet;