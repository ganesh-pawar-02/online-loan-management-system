import React, { useEffect, useState } from "react";
import DataGridTable from "../components/DataGridTable";
import baseColumns from "../components/columns/UserColumns"; // renamed for clarity
import AdminSidebar from "./AdminSidebar"; // Import the sidebar
import AdminNavbar from "./AdminNavbar"; // Import the navbar
import { Box, Card, CircularProgress } from "@mui/material";
import { GridActionsCellItem } from "@mui/x-data-grid"; // Import for action buttons

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state for handling fetch errors

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const response = await fetch("http://65.2.80.0:8080/api/users/AllUsers");

      // Check if the response is OK (status code 200)
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const usersData = await response.json(); // Parse the JSON response
      setUsers(usersData); // Set the users data
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to load users. Please try again later.");
    } finally {
      setLoading(false); // End loading state
    }
  };

  // Action handlers for Approve and Reject buttons
  const handleApproveClick = (id) => {
    // Add your logic to handle approval here.
    console.log("Approve clicked for user:", id);
    alert(`Approve clicked for user ${id}`);
  };

  const handleRejectClick = (id) => {
    // Add your logic to handle rejection here.
    console.log("Reject clicked for user:", id);
    alert(`Reject clicked for user ${id}`);
  };

  // Extend the imported columns by appending the actions column
  const columnsWithActions = [
    ...baseColumns,
    {
      field: "actions",
      headerName: "Actions",
      width: 250, 
      type: "actions",
      getActions: (params) => [
        <GridActionsCellItem
          icon={
            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md">
              Approve
            </button>
          }
          label="Approve"
          onClick={() => handleApproveClick(params.id)}
          key="approve"
        />,
        <GridActionsCellItem
          icon={
            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md">
              Reject
            </button>
          }
          label="Reject"
          onClick={() => handleRejectClick(params.id)}
          key="reject"
        />
      ]
    }
  ];

  return (
    <Box className="min-h-screen flex flex-col">
      {/* Navbar */}
      <AdminNavbar isAuthenticated={true} />

      <Box className="flex flex-row flex-grow">
        {/* Sidebar */}
        <Box className="w-1/5 bg-gray-100 p-4">
          <AdminSidebar />
        </Box>

        {/* Main Content */}
        <Box className="w-4/5 p-6">
           <Card sx={{ p: 4, boxShadow: 3 }}>
            <h1 className="text-2xl font-semibold text-blue-600 mt-5">ALL USERS</h1>
            <div className="mt-10">
              {error && (
                <Box className="text-red-500 text-center">{error}</Box>
              )}
              {!loading ? (
                <DataGridTable data={users} columns={columnsWithActions} />
              ) : (
                <Box className="flex justify-center items-center h-40">
                  <CircularProgress />
                </Box>
              )}
            </div>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminUsers;
