import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { auth } from './firebase';

const ProtectedRoute = ({ element: Component, ...rest }) => {
  const user = auth.currentUser;

  if (!user || !user.isAdmin) {
    return <Redirect to="/" />; // Redirect non-admin users to the home page
  }

  return <Route {...rest} element={Component} />;
};

export default ProtectedRoute;
