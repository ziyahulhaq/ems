import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEmployees } from "../../Context/useEmployees";
import { useAuth } from "../../Context/useAuth";
import "../employee/Employee.css";
import "./Salary.css";

const formatCurrency = (value) => {
  const amount = Number(value);

  if (Number.isNaN(amount)) {
    return "Rs 0";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

const Salary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isReadOnly = user?.role !== "admin";
  const { employees, loading, error, updateEmployee } = useEmployees();
  const [searchValue, setSearchValue] = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [salaryValue, setSalaryValue] = useState("");
  const [actionError, setActionError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const salaryInputRef = useRef(null);

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
      [employee.name, employee.employeeId, employee.department]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalizedSearch)),
    );
  }, [searchValue, visibleEmployees]);

  const selectedEmployee = useMemo(
    () => visibleEmployees.find((employee) => employee._id === selectedEmployeeId) || null,
    [selectedEmployeeId, visibleEmployees],
  );

  const payrollTotal = useMemo(
    () =>
      visibleEmployees.reduce((total, employee) => total + Number(employee.salary || 0), 0),
    [visibleEmployees],
  );

  const averageSalary = visibleEmployees.length > 0 ? payrollTotal / visibleEmployees.length : 0;

  useEffect(() => {
    const requestedEmployeeId = location.state?.selectedEmployeeId;
    const requestedEmployeeExists = visibleEmployees.some(
      (employee) => employee._id === requestedEmployeeId,
    );
    const currentEmployeeExists = visibleEmployees.some(
      (employee) => employee._id === selectedEmployeeId,
    );

    if (requestedEmployeeId && requestedEmployeeExists && requestedEmployeeId !== selectedEmployeeId) {
      setSelectedEmployeeId(requestedEmployeeId);
      navigate(location.pathname, { replace: true, state: null });
      return;
    }

    if (requestedEmployeeId && requestedEmployeeExists) {
      navigate(location.pathname, { replace: true, state: null });
      return;
    }

    if (!currentEmployeeExists && visibleEmployees[0]?._id) {
      setSelectedEmployeeId(visibleEmployees[0]._id);
    }
  }, [location.pathname, location.state, navigate, selectedEmployeeId, visibleEmployees]);

  useEffect(() => {
    setSalaryValue(selectedEmployee?.salary?.toString() || "");
    setActionError("");
    setIsSubmitting(false);

    if (selectedEmployee) {
      window.requestAnimationFrame(() => {
        if (isReadOnly) {
          salaryInputRef.current?.focus();
          return;
        }

        salaryInputRef.current?.focus();

        if (location.state?.openEditor) {
          salaryInputRef.current?.select();
        }
      });
    }
  }, [isReadOnly, location.state, selectedEmployee]);

  const handleEmployeeKeyDown = (event, currentIndex) => {
    if (!filteredEmployees.length) {
      return;
    }

    const lastIndex = filteredEmployees.length - 1;
    let nextIndex = currentIndex;

    if (event.key === "ArrowDown") {
      nextIndex = currentIndex === lastIndex ? 0 : currentIndex + 1;
    } else if (event.key === "ArrowUp") {
      nextIndex = currentIndex === 0 ? lastIndex : currentIndex - 1;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = lastIndex;
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setSelectedEmployeeId(filteredEmployees[currentIndex]._id);
      return;
    } else {
      return;
    }

    event.preventDefault();

    const nextEmployee = filteredEmployees[nextIndex];

    if (!nextEmployee) {
      return;
    }

    setSelectedEmployeeId(nextEmployee._id);

    window.requestAnimationFrame(() => {
      document
        .querySelector(`[data-salary-employee-id="${nextEmployee._id}"]`)
        ?.focus();
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedEmployee) {
      setActionError("Please select an employee first");
      return;
    }

    if (isReadOnly) {
      setActionError("Read only access. Only admins can update salary.");
      return;
    }

    if (salaryValue === "") {
      setActionError("Salary is required");
      return;
    }

    try {
      setIsSubmitting(true);
      setActionError("");

      await updateEmployee(selectedEmployee._id, {
        previousEmail: selectedEmployee.email || "",
        salary: salaryValue,
      });
    } catch (saveError) {
      setActionError(saveError.response?.data?.error || saveError.message || "Update failed");
      setIsSubmitting(false);
    }
  };

  return (
    <section className="employee-shell">
      <div className="employee-shell__header">
        <div>
          <p className="employee-shell__eyebrow">Salary desk</p>
          <h1 className="employee-shell__title">Manage Salaries</h1>
          <p className="employee-shell__text">
            Admins can open the salary workspace from the sidebar, dashboard card,
            or employee list and update the selected employee from the edit panel.
          </p>
        </div>
        <div className="employee-shell__pill">{formatCurrency(payrollTotal)} payroll</div>
      </div>

      <div className="employee-grid">
        <div className="employee-panel">
          <p className="employee-panel__label">Employees</p>
          <p className="employee-panel__value">{visibleEmployees.length}</p>
        </div>
        <div className="employee-panel">
          <p className="employee-panel__label">Average Salary</p>
          <p className="employee-panel__value">{formatCurrency(averageSalary)}</p>
        </div>
        <div className="employee-panel">
          <p className="employee-panel__label">Selected Salary</p>
          <p className="employee-panel__value">
            {selectedEmployee ? formatCurrency(selectedEmployee.salary) : "Rs 0"}
          </p>
        </div>
      </div>

      <div className="salary-layout">
        <div className="salary-card">
          <div className="salary-card__header">
            <div>
              <p className="salary-card__eyebrow">Employee list</p>
              <h2 className="salary-card__title">Choose Employee</h2>
            </div>
          </div>

          <input
            className="employee-toolbar__search"
            type="search"
            placeholder="Search by name, ID, or department"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
          />

          {loading ? (
            <div className="employee-empty-state">
              <h2 className="employee-empty-state__title">Loading salaries...</h2>
              <p className="employee-empty-state__text">
                Pulling the latest employee records now.
              </p>
            </div>
          ) : error ? (
            <div className="employee-empty-state">
              <h2 className="employee-empty-state__title">Unable to load salaries</h2>
              <p className="employee-empty-state__text">{error}</p>
            </div>
          ) : filteredEmployees.length > 0 ? (
            <div className="salary-list" role="listbox" aria-label="Employee salary list">
              {filteredEmployees.map((employee, index) => (
                <button
                  key={employee._id}
                  data-salary-employee-id={employee._id}
                  className={`salary-list__item ${
                    employee._id === selectedEmployeeId ? "salary-list__item--active" : ""
                  }`}
                  type="button"
                  onClick={() => setSelectedEmployeeId(employee._id)}
                  onKeyDown={(event) => handleEmployeeKeyDown(event, index)}
                  role="option"
                  aria-selected={employee._id === selectedEmployeeId}
                >
                  <div className="salary-list__identity">
                    <strong>{employee.name}</strong>
                    <span>{employee.employeeId || "No employee ID"}</span>
                  </div>
                  <div className="salary-list__meta">
                    <span>{employee.department || "No department"}</span>
                    <strong>{formatCurrency(employee.salary)}</strong>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="employee-empty-state">
              <h2 className="employee-empty-state__title">No matching employee found</h2>
              <p className="employee-empty-state__text">
                Try a different name, employee ID, or department in search.
              </p>
            </div>
          )}
        </div>

        <div className="salary-card salary-card--editor">
          <div className="salary-card__header">
            <div>
              <p className="salary-card__eyebrow">Edit area</p>
              <h2 className="salary-card__title">{isReadOnly ? "Salary Details" : "Update Salary"}</h2>
            </div>
          </div>

          {selectedEmployee ? (
            <form className="employee-form" onSubmit={handleSubmit}>
              <div className="salary-summary">
                <div className="employee-detail-card">
                  <span>Name</span>
                  <strong>{selectedEmployee.name}</strong>
                </div>
                <div className="employee-detail-card">
                  <span>Employee ID</span>
                  <strong>{selectedEmployee.employeeId || "-"}</strong>
                </div>
                <div className="employee-detail-card">
                  <span>Department</span>
                  <strong>{selectedEmployee.department || "-"}</strong>
                </div>
                <div className="employee-detail-card">
                  <span>Current Salary</span>
                  <strong>{formatCurrency(selectedEmployee.salary)}</strong>
                </div>
              </div>

              <label className="employee-form__field">
                <span className="employee-form__label">Edit Salary</span>
                <input
                  ref={salaryInputRef}
                  className="employee-form__input"
                  name="salary"
                  type="number"
                  min="0"
                  step="0.01"
                  value={salaryValue}
                  onChange={(event) => setSalaryValue(event.target.value)}
                  disabled={isReadOnly}
                />
              </label>

              {actionError ? <p className="employee-form__error">{actionError}</p> : null}

              {isReadOnly ? (
                <p className="employee-shell__hint">
                  Read only mode. Employees can view salary records but cannot change them.
                </p>
              ) : (
                <button className="employee-form__button" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Salary"}
                </button>
              )}
            </form>
          ) : (
            <div className="employee-empty-state">
              <h2 className="employee-empty-state__title">No employee selected</h2>
              <p className="employee-empty-state__text">
                Choose any employee from the left and the salary edit area will open here.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Salary;
