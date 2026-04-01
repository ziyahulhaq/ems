import React from "react";
import "./EmployeeDashboard.css";

const EmployeeDashboard = () => {
  return (
    <div className="employee-dashboard">
      <div className="employee-dashboard__card">
        <p className="employee-dashboard__eyebrow">Employee view</p>
        <h1 className="employee-dashboard__title">Welcome to your dashboard</h1>
        <p className="employee-dashboard__text">
          This area is ready for attendance, leave requests, and profile details.
          The layout scales down cleanly on phones, tablets, and desktops.
        </p>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
