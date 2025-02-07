import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, Typography } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import { getCourseById } from './api-course';

const useStyles = makeStyles((theme) => ({
  card: {
    width: '60%',
    margin: '0 auto',
    marginTop: theme.spacing(3),
    padding: theme.spacing(2),
    textAlign: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: theme.spacing(2),
  },
  studentList: {
    textAlign: 'left',
    marginTop: theme.spacing(2),
    paddingLeft: theme.spacing(3),
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
          <Typography className={classes.title}>Course Details</Typography>

          {message && <Typography style={{ color: 'red', fontWeight: 'bold' }}>{message}</Typography>}

          {course ? (
            <>
              <Typography variant="h6">{course.courseName} ({course.courseCode})</Typography>
              <Typography>Semester: {course.semester}</Typography>
              <Typography>Section: {course.section}</Typography>
              <Typography variant="h6" className={classes.studentList}>Enrolled Students:</Typography>
              <ul className={classes.studentList}>
                {course.students && course.students.length === 0 ? (
                  <Typography>No students enrolled in this course.</Typography>
                ) : (
                  course.students.map((student) => (
                    <li key={student._id}>
                      {student.firstName} - {student.lastName} ----  {student.studentNumber}
                    </li>
                  ))
                )}
              </ul>
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
