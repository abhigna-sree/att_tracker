import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "../css/studashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("http://localhost:4000/vendor/projects")

      .then((response) => response.json())
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching projects:", error);
        setLoading(false);
      });
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

        const userId = decodedToken.id;
        const response = await fetch(`http://localhost:4000/userdetails/${userId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [navigate]);

  const goToCreateProject = () => {
    navigate("/createProject");
  };
  const goToUploadFaculty = () => {
    navigate("/uploadfaculty");
  };
  const editProject = (id) => {
    navigate(`/editProject/${id}`);
  };
  const viewProfile = () => {
    navigate("/AdminAttendancePage");
  }


  const deleteProject = (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    fetch(`http://localhost:4000/vendor/projects/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then(() => {
        setProjects((prevProjects) =>
          prevProjects.filter((project) => project._id !== id)
        );
      })
      .catch((error) => console.error("Error deleting project:", error));
  };

  return (
    <>
      <div className="container-fluid container1 full-screen">
        <div className="container text-center">
          <h1 className="stuname">Welcome, {user ? `${user.name} (${user.role})` : "User"}</h1>
          <div className="row mt-4 keynumbers">
            <div className="col-md-4">
              <div className="card p-4 shadow cardbg">
                {/* <img src={"../imgs/ap.webp"} className="img-fluid" alt="Available Projects" /> */}
                <h3>New Project</h3>
                <p>Create a new project and assign details</p>
                <button className="btn carbut btncss" onClick={goToCreateProject}>+ Create Project</button>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card p-4 shadow cardbg">
                {/* <img src={"../imgs/rp.jpg"} className="img-fluid" alt="Registered Projects" /> */}
                <h3>Upload Faculty</h3>
                <p>Upload faculty details in JSON format only.</p>
                <button className="btn carbut btncss" onClick={goToUploadFaculty}>+ Upload</button>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card p-4 shadow cardbg">
                {/* <img src={"../imgs/sp1.png"} className="img-fluid" alt="Student Profile" /> */}
                <h3>Attendance Details</h3>
                <p>Attendance details of students</p>
                <button className="btn carbut btncss" onClick={viewProfile}>View →</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-4 mt-4 container1">
        <h4>Manage Existing Projects</h4>
        {loading ? (
          <p>Loading projects...</p>
        ) : projects.length > 0 ? (
          <ul className="list-group mt-3">
            {(() => {
              const projectElements = [];
              projects.forEach((project) => {
                projectElements.push(
                  <li
                    key={project._id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    {project.title}
                    <div>
                      <button className="btn btn-sm btn-warning me-2" onClick={() => editProject(project._id)}>
                        Edit
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => deleteProject(project._id)}>
                        Delete
                      </button>
                    </div>
                  </li>
                );
              });
              return projectElements;
            })()}
          </ul>
        ) : (
          <p className="text-center mt-3">No projects found.</p>
        )}
      </div>
    </>
  );
};

export default AdminDashboard;
