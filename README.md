# Survey Web Application using Node.js and React TypeScript
https://surveyappvannguyen.onrender.com/

Welcome to the Survey Web Application! Below is an overview of the application's architecture, features, and how various challenges were addressed during development.

## Overview

The Survey Web Application is built using the MERN stack, incorporating MongoDB, Express, React, and Node.js. This platform empowers users to create and customize survey questions, including Multiple Choice, True/False, and Text Field options.

Users have the flexibility to set an expiration date for surveys or manage their state from Inactive to Active, ensuring that only Active Surveys (not expired) are displayed to users. Additionally, surveys can contain multiple questions tailored to the user's needs.

The application offers essential account management functionalities. Users can reset their password, update their password, and modify their profile name. However, it's important to note that the username and email cannot be changed.

### Technologies, Frameworks, and Tools

- MongoDB
- Render
- MERN stack
- JWT Token
- JWT Authentication
- RESTful API
- CRUD operations
- React TypeScript
- Express.js

### The Challenge

Implementing Node.js instead of TypeScript posed certain challenges, as TypeScript provides type checking and requires validation of objects before accessing variables. Managing survey questions and responses with varying structures (Multiple Choice, True/False, and Text Field Questions) also proved challenging. Ensuring data consistency and integrity became paramount, especially for multiple-choice questions.

## How I Solved It

Utilizing MongoDB and Mongoose, I implemented a robust data schema for survey questions. The model includes validations to ensure the integrity of data based on the question type.

For example, for multiple-choice questions (MC), the system enforces constraints such as the number of possible answers, their length, and the length of the survey results array.

This meticulous design guarantees a consistent and secure survey experience, preventing data discrepancies and enhancing the overall functionality of the application.

## Special Function: Download Survey Results

As the owner of a survey, you have the capability to download comprehensive survey results for in-depth data analysis. This feature provides a JSON file containing general survey information and detailed insights into each survey question.

This powerful tool empowers you to extract valuable data, facilitating informed decision-making and a deeper understanding of participant responses.

# <span style="color:red">START APPLICATION</span>

## Building Client React Application

cd client && yarn install && yarn build

## Building Server Application

cd .. && npm install && tsc

## Start the Application

npm run dev

#### Toonie-Solutions
COMP229 Group 1 Project
// go to the parent folder: yarn
// go to the client folder: yarn
// go to the client folder: yarn dev

#### IMPORTANT (second way)
// go to client folder: yarn
// then 'yarn build' in the client
// go to the parent folder node server.js
