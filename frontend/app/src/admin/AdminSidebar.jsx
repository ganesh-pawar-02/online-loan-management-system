import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import PaymentIcon from "@mui/icons-material/Payment";
import CalculateIcon from "@mui/icons-material/Calculate";
import ContactsIcon from "@mui/icons-material/Contacts";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
const AdminSidebar = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  return (
    <div
      style={{
        width: "250px",
        backgroundColor: isDarkMode ? "#1e1e1e" : "#ffffff",
        color: isDarkMode ? "#ffffff" : "#000000",
        padding: "16px",
        height: "100vh",
        boxShadow: "2px 0px 5px rgba(0,0,0,0.1)",
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
        ADMIN 
      </h2>

      {/* Sidebar Links */}
      <div style={{ marginTop: "24px" }}>
        {[
          { name: "Dashboard", icon: <DashboardIcon />, path: "/AdminDashboard" },
          { name: "Clients", icon: <PeopleIcon />, path: "/AdminClients" },
          { name: "Loans", icon: <AccountBalanceIcon />, path: "/AdminLoans" },
          { name: "EMI Payments", icon: <PaymentIcon />, path: "/AdminEMI" },
          { name: "Calculator", icon: <CalculateIcon />, path: "/AdminCalculator" },
          { name: "Users", icon: <SupervisorAccountIcon />, path: "/AdminUsers" },
          { name: "Contact", icon: <ContactsIcon />, path: "/AdminContact" },
          { name: "Wallet", icon: <AccountBalanceWalletIcon />, path: "/AdminWallet" },
          { name: "Logout", icon: <LogoutIcon />, path: "/logout" },
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

export default AdminSidebar;
