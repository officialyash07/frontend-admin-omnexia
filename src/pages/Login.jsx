import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "../assets/css/styles/Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login, logout, user } = useAuth();

  // Force logout when visiting login page (disable auto-login)
  useEffect(() => {
    if (user) {
      logout();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/auth/login", { email, password });

      login(response.data);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* LEFT IMAGE PANEL */}
        <div className="login-left">
          <h2>New Scheduling And Routing Options</h2>
          <p>
            Manage your Omnexia Admin Panel easily with real-time data,
            analytics, and secure access.
          </p>
        </div>

        <div className="login-right">
          <h2>Hello Again 👋</h2>
          <p>Welcome back, please login to your account</p>

          {error && <p className="error">{error}</p>}

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
}
