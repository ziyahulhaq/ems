import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEmployees } from "../../Context/useEmployees";
import { useAuth } from "../../Context/useAuth";
import { apiUrl } from "../../utils/api";
import "./Employee.css";

const EMPTY_EMPLOYEE = {
  name: "",
  email: "",
  employeeId: "",
  dateOfBirth: "",
  gender: "",
  maritalStatus: "",
  designation: "",
  department: "",
  salary: "",
  role: "employee",
  password: "",
  confirmPassword: "",
  notes: "",
  profileImage: "",
  profileImageName: "",
};

const FALLBACK_DEPARTMENTS = ["Design Ops", "Platform", "People"];

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Unable to read image"));
    reader.readAsDataURL(file);
  });

const Add = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isReadOnly = user?.role !== "admin";
  const { addEmployee, clearError } = useEmployees();
  const [employee, setEmployee] = useState(EMPTY_EMPLOYEE);
  const [departments, setDepartments] = useState(FALLBACK_DEPARTMENTS);
  const [isSaving, setIsSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    const loadDepartments = async () => {
      const token = window.localStorage.getItem("token");

      if (!token) {
        return;
      }

      try {
        const response = await axios.get(apiUrl("/department"), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success && response.data.departments?.length) {
          setDepartments(
            response.data.departments
              .map((department) => department.dep_name)
              .filter(Boolean),
          );
        }
      } catch {
        setDepartments(FALLBACK_DEPARTMENTS);
      }
    };

    loadDepartments();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setEmployee((currentEmployee) => ({
      ...currentEmployee,
      [name]: value,
    }));
  };

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      setEmployee((currentEmployee) => ({
        ...currentEmployee,
        profileImage: "",
        profileImageName: "",
      }));
      return;
    }

    if (!file.type.startsWith("image/")) {
      setSubmitError("Please choose a valid image file");
      event.target.value = "";
      return;
    }

    try {
      const profileImage = await readFileAsDataUrl(file);
      setEmployee((currentEmployee) => ({
        ...currentEmployee,
        profileImage,
        profileImageName: file.name,
      }));
      setSubmitError("");
    } catch {
      setSubmitError("Failed to read the selected image");
      event.target.value = "";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isReadOnly) {
      setSubmitError("Read only access. Only admins can add employees.");
      return;
    }

    const payload = {
      name: employee.name.trim(),
      email: employee.email.trim(),
      employeeId: employee.employeeId.trim(),
      dateOfBirth: employee.dateOfBirth,
      gender: employee.gender.trim(),
      maritalStatus: employee.maritalStatus.trim(),
      designation: employee.designation.trim(),
      department: employee.department.trim(),
      salary: employee.salary.trim(),
      role: employee.role.trim(),
      password: employee.password,
      confirmPassword: employee.confirmPassword,
      profileImage: employee.profileImage,
      notes: employee.notes.trim(),
    };

    if (
      !payload.name ||
      !payload.email ||
      !payload.dateOfBirth ||
      !payload.gender ||
      !payload.maritalStatus ||
      !payload.designation ||
      !payload.department ||
      !payload.salary ||
      !payload.role ||
      !payload.password ||
      !payload.confirmPassword
    ) {
      setSubmitError("Please fill all required employee details");
      return;
    }

    if (payload.password.length < 6) {
      setSubmitError("Password must be at least 6 characters");
      return;
    }

    if (payload.password !== payload.confirmPassword) {
      setSubmitError("Password and confirm password must match");
      return;
    }

    try {
      setIsSaving(true);
      setSubmitError("");
      clearError();
      await addEmployee(payload);
      setEmployee(EMPTY_EMPLOYEE);

      navigate("/admin-dashboard/department/employees");
    } catch (error) {
      setSubmitError(error.response?.data?.error || error.message || "Failed to add employee");
    } finally {
      setIsSaving(false);
    }
  };

  if (user?.role !== "admin") {
    return (
      <section className="employee-shell">
        <div className="employee-shell__header">
          <div>
            <p className="employee-shell__eyebrow">Hiring panel</p>
            <h1 className="employee-shell__title">Read-only section</h1>
            <p className="employee-shell__text">
              Employees can open this page from the sidebar, but only admins can add new employees.
            </p>
          </div>
          <div className="employee-shell__pill">Read only</div>
        </div>
      </section>
    );
  }

  return (
    <section className="employee-shell">
      <div className="employee-shell__header">
        <div>
          <p className="employee-shell__eyebrow">Hiring panel</p>
          <h1 className="employee-shell__title">Add New Employee</h1>
          <p className="employee-shell__text">
            Capture employee profile details and create an employee login account in
            the same step so the new employee can sign in right away.
          </p>
        </div>
        <div className="employee-shell__pill">
          {isReadOnly ? "Read only preview" : "Creates employee login"}
        </div>
      </div>

      {isReadOnly ? (
        <p className="employee-shell__hint">
          Employees can view this page, but only admins can submit the form.
        </p>
      ) : null}

      <form className="employee-form" onSubmit={handleSubmit}>
        <fieldset className="employee-form__fieldset" disabled={isReadOnly}>
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
            <span className="employee-form__label">Employee ID</span>
            <input
              className="employee-form__input"
              type="text"
              name="employeeId"
              placeholder="Leave blank for auto generated ID"
              value={employee.employeeId}
              onChange={handleChange}
            />
          </label>

          <label className="employee-form__field">
            <span className="employee-form__label">Date of Birth</span>
            <input
              className="employee-form__input"
              type="date"
              name="dateOfBirth"
              value={employee.dateOfBirth}
              onChange={handleChange}
              required
            />
          </label>

          <label className="employee-form__field">
            <span className="employee-form__label">Gender</span>
            <select
              className="employee-form__select"
              name="gender"
              value={employee.gender}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select gender
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </label>

          <label className="employee-form__field">
            <span className="employee-form__label">Marital Status</span>
            <select
              className="employee-form__select"
              name="maritalStatus"
              value={employee.maritalStatus}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select status
              </option>
              <option value="single">Single</option>
              <option value="married">Married</option>
              <option value="divorced">Divorced</option>
              <option value="widowed">Widowed</option>
            </select>
          </label>

          <label className="employee-form__field">
            <span className="employee-form__label">Designation</span>
            <input
              className="employee-form__input"
              type="text"
              name="designation"
              placeholder="Frontend Engineer"
              value={employee.designation}
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
              {departments.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>
          </label>

          <label className="employee-form__field">
            <span className="employee-form__label">Salary</span>
            <input
              className="employee-form__input"
              type="number"
              min="0"
              step="0.01"
              name="salary"
              placeholder="45000"
              value={employee.salary}
              onChange={handleChange}
              required
            />
          </label>

          <label className="employee-form__field">
            <span className="employee-form__label">Password</span>
            <input
              className="employee-form__input"
              type="password"
              name="password"
              placeholder="Create login password"
              value={employee.password}
              onChange={handleChange}
              required
            />
          </label>

          <label className="employee-form__field">
            <span className="employee-form__label">Confirm Password</span>
            <input
              className="employee-form__input"
              type="password"
              name="confirmPassword"
              placeholder="Confirm login password"
              value={employee.confirmPassword}
              onChange={handleChange}
              required
            />
          </label>

          <label className="employee-form__field">
            <span className="employee-form__label">Role</span>
            <select
              className="employee-form__select"
              name="role"
              value={employee.role}
              onChange={handleChange}
              required
            >
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
            </select>
          </label>

          <label className="employee-form__field">
            <span className="employee-form__label">Upload Image</span>
            <input
              className="employee-form__input employee-form__file"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            <span className="employee-form__hint">
              {employee.profileImageName || "Optional profile image"}
            </span>
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
        </fieldset>

        <button className="employee-form__button" type="submit" disabled={isSaving || isReadOnly}>
          {isReadOnly ? "Read Only" : isSaving ? "Saving..." : "Add Employee"}
        </button>

        {submitError ? <p className="employee-form__error">{submitError}</p> : null}
      </form>
    </section>
  );
};

export default Add;
