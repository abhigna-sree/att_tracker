import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Form, Button, Alert, Spinner } from "react-bootstrap";

// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.bundle.min.js";

const EditProject = () => {
  const { id } = useParams(); // Get project ID from URL
  const navigate = useNavigate();
  
  const [project, setProject] = useState(null);
  const [updatedFields, setUpdatedFields] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetch project details
    axios.get(`http://localhost:5000/projects/${id}`)
      .then((res) => {
        setProject(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching project:", err);
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    setUpdatedFields({ ...updatedFields, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(updatedFields).length === 0) {
      setMessage("No changes made.");
      return;
    }
    
    try {
      const token = localStorage.getItem("token"); // Get token
      const response = await axios.put(
        `http://localhost:5000/projects/${id}`,
        updatedFields,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(response.data.message);
      setTimeout(() => navigate("/projects"), 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong");
    }
  };

  if (loading) {
    return <Spinner animation="border" className="d-block mx-auto mt-5" />;
  }

  if (!project) {
    return <Alert variant="danger" className="text-center mt-5">Project not found.</Alert>;
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-3">Update Project</h2>
      {message && <Alert variant="info">{message}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Project Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            placeholder="Enter new title"
            defaultValue={project.title}
            onChange={handleChange}
          />
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            placeholder="Enter new description"
            defaultValue={project.description}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Deadline</Form.Label>
          <Form.Control
            type="date"
            name="deadline"
            defaultValue={project.deadline.split("T")[0]}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Execution Start Date</Form.Label>
          <Form.Control
            type="date"
            name="executionStartDate"
            defaultValue={project.executionStartDate.split("T")[0]}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Execution End Date</Form.Label>
          <Form.Control
            type="date"
            name="executionEndDate"
            defaultValue={project.executionEndDate.split("T")[0]}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Number of Slots</Form.Label>
          <Form.Control
            type="number"
            name="slots"
            defaultValue={project.slots}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Mentor</Form.Label>
          <Form.Control
            type="text"
            name="mentor"
            placeholder="Enter new mentor ID"
            defaultValue={project.mentor}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Image URL</Form.Label>
          <Form.Control
            type="text"
            name="image"
            placeholder="Enter image URL"
            defaultValue={project.image}
            onChange={handleChange}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Update Project
        </Button>
      </Form>
    </Container>
  );
};

export default EditProject;
