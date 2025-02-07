import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, Typography, Button} from '@material-ui/core';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import auth from '../lib/auth-helper';
import { listCoursesByStudent, dropCourse , listCourses} from './api-course';

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

const AllCourses = () => {
  const classes = useStyles();
  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState('');
  const jwt = auth.isAuthenticated();

  // Fetch all courses
  useEffect(() => {
    listCourses().then((data) => {
      if (data.error) {
        setMessage(`Error: ${data.error}`);
      } else if (data.length === 0) {
        setMessage('No courses available.');
      } else {
        setCourses(data);
      }
    });
  }, []);

  return (
    <div>
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h6" className={classes.title}>
            All Available Courses
          </Typography>

          {message && (
            <Typography style={{ color: 'red', fontWeight: 'bold' }}>{message}</Typography>
          )}

          {courses.length === 0 ? (
            <Typography>No courses found.</Typography>
          ) : (
            courses.map((course) => (
              <Card key={course._id} className={classes.courseCard}>
                <Typography variant="h6">{course.courseName} ({course.courseCode})</Typography>
                <Typography>Semester: {course.semester} | Section: {course.section}</Typography>

                {/* View Course Details Button */}
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  component={Link}
                  to={`/course/${course._id}`}
                >
                  View Course Details
                </Button>
              </Card>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AllCourses;