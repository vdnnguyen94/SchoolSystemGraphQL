import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Card, CardContent, Typography, Button } from "@material-ui/core";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { GET_COURSES_BY_STUDENT } from "./queries";
import { DROP_COURSE } from "./mutations";
import auth from "../lib/auth-helper";

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

const MyCourses = () => {
  const classes = useStyles();
  const { studentNumber } = useParams();
  const [message, setMessage] = useState("");
  const jwt = auth.isAuthenticated();
  const navigate = useNavigate();

  const { loading, error, data, refetch } = useQuery(GET_COURSES_BY_STUDENT, {
    variables: { studentNumber },
  });

  const [dropCourseMutation] = useMutation(DROP_COURSE, {
    onCompleted: () => {
      setMessage("Course dropped successfully!");
      // Refetch the courses after dropping a course
      refetchCourses();
    },
    onError: (error) => {
      setMessage(`Error: ${error.message}`);
    },
  });

  const refetchCourses = () => {
    refetch();
  };

  if (loading) return <Typography>Loading courses...</Typography>;
  if (error)
    return (
      <Typography style={{ color: "red", fontWeight: "bold" }}>
        Error: {error.message}
      </Typography>
    );

  const courses = data?.coursesByStudent || [];

  // Handle Drop Course
  const handleDropCourse = (courseId) => {
    dropCourseMutation({
      variables: {
        studentNumber,
        courseId,
      },
      context: {
        headers: {
          Authorization: `Bearer ${jwt.token}`,
        },
      },
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
            <Typography
              style={{
                color: message.startsWith("Error") ? "red" : "green",
                fontWeight: "bold",
              }}
            >
              {message}
            </Typography>
          )}
          {courses.length === 0 ? (
            <Typography>Please Register Your Courses</Typography>
          ) : (
            courses.map((course) => (
              <Card key={course.id} className={classes.courseCard}>
                <Typography variant="h6">
                  {course.courseName} ({course.courseCode})
                </Typography>
                <Typography>
                  Semester: {course.semester} | Section: {course.section}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  onClick={() => handleChangeSection(course.id)}
                >
                  Change Section
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  className={classes.button}
                  onClick={() => handleDropCourse(course.id)}
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
