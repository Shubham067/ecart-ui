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

import { getUserDetails, updateUserDetails } from "../src/actions/userActions";
import { UPDATE_USER_PROFILE_RESET } from "../src/constants/userConstants";

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

const Profile = () => {
  const classes = useStyles();

  const router = useRouter();
  //   const redirect = router.query.redirect || "/";

  const [categories, setCategories] = useState([]);
  const [csrfToken, setCsrf] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  // const [error, setError] = useState("");
  //   const [state, send] = useMachine(toggleMachine);

  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.userDetails);

  const { error, loading, user } = userDetails;

  const userLogin = useSelector((state) => state.userLogin);

  const { userInfo } = userLogin;

  const updateUserProfile = useSelector((state) => state.updateUserProfile);

  const { success } = updateUserProfile;

  useEffect(() => {
    if (!userInfo) {
      router.push("/login");
    } else {
      if (!user || !user.name || success || user.id !== userInfo.user.id) {
        dispatch({ type: UPDATE_USER_PROFILE_RESET });
        dispatch(getUserDetails("profile"));
      } else {
        setName(user.name);
        setEmail(user.email);
        setUserName(user.username);
      }
    }
  }, [dispatch, router, userInfo, user]);

  useEffect(() => {
    async function getCategories() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_HOST}/api/categories`
        );
        setCategories(await res.json());
      } catch (err) {
        console.log(err);
      }
    }
    getCategories();
  }, []);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/accounts/csrf/`, {
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

    if (password !== confirmPassword) {
      setMessage("Passwords don't match!");
    } else {
      dispatch(
        updateUserDetails(
          {
            id: user.id,
            name: name,
            email: email,
            username: username,
            password: password,
          },
          csrfToken
        )
      );
    }
  }

  return (
    <>
      <Head>
        <title>User Profile</title>
      </Head>
      <Header data={categories} />
      {message && <Message severity="error">{message}</Message>}
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
              User Profile
            </Typography>
            <form className={classes.form} onSubmit={handleSubmit} noValidate>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="name"
                label="Name"
                name="name"
                autoComplete="name"
                placeholder="Enter Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="email"
                autoComplete="email"
                label="Email Address"
                type="email"
                id="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
              />
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
                onChange={(e) => setUserName(e.target.value)}
                autoFocus
              />
              <TextField
                variant="outlined"
                margin="normal"
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
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                name="confirm password"
                label="Confirm Password"
                type="password"
                id="confirm-password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="confirm-password"
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Update
              </Button>
            </form>
          </div>
        </Container>
      )}
    </>
  );
};

export default dynamic(() => Promise.resolve(Profile), { ssr: false });
