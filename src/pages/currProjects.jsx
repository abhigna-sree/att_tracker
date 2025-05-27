import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "bootstrap/dist/css/bootstrap.min.css";
// import "../css/all.css";

const CurrentProjects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState({});
  const [mentors, setMentors] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
  
      const decodedToken = jwtDecode(token);
      const stuid = decodedToken.rollno;
  
      try {
        const [mentorsRes, projectsRes] = await Promise.all([
          axios.get("http://localhost:4000/vendor/mentors"),
          axios.get(`http://localhost:4000/vendor/userprojects/${stuid}`),
        ]);
  
        setMentors(mentorsRes.data);
        const fetchedProjects = projectsRes.data;
        setProjects(fetchedProjects);
  
        const attendanceData = {};
  
        for (const proj of fetchedProjects) {
          const executionStart = new Date(proj.executionStartDate);
          const today = new Date();
  
          if (executionStart <= today) {
            const daysSinceStart = Math.floor((today - executionStart) / (1000 * 60 * 60 * 24)) + 1;
            const daysToShow = Math.min(daysSinceStart, 7);
  
            const projectAttendance = [];
  
            for (let i = 0; i < daysToShow; i++) {
              const date = new Date(executionStart);
              date.setDate(date.getDate() + i);
              const formattedDate = date.toISOString().split("T")[0];
  
              try {
                const res = await axios.get(
                  `http://localhost:4000/api/attendance/${proj.pid}/${formattedDate}/${stuid}`
                );
  
                projectAttendance.push({
                  date: date.toLocaleDateString(),
                  status: res.data?.attendanceStatus === true ? "Present" : "Absent",
                });
              } catch (err) {
                // No attendance marked
                projectAttendance.push({
                  date: date.toLocaleDateString(),
                  status: "Not marked",
                });
              }
            }
  
            attendanceData[proj.pid] = projectAttendance;
          }
        }
  
        setAttendanceRecords(attendanceData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchUserData();
  }, [navigate]);  

  const findMentorName = (mentorId) => {
    const mentor = mentors.find((m) => String(m._id) === String(mentorId));
    return mentor ? mentor.name : "Unknown";
  };

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4">Your Applied Projects</h2>

      <div className="mb-4">
        {projects.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  <th scope="col">Project Id</th>
                  <th scope="col">Project Title</th>
                  <th scope="col">Mentor</th>
                  <th scope="col">Execution Start Date</th>
                  <th scope="col">Execution End Date</th>
                  <th scope="col">Team Id</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((proj, index) => (
                  <tr key={index}>
                    <td>{proj.pid}</td>
                    <td>{proj.title}</td>
                    <td>{findMentorName(proj.mentor)}</td>
                    <td>{proj.executionStartDate}</td>
                    <td>{proj.executionEndDate}</td>
                    <td>{proj.teamId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center">You have no projects assigned.</p>
        )}
      </div>

      {/* Attendance Section */}
      {projects.some((proj) => new Date(proj.executionStartDate) <= new Date()) && (
        <>
          <h3 className="text-center mb-4">Your Attendance (Last 7 Days)</h3>
          {projects.map(
            (proj) =>
              new Date(proj.executionStartDate) <= new Date() && (
                <div key={proj.pid} className="mb-5">
                  <h5 className="text-center">{proj.title}</h5>
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered">
                      <thead>
                        <tr>
                          <th scope="col">Date</th>
                          <th scope="col">Attendance Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {attendanceRecords[proj.pid]?.map((att, index) => (
                          <tr key={index}>
                            <td>{att.date}</td>
                            <td>
                              {att.status === "null" ? (
                                <span className="text-muted">Not marked</span>
                              ) : (
                                <span>{att.status}</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )
          )}
        </>
      )}
    </div>
  );
};

export default CurrentProjects;
