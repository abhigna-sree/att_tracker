import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "bootstrap/dist/css/bootstrap.min.css";

const FacultyDashboard = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchUserData = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const decodedToken = jwtDecode(token);
      const facid = decodedToken.rollno;
      axios
        .get(`http://localhost:4000/vendor/getFacProjects/${facid}`)
        .then((response) => {
          const currentDate = new Date(); // Get today's date
          const filteredProjects = response.data.filter((proj) => 
            new Date(proj.executionEndDate) >= currentDate // Only keep active projects
          );
          setProjects(filteredProjects);
        })
        .catch((error) => console.error("Error fetching projects:", error));
    };
    fetchUserData();
  }, [navigate]);

  const getstudents = (pid) => {
    navigate(`/studentsRegistered/${pid}`);
  };

  const markAttendance = (pid) => {
    navigate(`/MarkAttendance/${pid}`);
  };

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4">Available Projects</h2>
      <div className="row">
        {projects.length > 0 ? (
          projects.map((proj, index) => {
            const currentDate = new Date();
            const startDate = new Date(proj.executionStartDate);
            const endDate = new Date(proj.executionEndDate);

            return (
              <div key={index} className="col-lg-6 col-md-6 col-sm-12 mb-4">
                <div className="card p-3 projectcard">
                  <div className="card-body">
                    <h5 className="card-title fw-bold">{proj.title}</h5>
                    <p className="card-text">{proj.description}</p>
                    <p className="card-text">Execution Start Date: {startDate.toISOString().split("T")[0]}</p>
                    <p className="card-text">Execution End Date: {endDate.toISOString().split("T")[0]}</p>
                    <p className="card-text text-danger">Slots left: {proj.slots}</p>
                    <div className="d-flex gap-2">
                      <button className="btn btn-primary btncss" onClick={() => getstudents(proj.pid)}>
                        Get Registered Students
                      </button>
                      {currentDate >= startDate && (
                        <button className="btn btn-success" onClick={() => markAttendance(proj.pid)}>
                          Mark Attendance
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center">No projects found.</p>
        )}
      </div>
    </div>
  );
};

export default FacultyDashboard;
