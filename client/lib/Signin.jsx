import React, {useState} from 'react'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Icon from '@material-ui/core/Icon'
import { makeStyles } from '@material-ui/core/styles'
import auth from './auth-helper.js'
import {Navigate, Link} from 'react-router-dom'
import { useLocation } from 'react-router-dom';
import {signin} from './api-auth.js'
import { useMutation, gql, useQuery } from "@apollo/client";

const LOGIN_MUTATION = gql`
  mutation LogIn($studentNumber: String!, $password: String!) {
    logIn(studentNumber: $studentNumber, password: $password)
  }
`;
const IS_LOGGED_IN = gql`
  query {
    isLoggedIn{
      isLoggedIn
      studentNumber
    }
  }
`;

const IS_ADMIN = gql`
  query {
    isAdmin
  }
`;


const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 600,
    margin: 'auto',
    textAlign: 'center',
    marginTop: theme.spacing(5),
    paddingBottom: theme.spacing(2)
  },
  error: {
    verticalAlign: 'middle'
  },
  title: {
    marginTop: theme.spacing(2),
    color: theme.palette.openTitle
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 300
  },
  submit: {
    margin: 'auto',
    marginBottom: theme.spacing(0.5),
    // Increase the button size by setting padding and font size
    padding: theme.spacing(2),
    fontSize: '0.8rem',
    width: '300px',
  },
  resetButton: {
    marginLeft: 'auto',
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(1),
    fontSize: '0.6rem',
  },
  demoButton: {
    margin: theme.spacing(1),
    fontSize: '0.9rem',
  },
  
}))

export default function Signin(props) {
  const location = useLocation();
  //console.log(location.state)
  const classes = useStyles()
  const [values, setValues] = useState({
      studentNumber: '',
      password: '',
      error: '',
      redirectToReferrer: false
  })
  //Mutation
  const { refetch: refetchAuth  } = useQuery(IS_LOGGED_IN);
  const { refetch: refetchAdmin } = useQuery(IS_ADMIN);
  const [logIn, { loading, error }] = useMutation(LOGIN_MUTATION, {
    refetchQueries: [{ query: IS_LOGGED_IN }, { query: IS_ADMIN }],
    onCompleted: async (data) => {
      console.log("Login successful:", data);
      if (data.logIn) {
        await await refetchAuth(); 
        await refetchAdmin();
        setValues({ ...values, redirectToReferrer: true });
      } else {
        setValues({ ...values, error: "Invalid credentials" });
      }
    },
    onError: (error) => {
      console.error("Login error:", error);
      setValues({ ...values, error: "Login failed. Try again." });
    },
  });

  const clickSubmit = () => {
    if (!values.studentNumber || !values.password) {
      setValues({ ...values, error: "All fields are required" });
      return;
    }
    console.log(`Login Credentials ${values.studentNumber} and ${values.password}`);
    console.log(`Login Credentials:`, values.studentNumber, typeof values.studentNumber);
    console.log(`Password Type:`, typeof values.password);
    logIn({ variables: { studentNumber: values.studentNumber, password: values.password } });
  };

  const handleDemoLogin = (studentNumber, password) => {
    setValues({ studentNumber, password, error: '' });
  
    logIn({ variables: { studentNumber, password } })
      .then(({ data }) => {
        console.log("Demo login successful:", data);
        if (data.logIn) {
          setValues({ ...values, redirectToReferrer: true });
        } else {
          setValues({ ...values, error: "Invalid demo credentials" });
        }
      })
      .catch((error) => {
        console.error("Demo login error:", error);
        setValues({ ...values, error: "Demo login failed. Try again." });
      });
  };
  


  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value })
  }

  const {from} = location.state || {
      from: {
        pathname: '/'
      }
  }
  const {redirectToReferrer} = values;
  if (redirectToReferrer) {
    return <Navigate to={from}/>;
      
  }

  return (
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h6" className={classes.title}>
            Sign In
          </Typography>
          <TextField id="studentNumber" type="username" label="studentNumber" className={classes.textField} value={values.studentNumber} onChange={handleChange('studentNumber')} margin="normal"/><br/>
          <TextField id="password" type="password" label="Password" className={classes.textField} value={values.password} onChange={handleChange('password')} margin="normal"/>
          <br/> {
            values.error && (<Typography component="p" color="error">
              <Icon color="error" className={classes.error}>error</Icon>
              {values.error}
            </Typography>)
          }
        </CardContent>
        <CardActions>
          <Button color="primary" variant="contained" onClick={clickSubmit} className={classes.submit}>
              {loading ? "Logging in..." : "LOG IN"}
          </Button>
          
        </CardActions>

      <CardActions>
        <Button
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={() => handleDemoLogin('101', 'qwe123')}
        >
          Demo Student Sign In
        </Button>
      </CardActions>
      <CardActions>
        <Button
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={() => handleDemoLogin('10001', 'qwe123')}
        >
          Demo Admin Sign In
        </Button>
      </CardActions>
      </Card>
    )
}
