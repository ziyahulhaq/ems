import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./DepartmentList.css";
import { DepartmentButtons } from "../../utils/DepartmentHelper";
import axios from "axios";

const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [depLoading, setDepLoading] = useState(false);
  useEffect(() => {
    const fetchDepartments = async () => {
      setDepLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:3444/api/department",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        if (response.data.success) {
          let sno = 1;
          const data = response.data.departments.map((dep) => ({
            _id: dep._id,
            sno: sno++,
            dep_name: dep.dep_name,
            action: <DepartmentButtons DepId={dep._id} />,
          }));
          setDepartments(data);
        }
      } catch (err) {
        const message = err.response?.data?.error || "Failed to add department";
        alert(message);
      } finally {
        setDepLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  return (
    <>
      {depLoading ? (
        <div>Loading ...</div>
      ) : (
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
            <Link
              className="department-list__button"
              to="/admin-dashboard/add-department"
            >
              Add New Department
            </Link>
          </div>
          <div className="department-list__table-wrap">
            <table className="department-list__table">
              <thead>
                <tr>
                  <th>S No</th>
                  <th>Department Name</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {departments.length > 0 ? (
                  departments.map((department) => (
                    <tr key={department._id}>
                      <td>{department.sno}</td>
                      <td>{department.dep_name}</td>
                      <td>{department.action}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3">No departments found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default DepartmentList;
