import React from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/signup';
import StuDashboard from './pages/stuDashboard';
import Projects from './pages/projects';
import Profile from './pages/profile';
import AdminDashboard from './pages/adminDashboard';
import CreateProject from './pages/createProject';
import EditProject from './pages/editProject';
import UploadUsers from './pages/uploadfaculty';
import FacultyDashboard from './pages/facultyDashboard';
import MarkAttendance from './pages/markAttendance';
import StudentsRegistered from './pages/StudentsRegistered';
import ApplyProject from './pages/applyProject';
import CurrentProject from './pages/currProjects';
import AdminAttendancePage from './pages/AdminAttendancePage';
import NavBar from './components/navbar';
import ProtectedRoute from './ProtectedRoute';

function App() {
  const location = useLocation();
  const hideNavOnPages = ["/Login", "/Signup"];
  const shouldShowNav = !hideNavOnPages.includes(location.pathname);

  return (
    <div className="App">
      {shouldShowNav && <NavBar />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/Login" />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />

        <Route path='/profile' element={<Profile />}></Route>

        {/* Student Protected Routes */}
        <Route path="/stuDashboard" element={<ProtectedRoute element={<StuDashboard />} allowedRoles={['student']} />} />
        <Route path="/projects" element={<ProtectedRoute element={<Projects />} allowedRoles={['student']} />} />
        <Route path="/apply/:projectId" element={<ProtectedRoute element={<ApplyProject />} allowedRoles={['student']} />} />
        {/* <Route path="/profile" element={<ProtectedRoute element={<Profile />} allowedRoles={['student']} />} /> */}
        <Route path="/CurrentProject" element={<ProtectedRoute element={<CurrentProject />} allowedRoles={['student']} />} />

        {/* Faculty Protected Routes */}
        <Route path="/facultyDashboard" element={<ProtectedRoute element={<FacultyDashboard />} allowedRoles={['faculty']} />} />
        <Route path="/markAttendance" element={<ProtectedRoute element={<MarkAttendance />} allowedRoles={['faculty']} />} />
        <Route path="/StudentsRegistered/:pid" element={<ProtectedRoute element={<StudentsRegistered />} allowedRoles={['faculty']} />} />
        <Route path="/MarkAttendance/:pid" element={<ProtectedRoute element={<MarkAttendance />} allowedRoles={['faculty']} />} />

        {/* Admin Protected Routes */}
        <Route path="/adminDashboard" element={<ProtectedRoute element={<AdminDashboard />} allowedRoles={['admin']} />} />
        <Route path="/createProject" element={<ProtectedRoute element={<CreateProject />} allowedRoles={['admin']} />} />
        <Route path="/editProject/:id" element={<ProtectedRoute element={<EditProject />} allowedRoles={['admin']} />} />
        <Route path="/uploadfaculty" element={<ProtectedRoute element={<UploadUsers />} allowedRoles={['admin']} />} />
        <Route path="/AdminAttendancePage" element={<ProtectedRoute element={<AdminAttendancePage />} allowedRoles={['admin']} />} />
        </Routes>
    </div>
  );
}

export default App;
