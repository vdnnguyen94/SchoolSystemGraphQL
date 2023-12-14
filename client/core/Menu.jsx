import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import HomeIcon from '@material-ui/icons/Home'
import Button from '@material-ui/core/Button'
import auth from '../lib/auth-helper'
import { Link, useNavigate, useLocation } from 'react-router-dom';


const isActive = (location, path) => {
  return location.pathname === path ? { color: '#ff4081' } : { color: '#ffffff' };
};
export default function Menu(){ 
  const navigate = useNavigate();
  const location = useLocation();

  return (
  <AppBar position="static">
    <Toolbar>
      <Typography variant="h6" color="inherit">
        TOONIE Solution
      </Typography>
      <Link to="/">
        <IconButton aria-label="Home" style={isActive(location, "/")}>
          <HomeIcon/>
        </IconButton>
      </Link>
      {
        !auth.isAuthenticated() && (<span>
          <Link to="/signup">
            <Button style={isActive(location, "/signup")}>Sign up
            </Button>
          </Link>
          <Link to="/signin">
            <Button style={isActive(location, "/signin")}>Sign In
            </Button>
          </Link>
        </span>)
      }
      {
        auth.isAuthenticated() && (<span>
          <Link to={"/surveys"}>
            <Button style={isActive(location,"/surveys" )}>Active Surveys</Button>
          </Link>   
          <Link to={"/mysurveys"}>
            <Button style={isActive(location,"/mysurveys" )}>My Surveys</Button>
          </Link>           
          <Link to={"/user/" + auth.isAuthenticated().user._id + "/newsurvey"}>
            <Button style={isActive(location,"/user/" + auth.isAuthenticated().user._id + "/newsurvey" )}>New Survey</Button>
          </Link>          
        </span>)
      }
      <div style={{ marginLeft: 'auto' }}>
      {
        auth.isAuthenticated() && (<span>       
          <Link to={"/user/" + auth.isAuthenticated().user._id}>
            <Button style={isActive(location, "/user/" + auth.isAuthenticated().user._id)}>My Profile</Button>
          </Link>
          <Button color="inherit" onClick={() => {
               auth.clearJWT(() => navigate('/'));
            }}>Sign out</Button>
        </span>)
      }
      </div>
    </Toolbar>
  </AppBar>
);
};


