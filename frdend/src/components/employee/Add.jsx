import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEmployees } from "../../Context/useEmployees";
import "./Employee.css";

const Add = () => {
  const navigate = useNavigate();
  const { addEmployee } = useEmployees();
  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    department: "",
    role: "",
    notes: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setEmployee((currentEmployee) => ({
      ...currentEmployee,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const payload = {
      name: employee.name.trim(),
      email: employee.email.trim(),
      department: employee.department.trim(),
      role: employee.role.trim(),
      notes: employee.notes.trim(),
    };

    if (!payload.name || !payload.email || !payload.department || !payload.role) {
      alert("Please fill all employee details");
      return;
    }

    addEmployee(payload);

    setEmployee({
      name: "",
      email: "",
      department: "",
      role: "",
      notes: "",
    });

    navigate("/admin-dashboard/department/employees");
  };

  return (
    <section className="employee-shell">
      <div className="employee-shell__header">
        <div>
          <p className="employee-shell__eyebrow">Hiring panel</p>
          <h1 className="employee-shell__title">Add New Employee</h1>
          <p className="employee-shell__text">
            A calm, touch-friendly onboarding form for staffing, role assignment,
            and quick profile setup.
          </p>
        </div>
        <div className="employee-shell__pill">Ready to save</div>
      </div>

      <form className="employee-form" onSubmit={handleSubmit}>
        <div className="employee-form__grid">
          <label className="employee-form__field">
            <span className="employee-form__label">Full Name</span>
            <input
              className="employee-form__input"
              type="text"
              name="name"
              placeholder="Jane Doe"
              value={employee.name}
              onChange={handleChange}
              required
            />
          </label>

          <label className="employee-form__field">
            <span className="employee-form__label">Email</span>
            <input
              className="employee-form__input"
              type="email"
              name="email"
              placeholder="jane@company.com"
              value={employee.email}
              onChange={handleChange}
              required
            />
          </label>

          <label className="employee-form__field">
            <span className="employee-form__label">Department</span>
            <select
              className="employee-form__select"
              name="department"
              value={employee.department}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select department
              </option>
              <option>Design Ops</option>
              <option>Platform</option>
              <option>People</option>
            </select>
          </label>

          <label className="employee-form__field">
            <span className="employee-form__label">Role</span>
            <input
              className="employee-form__input"
              type="text"
              name="role"
              placeholder="Frontend Engineer"
              value={employee.role}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <label className="employee-form__field">
          <span className="employee-form__label">Notes</span>
          <textarea
            className="employee-form__textarea"
            name="notes"
            placeholder="Add onboarding notes, shift rules, or access details."
            value={employee.notes}
            onChange={handleChange}
          />
        </label>

        <button className="employee-form__button" type="submit">
          Add Employee
        </button>
      </form>
    </section>
  );
};

export default Add;
