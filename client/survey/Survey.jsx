import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, Typography, Button, TextField, Radio, RadioGroup, FormControlLabel } from '@material-ui/core';
import {Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from'@material-ui/core';
import { Link, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import auth from '../lib/auth-helper';
import { listSurveyQuestions} from '../question/api-question';
import { surveyByID } from './api-survey';
import { checkCompletedSurvey, updateSurveyResult } from '../surveysubmit/api-submit';

const useStyles = makeStyles((theme) => ({
  card: {
    width: '60%',
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
  errorText: {
    color: 'red',
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: theme.spacing(2),
  },
  button: {
    marginRight: theme.spacing(2),
  },
  questionsContainer: {
    marginTop: theme.spacing(3),
  },
  questionCard: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(2),
    border: '1px solid #ccc',
  },
  radioLabel: {
    display: 'block',
    marginBottom: theme.spacing(1),
  },
  radioGroup: {
    paddingLeft: 20,
  },
}));

const MySurveys = () => {
  const classes = useStyles();
  const jwt = auth.isAuthenticated();
  const { surveyId } = useParams();
  const [currentSurvey, setCurrentSurvey] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);
  const [completedSurvey, setCompletedSurvey] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [validationError, setValidationError] = useState(null);

  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false)
  };

  const handleAnswerChange = (questionId, answer) => {
    setUserAnswers((prevAnswers) => {
      const updatedAnswers = { ...prevAnswers };
  
      // Check question type and handle answer accordingly
      const question = questions.find((q) => q._id === questionId);
  
      if (question) {
        if (question.questionType === 'MC') {
          // For MC questions, answer is the index of the selected option
          updatedAnswers[questionId] = parseInt(answer);
        } else if (question.questionType === 'TF') {
          // For TF questions, answer is a string
          updatedAnswers[questionId] = answer;
        }
      }
      console.log(updatedAnswers);
      return updatedAnswers;
    });
  };
  const handleSubmit = () => {
    // Validate all text-fill questions have non-null answers
    const totalQuestions = questions.length;
    const textFillQuestions = questions.filter((question) => question.questionType === 'TF');
    const textFillAnswers = Object.values(userAnswers).filter((answer) => answer !== null && answer !== '');
    const allTextFillAnswered = totalQuestions === textFillAnswers.length;
    console.log(textFillQuestions);
    console.log(textFillAnswers);
    //Validate all multiple-choice questions have answers
    const mcQuestions = questions.filter((question) => question.questionType === 'MC');
    const mcAnswers = Object.values(userAnswers).filter((answer) => answer !== null);
    const allMCAnswered = totalQuestions=== mcAnswers.length;
    const finalCheck = totalQuestions === Object.keys(userAnswers).length;
    console.log(mcQuestions);
    console.log(mcAnswers);
    console.log('User Answers:', userAnswers);
    console.log(Object.keys(userAnswers).length);
    //Display results
    if (allTextFillAnswered && allMCAnswered && finalCheck) {
      console.log('User Answers:', userAnswers);
      setValidationError("");

    // Call the API to update survey results
      updateSurveyResult({ surveyId: surveyId },{ t: jwt.token }, userAnswers )
        .then(result => {
          if(result.error){
            console.log(result);
            console.log(jwt.token);
            console.log(surveyId);
            setValidationError(result.error)
          } else{
            setOpen(true);

          }
          
        })
        .catch(error => {
          console.error('Error updating survey results:', error);
          setValidationError('Error updating survey results. Please try again.');
        });
    } else {
      console.log('Validation failed. Please answer all questions.');
      setValidationError('Validation Failed. Please Answer All Questions.');
    }
  };
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const fetchSurveyDetails = async () => {
      try {
        const surveyData = await surveyByID({ surveyId: surveyId }, signal);

        if (surveyData.error) {
          setError(surveyData.error);
        } else {
          setCurrentSurvey(surveyData);
        }
      } catch (error) {
        console.error('Error in fetching survey details:', error);
        setError('Internal Server Error');
      }
    };

    const fetchSurveyQuestions = async () => {
      try {
        const questionsData = await listSurveyQuestions({ surveyId: surveyId }, signal);
        //console.log(questionsData);
        if (questionsData.error) {
          setError(questionsData.error);
        } else {
          setQuestions(questionsData);
        }
      } catch (error) {
        console.error('Error in fetching survey questions:', error);
        setError('Internal Server Error');
      }
    };
    const fetchCompletedSurvey = async () => {
      try {
        const result = await checkCompletedSurvey({ surveyId: surveyId }, { t: jwt.token });

        if (result.error) {
          setError(result.error);
        } else {
          setCompletedSurvey(result.answer);
        }
      } catch (error) {
        console.error('Error in fetching completed survey status:', error);
        setError('Internal Server Error');
      }
    };

    fetchSurveyDetails();
    fetchSurveyQuestions();
    fetchCompletedSurvey(); 

    return function cleanup() {
      abortController.abort();
    };
  }, [surveyId]);

  return (
    <div>
      <Card className={classes.card}>
        <CardContent>
          {error ? (
            <Typography variant="h5" className={classes.errorText}>
              {error}
            </Typography>
          ) : currentSurvey ? (
            <>
              <Typography variant="h5" className={classes.title}>
                Survey Details
              </Typography>
              <Typography className={classes.biggerText} color="primary" variant="contained">
                {currentSurvey.name}
              </Typography>
              {currentSurvey.dateExpire && (
                <Typography>
                  Expiration Date: {new Date(currentSurvey.dateExpire).toLocaleDateString()}
                </Typography>
              )}
              {!currentSurvey.dateExpire && (
                <Typography>NO EXPIRATION DATE</Typography>
              )}
              <Typography>
                Status: {currentSurvey.status}
              </Typography>
              <Typography>
                Owner: {currentSurvey.owner.firstName} {currentSurvey.owner.lastName} [
                {currentSurvey.owner.username}]
              </Typography>
              {jwt.user._id === currentSurvey.owner._id && (
                <div className={classes.buttonContainer}>
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    component={Link}
                    style={{ width: '180px' }}
                    to={`/survey/${surveyId}/createquestion`}
                  >
                    Create Question
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    component={Link}
                    style={{ width: '180px' }}
                    to={`/survey/${surveyId}/edit`}
                  >
                    Edit Survey
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    component={Link}
                    style={{ width: '180px' }}
                    to={`/survey/${surveyId}/result`}
          
                  >
                    Result
                  </Button>
                </div>
              )}

              <div className={classes.questionsContainer}>
                <Typography variant="h5" className={classes.title}>
                  Survey Questions
                </Typography>
                {questions.length === 0 ? (
                  <Typography variant="h6">There are no questions in this survey.</Typography>
                ) : (
                  questions.map((question) => (
                    <Card key={question._id} className={classes.questionCard}>

                      {/* Edit Question Button */}
                      {jwt.user._id === currentSurvey.owner._id && (
                        <Button
                          variant="contained"
                          color="primary"
                          className={classes.button}
                          component={Link}
                          to={`/question/${surveyId}/${question._id}/edit`}
                        >
                          Edit Question
                        </Button>
                      )}
                      <Typography variant="subtitle1">Question {question.questionOrder}: {question.name}</Typography>
                      
                      {question.questionType === 'MC' ? (
                        <RadioGroup>
                          {question.possibleAnswers.map((answer, index) => (
                            <FormControlLabel
                              key={index}
                              value={String(index)}
                              control={<Radio />}
                              label={answer}
                              onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                            />
                          ))}
                        </RadioGroup>
                      ) : (
                        <TextField
                          id={question._id}
                          label="Answer"
                          variant="outlined"
                          className={classes.textField}
                          onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                        />
                      )}

                    </Card>

                  )))}

                {questions.length > 0 && (
                  <Typography variant="h5" style={{ color: 'blue' }}>
                  {completedSurvey === 'No' ? (
                    <Button
                    variant="contained"
                    color="primary"
                    style={{ margin: '20px',fontSize: '1.2rem', fontWeight: 'bold', width: '200px' }}
                    className={classes.button}
                    onClick={handleSubmit}
                  >
                      Submit
                    </Button>
                  ) : (
                    'You have already submitted the survey.'
                  )}
                </Typography>)}
              {validationError && (
              <Typography variant="h4" style={{ color: 'red' }}>
                {validationError}
              </Typography>
            )}
              </div>

            </>
          ) : (
            <Typography variant="h5" className={classes.title}>
              Loading...
            </Typography>
          )}
        </CardContent>
      </Card>
      <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Survey</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Thank you for completing the survey!!!
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Link to="/surveys">
          <Button color="primary" autoFocus variant="contained" onClick={handleClose}>
            Go to Surveys
          </Button>
        </Link>
      </DialogActions>
    </Dialog>

    </div>
  );
};


export default MySurveys;
