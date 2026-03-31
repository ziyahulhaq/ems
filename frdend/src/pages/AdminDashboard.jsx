import { useEffect } from "react";
import AdminSideBar from "../components/AdminSideBar";
import Navbar from "../components/Dashboard/Navbar";
import AdminSummery from "../components/Dashboard/AdminSummery";
import "./AdminDashboard.css";


const AdminDashboard = () => {
  useEffect(() => {
    const { style } = document.body;
    const { style: rootStyle } = document.documentElement;
    const previousBodyOverflow = style.overflow;
    const previousBodyHeight = style.height;
    const previousBodyPadding = style.padding;
    const previousBodyDisplay = style.display;
    const previousRootOverflow = rootStyle.overflow;

    style.overflow = "hidden";
    style.height = "100vh";
    style.padding = "0";
    style.display = "block";
    rootStyle.overflow = "hidden";

    return () => {
      style.overflow = previousBodyOverflow;
      style.height = previousBodyHeight;
      style.padding = previousBodyPadding;
      style.display = previousBodyDisplay;
      rootStyle.overflow = previousRootOverflow;
    };
  }, []);

  return (
    <div className="admin-dashboard">
      <AdminSideBar />
      <main className="admin-dashboard__content">
        <Navbar />
        <AdminSummery />
      </main>
    </div>
    
  );
};

export default AdminDashboard;
