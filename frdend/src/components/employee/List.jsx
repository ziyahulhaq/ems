import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useEmployees } from "../../Context/useEmployees";
import { useAuth } from "../../Context/useAuth";
import "./Employee.css";

const formatDate = (value) => {
  if (!value) {
    return "Not set";
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not set";
  }

  return parsedDate.toLocaleDateString();
};

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

const List = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { employees, loading, error, deleteEmployee } = useEmployees();
  const [searchTerm, setSearchTerm] = useState("");
  const [busyEmployeeId, setBusyEmployeeId] = useState("");

  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const filteredEmployees = useMemo(
    () =>
      employees.filter((employee) => {
        if (!normalizedSearchTerm) {
          return true;
        }

        return (
          employee.employeeId?.toLowerCase().includes(normalizedSearchTerm) ||
          employee.name?.toLowerCase().includes(normalizedSearchTerm)
        );
      }),
    [employees, normalizedSearchTerm],
  );

  const activeEmployees = employees.filter(
    (employee) => employee.status === "active",
  ).length;
  const totalMonthlySalary = employees.reduce(
    (sum, employee) => sum + (Number(employee.salary) || 0),
    0,
  );
  const departmentsOnline = new Set(
    employees.map((employee) => employee.department).filter(Boolean),
  ).size;
  const isAdmin = user?.role === "admin";

  const handleDelete = async (employee) => {
    const shouldDelete = window.confirm(
      `Delete ${employee.name}? This will remove the employee and login account.`,
    );

    if (!shouldDelete) {
      return;
    }

    try {
      setBusyEmployeeId(employee._id);
      await deleteEmployee(employee._id);
    } catch (deleteError) {
      alert(
        deleteError.response?.data?.error ||
          deleteError.message ||
          "Failed to delete employee",
      );
    } finally {
      setBusyEmployeeId("");
    }
  };

  return (
    <section className="employee-shell">
      <div className="employee-shell__header">
        <div>
          <p className="employee-shell__eyebrow">Manage employees</p>
          <h1 className="employee-shell__title">Employee Directory</h1>
          <p className="employee-shell__text">
            Search by employee ID, jump into salary details, and manage records
            from one table.
          </p>
        </div>
        <div className="employee-shell__pill">{employees.length} employees</div>
      </div>

      <div className="employee-grid">
        <div className="employee-panel">
          <p className="employee-panel__label">Active Members</p>
          <p className="employee-panel__value">{activeEmployees}</p>
        </div>
        <div className="employee-panel">
          <p className="employee-panel__label">Departments Used</p>
          <p className="employee-panel__value">{departmentsOnline}</p>
        </div>
        <div className="employee-panel">
          <p className="employee-panel__label">Monthly Salary</p>
          <p className="employee-panel__value">
            ${totalMonthlySalary.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="employee-toolbar">
        <input
          className="employee-toolbar__search"
          type="text"
          placeholder="Search by employee ID"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
        {isAdmin ? (
          <Link className="employee-toolbar__button" to="/admin-dashboard/add-new-employee">
            Add New Employee
          </Link>
        ) : null}
      </div>

      {loading ? (
        <div className="employee-empty-state">
          <h2 className="employee-empty-state__title">Loading employees...</h2>
          <p className="employee-empty-state__text">
            Fetching the latest team records from the database.
          </p>
        </div>
      ) : error ? (
        <div className="employee-empty-state">
          <h2 className="employee-empty-state__title">Unable to load employees</h2>
          <p className="employee-empty-state__text">{error}</p>
        </div>
      ) : filteredEmployees.length > 0 ? (
        <div className="employee-table-wrap">
          <table className="employee-table">
            <thead>
              <tr>
                <th>S No</th>
                <th>Image</th>
                <th>Name</th>
                <th>DOB</th>
                <th>Department</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee, index) => {
                const isBusy = busyEmployeeId === employee._id;

                return (
                  <tr key={employee._id}>
                    <td data-label="S No">{index + 1}</td>
                    <td data-label="Image">
                      {employee.profileImage ? (
                        <img
                          className="employee-avatar"
                          src={employee.profileImage}
                          alt={employee.name}
                        />
                      ) : (
                        <div className="employee-avatar employee-avatar--fallback">
                          {getInitials(employee.name)}
                        </div>
                      )}
                    </td>
                    <td data-label="Name">
                      <div className="employee-person">
                        <span className="employee-person__name">{employee.name}</span>
                        <span className="employee-person__meta">
                          {employee.employeeId || "No ID"}
                        </span>
                      </div>
                    </td>
                    <td data-label="DOB">{formatDate(employee.dateOfBirth)}</td>
                    <td data-label="Department">{employee.department || "Not set"}</td>
                    <td data-label="Action">
                      <div className="employee-actions">
                        <button
                          className="employee-action employee-action--info"
                          type="button"
                          onClick={() =>
                            navigate(
                              `/admin-dashboard/salary?employeeId=${employee._id}`,
                            )
                          }
                        >
                          Salary
                        </button>
                        {isAdmin ? (
                          <Link
                            className="employee-action employee-action--success"
                            to={`/admin-dashboard/employees/${employee._id}/edit`}
                          >
                            Edit
                          </Link>
                        ) : null}
                        {isAdmin ? (
                          <button
                            className="employee-action employee-action--danger"
                            type="button"
                            onClick={() => handleDelete(employee)}
                            disabled={isBusy}
                          >
                            {isBusy ? "Deleting..." : "Delete"}
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="employee-empty-state">
          <h2 className="employee-empty-state__title">
            {normalizedSearchTerm ? "No matching employees" : "No employees added yet"}
          </h2>
          <p className="employee-empty-state__text">
            {normalizedSearchTerm
              ? "Try another employee ID or clear the search field."
              : "Start with the add employee screen and every new record will appear here automatically."}
          </p>
          {isAdmin && !normalizedSearchTerm ? (
            <Link
              className="employee-empty-state__button"
              to="/admin-dashboard/add-new-employee"
            >
              Add Your First Employee
            </Link>
          ) : null}
        </div>
      )}
    </section>
  );
};

export default List;
