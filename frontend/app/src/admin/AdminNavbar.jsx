import React, { useState } from "react";
import { IconButton, Badge, Menu, MenuItem, Tooltip } from "@mui/material";
import { Notifications, AccountCircle, Logout } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";

const AdminNavbar = ({ isAuthenticated }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications] = useState(5); // Example notification count
  const navigate = useNavigate();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto p-4 flex flex-col md:flex-row justify-between items-center">
        {/* Logo and Title */}
        <div className="flex items-center space-x-2">
          <img
            src="https://cdn-icons-png.flaticon.com/128/1466/1466700.png"
            alt="Logo"
            className="w-10 h-10"
          />
          <h1 className="text-2xl font-bold text-blue-600">Easy Loan - Admin</h1>
        </div>

        {/* Buttons and Icons */}
        <div className="flex space-x-4 mt-4 md:mt-0 items-center">
          {isAuthenticated ? (
            <>
              {/* Notifications */}
              <div className="relative">
                <IconButton color="primary" onClick={handleMenuOpen}>
                  <Badge badgeContent={notifications} color="error">
                    <Notifications />
                  </Badge>
                </IconButton>
                {/* Notification Menu */}
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                  <MenuItem onClick={handleMenuClose}>New User Registered</MenuItem>
                  <MenuItem onClick={handleMenuClose}>Loan Request Pending</MenuItem>
                  <MenuItem onClick={handleMenuClose}>Payment Received</MenuItem>
                </Menu>
              </div>

              {/* Admin Profile & Logout */}
              <div className="flex items-center space-x-4">
                {/* Profile */}
                <Link to="/admin-profile" className="text-blue-600 flex items-center space-x-2">
                  <Tooltip title="Admin Profile" arrow>
                    <AccountCircle fontSize="large" className="bg-transparent" />
                  </Tooltip>
                </Link>

                {/* Logout */}
                <button
                  onClick={() => navigate("/logout")} // Redirects to Logout component
                  className="relative px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition duration-300"
                >
                  <Logout fontSize="small" />
                  <span>Logout</span>
                </button>
              </div>
            </>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition duration-300"
            >
              <AccountCircle fontSize="small" />
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
