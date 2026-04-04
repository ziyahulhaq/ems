import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./DepartmentList.css";
import { DepartmentButtons } from "../../utils/DepartmentHelper";
import axios from "axios";

const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [depLoading, setDepLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const filteredDepartments = departments.filter((department) =>
    department.dep_name?.toLowerCase().includes(normalizedSearchTerm),
  );

  const onDepartmentDelete = (id) => {
    setDepartments((currentDepartments) =>
      currentDepartments.filter((dep) => dep._id !== id),
    );
  };

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
          setDepartments(response.data.departments);
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
            <div>
              <h3 className="department-list__title">Manage Departments</h3>
            </div>
          </div>

          <div className="department-list__controls">
            <input
              className="department-list__search"
              type="text"
              placeholder="Search by department name"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
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
                {filteredDepartments.length > 0 ? (
                  filteredDepartments.map((department, index) => (
                    <tr key={department._id}>
                      <td data-label="S No">{index + 1}</td>
                      <td data-label="Department Name">{department.dep_name}</td>
                      <td data-label="Action">
                        <DepartmentButtons
                          DepId={department._id}
                          onDepartmentDelete={onDepartmentDelete}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3">
                      {normalizedSearchTerm
                        ? "No departments match your search."
                        : "No departments found."}
                    </td>
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
