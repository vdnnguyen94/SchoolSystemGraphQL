import React, { useState } from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import { makeStyles } from '@material-ui/core/styles';
import { useLocation, Navigate } from 'react-router-dom';
import { resetPassword } from './api-auth.js';

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 600,
    margin: 'auto',
    textAlign: 'center',
    marginTop: theme.spacing(5),
    paddingBottom: theme.spacing(2),
  },
  error: {
    verticalAlign: 'middle',
  },
  title: {
    marginTop: theme.spacing(2),
    color: theme.palette.openTitle,
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 300,
  },
  submit: {
    margin: 'auto',
    marginBottom: theme.spacing(2),
  },
  resetButton: {
    marginLeft: 'auto',
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(1),
  },
}));

export default function ResetPassword(props) {
  const location = useLocation();
  const classes = useStyles();
  const [values, setValues] = useState({
    username: '',
    email: '',
    newPassword: '',
    newPasswordConfirm: '',
    error: '',
    redirectToReferrer: false,
  });

  const clickSubmit = () => {
    const user = {
      username: values.username || undefined,
      email: values.email || undefined,
      newPassword: values.newPassword || undefined,
      newPasswordConfirm: values.newPasswordConfirm || undefined,
    };

    resetPassword(user).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        console.log(data);
        // Handle successful reset if needed
      }
    });
  };

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const { from } = location.state || {
    from: {
      pathname: '/signin',
    },
  };
  const { redirectToReferrer } = values;

  if (redirectToReferrer) {
    return <Navigate to={from} />;
  }

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h6" className={classes.title}>
          Reset Password
        </Typography>
        <TextField
          id="username"
          type="text"
          label="Username"
          className={classes.textField}
          value={values.username}
          onChange={handleChange('username')}
          margin="normal"
        />
        <br />
        <TextField
          id="email"
          type="email"
          label="Email"
          className={classes.textField}
          value={values.email}
          onChange={handleChange('email')}
          margin="normal"
        />
        <br />
        <TextField
          id="newPassword"
          type="password"
          label="New Password"
          className={classes.textField}
          value={values.newPassword}
          onChange={handleChange('newPassword')}
          margin="normal"
        />
        <br />
        <TextField
          id="newPasswordConfirm"
          type="password"
          label="Confirm New Password"
          className={classes.textField}
          value={values.newPasswordConfirm}
          onChange={handleChange('newPasswordConfirm')}
          margin="normal"
        />
        <br />
        {values.error && (
          <Typography component="p" color="error">
            <Icon color="error" className={classes.error}>
              error
            </Icon>
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
  );
}
