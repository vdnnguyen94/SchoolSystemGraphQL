import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
} from "@material-ui/core";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { GET_UNREGISTERED_COURSES } from "./queries";
import { REGISTER_COURSE } from "./mutations";
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
  registerButton: {
    marginTop: theme.spacing(1),
  },
  loading: {
    marginTop: theme.spacing(2),
  },
}));

const RegisterCourses = () => {
  const classes = useStyles();
  const { studentNumber } = useParams(); // Extract studentNumber from the route
  const [message, setMessage] = useState("");
  const [loadingRegister, setLoadingRegister] = useState(false);
  const jwt = auth.isAuthenticated();

  const { loading, error, data, refetch } = useQuery(GET_UNREGISTERED_COURSES, {
    variables: { studentNumber },
  });

  const [registerCourseMutation] = useMutation(REGISTER_COURSE, {
    onCompleted: () => {
      setMessage("Successfully registered for the course!");
      setLoadingRegister(false);
      // Refetch the courses after successful registration
      refetchCourses();
      // Clear the message after 3 seconds
      setTimeout(() => setMessage(""), 3000);
    },
    onError: (error) => {
      setMessage(`Error: ${error.message}`);
      setLoadingRegister(false);
      // Clear the message after 3 seconds
      setTimeout(() => setMessage(""), 3000);
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

  const courses = data?.unregisteredCourses || [];

  // Handle course registration
  const handleRegister = (courseId) => {
    setLoadingRegister(true);
    registerCourseMutation({
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

  return (
    <div>
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h6" className={classes.title}>
            Unregistered Courses for Student {studentNumber}
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
          {loadingRegister && <CircularProgress className={classes.loading} />}
          {courses.length === 0 ? (
            <Typography>No available courses to register.</Typography>
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
                  className={classes.registerButton}
                  onClick={() => handleRegister(course.id)}
                  disabled={loadingRegister}
                >
                  {loadingRegister ? "Registering..." : "Register"}
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
