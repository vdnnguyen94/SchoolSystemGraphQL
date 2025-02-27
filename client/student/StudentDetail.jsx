import { useState, useEffect } from "react";
//import { useParams } from 'react-router-dom';
import { useQuery, gql } from "@apollo/client";
import { GET_STUDENT_BY_NUMBER } from "./queries";
import auth from "../lib/auth-helper";

const IS_LOGGED_IN = gql`
  query {
    isLoggedIn{
      isLoggedIn
      studentNumber
    }
  }
`;

const StudentDetail = () => {

  const { data: loginData, loading: loginLoading, error: loginError } = useQuery(IS_LOGGED_IN);
  const studentNumber = loginData?.isLoggedIn?.studentNumber || null;
  console.log(studentNumber);
  // Fetch student details
  const { data: studentData, loading: studentLoading, error: studentError } = useQuery(GET_STUDENT_BY_NUMBER, {
    variables: { studentNumber: studentNumber },
    skip: !studentNumber, 
  });

  if (loginLoading) return <p>Checking authentication...</p>;
  if (loginError || !studentNumber) return <p style={{ color: "red" }}>You must be logged in to view student details.</p>;

  if (studentLoading) return <p>Loading student details...</p>;
  if (studentError) return <p style={{ color: "red" }}>Error: {studentError.message}</p>;

  const student = studentData?.student;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <div>
        <h2>Student Details</h2>
        {student ? (
          <ul>
            <li>
              <strong>Student Number:</strong> {student.studentNumber}
            </li>
            <li>
              <strong>Name:</strong> {student.firstName} {student.lastName}
            </li>
            <li>
              <strong>Email:</strong> {student.email}
            </li>
            <li>
              <strong>Address:</strong> {student.address}
            </li>
            <li>
              <strong>City:</strong> {student.city}
            </li>
            <li>
              <strong>Phone Number:</strong> {student.phoneNumber}
            </li>
            <li>
              <strong>Program:</strong> {student.program}
            </li>
            <li>
              <strong>Hobbies:</strong> {student.hobbies}
            </li>
            <li>
              <strong>Tech Skills:</strong> {student.techSkills}
            </li>
            <li>
              <strong>Admin:</strong> {student.isAdmin ? "Yes" : "No"}
            </li>
            <li>
              <strong>Registered Courses:</strong>
            </li>
            <ul>
              {student.courses.length === 0 ? (
                <li>No courses registered.</li>
              ) : (
                student.courses.map((course) => (
                  <li key={course.id}>
                    {course.courseName} ({course.courseCode}) - Semester:{" "}
                    {course.semester}, Section: {course.section}
                  </li>
                ))
              )}
            </ul>
          </ul>
        ) : (
          <p>Loading student details...</p>
        )}
      </div>
    </div>
  );
};

export default StudentDetail;
