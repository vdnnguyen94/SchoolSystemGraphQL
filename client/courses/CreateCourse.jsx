import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from "@material-ui/core";
import { useMutation } from "@apollo/client";
import { CREATE_COURSE } from "./mutations";
import auth from "../lib/auth-helper";

const useStyles = makeStyles((theme) => ({
  card: {
    width: "50%",
    margin: "0 auto",
    marginTop: theme.spacing(3),
    padding: theme.spacing(2),
    textAlign: "center",
  },
  formField: {
    marginBottom: theme.spacing(2),
    width: "100%",
  },
  button: {
    marginTop: theme.spacing(2),
  },
  loading: {
    marginTop: theme.spacing(2),
  },
}));

const CreateCourse = () => {
  const classes = useStyles();
  const [values, setValues] = useState({
    courseCode: "",
    courseName: "",
    semester: "",
    section: "",
    error: "",
    success: "",
    loading: false,
  });

  const jwt = auth.isAuthenticated();

  const [createCourseMutation] = useMutation(CREATE_COURSE, {
    onCompleted: () => {
      setValues({
        courseCode: "",
        courseName: "",
        semester: "",
        section: "",
        error: "",
        success: "Course created successfully!",
        loading: false,
      });
    },
    onError: (error) => {
      setValues({
        ...values,
        success: "",
        error: error.message,
        loading: false,
      });
    },
  });

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const course = {
      courseCode: values.courseCode.trim(),
      courseName: values.courseName.trim(),
      semester: values.semester.trim(),
      section: values.section.trim(),
    };

    // Basic validation
    if (
      !course.courseCode ||
      !course.courseName ||
      !course.semester ||
      !course.section
    ) {
      setValues({
        ...values,
        error: "All fields are required.",
        success: "",
        loading: false,
      });
      return;
    }

    setValues({ ...values, error: "", success: "", loading: true });

    createCourseMutation({
      variables: {
        courseCode: course.courseCode,
        courseName: course.courseName,
        section: course.section,
        semester: course.semester,
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
          <Typography variant="h6">Create a New Course</Typography>
          {values.error && (
            <Typography style={{ color: "red" }}>{values.error}</Typography>
          )}
          {values.success && (
            <Typography style={{ color: "green" }}>{values.success}</Typography>
          )}
          {values.loading && <CircularProgress className={classes.loading} />}
          <form onSubmit={handleSubmit}>
            <TextField
              label="Course Code"
              variant="outlined"
              className={classes.formField}
              value={values.courseCode}
              onChange={handleChange("courseCode")}
              required
            />
            <TextField
              label="Course Name"
              variant="outlined"
              className={classes.formField}
              value={values.courseName}
              onChange={handleChange("courseName")}
              required
            />
            <TextField
              label="Semester"
              variant="outlined"
              className={classes.formField}
              value={values.semester}
              onChange={handleChange("semester")}
              required
            />
            <TextField
              label="Section"
              variant="outlined"
              className={classes.formField}
              value={values.section}
              onChange={handleChange("section")}
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.button}
              disabled={values.loading}
            >
              {values.loading ? "Creating..." : "Create Course"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateCourse;
