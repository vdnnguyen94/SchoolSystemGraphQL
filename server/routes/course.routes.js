import express from 'express';
import authCtrl from '../controllers/auth.controller.js';
import studentCtrl from '../controllers/student.controller.js';
import courseCtrl from '../controllers/course.controller.js';


const router = express.Router();

// **List all courses & create a course**
router.route('/api/courses')
  .get(courseCtrl.listAllCourse) 
  .post(courseCtrl.create);

// **Get**
router.route('/api/courses/:courseId')
  .get(courseCtrl.read)  
  .post(authCtrl.requireSignin, authCtrl.isAdmin, courseCtrl.updateCourse); 

router.route('/api/student/:studentNumber/course/:courseId')
  .get(courseCtrl.register)
  .post(authCtrl.requireSignin, courseCtrl.changeSection)
  .put(authCtrl.requireSignin, courseCtrl.dropCourse);
router.route('/api/courses/student/:studentNumber')
  .get(courseCtrl.listCoursesByStudent);  
router.route('/api/courses/unregistered/:studentNumber')
  .get(courseCtrl.listUnregisteredCourses);
router.param('studentNumber', studentCtrl.studentByStudentNumber);
router.param('courseId', courseCtrl.courseByID);

export default router;
