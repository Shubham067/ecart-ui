import React, { useState, useEffect } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import NextLink from "next/link";
import Image from "next/image";

import {
  Grid,
  TableContainer,
  Table,
  Typography,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Link,
  CircularProgress,
  Button,
  Card,
  List,
  ListItem,
  Container,
  CssBaseline,
  Divider,
} from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";

import Message from "../../components/message";

import { PayPalButton } from "react-paypal-button-v2";

import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../components/header";

import {
  getOrderDetails,
  payOrder,
  deliverOrder,
} from "../../src/actions/orderActions";
import {
  ORDER_PAY_RESET,
  ORDER_DELIVER_RESET,
} from "../../src/constants/orderConstants";

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

const Order = ({ params }) => {
  const classes = useStyles();

  const router = useRouter();
  const orderId = params.id;
  const dispatch = useDispatch();

  const [sdkReady, setSdkReady] = useState(false);

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, error, loading } = orderDetails;

  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, success: successPay } = orderPay;

  const orderDeliver = useSelector((state) => state.orderDeliver);
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const [csrfToken, setCsrf] = useState("");
  const [categories, setCategories] = useState([]);

  if (!loading && !error) {
    order.itemsPrice = order.orderItems
      .reduce((acc, item) => acc + item.price * item.quantity, 0)
      .toFixed(2);
  }

  // AcxPL87dLmmngpO21L484Pj06YfzXQpPFpqRT_I3Q7n5diuyP8nGLramhIGyZGRLFU5t_3Um23Kr0E8W
  const addPayPalScript = () => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      "https://www.paypal.com/sdk/js?client-id=AcxPL87dLmmngpO21L484Pj06YfzXQpPFpqRT_I3Q7n5diuyP8nGLramhIGyZGRLFU5t_3Um23Kr0E8W";
    script.async = true;
    script.onload = () => {
      setSdkReady(true);
    };
    document.body.appendChild(script);
  };

  useEffect(() => {
    if (!userInfo) {
      router.push("/login");
    }
    if (
      !order ||
      successPay ||
      order.id !== Number(orderId) ||
      successDeliver
    ) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch({ type: ORDER_DELIVER_RESET });

      dispatch(getOrderDetails(orderId));
    } else if (!order.is_paid) {
      if (!window.paypal) {
        addPayPalScript();
      } else {
        setSdkReady(true);
      }
    }
  }, [router, dispatch, order, orderId, successPay, successDeliver]);

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

  const successPaymentHandler = (paymentResult) => {
    dispatch(payOrder(orderId, paymentResult, csrfToken));
  };

  const deliverOrderHandler = () => {
    dispatch(deliverOrder(order, csrfToken));
  };

  return (
    <>
      <Head>
        <title>Order</title>
      </Head>
      <Header data={categories} />
      {/* <CssBaseline /> */}
      {loading ? (
        <h2>Loading...</h2>
      ) : error ? (
        <Message severity="error">{error}</Message>
      ) : (
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            Order: {orderId}
          </Typography>
          <Grid container spacing={1}>
            <Grid item md={9} xs={12}>
              <Card className={classes.section}>
                <List>
                  <ListItem>
                    <Typography component="h1" variant="h3">
                      Shipping Address
                    </Typography>
                  </ListItem>
                  <ListItem>
                    <Typography component="h3" variant="p">
                      Address: {order.shippingAddress.name},{" "}
                      {order.shippingAddress.address},{" "}
                      {order.shippingAddress.city},{" "}
                      {order.shippingAddress.state},{" "}
                      {order.shippingAddress.zipcode},{" "}
                      {order.shippingAddress.country}
                    </Typography>
                  </ListItem>
                  <ListItem>
                    <Typography component="h3" variant="p">
                      Email:{" "}
                      <a
                        href={`mailto:${order.created_by.email}`}
                        style={{
                          color: "inherit",
                          textDecoration: "inherit",
                          // marginLeft: 3,
                        }}
                      >
                        {order.created_by.email}
                      </a>
                    </Typography>
                  </ListItem>
                  <ListItem>
                    {order.is_delivered ? (
                      <Message severity="success">
                        Delivered on {order.delivered_at.substring(0, 10)}
                      </Message>
                    ) : (
                      <Message severity="error">Not Delivered</Message>
                    )}
                  </ListItem>
                </List>
              </Card>
              <Card className={classes.section}>
                <List>
                  <ListItem>
                    <Typography component="h1" variant="h3">
                      Payment Method
                    </Typography>
                  </ListItem>
                  <ListItem>
                    <Typography component="h3" variant="p">
                      Method: {order.payment_method}
                    </Typography>
                  </ListItem>
                  <ListItem>
                    {order.is_paid ? (
                      <Message severity="success">
                        Paid on {order.paid_at.substring(0, 10)}
                      </Message>
                    ) : (
                      <Message severity="error">Not Paid</Message>
                    )}
                  </ListItem>
                </List>
              </Card>
              <Card className={classes.section}>
                <List>
                  <ListItem>
                    <Typography component="h1" variant="h3">
                      Order Items
                    </Typography>
                  </ListItem>
                  {order.orderItems.length === 0 ? (
                    <div align="center">
                      <br></br>
                      <Message severity="info">Order is empty.</Message>
                      <br></br>
                    </div>
                  ) : (
                    <ListItem>
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Image</TableCell>
                              <TableCell>Name</TableCell>
                              <TableCell>Brand</TableCell>
                              <TableCell>Quantity</TableCell>
                              <TableCell>Price</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {order.orderItems.map((item) => (
                              <TableRow key={item.id}>
                                <TableCell>
                                  <NextLink
                                    href={`/product/${item.slug}`}
                                    passHref
                                  >
                                    <Link>
                                      <Image
                                        src={item.image}
                                        alt={item.name}
                                        width={50}
                                        height={50}
                                      ></Image>
                                    </Link>
                                  </NextLink>
                                </TableCell>

                                <TableCell>
                                  <NextLink
                                    href={`/product/${item.slug}`}
                                    passHref
                                  >
                                    <Link>
                                      <Typography
                                      //   style={{
                                      //     color: "black",
                                      //     textDecoration: "none",
                                      //   }}
                                      >
                                        {item.name}
                                      </Typography>
                                    </Link>
                                  </NextLink>
                                </TableCell>
                                <TableCell>
                                  <Typography>{item.brand}</Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography>{item.quantity}</Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography>₹{item.price}</Typography>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </ListItem>
                  )}
                </List>
              </Card>
            </Grid>
            <Grid item md={3} xs={12}>
              <Card className={classes.section}>
                <List>
                  <ListItem>
                    <Typography component="h1" variant="h3">
                      Order Summary
                    </Typography>
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <Grid container>
                      <Grid item xs={6}>
                        <Typography>Items:</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography align="right">
                          ₹{order.itemsPrice}
                        </Typography>
                      </Grid>
                    </Grid>
                  </ListItem>
                  <ListItem>
                    <Grid container>
                      <Grid item xs={6}>
                        <Typography>Tax:</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography align="right">₹{order.tax}</Typography>
                      </Grid>
                    </Grid>
                  </ListItem>
                  <ListItem>
                    <Grid container>
                      <Grid item xs={6}>
                        <Typography>Shipping:</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography align="right">
                          ₹{order.shipping_charge}
                        </Typography>
                      </Grid>
                    </Grid>
                  </ListItem>
                  <ListItem>
                    <Grid container>
                      <Grid item xs={6}>
                        <Typography>
                          <strong>Total:</strong>
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography align="right">
                          <strong>₹{order.total_price}</strong>
                        </Typography>
                      </Grid>
                    </Grid>
                  </ListItem>
                  <Divider />
                  {!order.is_paid && (
                    <ListItem>
                      <div style={{ width: "100%" }}>
                        {loadingPay && <CircularProgress />}
                        {!sdkReady ? (
                          <CircularProgress />
                        ) : (
                          <PayPalButton
                            style={{
                              label: "buynow",
                              layout: "vertical",
                              shape: "pill",
                            }}
                            amount={order.total_price}
                            onSuccess={successPaymentHandler}
                          />
                        )}
                      </div>
                    </ListItem>
                  )}
                  {userInfo &&
                    userInfo.user.is_admin &&
                    order.is_paid &&
                    !order.is_delivered && (
                      <ListItem>
                        {loadingDeliver && <CircularProgress />}
                        <Button
                          fullWidth
                          variant="contained"
                          color="primary"
                          onClick={deliverOrderHandler}
                        >
                          Deliver Order
                        </Button>
                      </ListItem>
                    )}
                </List>
              </Card>
            </Grid>
          </Grid>
        </div>
      )}
    </>
  );
};

export async function getServerSideProps({ params }) {
  return { props: { params } };
}

export default dynamic(() => Promise.resolve(Order), { ssr: false });
