import React, { useEffect } from "react";

const StudentAttendance = ({
  students,
  setStudents,
  resetTrigger,
  fetchAttendance,
  selectedClasses,
  setSelectedClasses
}) => {
  console.log(setStudents);
  useEffect(() => {
    setSelectedClasses([]);
  }, [resetTrigger]);

  useEffect(() => {
    const loadAttendance = async () => {
      if (selectedClasses.length === 0) return;

      const fetchedData = await fetchAttendance(selectedClasses);
      console.log(fetchedData);
      if (fetchedData?.length > 0) {
        setStudents((prev) =>
          prev.map((student) => {
            const match = fetchedData.find((rec) => rec.rollNo === student.rollNo);
            return match
              ? {
                ...student,
                attendanceStatus: match.attendanceStatus,
                selectedClasses: match.selectedClasses || [],
              }
              : student;
          })
        );
      }
    };

    loadAttendance();
  }, [selectedClasses]);

  const toggleClassHour = (hour) => {
    setSelectedClasses((prev) =>
      prev.includes(hour) ? prev.filter((h) => h !== hour) : [...prev, hour]
    );
  };

  const toggleStudentAttendance = (rollNo) => {
    setStudents((prev) =>
      prev.map((s) => (s.rollNo === rollNo ? { ...s, attendanceStatus: !s.attendanceStatus } : s))
    );
  };

  const markAll = (status) => {
    setStudents((prev) => prev.map((s) => ({ ...s, attendanceStatus: status })));
  };

  return (
    <div>
      {/* Class Hour Buttons */}
      <div style={styles.row}>
        {[1, 2, 3, 4, 5, 6, 7].map((hour) => (
          <button
            key={hour}
            onClick={() => toggleClassHour(hour)}
            style={{
              ...styles.circleButton,
              background: selectedClasses.includes(hour) ? "blue" : "white",
              color: selectedClasses.includes(hour) ? "white" : "black"
            }}
          >
            {hour}
          </button>
        ))}
      </div>

      {/* Student Buttons */}
      <div style={styles.row}>
        {students.map((s) => (
          <button
            key={s.rollNo}
            onClick={() => toggleStudentAttendance(s.rollNo)}
            style={{
              ...styles.circleButton,
              background: s.attendanceStatus ? "green" : "red",
              color: "white"
            }}
          >
            {s.rollNo.slice(-3)}
          </button>
        ))}

      </div>

      {/* Mark All */}
      <div style={styles.row}>
        <button onClick={() => markAll(true)} style={styles.greenButton}>Mark All Present</button>
        <button onClick={() => markAll(false)} style={styles.redButton}>Mark All Absent</button>
      </div>

      {/* Summary */}
      <div style={styles.row}>
        <div style={{ ...styles.countBox, background: "green" }}>✔ {students.filter((s) => s.attendanceStatus).length}</div>
        <div style={{ ...styles.countBox, background: "red" }}>✘ {students.filter((s) => !s.attendanceStatus).length}</div>
      </div>
    </div>
  );
};

const styles = {
  row: { display: "flex", justifyContent: "center", gap: "10px", marginTop: "15px" },
  circleButton: { width: "40px", height: "40px", borderRadius: "50%", cursor: "pointer" },
  greenButton: { padding: "8px 15px", background: "green", color: "white", borderRadius: "5px", cursor: "pointer" },
  redButton: { padding: "8px 15px", background: "red", color: "white", borderRadius: "5px", cursor: "pointer" },
  countBox: { width: "40px", height: "40px", borderRadius: "50%", color: "white", fontSize: "18px", textAlign: "center", lineHeight: "40px" },
};

export default StudentAttendance;