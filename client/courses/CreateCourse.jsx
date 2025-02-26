import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, Typography, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';

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

// GraphQL Query to Fetch All Courses
const GET_COURSES = gql`
  query GetCourses {
    courses {
      _id
      courseCode
      courseName
      section
      semester
    }
  }
`;

const AllCourses = () => {
  const classes = useStyles();

  // Use Apollo's `useQuery` Hook
  const { loading, error, data } = useQuery(GET_COURSES);

  if (loading) return <Typography>Loading courses...</Typography>;
  if (error) return <Typography style={{ color: 'red', fontWeight: 'bold' }}>Error: {error.message}</Typography>;

  const courses = data?.courses || [];

  return (
    <div>
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h6" className={classes.title}>
            All Available Courses
          </Typography>

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
