import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const ApplyProject = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();

    const [teamMembers, setTeamMembers] = useState(["", "", ""]); 
    // const [teamMembers, setTeamMembers] = useState(["", "", "", "", ""]); 
    const [studentRollNo, setStudentRollNo] = useState(""); 

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error("No token found in localStorage");
            navigate("/login");
            return;
        }
    
        try {
            const decodedToken = jwtDecode(token);
            console.log("Decoded Token:", decodedToken);  // Log decoded token
    
            if (!decodedToken.rollno) {
                console.error("rollno is missing in decoded token");
                return;
            }
    
            if (decodedToken.role !== "student") {
                console.error("Unauthorized role:", decodedToken.role);
                navigate("/login");
                return;
            }
    
            setStudentRollNo(decodedToken.rollno);
            setTeamMembers([decodedToken.rollno, "", ""]);  // Fix first index
    
        } catch (error) {
            console.error("Token decoding error:", error);
        }
    }, [navigate]);
    

    const handleInputChange = (index, value) => {
        const updatedMembers = [...teamMembers];
        updatedMembers[index] = value;
        setTeamMembers(updatedMembers);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(teamMembers);
        if (teamMembers.some(roll => roll === "")) {
            alert("Please fill all team members' roll numbers.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:4000/vendor/apply", {
                projectId,
                teamMembers,
            }, {
                headers: { "Authorization": localStorage.getItem("token") }
            });
            alert(response.data.message);
            navigate("/projects"); // Redirect after successful application
        } catch (error) {
            console.error("Application error:", error);
            alert("Application failed.");
        }
    };

    return (
        <div className="container">
            <h3>Apply for Project {projectId}</h3>
            <form onSubmit={handleSubmit}>
                {teamMembers.map((roll, index) => (
                    <div key={index} className="form-group">
                        <label>Team Member {index + 1} Roll No:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={roll}
                            onChange={(e) => handleInputChange(index, e.target.value)}
                            disabled={index === 0} // First member is fixed
                            required
                        />
                    </div>
                ))}
                <button type="submit" className="btn btn-success mt-3">Submit</button>
            </form>
            <button className="btn btn-danger mt-2" onClick={() => navigate("/projects")}>Cancel</button>
        </div>
    );
};

export default ApplyProject;
