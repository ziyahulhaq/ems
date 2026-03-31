import React from "react";
import {
  FaBuilding,
  FaCheckCircle,
  FaDollarSign,
  FaFileAlt,
  FaHourglassHalf,
  FaTimesCircle,
  FaUsers,
} from "react-icons/fa";
import SummeryCard from "./SummeryCard";
import "./DashboardSummary.css";

const AdminSummery = () => {
  return (
    <div className="admin-summary">
      <section className="admin-summary__overview">
        <h3 className="admin-summary__section-title">Dashboard Overview</h3>
        <div className="admin-summary__overview-grid">
          <SummeryCard
            variant="compact"
            icon={<FaUsers />}
            text="Total Employees"
            number={13}
            iconColor="#ffffff"
            iconBg="#14b8a6"
          />
          <SummeryCard
            variant="compact"
            icon={<FaBuilding />}
            text="Total Department"
            number={7}
            iconColor="#ffffff"
            iconBg="#f59e0b"
          />
          <SummeryCard
            variant="compact"
            icon={<FaDollarSign />}
            text="Monthly Salary"
            number={"$234"}
            iconColor="#ffffff"
            iconBg="#22c55e"
          />
        </div>
      </section>

      <section className="admin-summary__leave">
        <h3 className="admin-summary__section-title">Leave Details</h3>
        <div className="admin-summary__leave-grid">
          <SummeryCard
            variant="compact"
            icon={<FaFileAlt />}
            text="Leave Applied"
            number={5}
            iconColor="#ffffff"
            iconBg="#14b8a6"
          />
          <SummeryCard
            variant="compact"
            icon={<FaCheckCircle />}
            text="Leave Approved"
            number={2}
            iconColor="#ffffff"
            iconBg="#22c55e"
          />
          <SummeryCard
            variant="compact"
            icon={<FaHourglassHalf />}
            text="Leave Pending"
            number={4}
            iconColor="#ffffff"
            iconBg="#d97706"
          />
          <SummeryCard
            variant="compact"
            icon={<FaTimesCircle />}
            text="Leave Rejected"
            number={1}
            iconColor="#ffffff"
            iconBg="#e11d48"
          />
        </div>
      </section>
    </div>
  );
};

export default AdminSummery;
