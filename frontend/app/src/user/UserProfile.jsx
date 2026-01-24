import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
  Divider,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserSidebar from './UserSidebar';
import Navbar from './Navbar';

const UserProfile = () => {
  const [userDetails, setUserDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    avatarUrl: 'https://via.placeholder.com/150',
    gender: '',
    dob: '',
    state: '',
    zipCode: '',
    adharNo: '',
    panNo: '',
    bankAccountNo: '',
  });

  const [formValues, setFormValues] = useState(userDetails);
  const [isEditing, setIsEditing] = useState(false);

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);

  // Helper functions to handle loading state
  const startLoading = () => setLoading(true);
  const endLoading = () => setLoading(false);

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        startLoading();
        const token = sessionStorage.getItem('authToken');
        const headers = { 'Content-Type': 'application/json' };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await axios.get(`http://65.2.80.0:8080/kyc/user/profile`, { headers });
        const apiData = response.data;

        // Map API fields to local state structure
        const updatedUserDetails = {
          firstName: apiData.firstName || '',
          lastName: apiData.lastName || '',
          email: apiData.email || '',
          phone: apiData.phone || '',
          city: apiData.correspondenceCity || '',
          avatarUrl: apiData.avatarUrl || 'https://via.placeholder.com/150',
          gender: apiData.gender || '',
          dob: apiData.dob || '',
          state: apiData.correspondenceState || '',
          zipCode: apiData.correspondenceZipCode || '',
          adharNo: apiData.aadhaarNumber || '',
          panNo: apiData.panNumber || '',
          bankAccountNo: apiData.bankAccountNumber || '',
        };

        setUserDetails(updatedUserDetails);
        setFormValues(updatedUserDetails);

        // Prefill email in the password form
        setPasswordForm((prev) => ({ ...prev, email: updatedUserDetails.email }));
      } catch (error) {
        console.error('Error fetching user profile:', error.response || error);
        toast.error('Error fetching user profile. Please try again later.');
      } finally {
        endLoading();
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newAvatarUrl = reader.result;
        // Update both states so that the new avatar is sent on update
        setUserDetails((prev) => ({ ...prev, avatarUrl: newAvatarUrl }));
        setFormValues((prev) => ({ ...prev, avatarUrl: newAvatarUrl }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    try {
      startLoading();
      const response = await axios.post(
        'http://65.2.80.0:8080/users/change-password',
        passwordForm,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 200) {
        setIsChangingPassword(false);
        toast.success('Password changed successfully!');
      } else {
        toast.error('Failed to change password. Please try again.');
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error('An error occurred while changing the password.');
    } finally {
      endLoading();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      startLoading();
      const token = sessionStorage.getItem('authToken');
      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Fixed the syntax here: removed the extra curly brace.
      const response = await axios.put(
        `http://65.2.80.0:8080/kyc/user/update`,
        formValues,
        { headers }
      );

      if (response.status === 200) {
        setUserDetails(formValues);
        setIsEditing(false);
        toast.success('Profile updated successfully!');
      } else {
        toast.error('Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error('Error updating profile:', error.response || error);
      toast.error('Error updating profile. Please try again later.');
    } finally {
      endLoading();
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography variant="h6">Loading Profile...</Typography>
      </Box>
    );
  }

  return (
    <Box className="min-h-screen flex flex-col">
      <Navbar isAuthenticated={true} />
      <ToastContainer />
      <Box className="flex flex-row flex-grow">
        <Box className="w-1/5 bg-gray-100 p-4">
          <UserSidebar />
        </Box>


        <Box width={{ xs: '100%', md: '80%' }} p={4}>
          <Typography variant="h5"  
            fontWeight="bold"
            gutterBottom
            sx={{ mt: 1, ml: 2, color: "#1976d2" }}>
            USER PROFILE
          </Typography>
          <Card sx={{ p: 4, boxShadow: 3 }}>
            <Grid container spacing={4}>

              <Grid item xs={12} md={4} textAlign="center" display="flex" flexDirection="column" alignItems="center">
                <Box sx={{ position: 'relative', display: 'inline-block' }}>
                  <Avatar
                    src={userDetails.avatarUrl}
                    alt={userDetails.firstName}
                    sx={{ width: 150, height: 150, mb: 2 }}
                  />
                  {isEditing && (
                    <IconButton
                      color="primary"
                      aria-label="upload picture"
                      component="label"
                      sx={{
                        position: 'absolute',
                        bottom: 10,
                        right: 10,
                        bgcolor: 'rgba(0,0,0,0.6)',
                        borderRadius: '50%',
                        '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' },
                      }}
                    >
                      <input hidden accept="image/*" type="file" onChange={handleProfilePicChange} />
                      <PhotoCameraIcon fontSize="small" sx={{ color: 'white' }} />
                    </IconButton>
                  )}
                </Box>
                {!isEditing && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setIsEditing(true)}
                    sx={{ mt: 1, width: 'fit-content' }}
                  >
                    Edit Profile
                  </Button>
                )}
              </Grid>


              <Grid item xs={12} md={8}>
                {!isEditing ? (
                  <>
                    <Typography variant="h6" gutterBottom sx={{ color: '#1565c0', fontWeight: 'bold' }}>
                      PERSONAL INFORMATION
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <DetailItem label="Full Name" value={`${userDetails.firstName} ${userDetails.lastName}`} />
                    <DetailItem label="Date of Birth" value={userDetails.dob} />
                    <DetailItem label="Phone Number" value={userDetails.phone} />
                    <DetailItem label="Gender" value={userDetails.gender} />
                    <DetailItem label="Email Address" value={userDetails.email} />

                    <Typography variant="h6" gutterBottom sx={{ color: '#1565c0', fontWeight: 'bold', mt: 4 }}>
                      CHANGE PASSWORD
                    </Typography>
                    <Button variant="outlined" color="primary" onClick={() => setIsChangingPassword(true)}>
                      Change Password
                    </Button>
                  </>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <Typography variant="h5" gutterBottom>
                      EDIT PERSONAL INFORMATION
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="First Name"
                          variant="outlined"
                          fullWidth
                          name="firstName"
                          value={formValues.firstName}
                          onChange={handleChange}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Last Name"
                          variant="outlined"
                          fullWidth
                          name="lastName"
                          value={formValues.lastName}
                          onChange={handleChange}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Email Address"
                          variant="outlined"
                          fullWidth
                          name="email"
                          value={formValues.email}
                          onChange={handleChange}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Phone Number"
                          variant="outlined"
                          fullWidth
                          name="phone"
                          value={formValues.phone}
                          onChange={handleChange}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="City"
                          variant="outlined"
                          fullWidth
                          name="city"
                          value={formValues.city}
                          onChange={handleChange}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <InputLabel>Gender</InputLabel>
                          <Select name="gender" value={formValues.gender} onChange={handleChange} label="Gender" required>
                            <MenuItem value="Male">Male</MenuItem>
                            <MenuItem value="Female">Female</MenuItem>
                            <MenuItem value="Other">Other</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Date of Birth"
                          variant="outlined"
                          fullWidth
                          name="dob"
                          value={formValues.dob}
                          onChange={handleChange}
                          type="date"
                          InputLabelProps={{ shrink: true }}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="State"
                          variant="outlined"
                          fullWidth
                          name="state"
                          value={formValues.state}
                          onChange={handleChange}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Zip Code"
                          variant="outlined"
                          fullWidth
                          name="zipCode"
                          value={formValues.zipCode}
                          onChange={handleChange}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Adhar No"
                          variant="outlined"
                          fullWidth
                          name="adharNo"
                          value={formValues.adharNo}
                          onChange={handleChange}
                          InputProps={{ readOnly: true }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Pan No"
                          variant="outlined"
                          fullWidth
                          name="panNo"
                          value={formValues.panNo}
                          onChange={handleChange}
                          InputProps={{ readOnly: true }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Bank Account No"
                          variant="outlined"
                          fullWidth
                          name="bankAccountNo"
                          value={formValues.bankAccountNo}
                          onChange={handleChange}
                          InputProps={{ readOnly: true }}
                        />
                      </Grid>
                    </Grid>
                    <Box display="flex" gap={2} mt={3}>
                      <Button variant="contained" color="success" type="submit">
                        Save
                      </Button>
                      <Button variant="contained" color="error" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                    </Box>
                  </form>
                )}

                {isChangingPassword && (
                  <form onSubmit={handlePasswordSubmit}>
                    <Typography variant="h6" gutterBottom>
                      Change Password
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          label="Email"
                          variant="outlined"
                          fullWidth
                          name="email"
                          value={passwordForm.email}
                          onChange={handlePasswordChange}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          label="Current Password"
                          variant="outlined"
                          fullWidth
                          name="currentPassword"
                          value={passwordForm.currentPassword}
                          onChange={handlePasswordChange}
                          type="password"
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          label="New Password"
                          variant="outlined"
                          fullWidth
                          name="newPassword"
                          value={passwordForm.newPassword}
                          onChange={handlePasswordChange}
                          type="password"
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          label="Confirm Password"
                          variant="outlined"
                          fullWidth
                          name="confirmPassword"
                          value={passwordForm.confirmPassword}
                          onChange={handlePasswordChange}
                          type="password"
                          required
                        />
                      </Grid>
                    </Grid>
                    <Box display="flex" gap={2} mt={3}>
                      <Button variant="contained" color="success" type="submit">
                        Change Password
                      </Button>
                      <Button variant="contained" color="error" onClick={() => setIsChangingPassword(false)}>
                        Cancel
                      </Button>
                    </Box>
                  </form>
                )}
              </Grid>
            </Grid>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

const DetailItem = ({ label, value }) => (
  <Box display="flex" justifyContent="space-between" mb={2}>
    <Typography variant="body1" color="textSecondary">
      {label}:
    </Typography>
    <Typography variant="body1">{value}</Typography>
  </Box>
);

export default UserProfile;
