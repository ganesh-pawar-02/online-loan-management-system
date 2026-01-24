import React from 'react';
import AdminSidebar from './AdminSidebar'; // Import AdminSidebar component
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const AdminLogout = () => {
    const navigate = useNavigate();

    // Handle Logout Confirmation
    const handleLogout = () => {
        confirmAlert({
            title: 'Confirm Logout',
            message: 'Are you sure you want to log out?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => performLogout()
                },
                {
                    label: 'No'
                }
            ]
        });
    };

    // Perform Logout Operation
    const performLogout = () => {
        try {
            // Clear session data (e.g., from localStorage)
            localStorage.removeItem('userSession'); // Replace 'userSession' with your key

            // Redirect to login page immediately
            navigate('/login');  // This redirects the user to the login page after logout
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <div className="w-1/5">
                <AdminSidebar />
            </div>

            {/* Main Content */}
            <div className="w-4/5 p-4 flex flex-col items-center justify-center">
                <h1 className="text-3xl text-blue-600 mb-8">Admin Logout</h1>
                <p className="text-lg text-gray-700 mb-6">Are you sure you want to log out from the admin dashboard?</p>
                <div>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={handleLogout}
                        style={{ marginRight: '10px' }}
                    >
                        Confirm Logout
                    </Button>
                    <Button 
                        variant="outlined" 
                        color="secondary" 
                        onClick={() => navigate(-1)}
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AdminLogout;
