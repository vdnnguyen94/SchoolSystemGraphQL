import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, Typography, TextField, CardActions, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { isEmailExists, isUsernameExists, resetPassword } from './api-user';

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

export default function ResetPassword() {
  const classes = useStyles();

  const [values, setValues] = useState({ 
    username: '',
    email: '',
    newPassword: '',
    newPasswordConfirm: '',
    error: ''
  });

  const [open, setOpen] = useState(false);

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const validateForm = () => {
    if (!values.email || !values.username || !values.newPassword || !values.newPasswordConfirm) {
      setValues({ ...values, error: 'All fields are required.' });
      return false;
    }

    if (values.newPassword.length < 6) {
      setValues({ ...values, error: 'Password must be at least 6 characters long.' });
      return false;
    }
    if (values.newPassword !== values.newPasswordConfirm) {
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
      username: values.username || undefined,
      email: values.email || undefined,
      newPassword: values.newPassword || undefined,
      newPasswordConfirm: values.newPasswordConfirm || undefined,
    };
  
    isEmailExists(user.email).then((emailExists) => {
      if (!emailExists) {
        setValues({ ...values, error: 'Email not found.' });
      } else {
        isUsernameExists(user.username).then((usernameExists) => {
          if (!usernameExists) {
            setValues({ ...values, error: 'Username not found.' });
          } else {
            resetPassword(user).then((data) => {
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

  ResetPassword.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
  };

  return (
    <div>
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h6" className={classes.title}>
            Reset Password
          </Typography>

          <TextField
            id="username"
            label="Username"
            className={classes.textField}
            value={values.username}
            onChange={handleChange('username')}
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
            id="newPassword"
            label="New Password"
            className={classes.textField}
            value={values.newPassword}
            onChange={handleChange('newPassword')}
            type="password"
            margin="normal"
          />
          <TextField
            id="newPasswordConfirm"
            label="Confirm New Password"
            className={classes.textField}
            value={values.newPasswordConfirm}
            onChange={handleChange('newPasswordConfirm')}
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
          <Button
            color="primary"
            variant="contained"
            onClick={clickSubmit}
            className={classes.submit}
          >
            Reset Password
          </Button>
        </CardActions>
      </Card>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Password Reset</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Password successfully reset. Please sign in with your new password.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Link to="/signin">
            <Button color="primary" autoFocus variant="contained" onClick={handleClose}>
              Sign In
            </Button>
          </Link>
        </DialogActions>
      </Dialog>
    </div>
  );
}
