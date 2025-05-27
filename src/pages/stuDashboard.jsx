import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../css/studashboard.css";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const StuDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
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

  const goToProfile = () => navigate("/profile");
  const goTocurprojects = () => navigate("/CurrentProject");
  const goToprojects = () => navigate("/projects");

  return (
    <>
      {/* Dashboard Content */}
      <div className="container-fluid full-screen container1">
        <div className="container text-center">
          {/* <h1 className="stuname">Welcome, {user ? user.name : "Student"}</h1> */}
          <h1 className="stuname">Welcome, {user ? `${user.name} (${user.role})` : "User"}</h1>
          <h5 className="subheading">Explore projects & opportunities!</h5>
          <div className="row mt-4 keynumbers">
            <div className="col-md-4">
              <div className="card p-4 shadow cardbg">
                <img src={"../imgs/ap.webp"} className="img-fluid" alt="Available Projects" />
                <h3>Available Projects</h3>
                <p>Browse and pick projects. First come, first served!</p>
                <button className="btn carbut" onClick={goToprojects}>View →</button>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card p-4 shadow cardbg">
                <img src={"../imgs/rp.jpg"} className="img-fluid" alt="Registered Projects" />
                <h3>Registered Projects</h3>
                <p>Check and modify your registered projects.</p>
                <button className="btn carbut" onClick={goTocurprojects}>View →</button>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card p-4 shadow cardbg">
                <img src={"../imgs/sp1.png"} className="img-fluid" alt="Student Profile" />
                <h3>Student Profile</h3>
                <p>View and update your details.</p>
                <button className="btn carbut" onClick={goToProfile}>View →</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Projects */}
      <div className="container-fluid bg-dark text-white full-screen">
        <div className="container text-center">
          <h1 className="mb-4">Recommended Projects</h1>
          <div id="projectCarousel" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner">
              {[
                { img: "../imgs/p1.jpg", title: "Jewelry Design Generation", text: "Upload a basic sketch and generate realistic jewelry designs using AI." },
                { img: "../imgs/p2.jpg", title: "Machine Learning for Healthcare", text: "Develop AI models to predict diseases and improve diagnostics." },
                { img: "../imgs/p3.jpg", title: "Interactive Web Development", text: "Build responsive and dynamic web applications using MERN stack." }
              ].map((item, index) => (
                <div className={`carousel-item ${index === 0 ? "active" : ""}`} key={index}>
                  <img src={item.img} className="d-block w-100 carimg" alt={item.title} />
                  <div className="carousel-caption carousel-box">
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                    <button className="btn btn-primary">Apply Now</button>
                  </div>
                </div>
              ))}
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#projectCarousel" data-bs-slide="prev">
              <span className="carousel-control-prev-icon"></span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#projectCarousel" data-bs-slide="next">
              <span className="carousel-control-next-icon"></span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default StuDashboard;
