import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:4000/vendor/login", { username, password })
      .then((result) => {
        console.log(result);
        if (result.data.token) {
          localStorage.setItem("token", result.data.token);
          // localStorage.setItem("role", result.data.role);
            navigate(result.data.dashboard);
        } else {
          alert("Invalid login response");
        }
      })
      .catch((err) => {
        console.log(err);
        alert("Login failed. Please check your credentials.");
      });
  };
  

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 vw-100 text-dark loginbg"
      style={{
        // backgroundImage: "url('/imgs/login.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "#EDE8F5"
      }}
    >
      <div className="border border-2 rounded p-4 shadow-lg" style={{ width: "350px", backdropFilter: "blur(10px)" }}>
        <h1 className="text-center fw-bold text-uppercase mb-4">AttendX</h1>
        <h3 className="text-center mb-3">Login</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Username:</label>
            <input type="text" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Password:</label>
            <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-dark w-100">Submit</button>
        </form>
        <div className="mt-3 text-center">
          Don't have an account? <Link to="/signup" className="text-primary">Signup</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
