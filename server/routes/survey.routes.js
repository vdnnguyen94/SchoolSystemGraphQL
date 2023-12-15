import express from 'express';
import surveyCtrl from '../controllers/survey.controller.js';
import authCtrl from '../controllers/auth.controller.js';
import userCtrl from '../controllers/user.controller.js';
import submitCtrl from '../controllers/completedSurvey.controller.js';
const router = express.Router();

router.route('/api/surveys')
  .get(surveyCtrl.list)

router.route('/api/surveys/:surveyId')
  .get(surveyCtrl.read)  
  .post(authCtrl.requireSignin, surveyCtrl.isOwner, surveyCtrl.update)
  .delete(authCtrl.requireSignin, surveyCtrl.isOwner, surveyCtrl.remove);
router.route('/api/surveys/by/:userId')
  .post(authCtrl.requireSignin, surveyCtrl.create)
  .get(authCtrl.requireSignin, surveyCtrl.listMySurveys)
router.route('/api/surveys/:surveyId/activate')
  .put(authCtrl.requireSignin, surveyCtrl.isOwner, surveyCtrl.activate);
router.route('/api/surveys/:surveyId/inactivate')
  .put(authCtrl.requireSignin, surveyCtrl.isOwner, surveyCtrl.inactivate);
router.route('/api/surveys/:surveyId/submit')
  .post(authCtrl.requireSignin, submitCtrl.notCompleteSurvey,submitCtrl.updateSurveyResults);
router.route('/api/surveys/:surveyId/check')
  .get(authCtrl.requireSignin, submitCtrl.completedSurvey);  
router.route('/api/surveys/:surveyId/downloadresult')
  .get(authCtrl.requireSignin, surveyCtrl.isOwner, submitCtrl.downloadSurveyResult);
router.param('surveyId', surveyCtrl.surveyByID);
router.param('userId', userCtrl.userByID);
export default router;
