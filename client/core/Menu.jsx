import React, {useEffect} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';
import Button from '@material-ui/core/Button';
//import auth from '../lib/auth-helper';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useMutation, gql } from "@apollo/client";

const IS_LOGGED_IN = gql`
  query {
    isLoggedIn{
      isLoggedIn
      studentNumber
    }
  }
`;

const IS_ADMIN = gql`
  query {
    isAdmin
  }
`;

const LOGOUT = gql`
  mutation {
    logOut
  }
`;
const isActive = (location, path) => {
  return location.pathname === path ? { color: '#ff4081' } : { color: '#ffffff' };
};

export default function Menu() { 
  const navigate = useNavigate();
  const location = useLocation();

  const { data: loggedInData, loading: loadingAuth, refetch } = useQuery(IS_LOGGED_IN);
  const { data: adminData } = useQuery(IS_ADMIN);

  useEffect(() => {
    refetch();  // 
  }, [location.pathname, refetch]);
  
  //log out mutation
  const [logOut] = useMutation(LOGOUT, {
    onCompleted: async () => {
      await refetch();
      navigate("/");
    },

  });
  const isAuthenticated = loggedInData?.isLoggedIn?.isLoggedIn || false;
  const studentNumber = loggedInData?.isLoggedIn?.studentNumber || null;
  const isAdmin = adminData?.isAdmin || false;
  console.log("🔹 isAuthenticated:", isAuthenticated);
  console.log("🔹 isAdmin:", isAdmin);
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
        {!loadingAuth && !isAuthenticated && (
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
        {!loadingAuth && isAuthenticated && (
          <span>
            {/* My Account */}
            <Link to="/myAccount">
              <Button style={isActive(location, "/myAccount")}>My Account</Button>
            </Link>

            {/* Show "My Courses" and "Register Course" ONLY if NOT an Admin */}
            {!isAdmin && (
              <>
                <Link to={`/mycourses/${studentNumber}`}>
                  <Button style={isActive(location, `/mycourses/${studentNumber}`)}>My Courses</Button>
                </Link>

                <Link to={`/student/${studentNumber}/register`}>
                  <Button style={isActive(location, `/student/${studentNumber}/register`)}>Register Course</Button>
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
        {!loadingAuth && isAuthenticated && (
          <div style={{ marginLeft: 'auto' }}>
            <span>
              <Button
                color="inherit"
                onClick={() => logOut()}
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
