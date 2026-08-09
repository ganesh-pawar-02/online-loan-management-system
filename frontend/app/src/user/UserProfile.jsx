import API_BASE_URL from "../config/api";
import React, { useEffect, useState } from "react";
import axios from "axios";
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
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserSidebar from "./UserSidebar";
import Navbar from "./Navbar";

const UserProfile = () => {

  const [userDetails, setUserDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    profilePicturePath: "",
  });

  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  // Actual selected file
  const [profileImageFile, setProfileImageFile] =
    useState(null);

  // Image displayed in Avatar
  const [profileImage, setProfileImage] =
    useState("");

  const [isEditing, setIsEditing] =
    useState(false);

  const [isChangingPassword, setIsChangingPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [passwordForm, setPasswordForm] =
    useState({
      email: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

  // =========================================================
  // HEADERS
  // =========================================================

  const getHeaders = () => {

    const token =
      sessionStorage.getItem("authToken");

    return token
      ? {
          Authorization:
            `Bearer ${token}`,
        }
      : {};
  };

  // =========================================================
  // GET PROFILE
  // =========================================================

  const fetchUserProfile = async () => {

    try {

      setLoading(true);

      const response =
        await axios.get(
          `${API_BASE_URL}/users/profile`,
          {
            headers: getHeaders(),
          }
        );

      const data = response.data;

      const user = {

        firstName:
          data.firstName || "",

        lastName:
          data.lastName || "",

        email:
          data.email || "",

        phone:
          data.phone ||
          data.phoneNumber ||
          "",

        profilePicturePath:
          data.profilePicturePath ||
          "",
      };

      setUserDetails(user);

      setFormValues({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
      });

      setPasswordForm((prev) => ({
        ...prev,
        email: user.email,
      }));

    } catch (error) {

      console.error(
        "Error fetching profile:",
        error
      );

      toast.error(
        error.response?.data?.message ||
        "Unable to load profile."
      );

    } finally {

      setLoading(false);

    }
  };

  // =========================================================
  // GET PROFILE PICTURE
  // =========================================================

  const loadProfilePicture = async () => {

    try {

      const response =
        await axios.get(
          `${API_BASE_URL}/users/profile-picture`,
          {
            headers: getHeaders(),
            responseType: "blob",
          }
        );

      const imageUrl =
        URL.createObjectURL(
          response.data
        );

      setProfileImage(imageUrl);

    } catch (error) {

      // No picture uploaded yet
      setProfileImage("");

    }
  };

  useEffect(() => {

    fetchUserProfile();

    loadProfilePicture();

    return () => {

      if (profileImage) {
        URL.revokeObjectURL(
          profileImage
        );
      }

    };

  }, []);

  // =========================================================
  // HANDLE INPUT
  // =========================================================

  const handleChange = (e) => {

    const {
      name,
      value
    } = e.target;

    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // SELECT PROFILE PICTURE
  // =========================================================

  const handleProfilePicChange = (e) => {

    const file =
      e.target.files[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {

      toast.error(
        "Please select a valid image file."
      );

      return;
    }

    if (file.size > 5 * 1024 * 1024) {

      toast.error(
        "Profile picture must be less than 5 MB."
      );

      return;
    }

    // Store actual file
    setProfileImageFile(file);

    // Show preview
    const preview =
      URL.createObjectURL(file);

    setProfileImage(preview);
  };

  // =========================================================
  // SAVE PROFILE
  // NAME + PHONE + IMAGE
  // =========================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const formData =
        new FormData();

      formData.append(
        "firstName",
        formValues.firstName
      );

      formData.append(
        "lastName",
        formValues.lastName
      );

      formData.append(
        "phone",
        formValues.phone
      );

      // Add image only if user selected one

      if (profileImageFile) {

        formData.append(
          "profilePicture",
          profileImageFile
        );
      }

      const response =
        await axios.put(
          `${API_BASE_URL}/users/profile`,
          formData,
          {
            headers: getHeaders(),
          }
        );

      const data =
        response.data;

      const updatedUser = {

        firstName:
          data.firstName ||
          formValues.firstName,

        lastName:
          data.lastName ||
          formValues.lastName,

        email:
          data.email ||
          userDetails.email,

        phone:
          data.phone ||
          formValues.phone,

        profilePicturePath:
          data.profilePicturePath ||
          "",
      };

      setUserDetails(
        updatedUser
      );

      setFormValues({
        firstName:
          updatedUser.firstName,

        lastName:
          updatedUser.lastName,

        email:
          updatedUser.email,

        phone:
          updatedUser.phone,
      });

      setProfileImageFile(null);

      setIsEditing(false);

      toast.success(
        "Profile updated successfully!"
      );

      // Reload image from backend
      await loadProfilePicture();

    } catch (error) {

      console.error(
        "Profile update error:",
        error.response || error
      );

      toast.error(
        error.response?.data?.message ||
        "Unable to update profile."
      );

    } finally {

      setLoading(false);

    }
  };

  // =========================================================
  // CANCEL EDIT
  // =========================================================

  const handleCancelEdit = () => {

    setFormValues({
      firstName:
        userDetails.firstName,

      lastName:
        userDetails.lastName,

      email:
        userDetails.email,

      phone:
        userDetails.phone,
    });

    setProfileImageFile(null);

    loadProfilePicture();

    setIsEditing(false);
  };

  // =========================================================
  // PASSWORD INPUT
  // =========================================================

  const handlePasswordChange = (e) => {

    const {
      name,
      value
    } = e.target;

    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // CHANGE PASSWORD
  // =========================================================

  const handlePasswordSubmit =
    async (e) => {

      e.preventDefault();

      if (
        !passwordForm.currentPassword.trim()
      ) {

        toast.error(
          "Please enter your current password!"
        );

        return;
      }

      if (
        !passwordForm.newPassword.trim()
      ) {

        toast.error(
          "Please enter your new password!"
        );

        return;
      }

      if (
        passwordForm.newPassword !==
        passwordForm.confirmPassword
      ) {

        toast.error(
          "Passwords do not match!"
        );

        return;
      }

      try {

        setLoading(true);

        await axios.post(
          `${API_BASE_URL}/users/change-password`,
          passwordForm,
          {
            headers: {
              ...getHeaders(),
              "Content-Type":
                "application/json",
            },
          }
        );

        setIsChangingPassword(
          false
        );

        setPasswordForm((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));

        toast.success(
          "Password changed successfully!"
        );

      } catch (error) {

        console.error(
          "Password change error:",
          error
        );

        toast.error(
          error.response?.data?.message ||
          "Unable to change password."
        );

      } finally {

        setLoading(false);

      }
    };

  // =========================================================
  // UI
  // =========================================================

  return (

    <Box
      className="min-h-screen flex flex-col"
    >

      <Navbar
        isAuthenticated={true}
      />

      <ToastContainer />

      <Box
        className="flex flex-row flex-grow"
      >

        <Box
          className="w-1/5 bg-gray-100 p-4"
        >
          <UserSidebar />
        </Box>

        <Box
          width={{
            xs: "100%",
            md: "80%",
          }}
          p={4}
        >

          <Typography
            variant="h5"
            fontWeight="bold"
            gutterBottom
            sx={{
              mt: 1,
              ml: 2,
              color: "#1976d2",
            }}
          >
            USER PROFILE
          </Typography>

          <Card
            sx={{
              p: 4,
              boxShadow: 3,
            }}
          >

            <Grid
              container
              spacing={4}
            >

              {/* =================================================
                  PROFILE PICTURE
              ================================================= */}

              <Grid
                item
                xs={12}
                md={4}
                textAlign="center"
                display="flex"
                flexDirection="column"
                alignItems="center"
              >

                <Box
                  sx={{
                    position:
                      "relative",
                    display:
                      "inline-block",
                  }}
                >

                  <Avatar
                    src={
                      profileImage
                    }
                    alt={
                      userDetails.firstName
                    }
                    sx={{
                      width: 150,
                      height: 150,
                      mb: 2,
                    }}
                  />

                  <IconButton
                    color="primary"
                    component="label"
                    disabled={
                      !isEditing ||
                      loading
                    }
                    sx={{
                      position:
                        "absolute",
                      bottom: 10,
                      right: 10,
                      bgcolor:
                        "rgba(0,0,0,0.6)",

                      "&:hover": {
                        bgcolor:
                          "rgba(0,0,0,0.8)",
                      },
                    }}
                  >

                    <input
                      hidden
                      accept="image/*"
                      type="file"
                      onChange={
                        handleProfilePicChange
                      }
                    />

                    <PhotoCameraIcon
                      fontSize="small"
                      sx={{
                        color:
                          "white",
                      }}
                    />

                  </IconButton>

                </Box>

              </Grid>

              {/* =================================================
                  PROFILE INFORMATION
              ================================================= */}

              <Grid
                item
                xs={12}
                md={8}
              >

                {!isEditing ? (

                  <>

                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{
                        color:
                          "#1565c0",
                        fontWeight:
                          "bold",
                      }}
                    >
                      PERSONAL INFORMATION
                    </Typography>

                    <Divider
                      sx={{
                        mb: 2,
                      }}
                    />

                    <DetailItem
                      label="Full Name"
                      value={`${userDetails.firstName} ${userDetails.lastName}`}
                    />

                    <DetailItem
                      label="Phone Number"
                      value={
                        userDetails.phone
                      }
                    />

                    <DetailItem
                      label="Email Address"
                      value={
                        userDetails.email
                      }
                    />

                    <Box mt={3}>

                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() =>
                          setIsEditing(
                            true
                          )
                        }
                      >
                        Edit Profile
                      </Button>

                    </Box>

                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{
                        color:
                          "#1565c0",
                        fontWeight:
                          "bold",
                        mt: 4,
                      }}
                    >
                      CHANGE PASSWORD
                    </Typography>

                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() =>
                        setIsChangingPassword(
                          true
                        )
                      }
                    >
                      Change Password
                    </Button>

                  </>

                ) : (

                  <form
                    onSubmit={
                      handleSubmit
                    }
                  >

                    <Typography
                      variant="h5"
                      gutterBottom
                    >
                      EDIT PERSONAL INFORMATION
                    </Typography>

                    <Divider
                      sx={{
                        mb: 2,
                      }}
                    />

                    <Grid
                      container
                      spacing={2}
                    >

                      <Grid
                        item
                        xs={12}
                        sm={6}
                      >

                        <TextField
                          label="First Name"
                          variant="outlined"
                          fullWidth
                          name="firstName"
                          value={
                            formValues.firstName
                          }
                          onChange={
                            handleChange
                          }
                          required
                        />

                      </Grid>

                      <Grid
                        item
                        xs={12}
                        sm={6}
                      >

                        <TextField
                          label="Last Name"
                          variant="outlined"
                          fullWidth
                          name="lastName"
                          value={
                            formValues.lastName
                          }
                          onChange={
                            handleChange
                          }
                          required
                        />

                      </Grid>

                      <Grid
                        item
                        xs={12}
                        sm={6}
                      >

                        <TextField
                          label="Email Address"
                          variant="outlined"
                          fullWidth
                          name="email"
                          value={
                            formValues.email
                          }
                          InputProps={{
                            readOnly:
                              true,
                          }}
                          helperText="Email cannot be changed"
                        />

                      </Grid>

                      <Grid
                        item
                        xs={12}
                        sm={6}
                      >

                        <TextField
                          label="Phone Number"
                          variant="outlined"
                          fullWidth
                          name="phone"
                          value={
                            formValues.phone
                          }
                          onChange={
                            handleChange
                          }
                          required
                        />

                      </Grid>

                    </Grid>

                    <Box
                      display="flex"
                      gap={2}
                      mt={3}
                    >

                      <Button
                        variant="contained"
                        color="success"
                        type="submit"
                        disabled={
                          loading
                        }
                      >
                        {loading
                          ? "Saving..."
                          : "Save"}
                      </Button>

                      <Button
                        variant="contained"
                        color="error"
                        type="button"
                        onClick={
                          handleCancelEdit
                        }
                        disabled={
                          loading
                        }
                      >
                        Cancel
                      </Button>

                    </Box>

                  </form>

                )}

                {/* =================================================
                    CHANGE PASSWORD
                ================================================= */}

                {isChangingPassword && (

                  <form
                    onSubmit={
                      handlePasswordSubmit
                    }
                  >

                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{
                        mt: 4,
                      }}
                    >
                      Change Password
                    </Typography>

                    <Grid
                      container
                      spacing={2}
                    >

                      <Grid
                        item
                        xs={12}
                        sm={4}
                      >

                        <TextField
                          label="Email"
                          variant="outlined"
                          fullWidth
                          value={
                            passwordForm.email
                          }
                          InputProps={{
                            readOnly:
                              true,
                          }}
                        />

                      </Grid>

                      <Grid
                        item
                        xs={12}
                        sm={4}
                      >

                        <TextField
                          label="Current Password"
                          variant="outlined"
                          fullWidth
                          name="currentPassword"
                          value={
                            passwordForm.currentPassword
                          }
                          onChange={
                            handlePasswordChange
                          }
                          type="password"
                          required
                        />

                      </Grid>

                      <Grid
                        item
                        xs={12}
                        sm={4}
                      >

                        <TextField
                          label="New Password"
                          variant="outlined"
                          fullWidth
                          name="newPassword"
                          value={
                            passwordForm.newPassword
                          }
                          onChange={
                            handlePasswordChange
                          }
                          type="password"
                          required
                        />

                      </Grid>

                      <Grid
                        item
                        xs={12}
                        sm={4}
                      >

                        <TextField
                          label="Confirm Password"
                          variant="outlined"
                          fullWidth
                          name="confirmPassword"
                          value={
                            passwordForm.confirmPassword
                          }
                          onChange={
                            handlePasswordChange
                          }
                          type="password"
                          required
                        />

                      </Grid>

                    </Grid>

                    <Box
                      display="flex"
                      gap={2}
                      mt={3}
                    >

                      <Button
                        variant="contained"
                        color="success"
                        type="submit"
                        disabled={
                          loading
                        }
                      >
                        Change Password
                      </Button>

                      <Button
                        variant="contained"
                        color="error"
                        type="button"
                        onClick={() =>
                          setIsChangingPassword(
                            false
                          )
                        }
                      >
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

// =========================================================
// DETAIL ITEM
// =========================================================

const DetailItem = ({
  label,
  value,
}) => (

  <Box
    display="flex"
    justifyContent="space-between"
    mb={2}
  >

    <Typography
      variant="body1"
      color="textSecondary"
    >
      {label}:
    </Typography>

    <Typography
      variant="body1"
    >
      {value}
    </Typography>

  </Box>
);

export default UserProfile;