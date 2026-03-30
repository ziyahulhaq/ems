import { useAuth } from "../../Context/authContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const initials = user?.name
    ? user.name
        .split(" ")
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase()
    : "EM";

  return (
    <header className="dashboard-navbar">
      <div className="dashboard-navbar__brand">
        <span className="dashboard-navbar__eyebrow">Employee Management</span>
        <h2 className="dashboard-navbar__title">
          Welcome back, <span>{user?.name || "User"}</span>
        </h2>
        
      </div>
 <button className="dashboard-navbar__button" onClick={logout} type="button">
            Logout
          </button>
      <div className="dashboard-navbar__actions">
        <div className="dashboard-navbar__user">
          <div className="dashboard-navbar__avatar" aria-hidden="true">
            {initials}
          </div>
          <div className="dashboard-navbar__meta">
            <span className="dashboard-navbar__label">Signed in as</span>
            <strong>{user?.role || "Member"}</strong>
          </div>
         
        </div>
      </div>
    </header>
  );
};

export default Navbar;
