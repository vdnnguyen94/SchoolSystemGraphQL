import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, Typography, Button} from '@material-ui/core';
import { useParams, useNavigate } from 'react-router-dom';
import auth from '../lib/auth-helper';
import { listCoursesByStudent, dropCourse } from './api-course';

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
  button: {
    margin: theme.spacing(1),
  },
}));

const MyCourses = () => {
  const classes = useStyles();
  const { studentNumber } = useParams(); 
  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState('');
  const jwt = auth.isAuthenticated();
  const navigate = useNavigate();

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    listCoursesByStudent({ studentNumber }, signal).then((data) => {
      if (data.error) {
        setMessage(`Error: ${data.error}`);
      } else if (data.length === 0) {
        setMessage('You are not registered for any courses.');
      } else {
        setCourses(data);
      }
    });

    return () => abortController.abort();
  }, [studentNumber]);

  // Handle Drop Course
  const handleDropCourse = (courseId) => {
    dropCourse({ studentNumber, courseId }, {t: jwt.token}).then((data) => {
      if (data.error) {
        setMessage(`Error: ${data.error}`);
      } else {
        alert('Course dropped successfully!');
        // Refresh the course list
        listCoursesByStudent({ studentNumber }).then((updatedCourses) => {
          setCourses(updatedCourses);
        });
      }
    });
  };

  // Handle Change Section
  const handleChangeSection = (courseId) => {
    navigate(`/course/${courseId}/student/${studentNumber}/changeSection`);
  };


  return (
    <div>
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h6" className={classes.title}>
            Registered Courses for Student {studentNumber}
          </Typography>

          {message && (
            <Typography style={{ color: message.startsWith('Error') ? 'red' : 'green', fontWeight: 'bold' }}>
              {message}
            </Typography>
          )}

          {courses.length === 0 ? (
            <Typography>No registered courses found.</Typography>
          ) : (
            courses.map((course) => (
              <Card key={course._id} className={classes.courseCard}>
                <Typography variant="h6">{course.courseName} ({course.courseCode})</Typography>
                <Typography>Semester: {course.semester} | Section: {course.section}</Typography>

                <Button
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  onClick={() => handleChangeSection(course._id)}
                >
                  Change Section
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  className={classes.button}
                  onClick={() => handleDropCourse(course._id)}
                >
                  Drop Course
                </Button>

              </Card>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MyCourses;
