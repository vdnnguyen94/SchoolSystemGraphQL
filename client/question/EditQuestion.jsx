import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {  Card,  CardContent, Typography,  TextField,  CardActions,  Button,  Dialog,  DialogTitle,  DialogContent,  DialogContentText, DialogActions,  FormControl, InputLabel, Select,MenuItem,
} from '@material-ui/core';
import { Link, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import auth from '../lib/auth-helper';
import { questionByID, removeQuestion, updateMCQuestion, updateQuestion, updateQuestionName} from './api-question';
import { surveyByID } from '../survey/api-survey';

const useStyles = makeStyles((theme) => ({
  card: {
    width: '70%',
    margin: '0 auto',
    marginTop: theme.spacing(3),
    padding: theme.spacing(2),
    textAlign: 'center',
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  surveyCard: {
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
    border: '1px solid #ccc',
  },
  biggerText: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    marginBottom: theme.spacing(2),
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
  textField: {
    width: '60%',
    marginBottom: theme.spacing(2),
  },
  select: {
    width: '60%',
    marginBottom: theme.spacing(2),
  },
  formControl: {
    width: '60%',
    marginBottom: theme.spacing(2),
  },
}));

const EditQuestion = () => {
  const classes = useStyles();
  const jwt = auth.isAuthenticated();
  const { questionId } = useParams();
  const { surveyId } = useParams();
  const [error, setError] = useState(null);
  const [question, setQuestion] = useState(null);
  const [open, setOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [newName, setNewName] = useState('');
  const [numberOfAnswers, setNumberOfAnswers] = useState(2);;
  const [possibleAnswers, setPossibleAnswers] = useState(Array.from({ length: 2 }, () => '')); 

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };
  const handleNumberOfAnswersChange = (event) => {
    setNumberOfAnswers(event.target.value);
  };

  const handlePossibleAnswerChange = (index, event) => {
    const updatedAnswers = [...possibleAnswers];
    updatedAnswers[index] = event.target.value;
    setPossibleAnswers(updatedAnswers);
  };
  const handleUpdateName = async () => {
    try {
      const updatedQuestion = await updateQuestionName(
        { surveyId: question.survey, questionId: questionId }, { t: jwt.token },newName
      );
      if (updatedQuestion.error) {
        setError(updatedQuestion.error);
      } else {
        setQuestion(updatedQuestion.question);
        setDialogMessage('Question has been updated.');
        setOpen(true);
      }
    } catch (error) {
      console.error('Error in updating question name:', error);
      setError('Internal Server Error');
    }
  };
  const handleUpdateMCQuestion = async () => {
    try {
      const updatedMCQuestion = await updateQuestion(
        { surveyId: question.survey, questionId: questionId },
        { t: jwt.token },       
        {
          name: newName,
          answerNum: numberOfAnswers, 
          possibleAnswers: possibleAnswers,
        }
      );
      if (updatedMCQuestion.error) {
        setError(updatedMCQuestion.error);
      } else {
        setQuestion(updatedMCQuestion.question);
        setDialogMessage('MC question has been updated.');
        setOpen(true);
      }
    } catch (error) {
      console.error('Error in updating MC question:', error);
      setError('Internal Server Error');
    }
  };
  const handleRemoveQuestion = async () => {
    try {
      const removedQuestion = await removeQuestion(
        { surveyId: question.survey, questionId: questionId },
        { t: jwt.token }
      );
      if (removedQuestion.error) {
        setError(removedQuestion.error);
      } else {
        setDialogMessage('Question has been removed.');
        setOpen(true);
      }
    } catch (error) {
      console.error('Error in removing question:', error);
      setError('Internal Server Error');
    }
  };
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    console.log(questionId);
    const fetchQuestionDetails = async () => {
      try {
        const questionData = await questionByID({ questionId: questionId }, signal);
        if (questionData.error) {
          setError(questionData.error);
        } else {
          setQuestion(questionData);
        }
      } catch (error) {
        console.error('Error in fetching question details:', error);
        setError('Internal Server Error');
      }
    };
    fetchQuestionDetails();

    return function cleanup() {
      abortController.abort();
    };
  }, [questionId]);

  return (
    <div>
      <Card className={classes.card}>
        <CardContent className={classes.cardContent}>
          <Typography variant="h5" className={classes.errorText}>
            {error}
          </Typography>
          {question ? (
            <>
              <Typography className={classes.biggerText} color="primary" variant="contained">
                Question Details
              </Typography>
              <Typography variant="subtitle1">
                TYPE: {question.questionType === 'MC' ? 'Multiple Choice' : 'Text Field'}
              </Typography>
              <Typography variant="subtitle1">Question: {question.name}</Typography>

              {question.questionType === 'MC' && (
                <>
                  <Typography variant="subtitle1">Number of Answers: {question.answerNum}</Typography>
                  <Typography variant="subtitle1">Possible Answers:</Typography>
                  <ul>
                    {question.possibleAnswers.map((answer, index) => (
                      <li key={index}>{answer}</li>
                    ))}
                  </ul>
                  <Typography style={{ font: '20px', color: 'red' }}>
                    Note: You can update question name, answers, or delete this question. Answers will be changed!
                  </Typography>
                  <TextField
                    className={classes.textField}
                    label="New Question Name"
                    variant="outlined"
                    value={newName}
                    onChange={handleNameChange}
                  />
                  <FormControl className={classes.formControl}>
                  <InputLabel id="number-of-answers-label">Number of Answers</InputLabel>
                  <Select
                    labelId="number-of-answers-label"
                    id="number-of-answers"
                    value={numberOfAnswers}
                    onChange={handleNumberOfAnswersChange}
                  >
                    {[2, 3, 4, 5].map((number) => (
                      <MenuItem key={number} value={number}>
                        {number}
                      </MenuItem>
                    ))}
                  </Select>
                  </FormControl>
                  {[...Array(numberOfAnswers)].map((_, index) => (
                  <TextField
                    key={`possibleAnswer${index + 1}`}
                    id={`possibleAnswer${index + 1}`}
                    label={`Possible Answer ${index + 1}`}
                    className={classes.textField}
                    value={possibleAnswers[index]}
                    onChange={(event) => handlePossibleAnswerChange(index, event)}
                  />
                  ))}


                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={handleUpdateName}
                    style={{ width: '200px' }}
                  >
                    Update Name
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={handleUpdateMCQuestion}
                    style={{ width: '200px' }}
                  >
                    Update Answers
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    className={classes.button}
                    onClick={handleRemoveQuestion}
                    style={{ width: '200px' }}
                  >
                    Remove Question
                  </Button>
                </>
              )}
              {question.questionType === 'TF' && (
                <>
                  <Typography style={{ font: '20px',color: 'red'} }>Note: You can change question name or delete this question!! Answers won't be changed!!</Typography>
                  <TextField
                    className={classes.textField}
                    label="New Question Name"
                    variant="outlined"
                    value={newName}
                    onChange={handleNameChange}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={handleUpdateName}
                    style={{ width: '200px' }}
                  >
                    Update Name
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    className={classes.button}
                    onClick={handleRemoveQuestion}
                    style={{ width: '200px' }}
                  >
                    Remove Question
                  </Button>
                </>
              )}
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
          <DialogContentText>{dialogMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Link to={`/survey/${surveyId}`}>
            <Button color="primary" autoFocus variant="contained" onClick={handleClose}>
              Go to Survey
            </Button>
          </Link>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EditQuestion;