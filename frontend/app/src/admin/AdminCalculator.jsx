import React, { useState } from "react";
import {
  Typography,
  Button,
  Box,
  TextField,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  CircularProgress,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

const AdminCalculator = () => {
  const [amount, setAmount] = useState(0);
  const [interest, setInterest] = useState(0);
  const [time, setTime] = useState(0);
  const [emi, setEmi] = useState(0);
  const [totalinterest, setTotalinterest] = useState(0);
  const [principal, setPrincipal] = useState(0);
  const [loading, setLoading] = useState(false);

  const handlePrincipalchange = (event) => {
    setPrincipal(event.target.value);
  };
  const handleInterestchange = (event) => {
    setInterest(event.target.value);
  };
  const handleTimechange = (event) => {
    setTime(event.target.value);
  };

  const calculateLoan = () => {
    const p = parseFloat(principal);
    const r = parseFloat(interest);
    const n = parseFloat(time);

    if (!isNaN(p) && !isNaN(r) && !isNaN(n) && p > 0 && r > 0 && n > 0) {
      setLoading(true);

      setTimeout(() => {
        let actualRate = r / 12 / 100;
        let calcemi =
          p * actualRate * (Math.pow(1 + actualRate, n) / (Math.pow(1 + actualRate, n) - 1));

        setEmi(Math.round(calcemi));
        setAmount(Math.round(calcemi * n));
        setTotalinterest(Math.round(calcemi * n - p));
        setLoading(false);
      }, 500);
    } else {
      toast.error("Amount, Interest, and Period must be greater than 0!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        toastId: "id",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setEmi(0);
      setAmount(0);
      setTotalinterest(0);
    }
  };

  return (
    <Box className="min-h-screen flex flex-col bg-white-100"> {/* Outer background gray */}
      <AdminNavbar isAuthenticated={true} />

      <Box className="flex flex-row flex-grow">
        <Box className="w-1/5 bg-gray-100 p-4 ">
          <AdminSidebar />
        </Box>

        <Box className="w-4/5 p-8">
          <ToastContainer />

          {/* Updated Header Color to Blue */}
          <Typography variant="h5" align="center" sx={{ color: "#1976d2", fontWeight: "bold", mb: 4 }}>
            LOAN CALCULATOR
          </Typography>

          <Box
            sx={{
              border: "2px solid #1976d2", // Updated Border Color to Blue
              borderRadius: "3px",
              padding: "35px",
              backgroundColor: "white", // Inner background white
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
            }}
          >
            <Grid container spacing={3}>
              <Grid item md={6} xs={12}>
                <TextField
                  label="Enter Loan Amount"
                  type="number"
                  variant="outlined"
                  onChange={handlePrincipalchange}
                  value={principal}
                  sx={{ width: "100%", mb: 2 }}
                />
                <TextField
                  label="Enter Interest Rate"
                  variant="outlined"
                  type="number"
                  onChange={handleInterestchange}
                  value={interest}
                  sx={{ width: "100%", mb: 2 }}
                />
                <TextField
                  label="Enter Loan Period (Months)"
                  variant="outlined"
                  type="number"
                  onChange={handleTimechange}
                  value={time}
                  sx={{ width: "100%", mb: 2 }}
                />
                <Box display="flex" justifyContent="center" mt={2}>
                  <Button
                    variant="contained"
                    size="medium"
                    onClick={calculateLoan}
                    sx={{ backgroundColor: "#1976d2", color: "white", "&:hover": { backgroundColor: "#1565c0" } }}
                  >
                    Calculate
                  </Button>
                </Box>
              </Grid>

              {/* Fixed Height Box to Prevent Expansion */}
              <Grid item md={6} xs={12}>
                <Box sx={{ minHeight: "150px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  {loading ? (
                    <CircularProgress />
                  ) : (
                    <TableContainer component={Paper} sx={{ borderRadius: "8px", boxShadow: "0px 2px 6px rgba(0,0,0,0.1)" }}>
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell align="center">
                              <Typography variant="body1">Loan EMI</Typography>
                              <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1976d2" }}>
                                ₹ {emi || 0}
                              </Typography>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell align="center">
                              <Typography variant="body1">Total Loan Amount</Typography>
                              <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1976d2" }}>
                                ₹ {amount || 0}
                              </Typography>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell align="center">
                              <Typography variant="body1">Total Interest</Typography>
                              <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1976d2" }}>
                                ₹ {totalinterest || 0}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminCalculator;