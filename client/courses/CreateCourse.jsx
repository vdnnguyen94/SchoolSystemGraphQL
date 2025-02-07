import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, Typography, TextField, Button } from '@material-ui/core';
import { createCourse } from '../courses/api-course';
import auth from '../lib/auth-helper';

const useStyles = makeStyles((theme) => ({
  card: {
    width: '50%',
    margin: '0 auto',
    marginTop: theme.spacing(3),
    padding: theme.spacing(2),
    textAlign: 'center',
  },
  formField: {
    marginBottom: theme.spacing(2),
    width: '100%',
  },
  button: {
    marginTop: theme.spacing(2),
  },
}));

const CreateCourse = () => {
  const classes = useStyles();
  const [values, setValues] = useState({
    courseCode: '',
    courseName: '',
    semester: '',
    section: '',
    error: '',
    success: '',
  });

  const jwt = auth.isAuthenticated();

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const course = {
      courseCode: values.courseCode,
      courseName: values.courseName,
      semester: values.semester,
      section: values.section,
    };

    createCourse(course, { t: jwt.token }).then((data) => {
      if (data.error) {
        setValues({ ...values, success: '', error: data.error });
      } else {
        setValues({
          courseCode: '',
          courseName: '',
          semester: '',
          section: '',
          error: '',
          success: 'Course created successfully!',
        });
      }
    });
  };

  return (
    <div>
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h6">Create a New Course</Typography>

          {values.error && <Typography style={{ color: 'red' }}>{values.error}</Typography>}
          {values.success && <Typography style={{ color: 'green' }}>{values.success}</Typography>}

          <form onSubmit={handleSubmit}>
            <TextField
              label="Course Code"
              variant="outlined"
              className={classes.formField}
              value={values.courseCode}
              onChange={handleChange('courseCode')}
              required
            />
            <TextField
              label="Course Name"
              variant="outlined"
              className={classes.formField}
              value={values.courseName}
              onChange={handleChange('courseName')}
              required
            />
            <TextField
              label="Semester"
              variant="outlined"
              className={classes.formField}
              value={values.semester}
              onChange={handleChange('semester')}
              required
            />
            <TextField
              label="Section"
              type="number"
              variant="outlined"
              className={classes.formField}
              value={values.section}
              onChange={handleChange('section')}
              required
            />
            <Button type="submit" variant="contained" color="primary" className={classes.button}>
              Create Course
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateCourse;
