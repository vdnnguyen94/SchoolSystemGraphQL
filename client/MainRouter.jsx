import React from 'react';
import { Routes, Route } from 'react-router-dom';
//import React from 'react'
//import {Route, Routes} from 'react-router-dom'
import Home from './core/Home' 
import Users from './user/Users.jsx'
import Signup from './student/Signup.jsx'
import Signin from './lib/Signin.jsx'
import RegisterCourses from './courses/RegisterCourses.jsx'
import MyCourses from './courses/MyCourses.jsx'
import ChangeSection from './courses/ChangeSection.jsx'
import SignupByAdmin from './student/SignupbyAdmin.jsx';

import Profile from './user/Profile.jsx'
import Switch from 'react'
import PrivateRoute from './lib/PrivateRoute.jsx'
import EditProfile from './user/EditProfile.jsx'
import UpdatePassword from './user/UpdatePassword.jsx'
import NewSurvey from './survey/NewSurvey.jsx'
import Surveys from './survey/Surveys.jsx'
import MySurveys from './survey/MySurveys.jsx'
import Survey from './survey/Survey.jsx'
import PrivateSurvey from './survey/PrivateSurvey.jsx';
import EditSurvey from './survey/EditSurvey.jsx'
import EditSurveyDetails from './survey/EditSurveyDetails.jsx'
import Result from './survey/Result.jsx'
import NewQuestion from './question/NewQuestion.jsx'
import EditQuestion from './question/EditQuestion.jsx'
import PasswordReset from './user/PasswordReset.jsx'
//import NewSurvey from './survey/NewSurvey.jsx'


import Menu from './core/Menu' 
function MainRouter() {
        return (
          <div>
      <Menu/>
          
               
                        
                        <Routes>
  <Route path="" element={<Home />} /> 
  <Route path="/" element={<Home />} /> 
  <Route path="/users" element={<Users />} />
  <Route path="/signup" element={<Signup />} />
  <Route path="/signin" element={<Signin />} />
  <Route path="/student/:studentNumber/register" element={<RegisterCourses />} />
  <Route path="/mycourses/:studentNumber" element={<MyCourses />} />
  <Route path="/course/:courseId/student/:studentNumber/changeSection" element={<ChangeSection />} />
  <Route path="/admin/create-student" element={<SignupByAdmin />} />


  <Route path="/user/passwordreset" element={<PasswordReset />} />
  <Route path="/user/edit/:userId" element={<PrivateRoute><EditProfile /> </PrivateRoute>}/>
  <Route path="/user/:userId" element={<Profile />} />
  <Route path="/user/:userId/updatepassword" element={<PrivateRoute><UpdatePassword /> </PrivateRoute>} />
 
  <Route path="/user/:userId/newsurvey" element={<NewSurvey/>}/>
  <Route path="/surveys" element={<Surveys/>}/>
  <Route path="/mysurveys" element={<MySurveys/>}/>
  <Route path="/survey/:surveyId" element={<Survey />} />
  <Route path="/survey/:surveyId/edit" element={<EditSurvey />} />
  <Route path="/survey/:surveyId/editdetails" element={<EditSurveyDetails />} />
  <Route path="/survey/:surveyId/result" element={<Result />} />

  <Route path="/survey/:surveyId/createquestion" element={<NewQuestion />} />
  <Route path="/question/:surveyId/:questionId/edit" element={<EditQuestion />} />
</Routes>
</div>
  );
}

export default MainRouter;
