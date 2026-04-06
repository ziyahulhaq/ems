import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useEmployees } from "../../Context/useEmployees";
import { useAuth } from "../../Context/useAuth";
import "./Employee.css";

const createFormState = (employee) => ({
  name: employee?.name || "",
  email: employee?.email || "",
  employeeId: employee?.employeeId || "",
  dateOfBirth: employee?.dateOfBirth
    ? new Date(employee.dateOfBirth).toISOString().split("T")[0]
    : "",
  designation: employee?.designation || "",
  department: employee?.department || "",
  salary: employee?.salary?.toString() || "",
  profileImage: employee?.profileImage || "",
  notes: employee?.notes || "",
  status: employee?.status || "active",
});

const Edit = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { loading, getEmployeeById, updateEmployee, clearError } = useEmployees();
  const employee = getEmployeeById(id);
  const [formState, setFormState] = useState(() => createFormState(employee));
  const [isSaving, setIsSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const focusField = useMemo(
    () => new URLSearchParams(location.search).get("focus"),
    [location.search],
  );

  useEffect(() => {
    if (employee) {
      setFormState(createFormState(employee));
    }
  }, [employee]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((currentState) => ({
      ...currentState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setIsSaving(true);
      setSubmitError("");
      clearError();

      await updateEmployee(id, {
        name: formState.name.trim(),
        email: formState.email.trim(),
        employeeId: formState.employeeId.trim(),
        dateOfBirth: formState.dateOfBirth,
        designation: formState.designation.trim(),
        department: formState.department.trim(),
        salary: formState.salary.trim(),
        profileImage: formState.profileImage.trim(),
        notes: formState.notes.trim(),
        status: formState.status,
      });

      navigate("/admin-dashboard/department/employees");
    } catch (updateError) {
      setSubmitError(
        updateError.response?.data?.error ||
          updateError.message ||
          "Failed to update employee",
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (user?.role !== "admin") {
    return (
      <section className="employee-shell">
        <div className="employee-empty-state">
          <h2 className="employee-empty-state__title">Admin access required</h2>
          <p className="employee-empty-state__text">
            Only admins can edit employee records.
          </p>
        </div>
      </section>
    );
  }

  if (loading && !employee) {
    return (
      <section className="employee-shell">
        <div className="employee-empty-state">
          <h2 className="employee-empty-state__title">Loading employee...</h2>
        </div>
      </section>
    );
  }

  if (!employee) {
    return (
      <section className="employee-shell">
        <div className="employee-empty-state">
          <h2 className="employee-empty-state__title">Employee not found</h2>
          <p className="employee-empty-state__text">
            The selected employee record could not be found.
          </p>
          <Link
            className="employee-empty-state__button"
            to="/admin-dashboard/department/employees"
          >
            Back to employees
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="employee-shell">
      <div className="employee-shell__header">
        <div>
          <p className="employee-shell__eyebrow">Employee editor</p>
          <h1 className="employee-shell__title">Edit {employee.name}</h1>
          <p className="employee-shell__text">
            Update core profile details, salary, status, and notes for this employee.
          </p>
        </div>
        <div className="employee-shell__pill">{employee.employeeId}</div>
      </div>

      <form className="employee-form" onSubmit={handleSubmit}>
        <div className="employee-form__grid">
          <label className="employee-form__field">
            <span className="employee-form__label">Full Name</span>
            <input
              className="employee-form__input"
              type="text"
              name="name"
              value={formState.name}
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
              value={formState.email}
              onChange={handleChange}
              required
            />
          </label>

          <label className="employee-form__field">
            <span className="employee-form__label">Employee ID</span>
            <input
              className="employee-form__input"
              type="text"
              name="employeeId"
              value={formState.employeeId}
              onChange={handleChange}
              required
            />
          </label>

          <label className="employee-form__field">
            <span className="employee-form__label">Date of Birth</span>
            <input
              className="employee-form__input"
              type="date"
              name="dateOfBirth"
              value={formState.dateOfBirth}
              onChange={handleChange}
            />
          </label>

          <label className="employee-form__field">
            <span className="employee-form__label">Designation</span>
            <input
              className="employee-form__input"
              type="text"
              name="designation"
              value={formState.designation}
              onChange={handleChange}
            />
          </label>

          <label className="employee-form__field">
            <span className="employee-form__label">Department</span>
            <input
              className="employee-form__input"
              type="text"
              name="department"
              value={formState.department}
              onChange={handleChange}
              required
            />
          </label>

          <label className="employee-form__field">
            <span className="employee-form__label">Salary</span>
            <input
              className={`employee-form__input ${
                focusField === "salary" ? "employee-form__input--highlight" : ""
              }`}
              type="number"
              min="0"
              name="salary"
              value={formState.salary}
              onChange={handleChange}
            />
          </label>

          <label className="employee-form__field">
            <span className="employee-form__label">Status</span>
            <select
              className="employee-form__select"
              name="status"
              value={formState.status}
              onChange={handleChange}
            >
              <option value="active">Active</option>
              <option value="hold">Hold</option>
            </select>
          </label>
        </div>

        <label className="employee-form__field">
          <span className="employee-form__label">Profile Image URL</span>
          <input
            className="employee-form__input"
            type="url"
            name="profileImage"
            value={formState.profileImage}
            onChange={handleChange}
            placeholder="https://example.com/avatar.jpg"
          />
        </label>

        <label className="employee-form__field">
          <span className="employee-form__label">Notes</span>
          <textarea
            className="employee-form__textarea"
            name="notes"
            value={formState.notes}
            onChange={handleChange}
            placeholder="Add payroll notes, reporting manager, or shift details."
          />
        </label>

        <div className="employee-form__actions">
          <button className="employee-form__button" type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
          <Link
            className="employee-form__secondary-button"
            to="/admin-dashboard/department/employees"
          >
            Cancel
          </Link>
        </div>

        {submitError ? <p className="employee-form__error">{submitError}</p> : null}
      </form>
    </section>
  );
};

export default Edit;
