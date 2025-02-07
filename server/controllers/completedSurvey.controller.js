import Survey from '../models/survey.model.js';
import Question from '../models/question.model.js';
import User from '../models/student.model.js';
import CompletedSurvey from '../models/completedSurvey.model.js';
import errorHandler from './error.controller.js';
import questionCtrl from './question.controller.js';
import authCtrl from './auth.controller.js';
import surveyCtrl from './survey.controller.js';

const updateSurveyResults = async (req, res) => {
  try {

    const survey = req.survey;
    const user = req.auth;
    // Check if all questions are answered
    const answeredQuestions = Object.keys(req.body);
    const surveyQuestions = await Question.find({ survey: survey._id });// Retrieve all questions associated with the survey from the database
    const surveyQuestionIds = surveyQuestions.map((question) => question._id.toString());// Extract the IDs of the survey questions as strings
    const allQuestionsAnswered = surveyQuestionIds.every((questionId) =>
      answeredQuestions.includes(questionId)
    );
    if (!allQuestionsAnswered) {
      return res.status(400).json({
        error: 'All questions must be answered.',
      });
    }

    // Update survey results based on user's answers
    for (const questionId in req.body) {
      const question = await Question.findById(questionId);
      if (question) {
        if (question.questionType === 'MC') {
          const answerIndex = parseInt(req.body[questionId]); // Using is 0 based index, 0,1,2,3,4 Like possibleAnswers[0]
          if (answerIndex >= 0 && answerIndex < 5) {
            question.surveyResults[answerIndex]++;
          }
        } else if (question.questionType === 'TF') {
          const userAnswer = req.body[questionId];
            question.surveyResult2.push(userAnswer);
        }
      }
      await question.save(); // Save the updated survey results
    }
    // Mark the survey as completed for the user
    const newCompletedSurvey = new CompletedSurvey({
      survey: survey._id,
      user: user._id,
    });
    await newCompletedSurvey.save();

    res.json({
      message: 'Survey results updated successfully.',
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};
const notCompleteSurvey = async (req, res, next) => {
  try {
    const completedSurvey = await CompletedSurvey.findOne({
      survey: req.survey._id,
      user: req.auth._id,
    });
    if (completedSurvey) {
      return res.status(400).json({
        error: 'You have already completed this survey.',
      });
    }
    next(); // Continue to the next middleware
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const completedSurvey = async (req, res) => {
  try {
    const survey = req.survey;
    console.log(survey._id);
    const user = req.auth;
    console.log(user._id);
    const completedSurvey = await CompletedSurvey.findOne({
      survey: survey._id,
      user: user._id,
    });
    if (completedSurvey) {
      return res.status(200).json({
        answer: 'Yes',
      });
    } else
    return res.status(200).json({
      answer: 'No',
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const downloadSurveyResult = async (req, res) => {
  try {
    const survey = req.survey;
    const surveyQuestions = await Question.find({ survey: survey._id });

    // Create an object containing survey and surveyQuestions
    const surveyData = {
      survey,
      surveyQuestions,
    };

    // Set the content type to JSON
    res.setHeader('Content-Type', 'application/json');

    // Set the content disposition to attachment to trigger download
    res.setHeader('Content-Disposition', 'attachment; filename=survey_result.json');

    // Send the JSON response with the survey data
    res.json(surveyData);
  } catch (err) {
    return res.status(400).json({
      error: "Issue from obtaining the file",
    });
  }
};;
export default {updateSurveyResults,notCompleteSurvey, completedSurvey, downloadSurveyResult};