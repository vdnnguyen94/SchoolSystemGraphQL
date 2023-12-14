import React, { useEffect, useState } from 'react';
import { Route, Navigate, useLocation, useParams } from 'react-router-dom';
import auth from '../lib/auth-helper';
import { surveyByID } from './api-survey';

const PrivateSurvey = ({ children }) => {
  const location = useLocation();
  const jwt = auth.isAuthenticated();
  const { surveyId } = useParams();
  const [currentSurvey, setCurrentSurvey] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const fetchData = async () => {
      try {
        const data = await surveyByID({ surveyId: surveyId }, signal);

        // Check if the component is still mounted before updating state
        if (!abortController.signal.aborted) {
          if (data && !data.error) {
            setCurrentSurvey(data);
          } else {
            console.error('Error fetching survey:', data.error);
          }
        }
      } catch (error) {
        console.error('Error in fetching survey:', error);
      }
    };

    fetchData();

    return () => {
      // Abort the request if the component is unmounted
      abortController.abort();
    };
  }, [surveyId]);

  return currentSurvey && jwt.user._id === currentSurvey.owner._id ? (
    children
  ) : (
    <Navigate to="/surveys" state={{ from: location }} replace />
  );
};

export default PrivateSurvey;
