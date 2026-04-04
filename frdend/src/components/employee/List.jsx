import React from "react";
import { Link } from "react-router-dom";
import { useEmployees } from "../../Context/useEmployees";
import "./Employee.css";

const List = () => {
  const { employees } = useEmployees();
  const activeEmployees = employees.filter(
    (employee) => employee.status === "active",
  ).length;
  const departmentsOnline = new Set(
    employees.map((employee) => employee.department).filter(Boolean),
  ).size;
  const roleCount = new Set(employees.map((employee) => employee.role).filter(Boolean))
    .size;

  return (
    <section className="employee-shell">
      <div className="employee-shell__header">
        <div>
          <p className="employee-shell__eyebrow">Employee roster</p>
          <h1 className="employee-shell__title">Team Directory</h1>
          <p className="employee-shell__text">
            A softer, touch-friendly employee view for quick scanning on desktop
            and card-like reading on mobile.
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
          <p className="employee-panel__label">Roles Added</p>
          <p className="employee-panel__value">{roleCount}</p>
        </div>
        <div className="employee-panel">
          <p className="employee-panel__label">Departments Used</p>
          <p className="employee-panel__value">{departmentsOnline}</p>
        </div>
      </div>

      {employees.length > 0 ? (
        <div className="employee-table-wrap">
          <table className="employee-table">
            <thead>
              <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Role</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id}>
                  <td data-label="Id">{employee.id}</td>
                  <td data-label="Name">{employee.name}</td>
                  <td data-label="Email">{employee.email}</td>
                  <td data-label="Department">{employee.department}</td>
                  <td data-label="Role">{employee.role}</td>
                  <td data-label="Status">
                    <span
                      className={`employee-badge ${
                        employee.status === "active"
                          ? "employee-badge--active"
                          : "employee-badge--hold"
                      }`}
                    >
                      {employee.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="employee-empty-state">
          <h2 className="employee-empty-state__title">No employees added yet</h2>
          <p className="employee-empty-state__text">
            Start with the add employee screen and every new record will appear
            here automatically.
          </p>
          <Link
            className="employee-empty-state__button"
            to="/admin-dashboard/add-new-employee"
          >
            Add Your First Employee
          </Link>
        </div>
      )}
    </section>
  );
};

export default List;
