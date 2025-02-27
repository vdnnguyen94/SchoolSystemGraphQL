import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
} from "@material-ui/core";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { GET_COURSE_BY_ID } from "./queries";
import { CHANGE_COURSE_SECTION } from "./mutations";
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
  inputField: {
    width: "80%",
    marginBottom: theme.spacing(2),
  },
  button: {
    margin: theme.spacing(1),
  },
}));

const ChangeSection = () => {
  const classes = useStyles();
  const { courseId, studentNumber } = useParams();
  const navigate = useNavigate();
  const [newSection, setNewSection] = useState("");
  const [message, setMessage] = useState("");
  const jwt = auth.isAuthenticated();

  const { loading, error, data } = useQuery(GET_COURSE_BY_ID, {
    variables: { id: courseId },
  });

  const [changeCourseSectionMutation] = useMutation(CHANGE_COURSE_SECTION, {
    onCompleted: () => {
      alert("Course section updated successfully!");
      navigate(`/mycourses/${studentNumber}`);
    },
    onError: (err) => {
      setMessage(`Error: ${err.message}`);
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const course = data?.course;

  // Handle Section Change Submission
  const handleChangeSection = () => {
    if (!newSection) {
      setMessage("Please enter a new section number.");
      return;
    }

    changeCourseSectionMutation({
      variables: {
        studentNumber,
        oldCourseId: courseId,
        newCourseId: newSection, // Assuming newSection is the ID of the new course
      },
    });
  };

  return (
    <div>
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h6">Change Course Section</Typography>
          {message && (
            <Typography style={{ color: "red", fontWeight: "bold" }}>
              {message}
            </Typography>
          )}
          {course ? (
            <>
              <Typography variant="h6">
                {course.courseName} ({course.courseCode})
              </Typography>
              <Typography>Semester: {course.semester}</Typography>
              <Typography>Current Section: {course.section}</Typography>
            </>
          ) : (
            <Typography>Loading course details...</Typography>
          )}
          {/* Section Input */}
          <TextField
            label="New Section Number"
            variant="outlined"
            className={classes.inputField}
            value={newSection}
            onChange={(e) => setNewSection(e.target.value)}
          />
          {/* Submit Button */}
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={handleChangeSection}
          >
            Update Section
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChangeSection;
