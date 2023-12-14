import express from 'express';
import questionCtrl from '../controllers/question.controller.js';
import authCtrl from '../controllers/auth.controller.js';
import surveyCtrl from '../controllers/survey.controller.js';
const router = express.Router();


router.route('/api/surveys/questions/:surveyId')
  .post(authCtrl.requireSignin, surveyCtrl.isOwner , questionCtrl.create)
  .get(questionCtrl.list)
  .delete(authCtrl.requireSignin, surveyCtrl.isOwner, questionCtrl.removeAll);

router.route('/api/question/:questionId/get')
  .get(questionCtrl.read);
router.route('/api/question/:questionId/MC')
  .post(authCtrl.requireSignin, authCtrl.hasAuthorization, questionCtrl.updateMC);
// Route to delete a specific question
router.route('/api/question/:surveyId/:questionId')
  .post(authCtrl.requireSignin, surveyCtrl.isOwner, questionCtrl.update)
  .delete(authCtrl.requireSignin, surveyCtrl.isOwner, questionCtrl.remove);
router.route('/api/question/:surveyId/:questionId/updateName')
  .post(authCtrl.requireSignin, surveyCtrl.isOwner, questionCtrl.updateName);
// Middleware to load questions associated with a survey
router.param('surveyId', surveyCtrl.surveyByID);
router.param('questionId', questionCtrl.questionByID);


export default router;
