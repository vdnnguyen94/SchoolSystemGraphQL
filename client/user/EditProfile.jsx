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

import { read, update } from './api-user';

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

export default function EditProfile({ match }) {
  const classes = useStyles();
  const { userId } = useParams();
  const [values, setValues] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    username: '',
    email: '',
    open: false,
    error: '',
    redirectToProfile: false,
  });
  const jwt = auth.isAuthenticated();

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    read(
      {
        userId: userId,
      },
      { t: jwt.token },
      signal
    ).then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          firstName: data.firstName,
          lastName: data.lastName,
          companyName: data.companyName,
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
      firstName: values.firstName || undefined,
      lastName: values.lastName || undefined,
      companyName: values.companyName || undefined,
    };
    update(
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
          userId: data._id,
          redirectToProfile: true,
        });
      }
    });
  };

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  if (values.redirectToProfile) {
    return <Navigate to={'/user/' + values.userId} />;
  }
  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h6" className={classes.title}>
          Edit Profile
        </Typography>
        <TextField
          id="firstName"
          label="First Name"
          className={classes.textField}
          value={values.firstName}
          onChange={handleChange('firstName')}
          margin="normal"
        />
        <br />
        <TextField
          id="lastName"
          label="Last Name"
          className={classes.textField}
          value={values.lastName}
          onChange={handleChange('lastName')}
          margin="normal"
        />
        <br />
        <TextField
          id="companyName"
          label="Company Name"
          className={classes.textField}
          value={values.companyName}
          onChange={handleChange('companyName')}
          margin="normal"
        />
        <br />
        <TextField
          id="username"
          label="Username"
          disabled="disabled"
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
          disabled="disabled"
          value={values.email}
          InputProps={{
            readOnly: true,
          }}
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
          Submit
        </Button>
      </CardActions>
    </Card>
  );
}
