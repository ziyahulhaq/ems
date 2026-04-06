import axios from "axios";
import { useNavigate } from "react-router-dom";

export const DepartmentButtons = ({ DepId, onDepartmentDelete, readOnly = false }) => {
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:3444/api/department/${DepId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (response.data.success) {
        onDepartmentDelete(DepId);
      }
    } catch (err) {
      const message =
        err.response?.data?.error || "Failed to delete department";
      alert(message);
    }
  };

  return (
    <div className="department-actions">
      <button
        className="department-actions__button department-actions__button--edit"
        type="button"
        onClick={() => navigate(`/admin-dashboard/department/${DepId}`)}
      >
        {readOnly ? "View" : "Edit"}
      </button>
      <button
        onClick={handleDelete}
        className="department-actions__button department-actions__button--delete"
        type="button"
        disabled={readOnly}
      >
        Delete
      </button>
    </div>
  );
};
