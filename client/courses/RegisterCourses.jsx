import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, Typography, Button } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import auth from '../lib/auth-helper';
import { listUnregisteredCourses, registerCourse } from './api-course';

const useStyles = makeStyles((theme) => ({
  card: {
    width: '70%',
    margin: '0 auto',
    marginTop: theme.spacing(3),
    padding: theme.spacing(2),
    textAlign: 'center',
  },
  title: {
    fontSize: 18,
    marginBottom: theme.spacing(2),
  },
  courseCard: {
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
    border: '1px solid #ccc',
  },
  registerButton: {
    marginTop: theme.spacing(1),
  },
}));

const RegisterCourses = () => {
  const classes = useStyles();
  const { studentNumber } = useParams();  // Extract studentNumber from the route
  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState('');
  const jwt = auth.isAuthenticated();

  // Fetch unregistered courses
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    listUnregisteredCourses({ studentNumber }, signal).then((data) => {
      if (data.error) {
        console.error('Error fetching unregistered courses:', data.error);
      } else {
        setCourses(data);
      }
    });

    return () => abortController.abort();
  }, [studentNumber]);

  // Handle course registration
  const handleRegister = (courseId) => {
    registerCourse({ studentNumber, courseId }, jwt).then((data) => {
      if (data.error) {
        setMessage(`Error: ${data.error}`);
      } else {
        setMessage('Successfully registered for the course!');

        // Refresh the list after successful registration
        listUnregisteredCourses({ studentNumber }).then((updatedCourses) => {
          setCourses(updatedCourses);
        });
      }
    });
  };

  return (
    <div>
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h6" className={classes.title}>
            Unregistered Courses for Student {studentNumber}
          </Typography>

          {message && (
            <Typography style={{ color: 'green', fontWeight: 'bold' }}>{message}</Typography>
          )}

          {courses.length === 0 ? (
            <Typography>No available courses to register.</Typography>
          ) : (
            courses.map((course) => (
              <Card key={course._id} className={classes.courseCard}>
                <Typography variant="h6">{course.courseName} ({course.courseCode})</Typography>
                <Typography>Semester: {course.semester} | Section: {course.section}</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.registerButton}
                  onClick={() => handleRegister(course._id)}
                >
                  Register
                </Button>
              </Card>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterCourses;
