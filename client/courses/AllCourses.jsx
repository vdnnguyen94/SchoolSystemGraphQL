import { makeStyles } from "@material-ui/core/styles";
import { Card, CardContent, Typography, Button } from "@material-ui/core";
import { useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import { GET_ALL_COURSES } from "./queries";

const useStyles = makeStyles((theme) => ({
  card: {
    width: "70%",
    margin: "0 auto",
    marginTop: theme.spacing(3),
    padding: theme.spacing(2),
    textAlign: "center",
  },
  title: {
    fontSize: 18,
    marginBottom: theme.spacing(2),
  },
  courseCard: {
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
    border: "1px solid #ccc",
  },
  button: {
    margin: theme.spacing(1),
  },
}));

const AllCourses = () => {
  const classes = useStyles();
  const { loading, error, data } = useQuery(GET_ALL_COURSES);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const courses = data.courses || [];

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
              <Card key={course.id} className={classes.courseCard}>
                <Typography variant="h6">
                  {course.courseName} ({course.courseCode})
                </Typography>
                <Typography>
                  Semester: {course.semester} | Section: {course.section}
                </Typography>

                {/* View Course Details Button */}
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  component={Link}
                  to={`/course/${course.id}`}
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
