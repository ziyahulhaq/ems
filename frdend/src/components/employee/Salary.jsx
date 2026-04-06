import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useEmployees } from "../../Context/useEmployees";
import { useAuth } from "../../Context/useAuth";
import "./Employee.css";

const formatCurrency = (value) =>
  `$${(Number(value) || 0).toLocaleString(undefined, {
    maximumFractionDigits: 0,
  })}`;

const Salary = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { employees, loading, error } = useEmployees();
  const selectedEmployeeId = useMemo(
    () => new URLSearchParams(location.search).get("employeeId"),
    [location.search],
  );

  const totalSalary = employees.reduce(
    (sum, employee) => sum + (Number(employee.salary) || 0),
    0,
  );
  const averageSalary = employees.length > 0 ? totalSalary / employees.length : 0;
  const highestSalary = employees.reduce(
    (highest, employee) => Math.max(highest, Number(employee.salary) || 0),
    0,
  );

  return (
    <section className="employee-shell">
      <div className="employee-shell__header">
        <div>
          <p className="employee-shell__eyebrow">Salary bar</p>
          <h1 className="employee-shell__title">Employee Salary</h1>
          <p className="employee-shell__text">
            Review payroll at a glance and jump straight into editing a selected
            employee’s salary.
          </p>
        </div>
        <div className="employee-shell__pill">{employees.length} salary records</div>
      </div>

      <div className="employee-grid">
        <div className="employee-panel">
          <p className="employee-panel__label">Monthly Payroll</p>
          <p className="employee-panel__value">{formatCurrency(totalSalary)}</p>
        </div>
        <div className="employee-panel">
          <p className="employee-panel__label">Average Salary</p>
          <p className="employee-panel__value">{formatCurrency(averageSalary)}</p>
        </div>
        <div className="employee-panel">
          <p className="employee-panel__label">Highest Salary</p>
          <p className="employee-panel__value">{formatCurrency(highestSalary)}</p>
        </div>
      </div>

      {loading ? (
        <div className="employee-empty-state">
          <h2 className="employee-empty-state__title">Loading salary records...</h2>
        </div>
      ) : error ? (
        <div className="employee-empty-state">
          <h2 className="employee-empty-state__title">Unable to load salaries</h2>
          <p className="employee-empty-state__text">{error}</p>
        </div>
      ) : (
        <div className="employee-table-wrap">
          <table className="employee-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Status</th>
                <th>Salary</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => {
                const isSelected = selectedEmployeeId === employee._id;

                return (
                  <tr
                    key={employee._id}
                    className={isSelected ? "employee-table__row--selected" : ""}
                  >
                    <td data-label="Employee">
                      <div className="employee-person">
                        <span className="employee-person__name">{employee.name}</span>
                        <span className="employee-person__meta">
                          {employee.employeeId || employee.email}
                        </span>
                      </div>
                    </td>
                    <td data-label="Department">{employee.department || "Not set"}</td>
                    <td data-label="Status">
                      <span
                        className={`employee-badge ${
                          employee.status === "active"
                            ? "employee-badge--active"
                            : "employee-badge--hold"
                        }`}
                      >
                        {employee.status || "active"}
                      </span>
                    </td>
                    <td data-label="Salary">{formatCurrency(employee.salary)}</td>
                    <td data-label="Action">
                      {user?.role === "admin" ? (
                        <Link
                          className="employee-action employee-action--success"
                          to={`/admin-dashboard/employees/${employee._id}/edit?focus=salary`}
                        >
                          Edit Salary
                        </Link>
                      ) : (
                        <span className="employee-salary__note">Admin only</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default Salary;
