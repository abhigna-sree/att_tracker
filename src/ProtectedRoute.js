import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ element, allowedRoles }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/Login" />;
  }

  const decodedToken = jwtDecode(token);
  const userRole = decodedToken.role;

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/Login" />;
  }

  return element;
};

export default ProtectedRoute;
