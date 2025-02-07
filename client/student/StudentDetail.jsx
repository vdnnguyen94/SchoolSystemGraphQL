import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getStudentByNumber } from './api-student';
import auth from '../lib/auth-helper';
const StudentDetail = () => {

  const [student, setStudent] = useState(null);
  const [message, setMessage] = useState('');
  const loggedInStudent = auth.isAuthenticated()?.student;
  const studentNumber = loggedInStudent ? loggedInStudent.studentNumber : null;
  // Fetch student details
  useEffect(() => {
    getStudentByNumber(studentNumber).then((data) => {
      if (data.error) {
        setMessage(`Error: ${data.error}`);
      } else {
        setStudent(data);
      }
    });
  }, [studentNumber]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
    }}>
      <div>
        <h2>Student Details</h2>
        
        {message && <p style={{ color: 'red' }}>{message}</p>}

        {student ? (
          <ul>
            <li><strong>Student Number:</strong> {student.studentNumber}</li>
            <li><strong>Name:</strong> {student.firstName} {student.lastName}</li>
            <li><strong>Email:</strong> {student.email}</li>
            <li><strong>Address:</strong> {student.address}</li>
            <li><strong>City:</strong> {student.city}</li>
            <li><strong>Phone Number:</strong> {student.phoneNumber}</li>
            <li><strong>Program:</strong> {student.program}</li>
            <li><strong>Hobbies:</strong> {student.hobbies}</li>
            <li><strong>Tech Skills:</strong> {student.techSkills}</li>
            <li><strong>Admin:</strong> {student.isAdmin ? 'Yes' : 'No'}</li>
          </ul>
        ) : (
          <p>Loading student details...</p>
        )}
      </div>
    </div>
  );
};

export default StudentDetail;
