import { useState, useEffect } from "react";
//import { useParams } from 'react-router-dom';
import { useQuery } from "@apollo/client";
import { GET_STUDENT_BY_NUMBER } from "./queries";
import auth from "../lib/auth-helper";

const StudentDetail = () => {
  const [student, setStudent] = useState(null);
  const [message, setMessage] = useState("");
  const loggedInStudent = auth.isAuthenticated()?.student;
  const studentNumber = loggedInStudent ? loggedInStudent.studentNumber : null;

  // Fetch student details
  const { loading, error, data } = useQuery(GET_STUDENT_BY_NUMBER, {
    variables: { studentNumber },
    skip: !studentNumber, // Skip the query if studentNumber is not available
  });

  useEffect(() => {
    if (error) {
      setMessage(`Error: ${error.message}`);
    } else if (data && data.student) {
      setStudent(data.student);
    }
  }, [data, error]);

  if (loading) return <p>Loading student details...</p>;
  if (error) return <p style={{ color: "red" }}>{message}</p>;

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
        {message && <p style={{ color: "red" }}>{message}</p>}
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
