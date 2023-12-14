import express from 'express';
import userCtrl from '../controllers/user.controller.js';
import authCtrl from '../controllers/auth.controller.js';

// Van Nguyen added updatePassword and resetPassword
const router = express.Router();

router.route('/api/users')
  .get(userCtrl.list)
  .post(userCtrl.create);

router.route('/api/users/:userId')
  .get(authCtrl.requireSignin, userCtrl.read)
  .put(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.update)
  .delete(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.remove);

// Add the new routes for updatePassword and resetPassword
router.route('/api/users/update-password/:userId')
  .post(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.updatePassword);

router.route('/api/users/resetpassword')
  .post(userCtrl.resetPassword);

// Include email and username parameters in the route paths
router.route('/api/users/email/:email')
  .get(userCtrl.checkEmail);

router.route('/api/users/username/:username')
  .get(userCtrl.checkUsername);

router.param('userId', userCtrl.userByID);

export default router;
