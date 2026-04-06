import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../Context/useAuth";
import "./AddDepartment.css";

const EditDepartment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isReadOnly = user?.role !== "admin";
  const [department, setDepartment] = useState({
    dep_name: "",
    description: "",
  });
  const [depLoading, setDepLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchDepartment = async () => {
      setDepLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:3444/api/department/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        if (response.data.success) {
          setDepartment({
            dep_name: response.data.department?.dep_name || "",
            description: response.data.department?.description || "",
          });
        }
      } catch (err) {
        const message =
          err.response?.data?.error || "Failed to load department";
        alert(message);
      } finally {
        setDepLoading(false);
      }
    };
    if (id) {
      fetchDepartment();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDepartment((prevDepartment) => ({
      ...prevDepartment,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isReadOnly) {
      return;
    }

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
      const response = await axios.put(
        `http://localhost:3444/api/department/${id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (response.data.success) {
        navigate("/admin-dashboard/departments");
      }
    } catch (err) {
      const message = err.response?.data?.error || "Failed to update department";
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return depLoading ? (
    <div>Loading ...</div>
  ) : (
    <div className="add-department">
      <div className="add-department__card">
        <div className="add-department__header">
          <p className="add-department__eyebrow">Department setup</p>
          <h3 className="add-department__title">{isReadOnly ? "View Department" : "Edit Department"}</h3>
          <p className="add-department__subtitle">
            Update the department name and description for your team.
          </p>
        </div>

        {isReadOnly ? (
          <p className="add-department__readonly">
            This department form is read-only for employee accounts.
          </p>
        ) : null}

        <form onSubmit={handleSubmit} className="add-department__form">
          <fieldset className="add-department__fieldset" disabled={isReadOnly}>
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
          </fieldset>

          <button
            className="add-department__button"
            type="submit"
            disabled={isSubmitting || isReadOnly}
          >
            {isReadOnly ? "Read Only" : isSubmitting ? "Saving..." : "Edit Department"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditDepartment;
