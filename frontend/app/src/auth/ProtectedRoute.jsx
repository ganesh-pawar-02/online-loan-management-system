import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
  const token = sessionStorage.getItem('authToken') || sessionStorage.getItem('tempToken');
  const role = sessionStorage.getItem('userRole');

  // Allow users to access OTP verification page if tempToken exists
  const isOTPRoute = window.location.pathname === '/verify-otp';

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
