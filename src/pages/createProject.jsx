import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "../css/studashboard.css";
import axios from "axios";

const CreateProject = () => {
  const [mentors, setMentors] = useState([]);
    const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    pid: "",
    projectName: "",
    projectDesc: "",
    projectDeadline: "",
    executionStartDate: "",
    executionEndDate: "",
    projectSlots: "",
    mentor: "",
    projectImage: null,
  });

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

    axios
      .get("http://localhost:4000/vendor/mentors")
      .then((response) => setMentors(response.data))
      .catch((error) => console.error("Error fetching mentors:", error));
  }, []);

  const handleChange = (e) => {
    if (e.target.type === "file") {
      setFormData({ ...formData, projectImage: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("pid", formData.pid);
    formDataToSend.append("projectName", formData.projectName);
    formDataToSend.append("projectDesc", formData.projectDesc);
    formDataToSend.append("projectDeadline", formData.projectDeadline);
    formDataToSend.append("executionStartDate", formData.executionStartDate);
    formDataToSend.append("executionEndDate", formData.executionEndDate);
    formDataToSend.append("projectSlots", formData.projectSlots);
    formDataToSend.append("mentor", formData.mentor);
    formDataToSend.append("projectImage", formData.projectImage);

    for (let [key, value] of formDataToSend.entries()) {
      console.log(key, value);
    }
    try {
      // console.log("Form data to send:", formDataToSend); // Log the form data

      await axios.post("http://localhost:4000/vendor/createProject", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // await axios.post("http://localhost:4000/vendor/createProject", formDataToSend);

      alert("Project Created Successfully!");
      window.location.href = "/adminDashboard";
    } catch (error) {
      if (error.response) {
        console.error("Error creating project:", error.response.data);
      } else if (error.request) {
        console.error("Error creating project, no response:", error.request);
      } else {
        console.error("Error setting up request:", error.message);
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Create New Project</h2>
      <form onSubmit={handleSubmit}>
        {/* Project ID */}
        <div className="mb-3">
          <label className="form-label">Project ID</label>
          <input type="text" className="form-control" name="pid" value={formData.pid} onChange={handleChange} required />
        </div>

        {/* Project Name */}
        <div className="mb-3">
          <label className="form-label">Project Name</label>
          <input type="text" className="form-control" name="projectName" value={formData.projectName} onChange={handleChange} required />
        </div>

        {/* Project Description */}
        <div className="mb-3">
          <label className="form-label">Project Description</label>
          <textarea className="form-control" name="projectDesc" rows="3" value={formData.projectDesc} onChange={handleChange} required></textarea>
        </div>

        {/* Deadline */}
        <div className="mb-3">
          <label className="form-label">Registration Deadline</label>
          <input type="date" className="form-control" name="projectDeadline" value={formData.projectDeadline} onChange={handleChange} required />
        </div>
        {/* project timeline start date */}
        <div className="mb-3">
          <label className="form-label">Project Start date</label>
          <input type="date" className="form-control" name="executionStartDate" value={formData.executionStartDate} onChange={handleChange} required />
        </div>
        {/* project timeline end date */}
        <div className="mb-3">
          <label className="form-label">Project End date</label>
          <input type="date" className="form-control" name="executionEndDate" value={formData.executionEndDate} onChange={handleChange} required />
        </div>

        {/* Number of Slots */}
        <div className="mb-3">
          <label className="form-label">Number of Slots</label>
          <input type="number" className="form-control" name="projectSlots" min="1" value={formData.projectSlots} onChange={handleChange} required />
        </div>

        {/* Mentor Assignment */}
        <div className="mb-3">
          <label className="form-label">Assign Mentor</label>
          <select className="form-select" name="mentor" value={formData.mentor} onChange={handleChange} required>
            <option value="">Select a Mentor</option>
            {mentors.map((mentor) => (
              <option key={mentor._id} value={mentor._id}>{mentor.name}</option>
            ))}
          </select>
        </div>

        {/* Image Upload */}
        <div className="mb-3">
          <label className="form-label">Upload Project Image</label>
          <input type="file" className="form-control" name="projectImage" accept="image/*" onChange={handleChange} required />
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary w-60">Create Project</button>
      </form>
    </div>
  );
};

export default CreateProject;
