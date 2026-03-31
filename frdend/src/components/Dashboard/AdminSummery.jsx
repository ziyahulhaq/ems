
import React from 'react'
import SummeryCard from './SummeryCard'
import { FaBuilding, FaDollarSign, FaUsers } from 'react-icons/fa'
import "./DashboardSummary.css";

const AdminSummery = () => {
  return (
    <div className="admin-summary">
      <h3 className="admin-summary__title">Dashboard Overview</h3>

      <div className="admin-summary__grid">
        <SummeryCard icon={<FaUsers />} text="Total Employees" number={13} />
        <SummeryCard
          icon={<FaBuilding />}
          text="Total Department"
          number={7}
          iconColor="#b45309"
          iconBg="#fef3c7"
        />
        <SummeryCard
          icon={<FaDollarSign />}
          text="Monthly Salary"
          number={"$234"}
          iconColor="#15803d"
          iconBg="#dcfce7"
        />
      </div>

      <div className="admin-summary__leave">
        <h3 className="admin-summary__leave-title">Leave Details</h3>
      </div>
    </div>
  )
}

export default AdminSummery
