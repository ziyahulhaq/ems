export const DepartmentButtons = () => {
  return (
    <div className="department-actions">
      <button className="department-actions__button department-actions__button--edit" type="button">
        Edit
      </button>
      <button className="department-actions__button department-actions__button--delete" type="button">
        Delete
      </button>
    </div>
  );
};
