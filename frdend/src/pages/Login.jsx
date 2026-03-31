import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaLock } from "react-icons/fa";
import { FaEnvelope } from "react-icons/fa";
import "./login.css";
import axios from "axios";
import { useAuth } from "../Context/authContext";

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
      const response = await axios.post(
        "http://localhost:3444/api/auth/login",
        { email, password }
      );

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        login(response.data.user);

        if (response.data.user.role === "admin") {
          navigate("/admin-dashboard");
          return;
        }
        navigate("/employee-dashboard");
      }
    } catch (error) {
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError("Server error");
      }
    }
  };

  return (
    <>
      <div className="login-page">
        <h1 className="main-head">Employee Management System</h1>
        <div className="wrapper">
          <div className="for-box login">

            <form onSubmit={handleSubmit}>
              <h2>Login</h2>
              <div className="input-box">
                <input
                  type="email"
                  placeholder="Email"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
                <FaEnvelope className="icon" />
              </div>

              <div className="input-box">
                <input
                  type="password"
                  placeholder="Password"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
                <FaLock className="icon" />
              </div>
              <div className="remember-forget">
                <label>
                  <input type="checkbox" />
                  Remember Me
                </label>
                <a href="#">Forget Password?</a>
              </div>
              <button type="submit">Login</button>
              {error && <p className="form-error">{error}</p>}
              <div className="register-link">
                <p>
                  Don't Have An Account?
                  <a href="/register">Register</a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
