import React from "react";
import "./Employee.css";

const sampleEmployees = [
  {
    id: "EMP-104",
    name: "Ava Carter",
    department: "Design Ops",
    role: "UI Lead",
    status: "active",
  },
  {
    id: "EMP-228",
    name: "Rohan Patel",
    department: "Platform",
    role: "Backend Engineer",
    status: "active",
  },
  {
    id: "EMP-319",
    name: "Mina Brooks",
    department: "People",
    role: "HR Manager",
    status: "hold",
  },
];

const List = () => {
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
        <div className="employee-shell__pill">{sampleEmployees.length} employees</div>
      </div>

      <div className="employee-grid">
        <div className="employee-panel">
          <p className="employee-panel__label">Active Members</p>
          <p className="employee-panel__value">18</p>
        </div>
        <div className="employee-panel">
          <p className="employee-panel__label">Open Roles</p>
          <p className="employee-panel__value">04</p>
        </div>
        <div className="employee-panel">
          <p className="employee-panel__label">Departments Online</p>
          <p className="employee-panel__value">07</p>
        </div>
      </div>

      <div className="employee-table-wrap">
        <table className="employee-table">
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Department</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {sampleEmployees.map((employee) => (
              <tr key={employee.id}>
                <td data-label="Id">{employee.id}</td>
                <td data-label="Name">{employee.name}</td>
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
    </section>
  );
};

export default List;
