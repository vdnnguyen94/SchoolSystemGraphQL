import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {  Card,  CardContent, Typography,  TextField,  CardActions,  Button,  Dialog,  DialogTitle,  DialogContent,  DialogContentText, DialogActions,  FormControl, InputLabel, Select,MenuItem,
} from '@material-ui/core';
import { Link, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import auth from '../lib/auth-helper';
import { createQuestion, listSurveyQuestions } from './api-question';
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
    fontSize: 24,
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

const NewQuestion = () => {
  const classes = useStyles();
  const jwt = auth.isAuthenticated();
  const { surveyId } = useParams();
  const [error, setError] = useState(null);
  
  const [selectedType, setSelectedType] = useState('');
  const [numberOfAnswers, setNumberOfAnswers] = useState(2);
  const [currentSurvey, setCurrentSurvey] = useState(null);
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false)
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
    fetchSurveyDetails();


    return function cleanup() {
      abortController.abort();
    };
  }, [surveyId]);
  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

  const handleNumberOfAnswersChange = (event) => {
    setNumberOfAnswers(event.target.value);
  };

  const handleCreateQuestion = async () => {
    try {
      // Your create question logic here
      let questionData = {
        questionType: selectedType,
        name: document.getElementById('name').value,
      };

      if (selectedType === 'MC') {
        questionData.answerNum = numberOfAnswers;

        const possibleAnswers = [];
        for (let i = 1; i <= numberOfAnswers; i++) {
          const possibleAnswer = document.getElementById(`possibleAnswer${i}`).value;
          if (possibleAnswers.includes(possibleAnswer)) {
            setError('Each possibleAnswer must be unique. Duplicates are not allowed.');
            return; // Stop execution if duplicate is found
          }
          possibleAnswers.push(possibleAnswer);
        }

        questionData.possibleAnswers = possibleAnswers;
      }

      createQuestion({ surveyId: surveyId }, { t: jwt.token }, questionData)
      .then((response) => {
        if (response.error) {
          setError(response.error);
        } else {
          // Display success message or perform any other actions
          console.log('Question created successfully');
          console.log(response);
          setOpen(true);
          // Optionally, you can set a success message to display to the user
          // setSuccessMessage('Question created successfully');
        }
      })
      .catch((error) => {
        console.error('Error creating question:', error);
        setError('Internal Server Error');
      });
  } catch (error) {
    console.error('Error creating question:', error);
    setError('Internal Server Error');
  }
};
  const renderAnswerFields = () => {
    const answerFields = [];
    for (let i = 1; i <= numberOfAnswers; i++) {
      answerFields.push(
        <TextField
          key={`possibleAnswer${i}`}
          id={`possibleAnswer${i}`}
          label={`Possible Answer ${i}`}
          className={classes.textField}
        />
      );
    }
    return answerFields;
  };

  if (currentSurvey && jwt.user._id === currentSurvey.owner._id) {
    return (
    <div>
      <Card className={classes.card}>
        <CardContent className={classes.cardContent}>
          <Typography variant="h5" className={classes.errorText}>
            {error}
          </Typography>
          <Typography> SurveyID: {surveyId} {jwt.token}</Typography>
          <TextField id="name" label="What is the question?" className={classes.textField} />
          <div>
            <p>What type of question would you like to create?</p>
            <FormControl className={classes.formControl}>
              <InputLabel id="question-type-label">Question Type</InputLabel>
              <Select
                labelId="question-type-label"
                id="question-type"
                value={selectedType}
                onChange={handleTypeChange}
              >
                <MenuItem value="MC">Multiple Choice</MenuItem>
                <MenuItem value="TF">Text Field</MenuItem>
              </Select>
            </FormControl>
          </div>

          {selectedType === 'MC' && (
            <div>
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

              {renderAnswerFields()}
            </div>
          )}
        </CardContent>
          <Button variant="contained" color="primary" onClick={handleCreateQuestion}>
            Create a Question
          </Button>
      </Card>
      <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        <DialogContentText>
          Question is successfully created..!
        </DialogContentText>
      </DialogContent>
      <DialogActions>
      <Link to={`/survey/${surveyId}`}>
          <Button color="primary" autoFocus variant="contained" onClick={handleClose}>
            Go to Surveys
          </Button>
        </Link>
      </DialogActions>
    </Dialog>
    </div>
  );
} else {
  return (
  <div><Card className={classes.card}>
  <Typography variant="h4" style={{ color: 'red' }}>
  You are not the owner of this survey.
  </Typography>
  </Card></div>);
}};

export default NewQuestion;