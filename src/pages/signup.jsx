import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import axios from 'axios';

const Signup = () => {
    const [name, setName] = useState("");
    const [phoneNumber, setPhoneNo] = useState("");
    const [rollNo, setRollNo] = useState("");
    const [password, setPassword] = useState("");
    const [dept, setDept] = useState("");
    const [section, setSection] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const apiUrl = 'http://localhost:4000/vendor/signup';

        axios.post(apiUrl, { name, rollno: rollNo, phone: phoneNumber, password, dept, section })
            .then(result => 
              navigate('/Login')  
            )
            .catch(err => console.error("Signup Error:", err));
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 text-dark"
            style={{ backgroundImage: "url('/imgs/login.jpeg')", backgroundSize: "cover", backgroundPosition: "center" }}>
            <div className="border border-2 rounded p-4 shadow-lg"
                style={{ borderColor: "#221e0a", width: "350px", backdropFilter: "blur(10px)" }}>
                <h1 className="text-center fw-bold text-uppercase mb-4">AttendX</h1>
                <h3 className="text-center mb-3">Create Your Account</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input type="text" className="form-control" placeholder="Name" required
                            onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <input type="text" className="form-control" placeholder="Roll Number"
                            onChange={(e) => setRollNo(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <input type="text" className="form-control" placeholder="Phone Number"
                            onChange={(e) => setPhoneNo(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <input type="text" className="form-control" placeholder="Department"
                            onChange={(e) => setDept(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <input type="text" className="form-control" placeholder="Section"
                            onChange={(e) => setSection(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <input type="password" className="form-control" placeholder="Password" required
                            onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <button type="submit" className="btn btn-dark w-100">Submit</button>
                </form>
                <div className="mt-3 text-center">
                    Already have an account? <Link to="/login" className="text-primary">Login</Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;
