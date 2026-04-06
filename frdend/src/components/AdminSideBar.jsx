import {
  FaBuilding,
  FaChartPie,
  FaDollarSign,
  FaPlusCircle,
  FaUserFriends,
  FaUserTimes,
} from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../Context/useAuth";
import "./AdminSideBar.css";

const navItems = [
  { label: "Dashboard", to: "/admin-dashboard", icon: FaChartPie },
  { label: "Employees", to: "/admin-dashboard/department/employees", icon: FaUserFriends },
  { label: "Add Employee", to: "/admin-dashboard/add-new-employee", icon: FaPlusCircle },
  { label: "Departments", to: "/admin-dashboard/departments", icon: FaBuilding },
  { label: "Leave Management", to: "/admin-dashboard/leaves", icon: FaUserTimes },
  { label: "Salary", to: "/admin-dashboard/salary", icon: FaDollarSign },
  { label: "Settings", to: "/admin-dashboard/Settings", icon: IoMdSettings },
];

const AdminSideBar = ({ isOpen, closeSidebar }) => {
  const location = useLocation();
  const { user } = useAuth();
  const isReadOnly = user?.role !== "admin";

  return (
    <aside
      className={`admin-sidebar ${isOpen ? "admin-sidebar--open" : "admin-sidebar--closed"}`}
      aria-label="Admin sidebar"
    >
      <div className="admin-sidebar__brand">
        <div className="admin-sidebar__logo">TM</div>
        <div>
          <h1 className="admin-sidebar__title">TSMC</h1>
          <p className="admin-sidebar__subtitle">TSMC Management</p>
        </div>
      </div>

      <div className="admin-sidebar__status">
        {isReadOnly ? "Read Only Access" : "System Online"}
      </div>

      <nav className="admin-sidebar__nav">
        {navItems.map((item) => {
          const isActive =
            location.pathname === item.to ||
            (item.to !== "/admin-dashboard" && location.pathname.startsWith(item.to));

          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={closeSidebar}
              className={`admin-sidebar__link ${
                isActive ? "admin-sidebar__link--active" : ""
              }`}
            >
              <item.icon
                className={`admin-sidebar__icon ${
                  isActive ? "admin-sidebar__icon--active" : ""
                }`}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default AdminSideBar;
