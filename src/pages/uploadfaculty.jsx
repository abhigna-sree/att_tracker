import axios from "axios";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../css/studashboard.css";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const UploadUsers = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log("No token found, redirecting to login.");
        navigate("/login");
        return;
      }

      try {
        const decodedToken = jwtDecode(token);
        console.log("Decoded Token:", decodedToken);

        if (decodedToken.role !== "admin") {
          console.log("Unauthorized access, redirecting...");
          navigate("/login");
          return;
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [navigate]);
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile && selectedFile.type === "application/json") {
      setFile(selectedFile);
      setMessage("");
    } else {
      setMessage("Only JSON files are allowed.");
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a valid JSON file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:4000/vendor/uploadusers", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage(res.data.message);
    } catch (error) {
      setMessage("Error uploading file.");
    }
  };

  return (
    <div className="container-fluid d-flex flex-column justify-content-center align-items-center vh-100 "
      style={{ backgroundImage: "url(../imgs/ufi.webp)", backgroundSize: "cover" }}>
      <h1>Upload JSON file of users</h1>
      {message && <div className="alert alert-info mt-2">{message}</div>}
      <div className="d-flex gap-2">
        <input type="file" className="form-control" accept=".json" onChange={handleFileChange} />
        <button className="btn" style={{ fontSize: "15px", padding: "6px", borderRadius: "20px", width: "100px", backgroundColor: "rgb(9, 9, 69)", color: "white" }} onClick={handleUpload}>Upload</button>
      </div>
    </div>
  );
};

export default UploadUsers;
