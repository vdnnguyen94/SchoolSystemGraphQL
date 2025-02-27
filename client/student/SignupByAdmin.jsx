import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useMutation } from "@apollo/client";
import { CREATE_STUDENT } from "./mutations";
import auth from "../lib/auth-helper";

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 400,
    margin: "0 auto",
    marginTop: theme.spacing(3),
    padding: theme.spacing(2),
    textAlign: "center",
  },
  textField: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  error: {
    color: "red",
  },
  submit: {
    margin: "0 auto",
    marginBottom: theme.spacing(2),
  },
  title: {
    fontSize: 18,
  },
}));

const SignupByAdmin = () => {
  const classes = useStyles();
  const [values, setValues] = useState({
    studentNumber: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    phoneNumber: "",
    email: "",
    program: "",
    hobbies: "",
    techSkills: "",
    password: "",
    passwordConfirm: "",
    error: "",
    success: false,
    loading: false,
  });

  const jwt = auth.isAuthenticated();

  const [createStudentMutation] = useMutation(CREATE_STUDENT, {
    onCompleted: () => {
      setValues({
        ...values,
        error: "",
        success: true,
        loading: false,
      });
    },
    onError: (error) => {
      setValues({
        ...values,
        error: error.message,
        success: false,
        loading: false,
      });
    },
    context: {
      headers: {
        Authorization: `Bearer ${jwt.token}`,
      },
    },
  });

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleClose = () => {
    setValues({ ...values, success: false });
  };

  const clickSubmit = () => {
    const { password, passwordConfirm, ...rest } = values;

    if (password !== passwordConfirm) {
      setValues({
        ...values,
        error: "Passwords do not match",
        success: false,
        loading: false,
      });
      return;
    }

    setValues({ ...values, error: "", success: false, loading: true });

    createStudentMutation({
      variables: {
        ...rest,
        password,
        passwordConfirm,
      },
    });
  };

  return (
    <div>
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h6" className={classes.title}>
            Student Sign Up by Admin
          </Typography>
          <TextField
            id="studentNumber"
            label="Student Number"
            className={classes.textField}
            value={values.studentNumber}
            onChange={handleChange("studentNumber")}
            required
          />
          <TextField
            id="firstName"
            label="First Name"
            className={classes.textField}
            value={values.firstName}
            onChange={handleChange("firstName")}
            required
          />
          <TextField
            id="lastName"
            label="Last Name"
            className={classes.textField}
            value={values.lastName}
            onChange={handleChange("lastName")}
            required
          />
          <TextField
            id="email"
            label="Email"
            className={classes.textField}
            value={values.email}
            onChange={handleChange("email")}
            type="email"
            required
          />
          <TextField
            id="phoneNumber"
            label="Phone Number"
            className={classes.textField}
            value={values.phoneNumber}
            onChange={handleChange("phoneNumber")}
            required
          />
          <TextField
            id="address"
            label="Address"
            className={classes.textField}
            value={values.address}
            onChange={handleChange("address")}
            required
          />
          <TextField
            id="city"
            label="City"
            className={classes.textField}
            value={values.city}
            onChange={handleChange("city")}
            required
          />
          <TextField
            id="program"
            label="Program"
            className={classes.textField}
            value={values.program}
            onChange={handleChange("program")}
            required
          />
          <TextField
            id="hobbies"
            label="Hobbies"
            className={classes.textField}
            value={values.hobbies}
            onChange={handleChange("hobbies")}
          />
          <TextField
            id="techSkills"
            label="Tech Skills"
            className={classes.textField}
            value={values.techSkills}
            onChange={handleChange("techSkills")}
          />
          <TextField
            id="password"
            label="Password"
            className={classes.textField}
            value={values.password}
            onChange={handleChange("password")}
            type="password"
            required
          />
          <TextField
            id="passwordConfirm"
            label="Confirm Password"
            className={classes.textField}
            value={values.passwordConfirm}
            onChange={handleChange("passwordConfirm")}
            type="password"
            required
          />
          {values.error && (
            <Typography className={classes.error}>{values.error}</Typography>
          )}
        </CardContent>
        <CardActions>
          <Button
            color="primary"
            variant="contained"
            onClick={clickSubmit}
            className={classes.submit}
            disabled={values.loading}
          >
            {values.loading ? "Signing Up..." : "Sign Up"}
          </Button>
        </CardActions>
      </Card>
      <Dialog open={values.success} onClose={handleClose}>
        <DialogTitle>Account Created Successfully</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Student account has been successfully created.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Link to="/">
            <Button
              color="primary"
              autoFocus
              variant="contained"
              onClick={handleClose}
            >
              Back to Main
            </Button>
          </Link>
        </DialogActions>
      </Dialog>
    </div>
  );
};

SignupByAdmin.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default SignupByAdmin;
