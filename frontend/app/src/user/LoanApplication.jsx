import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserSidebar from "./UserSidebar";
import Navbar from "./Navbar";

const LoanApplicationForm = () => {
  const [formData, setFormData] = useState({
    loanAmount: "",
    loanPurpose: "",
    loanPeriod: "",
    interestRate: "",
  });

  const [emiCalculation, setEmiCalculation] = useState(null);
  const [loanTermOptions, setLoanTermOptions] = useState([]);
  const [loanDescription, setLoanDescription] = useState("");

  useEffect(() => {
    if (formData.loanAmount && formData.loanPeriod && formData.interestRate) {
      calculateEMI();
    }
  }, [formData.loanAmount, formData.loanPeriod, formData.interestRate]);

  useEffect(() => {
    if (formData.loanPurpose) {
      updateLoanDetails(formData.loanPurpose);
    }
  }, [formData.loanPurpose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const updateLoanDetails = (loanPurpose) => {
    let interestRate = 0;

    switch (loanPurpose) {
      case "Personal Loan":
        interestRate = 17;
        break;
      case "Home Loan":
        interestRate = 7.5;
        break;
      case "Car Loan":
        interestRate = 9.5;
        break;
      case "Education Loan":
        interestRate = 8.5;
        break;
      case "Business Loan":
        interestRate = 13;
        break;
      case "Gold Loan":
        interestRate = 10.5;
        break;
      case "Agriculture Loan":
        interestRate = 7;
        break;
      default:
        break;
    }

    const termsArr = [12, 24, 36, 48, 60]; // Loan terms in months
    setLoanTermOptions(termsArr);

    setFormData((prevData) => ({
      ...prevData,
      interestRate,
      loanPeriod: termsArr[0] || "",
    }));
  };

  const calculateEMI = () => {
    const principal = parseFloat(formData.loanAmount);
    const tenure = parseFloat(formData.loanPeriod);
    const rate = parseFloat(formData.interestRate) / 100 / 12;

    if (principal > 0 && tenure > 0 && rate > 0) {
      const emi = (principal * rate * Math.pow(1 + rate, tenure)) / (Math.pow(1 + rate, tenure) - 1);
      setEmiCalculation(emi.toFixed(2));

      const totalPayment = emi * tenure;
      const totalInterest = totalPayment - principal;
      setLoanDescription(
        `Loan Amount: ₹${principal.toLocaleString("en-IN")}\nInterest Rate: ${formData.interestRate}%\nTotal Interest: ₹${totalInterest.toFixed(
          2
        ).toLocaleString("en-IN")}\nTotal Repayment: ₹${totalPayment.toFixed(2).toLocaleString("en-IN")}\nMonthly EMI: ₹${emi.toFixed(2).toLocaleString("en-IN")}`
      );
    } else {
      setEmiCalculation(null);
      setLoanDescription("");
    }
  };

  const validateForm = () => {
    const { loanAmount, loanPeriod, interestRate } = formData;

    if (!loanAmount || parseFloat(loanAmount) <= 0) {
      toast.error("Enter a valid loan amount!");
      return false;
    }
    if (!loanPeriod) {
      toast.error("Loan period is required!");
      return false;
    }
    if (!interestRate) {
      toast.error("Interest rate is required!");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const token = sessionStorage.getItem("authToken");
        const userRole = sessionStorage.getItem("userRole");

        if (!token) {
          toast.error("No auth token found. Please log in first.");
          return;
        }

        if (userRole !== "ROLE_USER") {
          toast.error("You are not authorized to apply for a loan.");
          return;
        }

        const response = await axios.post("http://65.2.80.0:8080/loan-applications/apply", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          toast.success("Application submitted successfully!");
        } else {
          toast.error("Failed to submit application. Please try again.");
        }
      } catch (error) {
        toast.error("Error submitting application. Please try again.");
      }
    }
  };

  return (
    <Box className="min-h-screen flex flex-col">
      <Navbar isAuthenticated={true} />
      <ToastContainer position="top-right" autoClose={3000} />

      <Box className="flex flex-row flex-grow">
        <Box className="w-1/5 bg-gray-100 p-4">
          <UserSidebar />
        </Box>
        <Box width="80%" p={4}>
          <Card sx={{ p: 4, boxShadow: 3 }}>
            <Typography
              variant="h4"
              fontWeight="bold"
              gutterBottom
              sx={{ mt: -2, ml: 0, color: "#1976d2" }} // Set the color to blue
            >
              Loan Application Form
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Loan Purpose</InputLabel>
                    <Select name="loanPurpose" value={formData.loanPurpose} onChange={handleChange}>
                      <MenuItem value="Personal Loan">Personal Loan</MenuItem>
                      <MenuItem value="Home Loan">Home Loan</MenuItem>
                      <MenuItem value="Car Loan">Car Loan</MenuItem>
                      <MenuItem value="Education Loan">Education Loan</MenuItem>
                      <MenuItem value="Business Loan">Business Loan</MenuItem>
                      <MenuItem value="Gold Loan">Gold Loan</MenuItem>
                      <MenuItem value="Agriculture Loan">Agriculture Loan</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Loan Amount (₹)"
                    name="loanAmount"
                    type="number"
                    value={formData.loanAmount}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Loan Period (Months)</InputLabel>
                    <Select name="loanPeriod" value={formData.loanPeriod} onChange={handleChange}>
                      {loanTermOptions.map((term) => (
                        <MenuItem key={term} value={term}>
                          {term} months
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Interest Rate (%)"
                    name="interestRate"
                    value={formData.interestRate}
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Monthly EMI (₹)" value={emiCalculation || "0.00"} disabled />
                </Grid>
                {loanDescription && (
                  <Grid item xs={12}>
                    <Box sx={{ backgroundColor: "#f4f4f9", padding: 2, borderRadius: 2, boxShadow: 2 }}>
                      <Typography variant="body1" sx={{ mb: 1, fontWeight: "bold", color: "green" }}>
                        Loan Breakdown:
                      </Typography>
                      <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", color: "#333" }}>
                        {loanDescription}
                      </Typography>
                    </Box>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <center>
                    <Button variant="contained" color="primary" type="submit" size="large">
                      Apply for Loan
                    </Button>
                  </center>
                </Grid>
              </Grid>
            </form>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default LoanApplicationForm;
