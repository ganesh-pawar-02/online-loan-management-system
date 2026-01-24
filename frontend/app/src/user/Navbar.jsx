import React, { useState } from "react";
import { IconButton, Badge, Menu, MenuItem, Tooltip } from "@mui/material";
import { Notifications, AccountCircle, Logout } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ isAuthenticated }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications] = useState(5); // Example notification count
  const navigate = useNavigate();

  // Handle opening notification menu
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Handle closing notification menu
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
          <h1 className="text-2xl font-bold text-blue-600">Easy Loan - User</h1>
        </div>

        {/* Buttons and Icons */}
        <div className="flex space-x-4 mt-4 md:mt-0 items-center">
          {isAuthenticated && (
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
                  <MenuItem onClick={handleMenuClose}>New Loan Request</MenuItem>
                  <MenuItem onClick={handleMenuClose}>EMI Payment Due</MenuItem>
                </Menu>
              </div>

              {/* User Profile & Logout */}
              <div className="flex items-center space-x-4">
                {/* Profile Link */}
                <Link to="/user-profile" className="text-blue-600 flex items-center space-x-2">
                  <Tooltip title="User Profile" arrow>
                    <AccountCircle fontSize="large" />
                  </Tooltip>
                </Link>

                {/* Logout Button */}
                <button
                  onClick={() => navigate("/logout")} // Redirects to Logout component
                  className="relative px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition duration-300"
                >
                  <Logout fontSize="small" />
                  <span>Logout</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
