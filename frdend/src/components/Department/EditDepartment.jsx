import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./AddDepartment.css";

const EditDepartment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [department, setDepartment] = useState({
    dep_name: "",
    description: "",
  });
  const [depLoading, setDepLoading] = useState(false);

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
          setDepartment(response.data.department);
        }
      } catch (err) {
        const message = err.response?.data?.error || "Failed to add department";
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

    try {
      const response = await axios.put(
        `http://localhost:3444/api/department/${id}`,
        department,
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
    }
  };

  return depLoading ? (
    <div>Loading ...</div>
  ) : (
    <div className="add-department">
      <div className="add-department__card">
        <div className="add-department__header">
          <p className="add-department__eyebrow">Department setup</p>
          <h3 className="add-department__title">Edit Department</h3>
          <p className="add-department__subtitle">
            Update the department name and description for your team.
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
            ></textarea>
          </div>

          <button className="add-department__button" type="submit">
            Edit Department
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditDepartment;
