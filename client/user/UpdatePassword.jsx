import React, { useState, useEffect } from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import { makeStyles } from '@material-ui/core/styles';
import auth from '../lib/auth-helper';
import { Navigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

import { read, updatePassword } from './api-user';

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 600,
    margin: 'auto',
    textAlign: 'center',
    marginTop: theme.spacing(5),
    paddingBottom: theme.spacing(2),
  },
  title: {
    margin: theme.spacing(2),
    color: theme.palette.protectedTitle,
  },
  error: {
    verticalAlign: 'middle',
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
  readOnlyField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 300,
    backgroundColor: theme.palette.background.default,
  },
}));

export default function UpdatePassword() {
  const classes = useStyles();
  const { userId } = useParams();
  const [values, setValues] = useState({
    username: '',
    email: '',
    oldPassword: '',
    newPassword: '',
    newPasswordConfirm: '',
    error: '',
    redirectToProfile: false,
  });
  const jwt = auth.isAuthenticated();

  useEffect(() => {
    const abortController = new AbortController();

    read(
      {
        userId: userId,
      },
      { t: jwt.token }
    ).then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          username: data.username,
          email: data.email,
        });
      }
    });

    return function cleanup() {
      abortController.abort();
    };
  }, [userId]);

  const clickSubmit = () => {
    const user = {
      oldPassword: values.oldPassword || undefined,
      newPassword: values.newPassword || undefined,
      newPasswordConfirm: values.newPasswordConfirm || undefined,
    };
    updatePassword(
      {
        userId: userId,
      },
      {
        t: jwt.token,
      },
      user
    ).then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          redirectToProfile: true,
        });
      }
    });
  };

  if (values.redirectToProfile) {
    return <Navigate to={'/user/' + userId} />;
  }

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h6" className={classes.title}>
          Update Password
        </Typography>
        <TextField
          id="username"
          label="Username"
          disabled
          value={values.username}
          InputProps={{
            readOnly: true,
          }}
          margin="normal"
        />
        <br />
        <TextField
          id="email"
          label="Email"
          disabled
          value={values.email}
          InputProps={{
            readOnly: true,
          }}
          margin="normal"
        />
        <br />
        <TextField
          id="oldPassword"
          label="Old Password"
          type="password"
          className={classes.textField}
          value={values.oldPassword}
          onChange={(e) => setValues({ ...values, oldPassword: e.target.value })}
          margin="normal"
        />
        <br />
        <TextField
          id="newPassword"
          label="New Password"
          type="password"
          className={classes.textField}
          value={values.newPassword}
          onChange={(e) => setValues({ ...values, newPassword: e.target.value })}
          margin="normal"
        />
        <br />
        <TextField
          id="newPasswordConfirm"
          label="Confirm New Password"
          type="password"
          className={classes.textField}
          value={values.newPasswordConfirm}
          onChange={(e) => setValues({ ...values, newPasswordConfirm: e.target.value })}
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
          Update Password
        </Button>
      </CardActions>
    </Card>
  );
}
