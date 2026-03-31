import React from "react";
import { Link } from "react-router-dom";
import "./DepartmentList.css";


const DepartmentList = () => {
  return (
    <div className="department-list">
      <div className="department-list__header">
        <h3 className="department-list__title">Manage Departments</h3>
      </div>

      <div className="department-list__controls">
        <input
          className="department-list__search"
          type="text"
          placeholder="Search by department name"
        />
        <Link className="department-list__button" to="/admin-dashboard/add-department">
          Add New Department
        </Link>
      </div>
    </div>
  );
};

export default DepartmentList;
