import { useAuth } from "../../Context/useAuth";
import { FaBars } from "react-icons/fa";
import "./Navbar.css";

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const accessLabel = user?.role === "admin" ? "Full access" : "Read only";
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
      <div className="dashboard-navbar__left">
        <button
          className="dashboard-navbar__menu-button"
          type="button"
          aria-label="Open navigation"
          onClick={onMenuClick}
        >
          <FaBars />
        </button>
      </div>

      <div className="dashboard-navbar__brand">
        <span className="dashboard-navbar__eyebrow">Employee Managements</span>
        <h2 className="dashboard-navbar__title">
          Welcome back, <span>{user?.name || "User"}</span>
        </h2>
      </div>

      <div className="dashboard-navbar__actions">
        <div className="dashboard-navbar__user">
          <div className="dashboard-navbar__avatar" aria-hidden="true">
            {initials}
          </div>
          <div className="dashboard-navbar__meta">
            <span className="dashboard-navbar__label">{accessLabel}</span>
            <strong>{user?.role || "Member"}</strong>
          </div>
        </div>

        <button className="dashboard-navbar__button" onClick={logout} type="button">
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
