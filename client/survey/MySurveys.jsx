import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import auth from '../lib/auth-helper';
import { listMySurveys } from './api-survey';

const useStyles = makeStyles((theme) => ({
  card: {
    width: '70%',
    margin: '0 auto',
    marginTop: theme.spacing(3),
    padding: theme.spacing(2),
    textAlign: 'center',
  },
  title: {
    fontSize: 18,
    marginBottom: theme.spacing(2),
  },
  surveyCard: {
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
    border: '1px solid #ccc',
  },
  biggerText: {
    fontSize: 24, 
    fontWeight: 'bold', 
  },
}));

const MySurveys = () => {
  const classes = useStyles();
  const [surveys, setSurveys] = useState([]);
  const jwt = auth.isAuthenticated();

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    const fetchSurveys = async () => {
      try {
        const data = await listMySurveys({userId: jwt.user._id}, {t: jwt.token}, signal);
        setSurveys(data);
      } catch (error) {
        console.error('Error in fetching surveys:', error);
      }
    };
  
    fetchSurveys();
  }, [jwt]);

  return (
    <div>
      <Card className={classes.card}>
        <CardContent>
          {surveys.map((survey) => (
            <Card key={survey._id} className={classes.surveyCard}>
              <Link to={`/survey/${survey._id}`} style={{ textDecoration: 'none' }}>
                <Typography className={classes.biggerText} color="primary" variant="contained">
                  {survey.name}
                </Typography>
              </Link>
              {survey.dateExpire && (
                <Typography>
                  Expiration Date: {new Date(survey.dateExpire).toLocaleDateString()}
                </Typography>
              )}
              {!survey.dateExpire && (
                <Typography>
                  NO EXPIRATION DATE
                </Typography>
              )}
              <Typography>
                Owner: {survey.owner.firstName} {survey.owner.lastName} [{survey.owner.username}]
              </Typography>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

MySurveys.propTypes = {
  // Add any prop types if needed
};

export default MySurveys;
