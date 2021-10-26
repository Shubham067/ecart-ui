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

import { listOrders } from "../../src/actions/orderActions";

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

const Orders = () => {
  const classes = useStyles();

  const router = useRouter();

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const orderList = useSelector((state) => state.orderList);
  const { error, loading, orders } = orderList;

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (userInfo && userInfo.user.is_admin) {
      dispatch(listOrders());
    } else {
      router.push("/login");
    }
  }, [dispatch, router, userInfo]);

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

  return (
    <>
      <Head>
        <title>Orders</title>
      </Head>
      <Header data={categories} />
      <Typography component="h1" variant="h4" className={classes.paper}>
        Orders
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
                            <Typography>USER</Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography>DATE</Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography>TOTAL</Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography>PAID</Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography>DELIVERED</Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography>ACTIONS</Typography>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {orders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell align="center">
                              <Typography>{order.id}</Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Typography>
                                {order.created_by
                                  ? order.created_by.name
                                  : "DELETED USER"}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Typography>
                                {order.created_at.substring(0, 10)}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Typography>₹{order.total_price}</Typography>
                            </TableCell>
                            <TableCell align="center">
                              {order.is_paid ? (
                                <span style={{ color: "green" }}>
                                  <Typography>
                                    Paid on {order.paid_at.substring(0, 10)}
                                  </Typography>
                                </span>
                              ) : (
                                <span style={{ color: "maroon" }}>
                                  <Typography>Not Paid</Typography>
                                </span>
                              )}
                            </TableCell>
                            <TableCell align="center">
                              {order.is_delivered ? (
                                <span style={{ color: "green" }}>
                                  <Typography>
                                    Delivered on{" "}
                                    {order.delivered_at.substring(0, 10)}
                                  </Typography>
                                </span>
                              ) : (
                                <span style={{ color: "maroon" }}>
                                  <Typography>Not Delivered</Typography>
                                </span>
                              )}
                            </TableCell>
                            <TableCell align="center">
                              <NextLink href={`/order/${order.id}`} passHref>
                                <Button
                                  size="small"
                                  variant="contained"
                                  color="secondary"
                                >
                                  <Typography>Details</Typography>
                                </Button>
                              </NextLink>
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

export default dynamic(() => Promise.resolve(Orders), { ssr: false });
