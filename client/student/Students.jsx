import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, Typography, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { listStudents } from './api-student';

const useStyles = makeStyles((theme) => ({
  card: {
    width: '60%',
    margin: '0 auto',
    marginTop: theme.spacing(3),
    padding: theme.spacing(2),
    textAlign: 'center',
  },
  studentList: {
    listStyleType: 'none',
    padding: 0,
    marginTop: theme.spacing(2),
  },
  studentItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(1),
    borderBottom: '1px solid #ccc',
  },
  button: {
    marginLeft: theme.spacing(2),
    textTransform: 'none', // Keep text readable
    fontSize: '0.9rem',
    padding: theme.spacing(1, 2),
  },
}));

const Students = () => {
  const classes = useStyles();
  const [students, setStudents] = useState([]);
  const [message, setMessage] = useState('');

  // Fetch all students
  useEffect(() => {
    listStudents().then((data) => {
      if (data.error) {
        setMessage(`Error: ${data.error}`);
      } else {
        setStudents(data);
      }
    });
  }, []);

  return (
    <div>
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h6">All Students</Typography>

          {message && <Typography style={{ color: 'red', fontWeight: 'bold' }}>{message}</Typography>}

          <ul className={classes.studentList}>
            {students.length === 0 ? (
              <Typography>No students found.</Typography>
            ) : (
              students.map((student) => (
                <li key={student._id} className={classes.studentItem}>
                  <Typography>
                    {student.firstName} {student.lastName} - {student.studentNumber}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    component={Link}
                    to={`/mycourses/${student.studentNumber}`}
                  >
                    View Student Courses
                  </Button>
                </li>
              ))
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default Students;
