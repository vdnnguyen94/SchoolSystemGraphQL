/*
  MainRouter.jsx

  This file defines the main routing component for the React application.
  It uses the 'react-router-dom' library to handle different routes within the application.

  Components:
  - Home: Landing page component.
  - Users: Component for user-related functionality.
  - Signup: Component for user registration.
  - Signin: Component for user sign-in.
  - Profile: Component for displaying user profiles.
  - EditProfile: Component for editing user profiles (private route).
  - Menu: Component for rendering the application menu.

  Route Definitions:
  - "/" : Home page.
  - "/users" : User-related functionality.
  - "/signup" : User registration page.
  - "/signin" : User sign-in page.
  - "/user/edit/:userId" : Private route for editing user profiles.
  - "/user/:userId" : Route for displaying user profiles.

  PrivateRoute:
  - The 'PrivateRoute' higher-order component ensures that the 'EditProfile' route
    is accessible only for authenticated users.

  Note: Ensure that this component is wrapped by the 'BrowserRouter' higher-level component
        in the application's entry point.

  Clean-Up Notes:
  - Unused imports like 'Switch' have been removed.
  - The component imports and route definitions are organized for better readability.
*/


import React from 'react';
import { Routes, Route } from 'react-router-dom';
//import React from 'react'
//import {Route, Routes} from 'react-router-dom'
import Home from './core/Home' 
import Users from './user/Users.jsx'
import Signup from './user/Signup.jsx'
import PasswordReset from './user/PasswordReset.jsx'
import Signin from './lib/Signin.jsx'
import Profile from './user/Profile.jsx'
import Switch from 'react'
import PrivateRoute from './lib/PrivateRoute.jsx'
import EditProfile from './user/EditProfile.jsx'
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
//import NewSurvey from './survey/NewSurvey.jsx'


import Menu from './core/Menu' 
function MainRouter() {
        return (
          <div>
      <Menu/>
          
               
                        
                        <Routes>
  <Route path="/" element={<Home />} /> 
  <Route path="/users" element={<Users />} />
  <Route path="/signup" element={<Signup />} />
  <Route path="/signin" element={<Signin />} />
  <Route path="/passwordreset" element={<PasswordReset />} />
  <Route path="/user/edit/:userId" element={<PrivateRoute><EditProfile /> </PrivateRoute>}/>
  <Route path="/user/:userId" element={<Profile />} />

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
