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

import LockOutlinedIcon from "@material-ui/icons/LockOutlined";

import { makeStyles } from "@material-ui/core/styles";

import Message from "../components/message";

import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import Header from "../components/header";
import CheckoutWizard from "../components/checkoutWizard";

import { createOrder } from "../src/actions/orderActions";

import { ORDER_CREATE_RESET } from "../src/constants/orderConstants";

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

const PlaceOrder = () => {
  const classes = useStyles();

  const router = useRouter();

  const orderCreate = useSelector((state) => state.orderCreate);
  const { order, error, success } = orderCreate;

  const cart = useSelector((state) => state.cart);

  const { shippingAddress, paymentMethod, cartItems } = cart;

  const dispatch = useDispatch();

  const [csrfToken, setCsrf] = useState("");
  const [categories, setCategories] = useState([]);

  cart.itemsPrice = cartItems
    .reduce((acc, item) => acc + item.price * item.qty, 0)
    .toFixed(2);

  cart.shippingCharge = (cart.itemsPrice > 200 ? 0 : 10).toFixed(2);

  cart.tax = Number(0.15 * cart.itemsPrice).toFixed(2);

  cart.totalPrice = (
    Number(cart.itemsPrice) +
    Number(cart.shippingCharge) +
    Number(cart.tax)
  ).toFixed(2);

  useEffect(() => {
    if (!paymentMethod) {
      router.push("/payment");
    }
    if (cartItems.length === 0) {
      router.push("/cart");
    }
  }, []);

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

  useEffect(() => {
    if (success) {
      router.push(`/order/${order.id}`);
      dispatch({ type: ORDER_CREATE_RESET });
    }
  }, [success, router]);

  const placeOrderHandler = () => {
    dispatch(
      createOrder(
        {
          orderItems: cartItems,
          shippingAddress: shippingAddress,
          paymentMethod: paymentMethod,
          // itemsPrice: cart.itemsPrice,
          shippingCharge: cart.shippingCharge,
          tax: cart.tax,
          // totalPrice: cart.totalPrice,
        },
        csrfToken
      )
    );
  };

  return (
    <>
      <Head>
        <title>Place Order</title>
      </Head>
      <Header data={categories} />
      <CheckoutWizard activeStep={3} />

      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Place Order
        </Typography>
        <Grid container spacing={1}>
          <Grid item md={9} xs={12}>
            <Card className={classes.section}>
              <List>
                <ListItem>
                  <Typography component="p" variant="h3">
                    Shipping Address
                  </Typography>
                </ListItem>
                <ListItem>
                  {shippingAddress.name}, {shippingAddress.address},{" "}
                  {shippingAddress.city}, {shippingAddress.state},{" "}
                  {shippingAddress.zipcode}, {shippingAddress.country}
                </ListItem>
              </List>
            </Card>
            <Card className={classes.section}>
              <List>
                <ListItem>
                  <Typography component="p" variant="h3">
                    Payment Method
                  </Typography>
                </ListItem>
                <ListItem>{paymentMethod}</ListItem>
              </List>
            </Card>
            <Card className={classes.section}>
              <List>
                <ListItem>
                  <Typography component="p" variant="h3">
                    Order Items
                  </Typography>
                </ListItem>
                {cartItems.length === 0 ? (
                  <div align="center">
                    <br></br>
                    <Message severity="info">Your cart is empty.</Message>
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
                          {cartItems.map((item) => (
                            <TableRow key={item.product}>
                              <TableCell>
                                <NextLink
                                  href={`/product/${item.slug}`}
                                  passHref
                                >
                                  <Link>
                                    <Image
                                      src={item.image.image}
                                      alt={item.title}
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
                                      {item.title}
                                    </Typography>
                                  </Link>
                                </NextLink>
                              </TableCell>
                              <TableCell>
                                <Typography>{item.brand}</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>{item.qty}</Typography>
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
                  <Typography component="p" variant="h3">
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
                      <Typography align="right">₹{cart.itemsPrice}</Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>Tax:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align="right">₹{cart.tax}</Typography>
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
                        ₹{cart.shippingCharge}
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
                        <strong>₹{cart.totalPrice}</strong>
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <Divider />
                <ListItem>
                  <Button
                    onClick={placeOrderHandler}
                    variant="contained"
                    color="primary"
                    disabled={cartItems.length === 0}
                    fullWidth
                  >
                    Place Order
                  </Button>
                </ListItem>
                {/* {loading && (
                    <ListItem>
                      <CircularProgress />
                    </ListItem>
                  )} */}
              </List>
            </Card>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default dynamic(() => Promise.resolve(PlaceOrder), { ssr: false });
