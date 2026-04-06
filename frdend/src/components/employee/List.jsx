import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useEmployees } from "../../Context/useEmployees";
import { useAuth } from "../../Context/useAuth";
import "./Employee.css";

const PAGE_SIZES = [5, 10, 20];

const formatDate = (value) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-US").format(date);
};

const getInitials = (name) =>
  name
    ?.trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "EM";

const createEditForm = (employee) => ({
  previousEmail: employee.email || "",
  name: employee.name || "",
  email: employee.email || "",
  employeeId: employee.employeeId || "",
  dateOfBirth: employee.dateOfBirth ? employee.dateOfBirth.slice(0, 10) : "",
  designation: employee.designation || "",
  department: employee.department || "",
  notes: employee.notes || "",
});

const List = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isReadOnly = user?.role !== "admin";
  const { employees, loading, error, updateEmployee, deleteEmployee } = useEmployees();
  const [searchValue, setSearchValue] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeEmployee, setActiveEmployee] = useState(null);
  const [activeDialog, setActiveDialog] = useState("");
  const [formState, setFormState] = useState(null);
  const [actionError, setActionError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const visibleEmployees = useMemo(
    () => employees.filter((employee) => (employee.role || "employee") !== "admin"),
    [employees],
  );

  const filteredEmployees = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();

    if (!normalizedSearch) {
      return visibleEmployees;
    }

    return visibleEmployees.filter((employee) =>
      (employee.employeeId || "").toLowerCase().includes(normalizedSearch),
    );
  }, [searchValue, visibleEmployees]);

  const totalPages = Math.max(1, Math.ceil(filteredEmployees.length / rowsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * rowsPerPage;
  const paginatedEmployees = filteredEmployees.slice(startIndex, startIndex + rowsPerPage);

  const activeEmployees = visibleEmployees.filter(
    (employee) => employee.status === "active",
  ).length;
  const totalMonthlySalary = employees.reduce(
    (sum, employee) => sum + (Number(employee.salary) || 0),
    0,
  );
  const departmentsOnline = new Set(
    visibleEmployees.map((employee) => employee.department).filter(Boolean),
  ).size;
  const designationCount = new Set(
    visibleEmployees.map((employee) => employee.designation).filter(Boolean),
  ).size;

  const closeDialog = () => {
    setActiveDialog("");
    setActiveEmployee(null);
    setFormState(null);
    setActionError("");
    setIsSubmitting(false);
  };

  const openViewDialog = (employee) => {
    setActiveEmployee(employee);
    setActiveDialog("view");
    setActionError("");
  };

  const openEditDialog = (employee) => {
    setActiveEmployee(employee);
    setFormState(createEditForm(employee));
    setActiveDialog("edit");
    setActionError("");
  };

  const openLeaveDialog = (employee) => {
    setActiveEmployee(employee);
    setFormState({
      previousEmail: employee.email || "",
      status: employee.status === "hold" ? "active" : "hold",
    });
    setActiveDialog("leave");
    setActionError("");
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormState((currentState) => ({
      ...currentState,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!activeEmployee || !activeDialog) {
      return;
    }

    if (isReadOnly) {
      setActionError("Read only access. Only admins can save changes.");
      return;
    }

    try {
      setIsSubmitting(true);
      setActionError("");

      let payload = {};

      if (activeDialog === "edit") {
        payload = {
          previousEmail: formState.previousEmail,
          name: formState.name.trim(),
          email: formState.email.trim(),
          employeeId: formState.employeeId.trim(),
          dateOfBirth: formState.dateOfBirth,
          designation: formState.designation.trim(),
          department: formState.department.trim(),
          notes: formState.notes.trim(),
        };

        if (
          !payload.name ||
          !payload.email ||
          !payload.employeeId ||
          !payload.dateOfBirth ||
          !payload.designation ||
          !payload.department
        ) {
          setActionError("Please fill all edit fields before saving");
          setIsSubmitting(false);
          return;
        }
      }

      if (activeDialog === "leave") {
        payload = {
          previousEmail: formState.previousEmail,
          status: formState.status,
        };
      }

      await updateEmployee(activeEmployee._id, payload);
      closeDialog();
    } catch (saveError) {
      setActionError(saveError.response?.data?.error || saveError.message || "Update failed");
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (employee) => {
    const isConfirmed = window.confirm(
      `Delete ${employee.name}? This will remove the employee and login account.`,
    );

    if (!isConfirmed) {
      return;
    }

    try {
      setActionError("");
      await deleteEmployee(employee._id);

      if (startIndex >= Math.max(filteredEmployees.length - 1, 0) && currentPage > 1) {
        setCurrentPage((page) => Math.max(1, page - 1));
      }
    } catch (deleteError) {
      setActionError(
        deleteError.response?.data?.error || deleteError.message || "Delete failed",
      );
    }
  };

  return (
    <section className="employee-shell">
      <div className="employee-shell__header">
        <div>
          <p className="employee-shell__eyebrow">Employee management</p>
          <h1 className="employee-shell__title">Manage Employees</h1>
          <p className="employee-shell__text">
            Search by employee ID, review employee details, and handle profile,
            salary, and leave actions from one place.
          </p>
        </div>
        <div className="employee-shell__pill">{visibleEmployees.length} employees</div>
      </div>

      <div className="employee-grid">
        <div className="employee-panel">
          <p className="employee-panel__label">Active Members</p>
          <p className="employee-panel__value">{activeEmployees}</p>
        </div>
        <div className="employee-panel">
          <p className="employee-panel__label">Designations</p>
          <p className="employee-panel__value">{designationCount}</p>
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
          type="search"
          placeholder="Search By Employee ID"
          value={searchValue}
          onChange={(event) => {
            setSearchValue(event.target.value);
            setCurrentPage(1);
          }}
        />

        {isReadOnly ? (
          <div className="employee-toolbar__readonly">Read only access</div>
        ) : (
          <Link className="employee-toolbar__button" to="/admin-dashboard/add-new-employee">
            Add New Employee
          </Link>
        )}
      </div>

      {actionError && !activeDialog ? <p className="employee-form__error">{actionError}</p> : null}

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
        <>
          <div className="employee-table-wrap">
            <table className="employee-table employee-table--management">
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
                {paginatedEmployees.map((employee, index) => (
                  <tr key={employee._id}>
                    <td data-label="S No">{startIndex + index + 1}</td>
                    <td data-label="Image">
                      <div className="employee-avatar">
                        {employee.profileImage ? (
                          <img src={employee.profileImage} alt={employee.name} />
                        ) : (
                          <span>{getInitials(employee.name)}</span>
                        )}
                      </div>
                    </td>
                    <td data-label="Name">
                      <div className="employee-name-block">
                        <strong>{employee.name}</strong>
                        <span>{employee.employeeId}</span>
                      </div>
                    </td>
                    <td data-label="DOB">{formatDate(employee.dateOfBirth)}</td>
                    <td data-label="Department">{employee.department || "-"}</td>
                    <td data-label="Action">
                      <div className="employee-actions">
                        <button
                          className="employee-actions__button employee-actions__button--view"
                          type="button"
                          onClick={() => openViewDialog(employee)}
                        >
                          View
                        </button>
                        <button
                          className="employee-actions__button employee-actions__button--edit"
                          type="button"
                          onClick={() => openEditDialog(employee)}
                        >
                          {isReadOnly ? "Preview" : "Edit"}
                        </button>
                        <button
                          className="employee-actions__button employee-actions__button--salary"
                          type="button"
                          onClick={() =>
                            navigate("/admin-dashboard/salary", {
                              state: {
                                selectedEmployeeId: employee._id,
                                openEditor: !isReadOnly,
                              },
                            })
                          }
                        >
                          {isReadOnly ? "View Salary" : "Edit Salary"}
                        </button>
                        <button
                          className="employee-actions__button employee-actions__button--leave"
                          type="button"
                          onClick={() => openLeaveDialog(employee)}
                        >
                          {isReadOnly ? "Status" : employee.status === "hold" ? "Return" : "Leave"}
                        </button>
                        <button
                          className="employee-actions__button employee-actions__button--delete"
                          type="button"
                          onClick={() => handleDelete(employee)}
                          disabled={isReadOnly}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="employee-pagination">
            <label className="employee-pagination__rows">
              <span>Rows per page</span>
              <select
                value={rowsPerPage}
                onChange={(event) => {
                  setRowsPerPage(Number(event.target.value));
                  setCurrentPage(1);
                }}
              >
                {PAGE_SIZES.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </label>

            <p className="employee-pagination__summary">
              {filteredEmployees.length === 0 ? 0 : startIndex + 1}-{Math.min(startIndex + rowsPerPage, filteredEmployees.length)} of {filteredEmployees.length}
            </p>

            <div className="employee-pagination__controls">
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={safePage === 1}
              >
                Prev
              </button>
              <span>
                {safePage}/{totalPages}
              </span>
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                disabled={safePage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="employee-empty-state">
            <h2 className="employee-empty-state__title">
              {visibleEmployees.length > 0 ? "No matching employee found" : "No employees added yet"}
            </h2>
            <p className="employee-empty-state__text">
              {visibleEmployees.length > 0
                ? "Try another employee ID or clear the search to see the full list."
                : "Start with the add employee screen and every new record will appear here automatically."}
            </p>
            <Link
              className="employee-empty-state__button"
              to="/admin-dashboard/add-new-employee"
            >
              Add New Employee
            </Link>
          </div>
        </>
      )}

      {activeDialog ? (
        <div className="employee-modal">
          <div className="employee-modal__backdrop" onClick={closeDialog} />
          <div className="employee-modal__panel" role="dialog" aria-modal="true">
            <div className="employee-modal__header">
              <div>
                <p className="employee-modal__eyebrow">Employee action</p>
                <h2 className="employee-modal__title">
                  {activeDialog === "view" && "Employee Details"}
                  {activeDialog === "edit" && "Edit Employee"}
                  {activeDialog === "leave" && "Leave Management"}
                </h2>
              </div>
              <button className="employee-modal__close" type="button" onClick={closeDialog}>
                Close
              </button>
            </div>

            {activeDialog === "view" ? (
              <div className="employee-detail-grid">
                <div className="employee-detail-card">
                  <span>Name</span>
                  <strong>{activeEmployee?.name}</strong>
                </div>
                <div className="employee-detail-card">
                  <span>Employee ID</span>
                  <strong>{activeEmployee?.employeeId || "-"}</strong>
                </div>
                <div className="employee-detail-card">
                  <span>Email</span>
                  <strong>{activeEmployee?.email}</strong>
                </div>
                <div className="employee-detail-card">
                  <span>Date of Birth</span>
                  <strong>{formatDate(activeEmployee?.dateOfBirth)}</strong>
                </div>
                <div className="employee-detail-card">
                  <span>Department</span>
                  <strong>{activeEmployee?.department || "-"}</strong>
                </div>
                <div className="employee-detail-card">
                  <span>Designation</span>
                  <strong>{activeEmployee?.designation || "-"}</strong>
                </div>
                <div className="employee-detail-card">
                  <span>Salary</span>
                  <strong>{activeEmployee?.salary ?? "-"}</strong>
                </div>
                <div className="employee-detail-card">
                  <span>Status</span>
                  <strong>{activeEmployee?.status || "-"}</strong>
                </div>
              </div>
            ) : null}

            {activeDialog === "edit" ? (
              <div className="employee-modal__body">
                <div className="employee-form__grid">
                  <label className="employee-form__field">
                    <span className="employee-form__label">Name</span>
                    <input
                      className="employee-form__input"
                      name="name"
                      value={formState.name}
                      onChange={handleFormChange}
                      disabled={isReadOnly}
                    />
                  </label>
                  <label className="employee-form__field">
                    <span className="employee-form__label">Email</span>
                    <input
                      className="employee-form__input"
                      name="email"
                      type="email"
                      value={formState.email}
                      onChange={handleFormChange}
                      disabled={isReadOnly}
                    />
                  </label>
                  <label className="employee-form__field">
                    <span className="employee-form__label">Employee ID</span>
                    <input
                      className="employee-form__input"
                      name="employeeId"
                      value={formState.employeeId}
                      onChange={handleFormChange}
                      disabled={isReadOnly}
                    />
                  </label>
                  <label className="employee-form__field">
                    <span className="employee-form__label">DOB</span>
                    <input
                      className="employee-form__input"
                      name="dateOfBirth"
                      type="date"
                      value={formState.dateOfBirth}
                      onChange={handleFormChange}
                      disabled={isReadOnly}
                    />
                  </label>
                  <label className="employee-form__field">
                    <span className="employee-form__label">Designation</span>
                    <input
                      className="employee-form__input"
                      name="designation"
                      value={formState.designation}
                      onChange={handleFormChange}
                      disabled={isReadOnly}
                    />
                  </label>
                  <label className="employee-form__field">
                    <span className="employee-form__label">Department</span>
                    <input
                      className="employee-form__input"
                      name="department"
                      value={formState.department}
                      onChange={handleFormChange}
                      disabled={isReadOnly}
                    />
                  </label>
                </div>
                <label className="employee-form__field">
                  <span className="employee-form__label">Notes</span>
                  <textarea
                    className="employee-form__textarea"
                    name="notes"
                    value={formState.notes}
                    onChange={handleFormChange}
                    disabled={isReadOnly}
                  />
                </label>
              </div>
            ) : null}

            {activeDialog === "leave" ? (
              <div className="employee-modal__body">
                <p className="employee-modal__text">
                  {activeEmployee?.status === "hold"
                    ? "This employee is currently on leave. Save to mark them active again."
                    : "Save to mark this employee as on leave."}
                </p>
                <label className="employee-form__field">
                  <span className="employee-form__label">Status</span>
                  <select
                    className="employee-form__select"
                    name="status"
                    value={formState.status}
                    onChange={handleFormChange}
                    disabled={isReadOnly}
                  >
                    <option value="hold">On Leave</option>
                    <option value="active">Active</option>
                  </select>
                </label>
              </div>
            ) : null}

            {actionError ? <p className="employee-form__error">{actionError}</p> : null}

            {activeDialog !== "view" && !isReadOnly ? (
              <div className="employee-modal__footer">
                <button
                  className="employee-actions__button employee-actions__button--edit"
                  type="button"
                  onClick={handleSave}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            ) : null}

            {activeDialog !== "view" && isReadOnly ? (
              <div className="employee-modal__footer">
                <p className="employee-shell__hint">Read only mode. Only admins can update this section.</p>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default List;
