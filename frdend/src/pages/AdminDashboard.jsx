import AdminSideBar from "../components/AdminSideBar";
import Navbar from "../components/Dashboard/Navbar";
import AdminSummery from "../components/Dashboard/AdminSummery";
import "./AdminDashboard.css";


const AdminDashboard = () => {
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
