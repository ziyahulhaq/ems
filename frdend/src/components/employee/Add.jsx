import React from "react";
import "./Employee.css";

const Add = () => {
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
        <div className="employee-shell__pill">Draft mode</div>
      </div>

      <form className="employee-form">
        <div className="employee-form__grid">
          <label className="employee-form__field">
            <span className="employee-form__label">Full Name</span>
            <input className="employee-form__input" type="text" placeholder="Jane Doe" />
          </label>

          <label className="employee-form__field">
            <span className="employee-form__label">Email</span>
            <input
              className="employee-form__input"
              type="email"
              placeholder="jane@company.com"
            />
          </label>

          <label className="employee-form__field">
            <span className="employee-form__label">Department</span>
            <select className="employee-form__select" defaultValue="">
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
            <input className="employee-form__input" type="text" placeholder="Frontend Engineer" />
          </label>
        </div>

        <label className="employee-form__field">
          <span className="employee-form__label">Notes</span>
          <textarea
            className="employee-form__textarea"
            placeholder="Add onboarding notes, shift rules, or access details."
          />
        </label>

        <button className="employee-form__button" type="button">
          Save Employee Draft
        </button>
      </form>
    </section>
  );
};

export default Add;
