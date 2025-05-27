import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap-icons/font/bootstrap-icons.min.css";

const NavBar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  let userRole = "";
  let dashboardRoute = "/";

  if (token) {
    const decodedToken = jwtDecode(token);
    userRole = decodedToken.role;
  }
  if (userRole === "student") {
    dashboardRoute = "/stuDashboard";
  } else if (userRole === "faculty") {
    dashboardRoute = "/facultyDashboard";
  } else if (userRole === "admin") {
    dashboardRoute = "/adminDashboard";
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to={dashboardRoute}>
          AttendX
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {userRole === "student" && (
              <li className="nav-item">
                <Link className="nav-link" to="/CurrentProject">
                  My Project
                </Link>
              </li>
            )}

            {/* Profile Icon */}
            <li className="nav-item d-flex align-items-center me-3">
              <Link className="nav-link" to="/profile">
                <i className="bi bi-person-circle fs-4 text-light"></i>
              </Link>
            </li>

            {/* Logout Button */}
            <li className="nav-item">
              <button className="btn btn-danger" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
