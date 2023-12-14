import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, Typography, TextField, CardActions, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { create,isEmailExists, isUsernameExists } from './api-user';

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 400,
    margin: '0 auto',
    marginTop: theme.spacing(3),
    padding: theme.spacing(2),
    textAlign: 'center',
  },
  textField: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  error: {
    color: 'red',
  },
  submit: {
    margin: '0 auto',
    marginBottom: theme.spacing(2),
  },
  title: {
    fontSize: 18,
  },
}));

// const create = async (user) => {
//   return { error: null }; // Simulated API call
// };

export default function Signup() {
  const classes = useStyles();

  const [values, setValues] = useState({ 
    firstName: '',
    lastName: '',
    companyName: '',
    email: '',
    username: '',
    password: '',
    passwordConfirmation: '',
    error: '',
  });

  const [open, setOpen] = useState(false);

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleClose = () => {
    setOpen(false);
  };
  const validateForm = () => {
    if (!values.firstName || !values.lastName || !values.companyName || !values.email || !values.username || !values.password || !values.passwordConfirmation) {
      setValues({ ...values, error: 'All fields are required.' });
      return false;
    }

    if (values.password.length < 6) {
      setValues({ ...values, error: 'Password must be at least 6 characters long.' });
      return false;
    }
    if (values.password !== values.passwordConfirmation ) {
      setValues({ ...values, error: 'Password Confirmation does not match.' });
      return false;
    }
    return true;
  };

  const clickSubmit = () => { 
    if (!validateForm()) {
      return;
    }
    const user = {
      firstName: values.firstName || undefined,
      lastName: values.lastName || undefined,
      companyName: values.companyName || undefined,
      email: values.email || undefined,
      username: values.username || undefined,
      password: values.password || undefined,
      passwordConfirmation: values.passwordConfirmation || undefined,
    };

    // Check if email exists
    isEmailExists(user.email).then((emailExists) => {
      if (emailExists) {
        setValues({ ...values, error: 'Email is already taken.' });
      } else {
        // Check if username exists
        isUsernameExists(user.username).then((usernameExists) => {
          if (usernameExists) {
            setValues({ ...values, error: 'Username is already taken.' });
          } else {
            // Make the API call to create the user
            create(user).then((data) => {
              if (data.error) {
                setValues({ ...values, error: data.error });
              } else {
                setOpen(true);
              }
            });
          }
        });
      }
    });
  };

  Signup.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
  };

  return (
    <div>
      <Card className={classes.card}> 
        <CardContent>
          <Typography variant="h6" className={classes.title}> 
            Sign Up
          </Typography>
                  
          <TextField
            id="firstName"
            label="firstName"
            className={classes.textField}
            value={values.firstName}
            onChange={handleChange('firstName')}
            margin="normal"
          />
          <TextField
            id="lastName"
            label="lastName"
            className={classes.textField}
            value={values.lastName}
            onChange={handleChange('lastName')}
            margin="normal"
          />
          <TextField
            id="companyName"
            label="companyName"
            className={classes.textField}
            value={values.companyName}
            onChange={handleChange('companyName')}
            margin="normal"
          />
          <TextField
            id="email"
            label="Email"
            className={classes.textField}
            value={values.email}
            onChange={handleChange('email')}
            margin="normal"
          />
          <TextField
            id="username"
            label="username"
            className={classes.textField}
            value={values.username}
            onChange={handleChange('username')}
            margin="normal"
          />
          <TextField
            id="password"
            label="Password"
            className={classes.textField}
            value={values.password}
            onChange={handleChange('password')}
            type="password"
            margin="normal"
          />
                    <TextField
            id="passwordConfirmation"
            label="passwordConfirmation"
            className={classes.textField}
            value={values.passwordConfirmation}
            onChange={handleChange('passwordConfirmation')}
            type="password"
            margin="normal"
          />
          {values.error && (
            <Typography variant="body2" className={classes.error}>
            {values.error}
          </Typography>
        )}
        </CardContent> 
        <CardActions>
          <Button color="primary" variant="contained" onClick={clickSubmit} 
            className={classes.submit}>
            Submit
          </Button>
        </CardActions> 
      </Card>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>New Account</DialogTitle>
        <DialogContent>
          <DialogContentText>
            New account successfully created. 
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Link to="/Signin">
            <Button color="primary" autoFocus variant="contained" onClick={handleClose}>
              Sign In 
            </Button>
          </Link>
        </DialogActions> 
      </Dialog>
    </div>
  );
}

