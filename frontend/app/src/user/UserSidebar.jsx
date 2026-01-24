import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PaymentIcon from "@mui/icons-material/Payment";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import DomainVerificationIcon from "@mui/icons-material/DomainVerification";
import EditNoteIcon from "@mui/icons-material/EditNote";

const UserSidebar = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  return (
    <div
      style={{
        width: "250px", // Fixed width
        backgroundColor: isDarkMode ? "#1e1e1e" : "#ffffff", // Background color
        color: isDarkMode ? "#ffffff" : "#000000", // Text color
        padding: "16px",
        height: "100vh", // Full height
        display: "flex",
        flexDirection: "column",
        boxShadow: "2px 0px 5px rgba(0,0,0,0.1)", // Shadow effect
      }}
    >
      <h2
        style={{
          textAlign: "center",
          fontWeight: "bold",
          padding: "16px 0",
          borderBottom: "1px solid gray",
        }}
      >
        USER DASHBOARD
      </h2>

      {/* Sidebar Links */}
      <div style={{ marginTop: "24px" }}>
        {[
          { name: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
          { name: "Loan Details", icon: <ReceiptLongIcon />, path: "/loan-details" },
          { name: "Pay EMI", icon: <PaymentIcon />, path: "/pay-emi" },
          { name: "User  Profile", icon: <AccountCircleIcon />, path: "/user-profile" },
          { name: "Wallet", icon: <AccountBalanceWalletIcon />, path: "/wallet" },
          { name: "KYC", icon: <DomainVerificationIcon />, path: "/kyc" },
          { name: "Apply For Loan", icon: <EditNoteIcon />, path: "/apply-for-loan" },
        ].map((item, index) => (
          <Link
            key={index}
            to={item.path}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "12px 16px",
              textDecoration: "none",
              color: isDarkMode ? "#ffffff" : "#000000",
              margin: "4px 0",
              borderRadius: "8px",
              transition: "background-color 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = isDarkMode
                ? "#333333"
                : "#f0f0f0";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "transparent";
            }}
          >
            <span style={{ marginRight: "16px", color: "#007bff" }}>
              {item.icon}
            </span>
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default UserSidebar;