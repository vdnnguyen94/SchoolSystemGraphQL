import React from 'react';
import { Routes, Route } from 'react-router-dom';
//import React from 'react'
//import {Route, Routes} from 'react-router-dom'
import Home from './core/Home' 
import Signup from './student/Signup.jsx'
import Signin from './lib/Signin.jsx'
import RegisterCourses from './courses/RegisterCourses.jsx'
import MyCourses from './courses/MyCourses.jsx'
import AllCourses from './courses/AllCourses.jsx';
import CourseDetails from './courses/CourseDetails.jsx';
import ChangeSection from './courses/ChangeSection.jsx'
//import StudentSignUp from './student/StudentSignup.jsx';
import Students from './student/Students.jsx';
import StudentDetail from './student/StudentDetail.jsx';
import SignupAdmin from './student/SignupAdmin.jsx';
import Switch from 'react'
import PrivateRoute from './lib/PrivateRoute.jsx'


import Menu from './core/Menu' 
function MainRouter() {
        return (
          <div>
      <Menu/>
          
               
                        
                        <Routes>
  <Route path="" element={<Home />} /> 
  <Route path="/" element={<Home />} /> 
  <Route path="/signup" element={<Signup />} />
  <Route path="/signin" element={<Signin />} />
  <Route path="/student/:studentNumber/register" element={<RegisterCourses />} />
  <Route path="/admin/students" element={<Students />} />
  <Route path="/mycourses/:studentNumber" element={<MyCourses />} />
  <Route path="/course/:courseId/student/:studentNumber/changeSection" element={<ChangeSection />} />
  <Route path="/course/:courseId" element={<CourseDetails />} />
  <Route path="/admin/create-student" element={<SignupAdmin/>} />
  <Route path="/myAccount" element={<StudentDetail />} />
  <Route path="/admin/courses" element={<AllCourses />} />
  <Route path="/admin/create-course" element={<CreateCourse />} />

</Routes>
</div>
  );
}

export default MainRouter;
