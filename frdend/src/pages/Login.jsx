import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaShieldAlt, FaUsers, FaArrowRight } from "react-icons/fa";
import "./login.css";
import axios from "axios";
import { useAuth } from "../Context/useAuth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post("http://3.59.139.48:3444/api/auth/login", {
        email,
        password,
      });

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        window.dispatchEvent(new Event("auth-changed"));
        login(response.data.user);

        navigate("/admin-dashboard");
      }
    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Server error");
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-shell">
        <section className="login-hero">
          <div className="login-hero__badge">
            <FaShieldAlt />
            Secure workforce access
          </div>
          <h1 className="login-hero__title">Manage your team from one focused workspace.</h1>
          <p className="login-hero__text">
            Keep departments, employees, leaves, and payroll aligned in a dashboard
            that works beautifully on desktop and mobile.
          </p>

          <div className="login-hero__stats">
            <div className="login-hero__stat">
              <FaUsers />
              <div>
                <strong>Team-ready</strong>
                <span>Admin and employee access</span>
              </div>
            </div>
            <div className="login-hero__stat">
              <FaArrowRight />
              <div>
                <strong>Fastt workflow</strong>
                <span>Login and get moving quickly</span>
              </div>
            </div>
          </div>
        </section>

        <section className="login-card" aria-label="Login form">
          <div className="login-card__header">
            <div>
              <p className="login-card__eyebrow">Employee Management System</p>
              <h2 className="login-card__title">Welcome back</h2>
              <p className="login-card__subtitle">
                Sign in to access your dashboard and team tools.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-field">
              <label className="login-field__label" htmlFor="email">
                Email
              </label>
              <div className="login-field__control">
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
                <FaEnvelope className="login-field__icon" />
              </div>
            </div>

            <div className="login-field">
              <label className="login-field__label" htmlFor="password">
                Password
              </label>
              <div className="login-field__control">
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
                <FaLock className="login-field__icon" />
              </div>
            </div>

            <div className="login-form__row">
              <label className="login-form__checkbox">
                <input type="checkbox" />
                Remember me
              </label>
              <span>Contact admin for password help</span>
            </div>

            <button className="login-form__button" type="submit">
              Login
            </button>

            {error && <p className="login-form__error">{error}</p>}

            <p className="login-form__footer">Need an account? Ask an admin to create it.</p>
          </form>
        </section>
      </div>
    </div>
  );
}

export default Login;
