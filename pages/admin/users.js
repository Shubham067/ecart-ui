import React, { useState, useEffect } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import NextLink from "next/link";
import Image from "next/image";

import {
  CircularProgress,
  Grid,
  List,
  ListItem,
  TableContainer,
  Typography,
  Card,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  ListItemText,
} from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";

import Message from "../../components/message";

import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../components/header";

import { getUserList, deleteUser } from "../../src/actions/userActions";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  section: {
    // marginTop: 10,
    // marginBottom: 10,
  },
}));

const Users = () => {
  const classes = useStyles();

  const router = useRouter();

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userList = useSelector((state) => state.userList);
  const { error, loading, users } = userList;

  const userDelete = useSelector((state) => state.userDelete);
  const { success: successDelete } = userDelete;

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (userInfo && userInfo.user.is_admin) {
      dispatch(getUserList());
    } else {
      router.push("/login");
    }
  }, [dispatch, router, userInfo, successDelete]);

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

  const deleteHandler = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUser(userId));
    }
  };

  return (
    <>
      <Head>
        <title>Users</title>
      </Head>
      <Header data={categories} />
      <Typography component="h1" variant="h4" className={classes.paper}>
        Users
      </Typography>
      <br></br>
      <Grid container spacing={1}>
        <Grid item md={12} xs={12}>
          <Card className={classes.section}>
            <List>
              <ListItem>
                {loading ? (
                  <CircularProgress />
                ) : error ? (
                  <Message severity="error">{error}</Message>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell align="center">
                            <Typography>ID</Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography>NAME</Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography>USERNAME</Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography>EMAIL</Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography>ISADMIN</Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography>ACTIONS</Typography>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {users.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell align="center">
                              <Typography>{user.id}</Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Typography>{user.name}</Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Typography>{user.username}</Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Typography>{user.email}</Typography>
                            </TableCell>
                            <TableCell align="center">
                              {user.is_admin ? (
                                <span style={{ color: "green" }}>
                                  <Typography>YES</Typography>
                                </span>
                              ) : (
                                <span style={{ color: "maroon" }}>
                                  <Typography>NO</Typography>
                                </span>
                              )}
                            </TableCell>
                            <TableCell align="center">
                              <NextLink
                                href={`/admin/user/${user.id}`}
                                passHref
                              >
                                <Button
                                  size="small"
                                  variant="contained"
                                  color="secondary"
                                >
                                  <Typography>Edit</Typography>
                                </Button>
                              </NextLink>{" "}
                              <Button
                                onClick={() => deleteHandler(user.id)}
                                size="small"
                                variant="contained"
                                style={{
                                  backgroundColor: "maroon",
                                  color: "white",
                                }}
                              >
                                <Typography>Delete</Typography>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default dynamic(() => Promise.resolve(Users), { ssr: false });
