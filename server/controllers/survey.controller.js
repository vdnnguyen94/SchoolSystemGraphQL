import Survey from '../models/survey.model.js';
import extend from 'lodash/extend.js';
import errorHandler from './error.controller.js';
import authCtrl from './auth.controller.js';
import User from '../models/user.model.js';

const create = async (req, res) => {
  try {
    console.log(req.body);
    // Check for authentication
    let user= req.profile;
    //let owner = user._id;

    // Create a new survey object
    const survey = new Survey({
      name: req.body.name,
      owner: user,
      dateExpire: req.body.dateExpire,
    });

    // Save the survey to the database
    await survey.save();

    res.status(201).json({
      message: 'Survey created successfully.',
      survey,
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const updateExpired = async () => {
  try {
    // Get all surveys with a dateExpire less than today
    const expiredSurveys = await Survey.find({
      dateExpire: { $lt: new Date() }, //$lt is less than current date
      status: { $ne: 'EXPIRED' }, //$ne not exlcude the 'EXPIRED'
    });

    // Update the status to EXPIRED for each expired survey
    for (const survey of expiredSurveys) {
      survey.status = 'EXPIRED';
      await survey.save();
    }

    } catch (error) {
      console.error('Error updating expired surveys:', error);
      return res.status(400).json({
        error: 'Error updating expired surveys:',
      });
    }
};

const list = async (req, res) => {
  await updateExpired(); // Wait for updateExpired to complete
  try {
    let surveys = await Survey.find({ status: 'ACTIVE' }).populate({
      path: 'owner',
      select: 'username firstName lastName email',
    });
    res.json(surveys);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};
const listMySurveys = async (req, res) => {
  try {
    await updateExpired();
    let user= req.profile;
    const ownerId = user._id;
    const surveys = await Survey.find({ owner: ownerId }).populate({
      path: 'owner',
      select: 'username firstName lastName email',
    });
    res.json(surveys);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};
//copy from User
const surveyByID = async (req, res, next, id) => {
  try {
    let survey = await Survey.findById(id).populate('owner');
    if (!survey)
      return res.status(400).json({
        error: 'Survey not found, check ID',
      });
    req.survey = survey;
    next();
  } catch (err) {
    return res.status(400).json({
      error: 'Could not retrieve user',
    });
  }
};

const activate = async (req, res) => {
  // Update the status to 'ACTIVE'
  try {
    const survey = req.survey;
    survey.status = 'ACTIVE';
    await survey.save();
    return res.status(200).json({
      message: 'Survey Activated Successfully.',
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};
const inactivate = async (req, res) => {
  // Update the status to 'INACTIVE'
  try {
    const survey = req.survey;
    survey.status = 'INACTIVE';
    await survey.save();
    return res.status(200).json({
      message: 'Survey Inactivated Successfully.',
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};
const update = async (req, res) => {
  try {
    let survey = req.survey;
    survey = extend(survey, req.body);
    if(req.body.dateExpire){survey.status = 'ACTIVE';}
    await survey.save();
    res.json({
      message: 'Survey Updated Successfully',
      survey,
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};
const remove = async (req, res) => {
  try {
    let survey = req.survey;
    let deletedSurvey = await survey.deleteOne();
    res.json({
      message: 'Your Survey has been successfully removed',
      survey: deletedSurvey,
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};
const isOwner = (req, res, next) => {
  //const survey = req.profile;

  // Check if the authenticated user is the owner of the survey
  //const isOwner = survey && req.auth && survey.owner.equals(req.auth._id);
  const isOwner = req.survey && req.auth && req.survey.owner._id == req.auth._id
  if (!isOwner) {
    return res.status(403).json({
      error: "User is not authorized"
    });
  }

  next();
};
const read = (req, res) => {
  return res.json(req.survey);
};
export default {create, updateExpired, list, listMySurveys, surveyByID, read, activate, inactivate, update, remove, isOwner};
