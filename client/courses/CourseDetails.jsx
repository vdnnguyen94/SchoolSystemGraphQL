import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, Typography, TextField, Button} from '@material-ui/core';
import { List, ListItem, ListItemText } from '@material-ui/core'
import { useParams, useNavigate } from 'react-router-dom';
import auth from '../lib/auth-helper';
import { listCoursesByStudent, dropCourse, getCourseById, changeCourseSection } from './api-course';

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
  studentList: {
    marginTop: theme.spacing(2),
  },
  listItem: {
    textAlign: 'left',
  },
}));
const CourseDetail = () => {
  const classes = useStyles();
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [message, setMessage] = useState('');

  // Fetch course details
  useEffect(() => {
    getCourseById(courseId).then((data) => {
      if (data.error) {
        setMessage(`Error: ${data.error}`);
      } else {
        setCourse(data);
      }
    });
  }, [courseId]);

  return (
    <div>
      <Card className={classes.card}>
        <CardContent>
          {message && <Typography style={{ color: 'red', fontWeight: 'bold' }}>{message}</Typography>}

          {course ? (
            <>
              <Typography className={classes.title}>{course.courseName} ({course.courseCode})</Typography>
              <Typography>Semester: {course.semester}</Typography>
              <Typography>Section: {course.section}</Typography>

              <Typography variant="h6" className={classes.studentList}>Enrolled Students</Typography>

              {course.students.length === 0 ? (
                <Typography>No students enrolled in this course.</Typography>
              ) : (
                <List>
                  {course.students.map((student) => (
                    <ListItem key={student._id} className={classes.listItem}>
                      <ListItemText primary={`${student.firstName} ${student.lastName}`} secondary={`Student Number: ${student.studentNumber}`} />
                    </ListItem>
                  ))}
                </List>
              )}
            </>
          ) : (
            <Typography>Loading course details...</Typography>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseDetail;