import React, { useState, useEffect } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";

import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  FormControl,
  FormControlLabel,
  Checkbox,
  Link,
  Grid,
  Typography,
  Container,
  List,
  ListItem,
  Radio,
  RadioGroup,
} from "@material-ui/core";

import LockOutlinedIcon from "@material-ui/icons/LockOutlined";

import { makeStyles } from "@material-ui/core/styles";

import Message from "../components/message";

import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import Header from "../components/header";
import CheckoutWizard from "../components/checkoutWizard";

import { savePaymentMethod } from "../src/actions/cartActions";

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
}));

const Payment = () => {
  const classes = useStyles();

  const router = useRouter();

  const cart = useSelector((state) => state.cart);

  const { shippingAddress, paymentMethod } = cart;

  const dispatch = useDispatch();

  const [categories, setCategories] = useState([]);
  const [payment, setPaymentMethod] = useState("");

  useEffect(() => {
    if (!shippingAddress.address) {
      router.push("/shipping");
    } else {
      setPaymentMethod(paymentMethod);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(payment));
    router.push("/placeorder");
  };

  return (
    <>
      <Head>
        <title>Payment Method</title>
      </Head>
      <Header data={categories} />
      <CheckoutWizard activeStep={2} />

      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            Payment Method
          </Typography>
          <form className={classes.form} onSubmit={handleSubmit} noValidate>
            <List>
              <ListItem>
                <FormControl component="fieldset">
                  <RadioGroup
                    aria-label="Payment Method"
                    name="paymentMethod"
                    value={payment ? payment : ""}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <FormControlLabel
                      label="PayPal"
                      value="PayPal"
                      control={<Radio />}
                    ></FormControlLabel>
                    <FormControlLabel
                      label="Stripe"
                      value="Stripe"
                      control={<Radio />}
                    ></FormControlLabel>
                    <FormControlLabel
                      label="Cash"
                      value="Cash"
                      control={<Radio />}
                    ></FormControlLabel>
                  </RadioGroup>
                </FormControl>
              </ListItem>
              <ListItem>
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  Continue
                </Button>
              </ListItem>
              <ListItem>
                <Button
                  fullWidth
                  type="button"
                  variant="contained"
                  onClick={() => router.push("/shipping")}
                >
                  Back
                </Button>
              </ListItem>
            </List>
          </form>
        </div>
      </Container>
    </>
  );
};

export default dynamic(() => Promise.resolve(Payment), { ssr: false });
