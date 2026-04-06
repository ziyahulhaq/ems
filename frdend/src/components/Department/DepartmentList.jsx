import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../../Context/useAuth";
import { DepartmentButtons } from "../../utils/DepartmentHelper";
import "./DepartmentList.css";

const DepartmentList = () => {
  const { user } = useAuth();
  const isReadOnly = user?.role !== "admin";
  const [departments, setDepartments] = useState([]);
  const [depLoading, setDepLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const filteredDepartments = useMemo(
    () =>
      departments.filter((department) =>
        department.dep_name?.toLowerCase().includes(normalizedSearchTerm),
      ),
    [departments, normalizedSearchTerm],
  );

  const onDepartmentDelete = (id) => {
    setDepartments((currentDepartments) =>
      currentDepartments.filter((department) => department._id !== id),
    );
  };

  useEffect(() => {
    const fetchDepartments = async () => {
      setDepLoading(true);
      try {
        const response = await axios.get("http://localhost:3444/api/department", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data.success) {
          setDepartments(response.data.departments);
        }
      } catch (error) {
        alert(error.response?.data?.error || "Failed to load departments");
      } finally {
        setDepLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  return depLoading ? (
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
        {isReadOnly ? (
          <div className="department-list__readonly-badge">Read only</div>
        ) : (
          <Link className="department-list__button" to="/admin-dashboard/add-department">
            Add New Department
          </Link>
        )}
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
                    {isReadOnly ? (
                      <span className="department-list__readonly-text">View only</span>
                    ) : (
                      <DepartmentButtons
                        DepId={department._id}
                        onDepartmentDelete={onDepartmentDelete}
                      />
                    )}
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
  );
};

export default DepartmentList;
