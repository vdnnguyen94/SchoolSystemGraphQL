import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, Typography, TextField, CardActions, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, FormControlLabel, RadioGroup, Radio } from '@material-ui/core';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import auth from '../lib/auth-helper';
import { useParams } from 'react-router-dom';
import { create } from './api-survey.js';


const useStyles = makeStyles((theme) => ({
    card: {
      width: '55%', 
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
  
  export default function NewSurvey() {
    const { userId } = useParams();
    const classes = useStyles();
    const jwt = auth.isAuthenticated();

    const [values, setValues] = useState({
      name: '',
      expireDate: null,
      setExpireDate: false,
      error: '',
      message: '',
    });
  
    const [open, setOpen] = useState(false);
  
    const handleChange = (name) => (event) => {
      setValues({ ...values, [name]: event.target.value });
    };
  
    const handleExpireDateChange = (event) => {
      setValues({ ...values, expireDate: event.target.value });
    };
  
    const handleSetExpireDateChange = (event) => {
      setValues({
        ...values,
        setExpireDate: event.target.value === 'yes',
        expireDate: null, // Reset expireDate when user toggles the choice
      });
    };
  
    const handleClose = () => {
      setOpen(false);
    };
  
    const validateForm = () => {
      if (!values.name) {
        setValues({ ...values, error: 'Survey name is required.' });
        return false;
      }
  
      if (values.setExpireDate && (!values.expireDate || new Date(values.expireDate) - new Date() < 3 * 24 * 60 * 60 * 1000)) {
        setValues({ ...values, error: 'Expiration date must be set and at least 3 days from now.' });
        return false;
      }
  
      return true;
    };
  
    const clickSubmit = () => {
      if (!validateForm()) {
        return;
      }
  
      const survey = {
        name: values.name || undefined,
        dateExpire: values.setExpireDate ? values.expireDate : undefined,
      };
      // Log the survey object to the console
      console.log(survey);
      // Perform the API call to create the survey
      create({ userId: userId }, { t: jwt.token }, survey).then((data) => {
        if (data.error) {
          setValues({ ...values, error: data.error, message: '' });
        } else {
          setValues({ ...values, error: '', message: data.message });
          setOpen(true);
        }
      });
    };
  
    return (
      <div>
        <Card className={classes.card}>
          <CardContent>
            <Typography variant="h6" className={classes.title}>
              Create Survey
            </Typography>
  
            <TextField
              id="name"
              label="Survey Name"
              className={classes.textField}
              value={values.name}
              onChange={handleChange('name')}
              margin="normal"
            />

            <Typography>
              Would you like to set an expiration date for your survey?
              <RadioGroup
                aria-label="SetExpireDate"
                name="setExpireDate"
                value={values.setExpireDate ? 'yes' : 'no'}
                onChange={handleSetExpireDateChange}
              >
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
            </Typography>
  
            {values.setExpireDate && (
              <Typography>
                Expire Date
              <TextField
                id="expireDate"
                type="date"
                className={classes.textField}
                value={values.expireDate}
                onChange={handleExpireDateChange}
                margin="normal"
              />
              </Typography>
            )}
            {values.message && (
              <Typography variant="body2" className={classes.success}>
                {values.message}
              </Typography>
            )}
            {values.error && (
              <Typography variant="body2" className={classes.error}>
                {values.error}
              </Typography>
            )}
          </CardContent>
          <CardActions>
            <Button color="primary" variant="contained" onClick={clickSubmit} className={classes.submit}>
              Create Survey
            </Button>
          </CardActions>
        </Card>
  
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>New Survey</DialogTitle>
          <DialogContent>
            <DialogContentText>New survey successfully created.</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Link to="/surveys">
              <Button color="primary" autoFocus variant="contained" onClick={handleClose}>
                Navigate to My Surveys
              </Button>
            </Link>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
  
  NewSurvey.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
  };