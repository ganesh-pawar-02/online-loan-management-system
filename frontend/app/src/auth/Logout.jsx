import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear sessionStorage to remove authToken and userRole
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userRole');

    // Optionally, show a logout success message
    toast.success("Logged out successfully!");

    // Redirect to landing page or login page
    navigate('/');
  }, [navigate]);

  return null;  // No UI is required, just handle logic and redirect
}

