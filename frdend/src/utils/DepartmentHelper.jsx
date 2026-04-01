import { useNavigate } from "react-router-dom";

export const DepartmentButtons = ({DepId}) => {
const navigate = useNavigate()

  return (
    <div className="department-actions">
      <button className="department-actions__button department-actions__button--edit" type="button" 
      onClick={() => navigate(`/admin-dashboard/department/${DepId}`) }>
        Edit
      </button>
      <button className="department-actions__button department-actions__button--delete" type="button">
        Delete
      </button>
    </div>
  );
};
