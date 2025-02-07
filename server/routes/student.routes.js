import express from 'express';
import studentCtrl from '../controllers/student.controller.js';
import authCtrl from '../controllers/auth.controller.js';

const router = express.Router();

router.route('/api/students')
  .get(studentCtrl.list)
  .post(studentCtrl.create);

router.route('/api/students/:studentNumber')
  .get(studentCtrl.read)
  .put(authCtrl.requireSignin, authCtrl.hasAuthorization, studentCtrl.update)
  .delete(authCtrl.requireSignin, authCtrl.hasAuthorization, studentCtrl.remove);

// Routes for updating and resetting password
router.route('/api/students/:studentNumber/updatepassword')
  .post(authCtrl.requireSignin, authCtrl.hasAuthorization, studentCtrl.updatePassword);

router.route('/api/students/resetpassword')
  .post(studentCtrl.resetPassword);

// Check if email or studentNumber exists
router.route('/api/students/email/:email')
  .get(studentCtrl.checkEmail);

router.route('/api/students/studentNumber/:studentNumber')
  .get(studentCtrl.checkStudentNumber);

// Admin routes to update, remove, or reset a student's password
router.route('/api/admin/students/:studentNumber')
  .put(authCtrl.requireSignin, authCtrl.isAdmin, studentCtrl.update) // Admin update
  .delete(authCtrl.requireSignin, authCtrl.isAdmin, studentCtrl.remove); // Admin remove

router.route('/api/admin/students/:studentNumber/resetpassword')
  .post(authCtrl.requireSignin, authCtrl.isAdmin, studentCtrl.resetPassword); // Admin reset password


router.param('studentNumber', studentCtrl.studentByStudentNumber);

export default router;
