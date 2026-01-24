import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

// Public Pages
import Landing from './landing/Landing';
import Main from './landing/Main';
import Login from './auth/Login';
import Register from './auth/Register';

// Admin Routes
import AdminDashboard from './admin/AdminDashboard';
import AdminClients from './admin/AdminClients';
import AdminLoans from './admin/AdminLoans';
import AdminEMI from './admin/AdminEMI';
import AdminCalculator from './admin/AdminCalculator';
import AdminUsers from './admin/AdminUsers';
import AdminContact from './admin/AdminContact';
import AdminWallet from './admin/AdminWallet';

// User Routes
import Dashboard from './user/Dashboard';
import LoanDetails from './user/LoanDetails';
import PayEmi from './user/PayEmi';
import Wallet from './user/Wallet';
import UserProfile from './user/UserProfile';
import KYCForm from './user/Kyc';
import LoanApplicationForm from './user/LoanApplication';

// Logout Routes
import Logout from './auth/Logout'; // Import Logout component
import AdminLogout from './admin/AdminLogout';

// Shared Wallet Context
import { SharedWalletProvider } from './components/SharedWallet';

// ProtectedRoute component handles authentication and role checks
import ProtectedRoute from './auth/ProtectedRoute';
import VerifyOtp from './auth/VerifyOtp';

export default function App() {
  // State to manage transaction data for the graph
  const [transactionData, setTransactionData] = useState([]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="MainPage" element={<Main />} />
      <Route path="verify-otp" element={<VerifyOtp />} />

      {/* Admin Routes (only for Admin users) */}
      <Route
        path="AdminDashboard"
        element={
          <ProtectedRoute requiredRole="ROLE_ADMIN">
            <AdminDashboard transactionData={transactionData} />
          </ProtectedRoute>
        }
      />
      <Route
        path="AdminClients"
        element={
          <ProtectedRoute requiredRole="ROLE_ADMIN">
            <AdminClients />
          </ProtectedRoute>
        }
      />
      <Route
        path="AdminLoans"
        element={
          <ProtectedRoute requiredRole="ROLE_ADMIN">
            <AdminLoans />
          </ProtectedRoute>
        }
      />
      <Route
        path="AdminEMI"
        element={
          <ProtectedRoute requiredRole="ROLE_ADMIN">
            <AdminEMI />
          </ProtectedRoute>
        }
      />
      <Route
        path="AdminCalculator"
        element={
          <ProtectedRoute requiredRole="ROLE_ADMIN">
            <AdminCalculator />
          </ProtectedRoute>
        }
      />
      <Route
        path="AdminUsers"
        element={
          <ProtectedRoute requiredRole="ROLE_ADMIN">
            <AdminUsers />
          </ProtectedRoute>
        }
      />
      <Route
        path="AdminContact"
        element={
          <ProtectedRoute requiredRole="ROLE_ADMIN">
            <AdminContact />
          </ProtectedRoute>
        }
      />
      <Route
        path="AdminWallet"
        element={
          <ProtectedRoute requiredRole="ROLE_ADMIN">
            <AdminWallet setTransactionData={setTransactionData} />
          </ProtectedRoute>
        }
      />
      <Route
        path="admin-logout"
        element={
          <ProtectedRoute requiredRole="ROLE_ADMIN">
            <AdminLogout />
          </ProtectedRoute>
        }
      />

      {/* User Routes (only for regular users) */}
      <Route
        path="dashboard"
        element={
          <ProtectedRoute requiredRole="ROLE_USER">
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="loan-details"
        element={
          <ProtectedRoute requiredRole="ROLE_USER">
            <LoanDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="pay-emi"
        element={
          <ProtectedRoute requiredRole="ROLE_USER">
            <SharedWalletProvider>
              <PayEmi />
            </SharedWalletProvider>
          </ProtectedRoute>
        }
      />
      <Route
        path="wallet"
        element={
          <ProtectedRoute requiredRole="ROLE_USER">
            <SharedWalletProvider>
              <Wallet />
            </SharedWalletProvider>
          </ProtectedRoute>
        }
      />
      <Route
        path="user-profile"
        element={
          <ProtectedRoute requiredRole="ROLE_USER">
            <UserProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="kyc"
        element={
          <ProtectedRoute requiredRole="ROLE_USER">
            <KYCForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="apply-for-loan"
        element={
          <ProtectedRoute requiredRole="ROLE_USER">
            <LoanApplicationForm />
          </ProtectedRoute>
        }
      />

      {/* Logout Route */}
      <Route path="logout" element={<Logout />} />

      {/* Catch-all route */}
      <Route path="*" element={<Login />} />
    </Routes>
  );
}