import { useAuth } from "../Context/authContext";
import AdminSideBar from "../components/AdminSideBar";
import Navbar from "../components/Dashboard/Navbar";
import AdminSummery from "../components/Dashboard/AdminSummery";


const AdminDashboard = () => {
  const { user } = useAuth();
 
  return (
    <div><AdminSideBar />
    <div className="admin-navbar">
      <Navbar/>
      <AdminSummery/>
    </div>

    </div>
    
  );
};

export default AdminDashboard;
