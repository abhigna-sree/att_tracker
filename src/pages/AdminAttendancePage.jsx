import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminAttendancePage = () => {
  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/admin/active-attendance")
      .then((res) => {
        setAttendanceData(res.data);
      })
      .catch((err) => {
        console.error("Error fetching attendance", err);
      });
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Admin Attendance for Today</h2>

      {attendanceData.map((project) => (
        <div key={project.pid} className="mb-4">
          <h5 className="text-primary">{project.title} ({project.pid})</h5>
          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead className="table-dark">
                <tr>
                  <th>Roll No</th>
                  <th>Name</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {project.students.map((stu, index) => (
                  <tr key={index}>
                    <td>{stu.rollNo}</td>
                    <td>{stu.name}</td>
                    <td className={stu.attendanceStatus ? "table-success" : "table-danger"}>
                      {stu.attendanceStatus ? "Present" : "Absent / Not marked"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminAttendancePage;
