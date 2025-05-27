import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/projects.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "../css/all.css";

const Projects = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [mentors, setMentors] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        axios.get("http://localhost:4000/vendor/projects")
            .then(response => setProjects(response.data))
            .catch(error => console.error("Error fetching projects:", error));
        axios.get("http://localhost:4000/vendor/mentors")
            .then(response => setMentors(response.data))
            .catch(error => console.error("Error fetching mentors:", error));
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
                if (decodedToken.role !== "student") {
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

    const applyForProject = (projectId) => {
        navigate(`/apply/${projectId}`);
    };

    const filteredProjects = projects.filter(proj =>
        proj.title.toLowerCase().includes(search.toLowerCase()) && proj.slots > 0 && new Date(proj.deadline) >= new Date()
    );

    const findMentorName = (mentorId) => {
        const mentor = mentors.find(m => String(m._id) === String(mentorId));
        return mentor ? mentor.name : "Unknown";
    };
    
    return (
        <div className="container py-5">
            <h2 className="text-center mb-4">Available Projects</h2>
            <input
                type="text"
                className="form-control mb-3"
                placeholder="Search projects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <div className="row">
                {filteredProjects.length > 0 ? (
                    filteredProjects.map((proj, index) => (
                        <div key={index} className="col-lg-6 col-md-6 col-sm-12 mb-4">
                            <div className="card p-3 projectcard">
                                <img src={`http://localhost:4000/uploads/${proj.image}`} className="card-img-top" alt="Project" />
                                <div className="card-body">
                                    <h5 className="card-title fw-bold">{proj.title}</h5>
                                    <p className="card-text">{proj.description}</p>
                                    <p className="card-text">Registration Deadline: {proj.deadline}</p>
                                    <p className="card-text">Execution Start Date: {proj.executionStartDate}</p>
                                    <p className="card-text">Execution End Date: {proj.executionEndDate}</p>
                                    <p className="card-text text-danger">Slots left: {proj.slots}</p>
                                    <p className="card-text">Mentor: {findMentorName(proj.mentor)}</p>
                                    <button className="btn btn-primary btncss" onClick={() => applyForProject(proj.pid)}>Apply</button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center">No projects found.</p>
                )}
            </div>
        </div>
    );
};

export default Projects;
