import React, { useState, useEffect } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";

import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  FormControlLabel,
  Checkbox,
  Link,
  Grid,
  Typography,
  Container,
} from "@material-ui/core";

import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { makeStyles } from "@material-ui/core/styles";
import { useMachine } from "@xstate/react";
import { createMachine } from "xstate";
import Message from "../components/message";

import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import Header from "../components/header";

import { login } from "../src/actions/userActions";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const toggleMachine = createMachine({
  id: "toggle",
  initial: "loggedOut",
  states: {
    loggedOut: {
      on: { TOGGLE: "loggedIn" },
    },
    loggedIn: {
      on: { TOGGLE: "loggedOut" },
    },
  },
});

const Login = () => {
  const classes = useStyles();

  const router = useRouter();
  const redirect = router.query.redirect || "/";

  const [categories, setCategories] = useState([]);

  const [csrfToken, setCsrf] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // const [error, setError] = useState("");
  const [state, send] = useMachine(toggleMachine);

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);

  const { error, loading, userInfo } = userLogin;

  // console.log("boolean", !("errors" in userInfo));
  useEffect(() => {
    if (userInfo && !("errors" in userInfo)) {
      router.push(redirect);
    }
  }, [router, userInfo, redirect]);

  useEffect(() => {
    async function getCategories() {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/categories");
        setCategories(await res.json());
      } catch (err) {
        console.log(err);
      }
    }
    getCategories();
  }, []);

  useEffect(() => {
    fetch("http://localhost:8000/api/accounts/csrf/", {
      credentials: "include",
    })
      .then((res) => {
        let csrfToken = res.headers.get("X-CSRFToken");
        setCsrf(csrfToken);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    dispatch(login(username, password, csrfToken));
  }
  console.log(state.value);

  return (
    <>
      <Head>
        <title>Sign In</title>
      </Head>
      <Header data={categories} />
      {userInfo && userInfo.errors && (
        <Message severity="error">
          {userInfo.errors[Object.keys(userInfo.errors)[0]]}
        </Message>
      )}
      {loading ? (
        <h2>Loading...</h2>
      ) : (
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign In
            </Typography>
            <form className={classes.form} onSubmit={handleSubmit} noValidate>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                placeholder="Enter Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link
                    href={
                      redirect ? `/register?redirect=${redirect}` : "/register"
                    }
                    variant="body2"
                  >
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </form>
          </div>
        </Container>
      )}
    </>
  );
};

export default dynamic(() => Promise.resolve(Login), { ssr: false });
