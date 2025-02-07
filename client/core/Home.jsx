import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import toonieLogo from './../assets/images/toonieLogo.png';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import auth from '../lib/auth-helper';

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 600,
    margin: 'auto',
    marginTop: theme.spacing(5),
  },
  media: {
    width: '100%',
    minHeight: 250,
    paddingTop: '56.25%',
    objectFit: 'cover',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(2),
  },
  button: {
    margin: theme.spacing(1),
  },
}));

const Home = ({ isUserSignedOut }) => {
  const classes = useStyles();
  const [isLoggedIn, setIsLoggedIn] = useState(auth.isAuthenticated());

  useEffect(() => {
    // Update the authentication status when isUserSignedOut changes
    setIsLoggedIn(auth.isAuthenticated());
  }, [isUserSignedOut]);

  const handleSignOut = () => {
    auth.clearJWT(() => {
      // Update the authentication status after sign-out
      setIsLoggedIn(false);
    });
  };

  return (
    <Card className={classes.card}>
      <CardMedia
        className={classes.media}
        image={toonieLogo}
        title="Toonie Solution Logo"
        onError={(e) => {
          console.error('Error loading image:', e);
        }}
      />
      <CardContent>
        <div className={classes.buttonContainer}>
          {isLoggedIn ? (
            <Link to="/" style={{ textDecoration: 'none' }}>
              <Button variant="contained" color="primary" className={classes.button}>
                Main Page
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/signup">
                <Button variant="contained" color="primary" className={classes.button}>
                  Sign Up
                </Button>
              </Link>
              <Link to="/signin">
                <Button variant="contained" color="primary" className={classes.button}>
                  Sign In
                </Button>
              </Link>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Home;