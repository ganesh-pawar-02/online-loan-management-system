import React, { useState } from 'react';
import longFormatters from "date-fns/_lib/format/longFormatters";
import axios from 'axios'; // Import Axios

import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  Grid,
  InputLabel,
  FormHelperText,
  CircularProgress,
  FormControl,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Divider,
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserSidebar from './UserSidebar';
import Navbar from './Navbar';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns'; // Import format from date-fns for date formatting


const FileUpload = ({ label, file, onDrop, loading, error, helperText }) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    onDrop,
  });


  return (
    <Box>
      <InputLabel>{label}</InputLabel>
      <Box
        {...getRootProps()}
        sx={{
          border: '1px dashed #ccc',
          borderRadius: 1,
          padding: 2,
          textAlign: 'center',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '120px',
          transition: 'background-color 0.3s ease',
          '&:hover': { backgroundColor: '#f1f1f1' },
        }}
      >
        <input {...getInputProps()} style={{ display: 'none' }} />
        <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
          {file ? `${file.name} uploaded` : `Drag & drop or click to select`}
        </Typography>
        {loading ? <CircularProgress size={24} /> : null}
      </Box>
      {error && <FormHelperText error>{helperText}</FormHelperText>}
    </Box>
  );
};

const KYCForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: null,
    gender: '',
    fatherName: '',
    motherName: '',
    maritalStatus: '',
    permanentAddress: {
      houseName: '',
      street: '',
      city: '',
      state: '',
      pinCode: '',
    },
    correspondenceAddress: {
      houseName: '',
      street: '',
      city: '',
      state: '',
      pinCode: '',
    },
    phone: '',
    email: '',
    panNumber: '',
    panCardImage: null,
    aadhaarNumber: '',
    addressProofDocumentType: '',
    addressProofDocumentNumber: '',
    addressProofDocumentImage: null,
    annualIncome: '',
    sourceOfIncome: '',
    occupation: '',
    employerName: '',
    incomeProofType: '',
    incomeProofImage: null,
    bankName: '',
    bankAccountNumber: '',
    ifscCode: '',
    accountType: '',
    otherSourceOfIncome: '',
    otherOccupation: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingFiles, setLoadingFiles] = useState({
    panCard: false,
    addressProofDocument: false,
    incomeProof: false,
  });

  const addressProofDocumentOptions = ['Aadhaar Card', 'Passport', 'Voter ID', 'Rental Agreement', 'Utility Bill'];
  const sourceOfIncomeOptions = ['Salary', 'Business', 'Investments', 'Pension', 'Rent', 'Agriculture', 'Others'];
  const occupationOptions = ['Salaried', 'Self-Employed', 'Business', 'Professional', 'Student', 'Homemaker', 'Retired', 'Others'];
  const incomeProofOptions = ['Salary Slip', 'Bank Statement', 'ITR Acknowledgement', 'Form 16', 'Others'];

  const API_BASE_URL = 'http://65.2.80.0:8080'; // Backend API base URL


  // Handle form submission
  const handleSubmit = async (e) => {  // Make handleSubmit async
    e.preventDefault();
    setIsSubmitting(true);

    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = 'First Name is required';
    if (!formData.lastName) newErrors.lastName = 'Last Name is required';
    if (!formData.dob) newErrors.dob = 'Date of Birth is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.fatherName && !formData.motherName)
      newErrors.parentName = 'Father’s or Mother’s Name is required';
    if (!formData.maritalStatus) newErrors.maritalStatus = 'Marital Status is required';
    if (!formData.permanentAddress.houseName || !formData.permanentAddress.street || !formData.permanentAddress.city || !formData.permanentAddress.state || !formData.permanentAddress.pinCode)
      newErrors.permanentAddress = 'Complete Permanent Address is required';
    if (!formData.phone || formData.phone.length !== 10) newErrors.phone = 'Valid Phone Number is required';
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Valid Email is required';
    if (!formData.panNumber || formData.panNumber.length !== 10) newErrors.panNumber = 'Valid PAN Number is required';
    if (!formData.panCardImage) newErrors.panCardImage = 'Upload PAN Card Image is required';
    if (!formData.aadhaarNumber || formData.aadhaarNumber.length !== 12) newErrors.aadhaarNumber = 'Valid Aadhaar Number is required';
    if (!formData.annualIncome) newErrors.annualIncome = 'Annual Income is required';
    if (!formData.sourceOfIncome) newErrors.sourceOfIncome = 'Source of Income is required';
    if (formData.sourceOfIncome === 'Others' && !formData.otherSourceOfIncome) newErrors.otherSourceOfIncome = 'Please specify your Source of Income';
    if (!formData.occupation) newErrors.occupation = 'Occupation is required';
    if (formData.occupation === 'Salaried' && !formData.employerName) newErrors.employerName = 'Employer Name is required for Salaried occupation';
    if (formData.occupation === 'Others' && !formData.otherOccupation) newErrors.otherOccupation = 'Please specify your Occupation';
    if (!formData.bankName) newErrors.bankName = 'Bank Name is required';
    if (!formData.bankAccountNumber) newErrors.bankAccountNumber = 'Bank Account Number is required';
    if (!formData.ifscCode || formData.ifscCode.length !== 11) newErrors.ifscCode = 'Valid IFSC Code is required';
    if (!formData.addressProofDocumentType && !formData.addressProofDocumentNumber) {
      if (!newErrors.addressProof) newErrors.addressProof = "Please provide Address Proof details.";
      else newErrors.addressProof += " Please provide Address Proof details.";
    } else if (formData.addressProofDocumentType && !formData.addressProofDocumentNumber) {
        if (!newErrors.addressProof) newErrors.addressProof = "Please enter the Address Proof document number.";
        else newErrors.addressProof += " Please enter the Address Proof document number.";
    } else if (!formData.addressProofDocumentType && formData.addressProofDocumentNumber) {
        if (!newErrors.addressProof) newErrors.addressProof = "Please select the Address Proof document type.";
        else newErrors.addressProof += " Please select the Address Proof document type.";
    } else if (formData.addressProofDocumentType && formData.addressProofDocumentNumber && !formData.addressProofDocumentImage) {
        if (!newErrors.addressProof) newErrors.addressProof = "Please upload the Address Proof document image.";
        else newErrors.addressProof += " Please upload the Address Proof document image.";
    }
     if (formData.incomeProofType && !formData.incomeProofImage) {
        if (!newErrors.incomeProof) newErrors.incomeProof = "Please upload the Income Proof document image.";
        else newErrors.incomeProof += " Please upload the Income Proof document image.";
    }


    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const form = new FormData();
        form.append('firstName', formData.firstName);
        form.append('lastName', formData.lastName);
        if (formData.dob) { // Format date only if it exists
          form.append('dob', format(formData.dob, 'yyyy-MM-dd')); // Format date
        }
        form.append('gender', formData.gender);
        form.append('fatherName', formData.fatherName);
        form.append('motherName', formData.motherName);
        form.append('maritalStatus', formData.maritalStatus);
        form.append('permanentStreet', formData.permanentAddress.street);
        form.append('permanentCity', formData.permanentAddress.city);
        form.append('permanentState', formData.permanentAddress.state);
        form.append('permanentZipCode', formData.permanentAddress.pinCode);
        form.append('correspondenceStreet', formData.correspondenceAddress.street);
        form.append('correspondenceCity', formData.correspondenceAddress.city);
        form.append('correspondenceState', formData.correspondenceAddress.state);
        form.append('correspondenceZipCode', formData.correspondenceAddress.pinCode);
        form.append('phone', formData.phone);
        form.append('email', formData.email);
        form.append('panNumber', formData.panNumber);
        form.append('panCardImageFile', formData.panCardImage); // Use 'panCardImageFile' to match backend
        form.append('aadhaarNumber', formData.aadhaarNumber);
        form.append('addressProofDocumentType', formData.addressProofDocumentType);
        form.append('addressProofDocumentNumber', formData.addressProofDocumentNumber);
        form.append('addressProofDocumentImageFile', formData.addressProofDocumentImage); // Use 'addressProofDocumentImageFile'
        form.append('annualIncome', formData.annualIncome);
        form.append('sourceOfIncome', formData.sourceOfIncome);
        form.append('occupation', formData.occupation);
        form.append('employerName', formData.employerName);
        form.append('incomeProofType', formData.incomeProofType);
        form.append('incomeProofImageFile', formData.incomeProofImage); // Use 'incomeProofImageFile'
        form.append('bankName', formData.bankName);
        form.append('bankAccountNumber', formData.bankAccountNumber);
        form.append('ifscCode', formData.ifscCode);
        form.append('accountType', formData.accountType);
        form.append('otherSourceOfIncome', formData.otherSourceOfIncome);
        form.append('otherOccupation', formData.otherOccupation);
        form.append('userId', 123); // Assuming a fixed userId for now, adjust as needed

        const response = await axios.post(`${API_BASE_URL}/kyc`, form, {
          headers: {
            'Content-Type': 'multipart/form-data', // Explicitly set header if needed (usually Axios does it)
          },
        });

        console.log('KYC submitted successfully', response.data);
        toast.success('KYC Submitted Successfully!', {
          position: "top-right",
          autoClose: 3000,
        });
        // Clear form fields after successful submission
        setFormData({
          firstName: '',
          lastName: '',
          dob: null,
          gender: '',
          fatherName: '',
          motherName: '',
          maritalStatus: '',
          permanentAddress: {
            houseName: '',
            street: '',
            city: '',
            state: '',
            pinCode: '',
          },
          correspondenceAddress: {
            houseName: '',
            street: '',
            city: '',
            state: '',
            pinCode: '',
          },
          phone: '',
          email: '',
          panNumber: '',
          panCardImage: null,
          aadhaarNumber: '',
          addressProofDocumentType: '',
          addressProofDocumentNumber: '',
          addressProofDocumentImage: null,
          annualIncome: '',
          sourceOfIncome: '',
          occupation: '',
          employerName: '',
          incomeProofType: '',
          incomeProofImage: null,
          bankName: '',
          bankAccountNumber: '',
          ifscCode: '',
          accountType: '',
          otherSourceOfIncome: '',
          otherOccupation: '',
        });
        setErrors({});


      } catch (error) {
        console.error('Error submitting KYC:', error);
        toast.error('Error submitting KYC. Please try again.', {
          position: "top-right",
          autoClose: 3000,
        });
        // Handle error response if needed (e.g., display specific error messages from backend)
      } finally {
        setIsSubmitting(false); //  setIsSubmitting(false) should be in finally block
      }


    } else {
      setIsSubmitting(false);
      // Display errors in toast notifications
      Object.values(newErrors).forEach(errorMessage => {
        toast.error(errorMessage, {
          position:  "top-right",
          autoClose: 3000,
        });
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileDrop = (name, acceptedFiles) => {
    setLoadingFiles((prev) => ({ ...prev, [name]: true }));
    setFormData((prev) => ({ ...prev, [`${name}Image`]: acceptedFiles[0] }));

    // Simulate file upload process
    setTimeout(() => {
      setLoadingFiles((prev) => ({ ...prev, [name]: false }));
    }, 2000);
  };

  const handleReset = () => {
    setFormData({
      firstName: '',
      lastName: '',
      dob: null,
      gender: '',
      fatherName: '',
      motherName: '',
      maritalStatus: '',
      permanentAddress: {
        houseName: '',
        street: '',
        city: '',
        state: '',
        pinCode: '',
      },
      correspondenceAddress: {
        houseName: '',
        street: '',
        city: '',
        state: '',
        pinCode: '',
      },
      phone: '',
      email: '',
      panNumber: '',
      panCardImage: null,
      aadhaarNumber: '',
      addressProofDocumentType: '',
      addressProofDocumentNumber: '',
      addressProofDocumentImage: null,
      annualIncome: '',
      sourceOfIncome: '',
      occupation: '',
      employerName: '',
      incomeProofType: '',
      incomeProofImage: null,
      bankName: '',
      bankAccountNumber: '',
      ifscCode: '',
      accountType: '',
      otherSourceOfIncome: '',
      otherOccupation: '',
    });
    setErrors({});
    setLoadingFiles({
      panCard: false,
      addressProofDocument: false,
      incomeProof: false,
    });
  };

  const currentAddressProofDocumentLabel = formData.addressProofDocumentType ? `Upload ${formData.addressProofDocumentType} Image` : "Upload Address Proof Document Image";
  const currentIncomeProofDocumentLabel = formData.incomeProofType ? `Upload ${formData.incomeProofType} Image` : "Upload Income Proof Document Image";


  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
       <Box className="min-h-screen flex flex-col">
        {/* Navbar Component */}
        <Navbar isAuthenticated={true} />

         <Box className="flex flex-row flex-grow">
          {/* Sidebar */}
          <Box className="w-1/5 bg-gray-100 p-4">
            <UserSidebar />
          </Box>

          {/* Main Content */}
          <Box width="80%" p={4}>
            <Card sx={{ p: 4, boxShadow: 3 }}>
              <Typography
                            variant="h4"
                            fontWeight="bold"
                            gutterBottom
                            sx={{ mt: -2, ml: 1, color: "#1976d2" }} // Set the color to blue
                          >
                KYC Form
              </Typography>
              <form onSubmit={handleSubmit}>
                {/* Personal Information */}
                <Typography variant="h6" gutterBottom sx={{ mt: 2, color: 'primary.main' }}>
                  Personal Information
                </Typography>
                {/* Personal Information Fields */}
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="First Name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Last Name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Date of Birth"
                    value={formData.dob}
                    onChange={(date) => setFormData({ ...formData, dob: date })}
                    textField={<TextField fullWidth required />} // Directly use the TextField component
                  />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth >
                      <InputLabel>Gender</InputLabel>
                      <Select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        required
                      >
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Father's Name"
                      name="fatherName"
                      value={formData.fatherName}
                      onChange={handleChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Mother's Name"
                      name="motherName"
                      value={formData.motherName}
                      onChange={handleChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Marital Status</InputLabel>
                      <Select
                        name="maritalStatus"
                        value={formData.maritalStatus}
                        onChange={handleChange}
                        required
                      >
                        <MenuItem value="Single">Single</MenuItem>
                        <MenuItem value="Married">Married</MenuItem>
                        <MenuItem value="Divorced">Divorced</MenuItem>
                        <MenuItem value="Widowed">Widowed</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>


                {/* Contact Details */}
                <Typography variant="h6" gutterBottom sx={{ mt: 4, color: 'primary.main' }}>
                  Contact Details
                </Typography>
                {/* Contact Details Fields */}
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                      Permanent Address
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="House Name"
                      name="permanentAddress.houseName"
                      value={formData.permanentAddress.houseName}
                      onChange={handleChange}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Street"
                      name="permanentAddress.street"
                      value={formData.permanentAddress.street}
                      onChange={handleChange}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="City"
                      name="permanentAddress.city"
                      value={formData.permanentAddress.city}
                      onChange={handleChange}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="State"
                      name="permanentAddress.state"
                      value={formData.permanentAddress.state}
                      onChange={handleChange}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="PIN Code"
                      name="permanentAddress.pinCode"
                      value={formData.permanentAddress.pinCode}
                      onChange={handleChange}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                        checked={formData.correspondenceAddress.sameAsPermanent || false} // Controlled state
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              correspondenceAddress: {
                                ...prev.correspondenceAddress,
                                sameAsPermanent: e.target.checked,
                              },
                            }))
                          }
                        />
                      }
                      label="Same as Permanent Address"
                    />
                  </Grid>
                  {!formData.correspondenceAddress.sameAsPermanent && (
                    <>
                      <Grid item xs={12}>
                        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                          Correspondence Address
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="House Name"
                          name="correspondenceAddress.houseName"
                          value={formData.correspondenceAddress.houseName}
                          onChange={handleChange}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Street"
                          name="correspondenceAddress.street"
                          value={formData.correspondenceAddress.street}
                          onChange={handleChange}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="City"
                          name="correspondenceAddress.city"
                          value={formData.correspondenceAddress.city}
                          onChange={handleChange}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="State"
                          name="correspondenceAddress.state"
                          value={formData.correspondenceAddress.state}
                          onChange={handleChange}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="PIN Code"
                          name="correspondenceAddress.pinCode"
                          value={formData.correspondenceAddress.pinCode}
                          onChange={handleChange}
                          fullWidth
                        />
                      </Grid>
                    </>
                  )}
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                      Contact Information
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Phone Number"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Email Address"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      fullWidth
                      required
                    />
                  </Grid>
                </Grid>


                {/* Identity and Address Proof */}
                <Typography variant="h6" gutterBottom sx={{ mt: 4, color: 'primary.main' }}>
                  Identity and Address Proof
                </Typography>
                {/* Identity and Address Proof Fields */}
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="PAN Number"
                      name="panNumber"
                      value={formData.panNumber}
                      onChange={handleChange}
                      fullWidth
                      required
                    />
                  </Grid>
                   <Grid item xs={12} sm={6}>
                    <FileUpload
                      label="Upload PAN Card Image"
                      name="panCardImage"
                      file={formData.panCardImage}
                      onDrop={(files) => handleFileDrop('panCard', files)}
                      loading={loadingFiles.panCard}
                      error={!!errors.panCardImage}
                      helperText={errors.panCardImage}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Address Proof Document</InputLabel>
                      <Select
                        name="addressProofDocumentType"
                        value={formData.addressProofDocumentType}
                        onChange={handleChange}
                        required
                      >
                        <MenuItem value="">None</MenuItem>
                        {addressProofDocumentOptions.map((option) => (
                          <MenuItem key={option} value={option}>{option}</MenuItem>
                        ))}
                      </Select>
                      {errors.addressProof && <FormHelperText error>{errors.addressProof}</FormHelperText>}
                    </FormControl>
                  </Grid>

                  {formData.addressProofDocumentType && (
                    <>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label={`${formData.addressProofDocumentType} Number`}
                          name="addressProofDocumentNumber"
                          value={formData.addressProofDocumentNumber}
                          onChange={handleChange}
                          fullWidth
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FileUpload
                          label={currentAddressProofDocumentLabel}
                          file={formData.addressProofDocumentImage}
                          onDrop={(files) => handleFileDrop('addressProofDocument', files)}
                          loading={loadingFiles.addressProofDocument}
                          error={!!errors.addressProof}
                          helperText={errors.addressProof}
                        />
                      </Grid>
                    </>
                  )}
                </Grid>


                {/* Financial Information */}
                <Typography variant="h6" gutterBottom sx={{ mt: 4, color: 'primary.main' }}>
                  Financial Information
                </Typography>
                {/* Financial Information Fields */}
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required>
                      <InputLabel>Source of Income</InputLabel>
                      <Select
                        label="Source of Income"
                        name="sourceOfIncome"
                        value={formData.sourceOfIncome}
                        onChange={handleChange}
                      >
                        {sourceOfIncomeOptions.map((option) => (
                          <MenuItem key={option} value={option}>{option}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  {formData.sourceOfIncome === 'Others' && (
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Specify Other Source of Income"
                        name="otherSourceOfIncome"
                        value={formData.otherSourceOfIncome}
                        onChange={handleChange}
                        fullWidth
                        required
                      />
                    </Grid>
                  )}


                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required>
                      <InputLabel>Occupation</InputLabel>
                      <Select
                        label="Occupation"
                        name="occupation"
                        value={formData.occupation}
                        onChange={handleChange}
                      >
                        {occupationOptions.map((option) => (
                          <MenuItem key={option} value={option}>{option}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  {formData.occupation === 'Others' && (
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Specify Other Occupation"
                        name="otherOccupation"
                        value={formData.otherOccupation}
                        onChange={handleChange}
                        fullWidth
                        required
                      />
                    </Grid>
                  )}


                  {formData.occupation === 'Salaried' && (
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Employer Name"
                        name="employerName"
                        value={formData.employerName}
                        onChange={handleChange}
                        fullWidth
                        required
                      />
                    </Grid>
                  )}

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Annual Income (in Rupees)"
                      name="annualIncome"
                      value={formData.annualIncome}
                      onChange={handleChange}
                      fullWidth
                      required
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Income Proof Document</InputLabel>
                      <Select
                        label="Income Proof Document"
                        name="incomeProofType"
                        value={formData.incomeProofType}
                        onChange={handleChange}
                      >
                        <MenuItem value="">None</MenuItem>
                        {incomeProofOptions.map((option) => (
                          <MenuItem key={option} value={option}>{option}</MenuItem>
                        ))}
                      </Select>
                      {errors.incomeProof && <FormHelperText error>{errors.incomeProof}</FormHelperText>}
                    </FormControl>
                  </Grid>


                  {formData.incomeProofType && (
                    <Grid item xs={12} sm={6}>
                      <FileUpload
                        label={currentIncomeProofDocumentLabel}
                        name="incomeProofImage"
                        file={formData.incomeProofImage}
                        onDrop={(files) => handleFileDrop('incomeProof', files)}
                        loading={loadingFiles.incomeProof}
                        error={!!errors.incomeProof}
                        helperText={errors.incomeProof}
                      />
                    </Grid>
                  )}

                </Grid>

                {/* Banking Details */}
                <Typography variant="h6" gutterBottom sx={{ mt: 4, color: 'primary.main' }}>
                  Banking Details
                </Typography>
                {/* Banking Details Fields */}
                <Grid container spacing={3}>
                   <Grid item xs={12} sm={6}>
                    <TextField
                      label="Bank Name"
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleChange}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Bank Account Number"
                      name="bankAccountNumber"
                      value={formData.bankAccountNumber}
                      onChange={handleChange}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="IFSC Code"
                      name="ifscCode"
                      value={formData.ifscCode}
                      onChange={handleChange}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Account Type</InputLabel>
                      <Select
                        name="accountType"
                        value={formData.accountType}
                        onChange={handleChange}
                      >
                        <MenuItem value="Savings">Savings</MenuItem>
                        <MenuItem value="Current">Current</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                {/* Submit Button */}
                <Grid container spacing={3} sx={{ mt: 4 }}>
                  <Grid item xs={12}>
                    <center>
                      <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        size="large"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Submitting...' : 'Submit KYC'}
                      </Button>
                    </center>
                  </Grid>
                </Grid>
              </form>
            </Card>
          </Box>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default KYCForm;