import React, { useState, useEffect } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import NextLink from "next/link";
import Image from "next/image";

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
  CircularProgress,
} from "@material-ui/core";

import LockOutlinedIcon from "@material-ui/icons/LockOutlined";

import { makeStyles } from "@material-ui/core/styles";

import Message from "../../../components/message";

import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../../components/header";

import { getUserDetails, updateUser } from "../../../src/actions/userActions";

import { USER_UPDATE_RESET } from "../../../src/constants/userConstants";

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

const UserEdit = ({ params }) => {
  const classes = useStyles();

  const router = useRouter();

  const userId = params.id;

  const [categories, setCategories] = useState([]);
  const [csrfToken, setCsrf] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [isAdmin, setIsAdmin] = useState(false);

  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.userDetails);
  const { error, loading, user } = userDetails;

  const userUpdate = useSelector((state) => state.userUpdate);
  const {
    error: errorUpdate,
    loading: loadingUpdate,
    success: successUpdate,
  } = userUpdate;

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: USER_UPDATE_RESET });
      router.push("/admin/users");
    } else {
      if (!user || !user.name || user.id !== Number(userId)) {
        dispatch(getUserDetails(userId));
      } else {
        setName(user.name);
        setEmail(user.email);

        setIsAdmin(user.is_admin);
      }
    }
  }, [user, userId, router, successUpdate]);

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

    dispatch(
      updateUser(
        {
          id: user.id,
          name: name,
          email: email,
          is_admin: isAdmin,
        },
        csrfToken
      )
    );
  }

  return (
    <>
      <Head>
        <title>Edit User</title>
      </Head>
      <Header data={categories} />
      {loadingUpdate && <CircularProgress />}
      {errorUpdate && <Message severity="error">{errorUpdate}</Message>}

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
              Edit User {userId}
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
              <FormControlLabel
                label="Is Admin"
                control={
                  <Checkbox
                    onClick={(e) => setIsAdmin(e.target.checked)}
                    checked={isAdmin}
                    name="isAdmin"
                    color="primary"
                  />
                }
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

export async function getServerSideProps({ params }) {
  return {
    props: { params },
  };
}

export default dynamic(() => Promise.resolve(UserEdit), { ssr: false });
