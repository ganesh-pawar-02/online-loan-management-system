import React from "react";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

const AdminLayout = ({ children }) => {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Navbar */}
        <AdminNavbar isAuthenticated={true} />

        {/* Page Content */}
        <div style={{ padding: "16px", backgroundColor: "#f5f5f5", flex: 1 }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
