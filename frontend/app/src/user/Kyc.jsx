import API_BASE_URL from "../config/api";
import React, { useState } from 'react';
import axios from 'axios';

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
import { format } from 'date-fns';

const FileUpload = ({ label, file, onDrop, loading, error, helperText }) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
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

const initialFormData = {
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
    sameAsPermanent: false,
  },
  phone: '',
  email: '',
  panNumber: '',
  panCardImage: null,
  aadhaarNumber: '',
  aadhaarCardImage: null,
  passportNumber: '',
  passportImage: null,
  voterIdNumber: '',
  drivingLicenseNumber: '',
  utilityBillImage: null,
  rentalAgreementImage: null,
  annualIncome: '',
  sourceOfIncome: '',
  occupation: '',
  employerName: '',
  bankAccountNumber: '',
  ifscCode: '',
  accountType: '',
};

const initialLoadingFiles = {
  panCard: false,
  aadhaarCard: false,
  passport: false,
  utilityBill: false,
  rentalAgreement: false,
};

const KYCForm = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingFiles, setLoadingFiles] = useState(initialLoadingFiles);

  const sourceOfIncomeOptions = [
    'Salary',
    'Business',
    'Investments',
    'Pension',
    'Rent',
    'Agriculture',
    'Others',
  ];

  const occupationOptions = [
    'Salaried',
    'Self-Employed',
    'Business',
    'Professional',
    'Student',
    'Homemaker',
    'Retired',
    'Others',
  ];

  const addressProofDocumentOptions = [
    'Aadhaar Card',
    'Passport',
    'Voter ID',
    'Driving License',
    'Rental Agreement',
    'Utility Bill',
  ];

  const getHeaders = () => {
    const token = sessionStorage.getItem('authToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newErrors = {};

    if (!formData.firstName) newErrors.firstName = 'First Name is required';
    if (!formData.lastName) newErrors.lastName = 'Last Name is required';
    if (!formData.dob) newErrors.dob = 'Date of Birth is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.fatherName && !formData.motherName) {
      newErrors.parentName = 'Father’s or Mother’s Name is required';
    }
    if (!formData.maritalStatus) newErrors.maritalStatus = 'Marital Status is required';

    if (
      !formData.permanentAddress.street ||
      !formData.permanentAddress.city ||
      !formData.permanentAddress.state ||
      !formData.permanentAddress.pinCode
    ) {
      newErrors.permanentAddress = 'Complete Permanent Address is required';
    }

    if (
      !formData.correspondenceAddress.sameAsPermanent &&
      (!formData.correspondenceAddress.street ||
        !formData.correspondenceAddress.city ||
        !formData.correspondenceAddress.state ||
        !formData.correspondenceAddress.pinCode)
    ) {
      newErrors.correspondenceAddress = 'Complete Correspondence Address is required';
    }

    if (!formData.phone || formData.phone.length !== 10) {
      newErrors.phone = 'Valid Phone Number is required';
    }

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Valid Email is required';
    }

    if (!formData.panNumber || formData.panNumber.length !== 10) {
      newErrors.panNumber = 'Valid PAN Number is required';
    }

    if (!formData.panCardImage) {
      newErrors.panCardImage = 'Upload PAN Card Image is required';
    }

    if (!formData.aadhaarNumber || formData.aadhaarNumber.length !== 12) {
      newErrors.aadhaarNumber = 'Valid Aadhaar Number is required';
    }

    if (!formData.annualIncome) newErrors.annualIncome = 'Annual Income is required';
    if (!formData.sourceOfIncome) newErrors.sourceOfIncome = 'Source of Income is required';
    if (!formData.occupation) newErrors.occupation = 'Occupation is required';
    if (formData.occupation === 'Salaried' && !formData.employerName) {
      newErrors.employerName = 'Employer Name is required for Salaried occupation';
    }

    if (!formData.bankAccountNumber) {
      newErrors.bankAccountNumber = 'Bank Account Number is required';
    }

    if (!formData.ifscCode || formData.ifscCode.length !== 11) {
      newErrors.ifscCode = 'Valid IFSC Code is required';
    }

    if (!formData.accountType) {
      newErrors.accountType = 'Account Type is required';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length !== 0) {
      setIsSubmitting(false);
      Object.values(newErrors).forEach((errorMessage) => {
        toast.error(errorMessage, {
          position: 'top-right',
          autoClose: 3000,
        });
      });
      return;
    }

    try {
      const form = new FormData();

      form.append('firstName', formData.firstName);
      form.append('lastName', formData.lastName);
      form.append('dob', format(formData.dob, 'yyyy-MM-dd'));
      form.append('gender', formData.gender);
      form.append('fatherName', formData.fatherName);
      form.append('motherName', formData.motherName);
      form.append('maritalStatus', formData.maritalStatus);

      form.append('permanentStreet', formData.permanentAddress.street);
      form.append('permanentCity', formData.permanentAddress.city);
      form.append('permanentState', formData.permanentAddress.state);
      form.append('permanentZipCode', formData.permanentAddress.pinCode);

      const correspondenceAddress = formData.correspondenceAddress.sameAsPermanent
        ? formData.permanentAddress
        : formData.correspondenceAddress;

      form.append('correspondenceStreet', correspondenceAddress.street);
      form.append('correspondenceCity', correspondenceAddress.city);
      form.append('correspondenceState', correspondenceAddress.state);
      form.append('correspondenceZipCode', correspondenceAddress.pinCode);

      form.append('phone', formData.phone);
      form.append('email', formData.email);
      form.append('panNumber', formData.panNumber);
      form.append('aadhaarNumber', formData.aadhaarNumber);
      form.append('passportNumber', formData.passportNumber || '');
      form.append('voterIdNumber', formData.voterIdNumber || '');
      form.append('drivingLicenseNumber', formData.drivingLicenseNumber || '');
      form.append('annualIncome', formData.annualIncome);
      form.append('sourceOfIncome', formData.sourceOfIncome);
      form.append('occupation', formData.occupation);
      form.append('employerName', formData.employerName || '');
      form.append('bankAccountNumber', formData.bankAccountNumber);
      form.append('ifscCode', formData.ifscCode);
      form.append('accountType', formData.accountType);

      // IMPORTANT: userId is NOT sent from the UI.
      // The backend should take the authenticated user's ID from Spring Security/JWT.
      if (formData.aadhaarCardImage) {
        form.append('aadhaarCardImagePathFile', formData.aadhaarCardImage);
      }
      if (formData.utilityBillImage) {
        form.append('utilityBillImagePathFile', formData.utilityBillImage);
      }
      if (formData.rentalAgreementImage) {
        form.append('rentalAgreementImagePathFile', formData.rentalAgreementImage);
      }
      if (formData.passportImage) {
        form.append('passportImagePathFile', formData.passportImage);
      }
      if (formData.panCardImage) {
        form.append('panCardImageFile', formData.panCardImage);
      }

      const response = await axios.post(
        `${API_BASE_URL}/kyc`,
        form,
        {
          headers: getHeaders(),
        }
      );

      console.log('KYC submitted successfully', response.data);

      toast.success('KYC Submitted Successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });

      setFormData(initialFormData);
      setErrors({});
    } catch (error) {
      console.error('Error submitting KYC:', error.response || error);

      toast.error(
        error.response?.data?.message ||
          'Error submitting KYC. Please try again.',
        {
          position: 'top-right',
          autoClose: 3000,
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');

      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFileDrop = (name, acceptedFiles) => {
    const file = acceptedFiles[0];

    if (!file) return;

    setLoadingFiles((prev) => ({ ...prev, [name]: true }));

    setFormData((prev) => ({
      ...prev,
      [`${name}Image`]: file,
    }));

    setTimeout(() => {
      setLoadingFiles((prev) => ({ ...prev, [name]: false }));
    }, 500);
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setErrors({});
    setLoadingFiles(initialLoadingFiles);
  };

  const currentAddressProofDocumentLabel = 'Upload Address Proof Document Image';

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box className="min-h-screen flex flex-col">
        <Navbar isAuthenticated={true} />

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
                sx={{ mt: -2, ml: 1, color: '#1976d2' }}
              >
                KYC Form
              </Typography>

              <form onSubmit={handleSubmit}>
                {/* Personal Information */}
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ mt: 2, color: 'primary.main' }}
                >
                  Personal Information
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="First Name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      fullWidth
                      required
                      error={!!errors.firstName}
                      helperText={errors.firstName}
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
                      error={!!errors.lastName}
                      helperText={errors.lastName}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <DatePicker
                      label="Date of Birth"
                      value={formData.dob}
                      onChange={(date) => setFormData((prev) => ({ ...prev, dob: date }))}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          required: true,
                          error: !!errors.dob,
                          helperText: errors.dob,
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required error={!!errors.gender}>
                      <InputLabel>Gender</InputLabel>
                      <Select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        label="Gender"
                      >
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                      </Select>
                      {errors.gender && <FormHelperText>{errors.gender}</FormHelperText>}
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
                    <FormControl fullWidth required error={!!errors.maritalStatus}>
                      <InputLabel>Marital Status</InputLabel>
                      <Select
                        name="maritalStatus"
                        value={formData.maritalStatus}
                        onChange={handleChange}
                        label="Marital Status"
                      >
                        <MenuItem value="Single">Single</MenuItem>
                        <MenuItem value="Married">Married</MenuItem>
                        <MenuItem value="Divorced">Divorced</MenuItem>
                        <MenuItem value="Widowed">Widowed</MenuItem>
                      </Select>
                      {errors.maritalStatus && (
                        <FormHelperText>{errors.maritalStatus}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                </Grid>

                {/* Contact Details */}
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ mt: 4, color: 'primary.main' }}
                >
                  Contact Details
                </Typography>

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
                          checked={formData.correspondenceAddress.sameAsPermanent || false}
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
                          required
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="City"
                          name="correspondenceAddress.city"
                          value={formData.correspondenceAddress.city}
                          onChange={handleChange}
                          fullWidth
                          required
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="State"
                          name="correspondenceAddress.state"
                          value={formData.correspondenceAddress.state}
                          onChange={handleChange}
                          fullWidth
                          required
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="PIN Code"
                          name="correspondenceAddress.pinCode"
                          value={formData.correspondenceAddress.pinCode}
                          onChange={handleChange}
                          fullWidth
                          required
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
                      error={!!errors.phone}
                      helperText={errors.phone}
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
                      error={!!errors.email}
                      helperText={errors.email}
                    />
                  </Grid>
                </Grid>

                {/* Identity and Address Proof */}
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ mt: 4, color: 'primary.main' }}
                >
                  Identity and Address Proof
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="PAN Number"
                      name="panNumber"
                      value={formData.panNumber}
                      onChange={handleChange}
                      fullWidth
                      required
                      error={!!errors.panNumber}
                      helperText={errors.panNumber}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FileUpload
                      label="Upload PAN Card Image"
                      file={formData.panCardImage}
                      onDrop={(files) => handleFileDrop('panCard', files)}
                      loading={loadingFiles.panCard}
                      error={!!errors.panCardImage}
                      helperText={errors.panCardImage}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Aadhaar Number"
                      name="aadhaarNumber"
                      value={formData.aadhaarNumber}
                      onChange={handleChange}
                      fullWidth
                      required
                      error={!!errors.aadhaarNumber}
                      helperText={errors.aadhaarNumber}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FileUpload
                      label="Upload Aadhaar Card Image"
                      file={formData.aadhaarCardImage}
                      onDrop={(files) => handleFileDrop('aadhaarCard', files)}
                      loading={loadingFiles.aadhaarCard}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Passport Number"
                      name="passportNumber"
                      value={formData.passportNumber}
                      onChange={handleChange}
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FileUpload
                      label="Upload Passport Image"
                      file={formData.passportImage}
                      onDrop={(files) => handleFileDrop('passport', files)}
                      loading={loadingFiles.passport}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Voter ID Number"
                      name="voterIdNumber"
                      value={formData.voterIdNumber}
                      onChange={handleChange}
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Driving License Number"
                      name="drivingLicenseNumber"
                      value={formData.drivingLicenseNumber}
                      onChange={handleChange}
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FileUpload
                      label={currentAddressProofDocumentLabel}
                      file={
                        formData.utilityBillImage ||
                        formData.rentalAgreementImage
                      }
                      onDrop={(files) => handleFileDrop('utilityBill', files)}
                      loading={loadingFiles.utilityBill}
                    />
                    <Typography variant="caption" color="textSecondary">
                      Upload a utility bill if it is being used as address proof.
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FileUpload
                      label="Upload Rental Agreement"
                      file={formData.rentalAgreementImage}
                      onDrop={(files) => handleFileDrop('rentalAgreement', files)}
                      loading={loadingFiles.rentalAgreement}
                    />
                  </Grid>
                </Grid>

                {/* Financial Information */}
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ mt: 4, color: 'primary.main' }}
                >
                  Financial Information
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required error={!!errors.sourceOfIncome}>
                      <InputLabel>Source of Income</InputLabel>
                      <Select
                        label="Source of Income"
                        name="sourceOfIncome"
                        value={formData.sourceOfIncome}
                        onChange={handleChange}
                      >
                        {sourceOfIncomeOptions.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.sourceOfIncome && (
                        <FormHelperText>{errors.sourceOfIncome}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required error={!!errors.occupation}>
                      <InputLabel>Occupation</InputLabel>
                      <Select
                        label="Occupation"
                        name="occupation"
                        value={formData.occupation}
                        onChange={handleChange}
                      >
                        {occupationOptions.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.occupation && (
                        <FormHelperText>{errors.occupation}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  {formData.occupation === 'Salaried' && (
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Employer Name"
                        name="employerName"
                        value={formData.employerName}
                        onChange={handleChange}
                        fullWidth
                        required
                        error={!!errors.employerName}
                        helperText={errors.employerName}
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
                      type="number"
                      error={!!errors.annualIncome}
                      helperText={errors.annualIncome}
                    />
                  </Grid>
                </Grid>

                {/* Banking Details */}
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ mt: 4, color: 'primary.main' }}
                >
                  Banking Details
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Bank Account Number"
                      name="bankAccountNumber"
                      value={formData.bankAccountNumber}
                      onChange={handleChange}
                      fullWidth
                      required
                      error={!!errors.bankAccountNumber}
                      helperText={errors.bankAccountNumber}
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
                      error={!!errors.ifscCode}
                      helperText={errors.ifscCode}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required error={!!errors.accountType}>
                      <InputLabel>Account Type</InputLabel>
                      <Select
                        name="accountType"
                        value={formData.accountType}
                        onChange={handleChange}
                        label="Account Type"
                      >
                        <MenuItem value="Savings">Savings</MenuItem>
                        <MenuItem value="Current">Current</MenuItem>
                      </Select>
                      {errors.accountType && (
                        <FormHelperText>{errors.accountType}</FormHelperText>
                      )}
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

                      <Button
                        variant="contained"
                        color="error"
                        type="button"
                        size="large"
                        onClick={handleReset}
                        sx={{ ml: 2 }}
                        disabled={isSubmitting}
                      >
                        Reset
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