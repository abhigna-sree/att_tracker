import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Table, Form, Spinner } from "react-bootstrap";
import { FaSort } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const StudentsRegistered = () => {
  const { pid } = useParams();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }
  
        const decodedToken = jwtDecode(token);
        console.log("Decoded Token:", decodedToken); // Debugging
  
        const response = await axios.get(`http://localhost:4000/vendor/studentsRegistered/${pid}`);
        console.log("Response Data:", response.data); // Debugging
  
        setStudents(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching students:", error);
        setLoading(false);
      }
    };
    fetchUserData();
  }, [pid, navigate]);
  

  const handleSort = (column) => {
    const order = sortColumn === column && sortOrder === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortOrder(order);
  };

  const sortedStudents = [...students].sort((a, b) => {
    if (!sortColumn) return 0;
    return sortOrder === "asc"
      ? a[sortColumn].localeCompare(b[sortColumn])
      : b[sortColumn].localeCompare(a[sortColumn]);
  });

  const filteredStudents = sortedStudents.filter((student) =>
    Object.values(student).some((val) =>
      val.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Students Registered for Project {pid}</h2>
      <Form.Control
        type="text"
        placeholder="Search students"
        className="mb-3"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th onClick={() => handleSort("rollNo")}>
                Roll No <FaSort />
              </th>
              <th onClick={() => handleSort("name")}>
                Name <FaSort />
              </th>
              <th onClick={() => handleSort("department")}>
                Department <FaSort />
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student, index) => (
              <tr key={index}>
                <td>{student.rollno}</td>
                <td>{student.name}</td>
                <td>{student.department}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default StudentsRegistered;
