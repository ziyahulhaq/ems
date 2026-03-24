import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaLock } from "react-icons/fa";
import { FaEnvelope } from "react-icons/fa";
import "./login.css";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:3444/api/auth/login",
        {
          email,
          password,
        },
      );
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        navigate("/admin-dashboard");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "Server error");
      } else {
        setError("Something went wrong");
      }
    }
  };

  return (
    <>
      <h1 className="main-head">Employee Management System</h1>
      <div className="wrapper">
        <div className="for-box login">
          {error && <p className="form-error">{error}</p>}

          <form onSubmit={handleSubmit}>
            <h1>Login</h1>
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
                type="Password"
                placeholder="Password"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
              <FaLock className="icon" />
            </div>
            <div className="remember-forget">
              <label>
                {" "}
                <input type="checkbox"></input>Remember Me
              </label>
              <a href="#">Forget Password?</a>
            </div>
            <button type="submit">Login</button>
            <div className="register-link">
              <p>
                Don't Have An Account?
                <a href="/register">Register</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
