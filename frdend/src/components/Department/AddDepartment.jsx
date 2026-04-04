import React, { useState } from "react";
import "./AddDepartment.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddDepartment = () => {
  const [department, setDepartment] = useState({
    dep_name: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDepartment((currentDepartment) => ({
      ...currentDepartment,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      dep_name: department.dep_name.trim(),
      description: department.description.trim(),
    };

    if (!payload.dep_name) {
      alert("Department name is required");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await axios.post(
        "http://localhost:3444/api/department/add",
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (response.data.success && response.data.department?._id) {
        navigate("/admin-dashboard/departments");
      }
    } catch (err) {
      const message = err.response?.data?.error || "Failed to add department";
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-department">
      <div className="add-department__card">
        <div className="add-department__header">
          <p className="add-department__eyebrow">Department setup</p>
          <h3 className="add-department__title">Add Department</h3>
          <p className="add-department__subtitle">
            Create a new department and describe its purpose for your team.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="add-department__form">
          <div className="add-department__field">
            <label className="add-department__label" htmlFor="dep_name">
              Department Name
            </label>
            <input
              className="add-department__input"
              id="dep_name"
              name="dep_name"
              value={department.dep_name}
              onChange={handleChange}
              type="text"
              placeholder="Enter department name"
              required
            />
          </div>

          <div className="add-department__field">
            <label className="add-department__label" htmlFor="description">
              Description
            </label>
            <textarea
              className="add-department__textarea"
              id="description"
              name="description"
              value={department.description}
              onChange={handleChange}
              placeholder="Write a short description..."
              rows="5"
            />
          </div>

          <button
            className="add-department__button"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adding..." : "Add Department"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddDepartment;
