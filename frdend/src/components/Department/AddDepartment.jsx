import React, { useState } from "react";
import "./AddDepartment.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddDepartment = () => {
  const [department, setDepartment] = useState({
    dep_name: "",
    description: "",
  });
const navigate = useNavigate()

const handleChange = (e) => {
  const {name , value} = e.target ;
  setDepartment({...department , [name] : value})
}

const handleSubmit = (e) => {
  e.preventDefault()
try{
  const response = await axios.post('http://localhost:3444/api/department/add',department,{
    headers:{
      "Authorization" : `Bearer ${localstorage.getItem('token')}`
    }
  })
if(response.data.success){
navigate("/admin-dashboard/departments")

}
}catch(err){
if(err.response && !err.response.data.success){
  alert(err.response.data.err)
}
}


}

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
              onChange={handleChange}
              placeholder="Write a short description..."
              rows="5"
            ></textarea>
          </div>

          <button className="add-department__button" type="submit">
            Add Department
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddDepartment;
