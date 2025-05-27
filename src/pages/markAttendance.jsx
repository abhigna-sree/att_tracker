import React, { useState } from "react";
import axios from "axios";
import StudentAttendance from "../components/StudentAttendance";
import { useParams } from "react-router-dom";

const MarkAttendance = () => {
  const today = new Date().toISOString().split("T")[0];
  const [students, setStudents] = useState([]);
  const [attendanceDate, setAttendanceDate] = useState(today);
  const [showPopup, setShowPopup] = useState(false);
  const [showWarningPopup, setShowWarningPopup] = useState(false);
  const [isProjectFetched, setIsProjectFetched] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const {pid} = useParams();
  const fetchStudents = async () => {
    // if (!pid.trim()) return;

    try {
      const { data: studentsList } = await axios.get(`http://localhost:4000/students/${pid}`);
      const updatedStudents = studentsList.map((student) => ({
        ...student,
        attendanceStatus: true,
        selectedClasses: [],
      }));
      setStudents(updatedStudents);
      setIsProjectFetched(true);
      setResetTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("❌ Error fetching students:", error);
    }
  };

  const fetchAttendance = async (selectedClassHours) => {
    if (!pid || !attendanceDate || selectedClassHours.length === 0) return null;

    try {
      const response = await axios.get(
        `http://localhost:4000/attendance?pid=${pid}&date=${attendanceDate}&classHours=${selectedClassHours.join(",")}`
      );
      return response.data;
    } catch (error) {
      console.warn("⚠ No matching attendance found.");
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!selectedClasses || selectedClasses.length === 0) {
      setShowWarningPopup(true);
      return;
    }

    try {
      console.log(students);
      const attendanceData = students.map((student) => ({
        rollNo: student.rollNo,
        pid,
        selectedClasses,
        date: attendanceDate,
        attendanceStatus: student.attendanceStatus === true,
      }));

      await axios.post("http://localhost:4000/api/attendance", { attendanceData });

      setShowPopup(true);
      setSelectedClasses([]);
      setResetTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("❌ Error submitting attendance:", error.response?.data || error.message);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Student Attendance Management</h2>
    
      <button onClick={fetchStudents} style={styles.fetchButton}>Fetch Students</button>

      {isProjectFetched && (
        <>
          <label style={styles.label}>Select Attendance Date:</label>
          <input
            type="date"
            value={attendanceDate}
            onChange={(e) => setAttendanceDate(e.target.value)}
            max={today}
            style={styles.largeDateInput}
          />

          <StudentAttendance
            students={students}
            setStudents={setStudents}
            resetTrigger={resetTrigger}
            fetchAttendance={fetchAttendance}
            selectedClasses={selectedClasses}
            setSelectedClasses={setSelectedClasses}
          />

          <button onClick={handleSubmit} style={styles.submitButton}>Submit</button>
        </>
      )}

      {showPopup && (
        <div style={styles.popupOverlay}>
          <div style={styles.popupBox}>
            <h2>✅ Attendance Submitted Successfully!</h2>
            <button onClick={() => setShowPopup(false)} style={styles.closeButton}>Close</button>
          </div>
        </div>
      )}

      {showWarningPopup && (
        <div style={styles.popupOverlay}>
          <div style={styles.popupBox}>
            <h2>⚠ Please select at least one class hour before submitting!</h2>
            <button onClick={() => setShowWarningPopup(false)} style={styles.closeButton}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  popupOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  popupBox: {
    background: "white",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.3)",
    textAlign: "center",
  },
  closeButton: {
    marginTop: "15px",
    padding: "10px",
    background: "red",
    color: "white",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
  },
  input: { padding: "10px", margin: "10px", width: "200px", fontSize: "16px" },
  largeDateInput: { padding: "12px", margin: "10px", fontSize: "18px", width: "250px" },
  label: { fontSize: "18px", fontWeight: "bold", marginRight: "10px", display: "block", marginTop: "20px" },
  fetchButton: {
    padding: "10px",
    fontSize: "16px",
    background: "#4CAF50",
    color: "white",
    cursor: "pointer",
    border: "none",
    marginTop: "10px",
  },
  submitButton: {
    padding: "10px",
    fontSize: "16px",
    background: "blue",
    color: "white",
    cursor: "pointer",
    borderRadius: "5px",
    marginTop: "20px",
  },
};

export default MarkAttendance;