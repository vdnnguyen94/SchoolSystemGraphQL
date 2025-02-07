import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';
import Button from '@material-ui/core/Button';
import auth from '../lib/auth-helper';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const isActive = (location, path) => {
  return location.pathname === path ? { color: '#ff4081' } : { color: '#ffffff' };
};

export default function Menu() { 
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthenticated = auth.isAuthenticated();
  const student = isAuthenticated ? isAuthenticated.student : null;
  const isAdmin = student?.isAdmin || false;

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" color="inherit">
          TOONIE Solution
        </Typography>

        {/* Home Button */}
        <Link to="/">
          <IconButton aria-label="Home" style={isActive(location, "/")}>
            <HomeIcon />
          </IconButton>
        </Link>

        {/* If Not Logged In - Show Signup & Sign In */}
        {!isAuthenticated && (
          <span>
            <Link to="/signup">
              <Button style={isActive(location, "/signup")}>Sign up</Button>
            </Link>
            <Link to="/signin">
              <Button style={isActive(location, "/signin")}>Sign In</Button>
            </Link>
          </span>
        )}

        {/* If Logged In - Show Account, Courses */}
        {isAuthenticated && (
          <span>
            {/* My Account */}
            <Link to="/myAccount">
              <Button style={isActive(location, "/myAccount")}>My Account</Button>
            </Link>

            {/* Show "My Courses" and "Register Course" ONLY if NOT an Admin */}
            {!isAdmin && (
              <>
                <Link to={`/mycourses/${student.studentNumber}`}>
                  <Button style={isActive(location, `/mycourses/${student.studentNumber}`)}>My Courses</Button>
                </Link>

                <Link to={`/student/${student.studentNumber}/register`}>
                  <Button style={isActive(location, `/student/${student.studentNumber}/register`)}>Register Course</Button>
                </Link>
              </>
            )}

            {/* Admin-Only Section */}
            {isAdmin && (
              <>
                <Typography variant="h8"  style={{ marginLeft: '20px', color: 'red' }}>
                  ADMIN
                </Typography>
                <Link to="/admin/create-student">
                  <Button style={isActive(location, "/admin/create-student")}>Create Student</Button>
                </Link>
                <Link to="/admin/create-course">
                  <Button style={isActive(location, "/admin/create-course")}>Create Course</Button>
                </Link>
                <Link to="/admin/students">
                  <Button style={isActive(location, "/admin/students")}>Manage Students</Button>
                </Link>
                <Link to="/admin/courses">
                  <Button style={isActive(location, "/admin/courses")}>All Courses</Button>
                </Link>
              </>
            )}
          </span>
        )}

        {/* Right-Side Section (Logout) */}
        {isAuthenticated && (
          <div style={{ marginLeft: 'auto' }}>
            <span>
              <Button
                color="inherit"
                onClick={() => {
                  auth.clearJWT(() => navigate('/'));
                }}
              >
                Sign out
              </Button>
            </span>
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
}
