import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import {
  FaBriefcase,
  FaBuilding,
  FaCheckCircle,
  FaDollarSign,
  FaHourglassHalf,
  FaTimesCircle,
  FaUsers,
} from "react-icons/fa";
import { useAuth } from "../../Context/useAuth";
import { useEmployees } from "../../Context/useEmployees";
import SummeryCard from "./SummeryCard";
import { apiUrl } from "../../utils/api";
import "./DashboardSummary.css";

const AdminSummery = () => {
  const { user } = useAuth();
  const { employees, loading: employeeLoading } = useEmployees();
  const [departments, setDepartments] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      const token = window.localStorage.getItem("token");

      if (!token || user?.role !== "admin") {
        setDepartments([]);
        setLeaves([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const [departmentResponse, leaveResponse] = await Promise.all([
          axios.get(apiUrl("/department"), {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get(apiUrl("/leave"), {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        if (departmentResponse.data.success) {
          setDepartments(departmentResponse.data.departments || []);
        }

        if (leaveResponse.data.success) {
          setLeaves(leaveResponse.data.leaves || []);
        }
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user?.role]);

  const stats = useMemo(() => {
    const totalEmployees = employees.length;
    const activeEmployees = employees.filter((employee) => employee.status === "active").length;
    const totalMonthlySalary = employees.reduce(
      (sum, employee) => sum + (Number(employee.salary) || 0),
      0,
    );
    const pendingLeaves = leaves.filter((leave) => leave.status === "pending").length;
    const approvedLeaves = leaves.filter((leave) => leave.status === "approved").length;
    const rejectedLeaves = leaves.filter((leave) => leave.status === "rejected").length;

    return {
      totalEmployees,
      activeEmployees,
      totalMonthlySalary,
      totalDepartments: departments.length,
      totalLeaves: leaves.length,
      pendingLeaves,
      approvedLeaves,
      rejectedLeaves,
    };
  }, [departments.length, employees, leaves]);

  if (user?.role !== "admin") {
    return <Navigate to="/admin-dashboard/leaves" replace />;
  }

  return (
    <div className="admin-summary">
      <section className="admin-summary__overview">
        <h3 className="admin-summary__section-title">Dashboard Overview</h3>
        <div className="admin-summary__overview-grid">
          <SummeryCard
            variant="compact"
            icon={<FaUsers />}
            text="Total Employees"
            number={employeeLoading || loading ? "..." : stats.totalEmployees}
          />
          <SummeryCard
            variant="compact"
            icon={<FaBriefcase />}
            text="Active Employees"
            number={employeeLoading || loading ? "..." : stats.activeEmployees}
            to="/admin-dashboard/department/employees"
          />
          <SummeryCard
            variant="compact"
            icon={<FaBuilding />}
            text="Departments"
            number={loading ? "..." : stats.totalDepartments}
            to="/admin-dashboard/departments"
          />
          <SummeryCard
            variant="compact"
            icon={<FaDollarSign />}
            text="Monthly Salary"
            number={employeeLoading || loading ? "..." : `$${stats.totalMonthlySalary.toLocaleString()}`}
            to="/admin-dashboard/salary"
          />
        </div>
      </section>

      <section className="admin-summary__leave">
        <h3 className="admin-summary__section-title">Leave Details</h3>
        <div className="admin-summary__leave-grid">
          <SummeryCard
            variant="compact"
            icon={<FaUsers />}
            text="Leave Applied"
            number={loading ? "..." : stats.totalLeaves}
            to="/admin-dashboard/leaves"
          />
          <SummeryCard
            variant="compact"
            icon={<FaCheckCircle />}
            text="Leave Approved"
            number={loading ? "..." : stats.approvedLeaves}
            to="/admin-dashboard/leaves"
          />
          <SummeryCard
            variant="compact"
            icon={<FaHourglassHalf />}
            text="Leave Pending"
            number={loading ? "..." : stats.pendingLeaves}
            to="/admin-dashboard/leaves"
          />
          <SummeryCard
            variant="compact"
            icon={<FaTimesCircle />}
            text="Leave Rejected"
            number={loading ? "..." : stats.rejectedLeaves}
            to="/admin-dashboard/leaves"
          />
        </div>
      </section>
    </div>
  );
};

export default AdminSummery;
