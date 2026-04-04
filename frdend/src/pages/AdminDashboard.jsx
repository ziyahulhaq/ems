import { useState } from "react";
import AdminSideBar from "../components/AdminSideBar";
import Navbar from "../components/Dashboard/Navbar";
import "./AdminDashboard.css";
import { Outlet } from "react-router-dom";

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="admin-dashboard">
      <AdminSideBar
        isOpen={isSidebarOpen}
        closeSidebar={() => setIsSidebarOpen(false)}
      />
      <button
        className={`admin-dashboard__backdrop ${
          isSidebarOpen ? "admin-dashboard__backdrop--visible" : ""
        }`}
        type="button"
        aria-label="Close navigation"
        onClick={() => setIsSidebarOpen(false)}
      />
      <main className="admin-dashboard__content">
        <Navbar onMenuClick={() => setIsSidebarOpen((open) => !open)} />
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;
