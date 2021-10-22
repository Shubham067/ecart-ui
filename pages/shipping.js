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
  List,
  ListItem,
} from "@material-ui/core";

import LockOutlinedIcon from "@material-ui/icons/LockOutlined";

import { makeStyles } from "@material-ui/core/styles";

import Message from "../components/message";

import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import Header from "../components/header";
import CheckoutWizard from "../components/checkoutWizard";

import { saveShippingAddress } from "../src/actions/cartActions";

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

const Shipping = () => {
  const classes = useStyles();

  const router = useRouter();

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);

  const { userInfo } = userLogin;

  const cart = useSelector((state) => state.cart);

  const { shippingAddress } = cart;

  const [categories, setCategories] = useState([]);
  // const [csrfToken, setCsrf] = useState("");
  const [name, setName] = useState(shippingAddress.name);
  const [address, setAddress] = useState(shippingAddress.address);
  const [city, setCity] = useState(shippingAddress.city);
  const [state, setState] = useState(shippingAddress.state);
  const [zipcode, setZipCode] = useState(shippingAddress.zipcode);
  const [country, setCountry] = useState(shippingAddress.country);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!userInfo) {
      router.push("/login?redirect=/shipping");
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
    dispatch(
      saveShippingAddress({ name, address, city, state, zipcode, country })
    );
    router.push("/payment");
  };

  return (
    <>
      <Head>
        <title>Shipping Address</title>
      </Head>
      <Header data={categories} />
      <CheckoutWizard activeStep={1} />

      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            Shipping Address
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
              placeholder="Enter Full Name"
              value={name ? name : ""}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="address"
              label="Address"
              name="address"
              autoComplete="address"
              placeholder="Enter Address"
              value={address ? address : ""}
              onChange={(e) => setAddress(e.target.value)}
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="city"
              autoComplete="city"
              label="City"
              id="city"
              placeholder="Enter City"
              value={city ? city : ""}
              onChange={(e) => setCity(e.target.value)}
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="state"
              label="State"
              name="state"
              autoComplete="state"
              placeholder="Enter State"
              value={state ? state : ""}
              onChange={(e) => setState(e.target.value)}
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="zipcode"
              label="ZipCode"
              id="zipcode"
              placeholder="Enter Zipcode"
              value={zipcode ? zipcode : ""}
              onChange={(e) => setZipCode(e.target.value)}
              autoComplete="zipcode"
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="country"
              label="Country"
              id="country"
              placeholder="Enter Country"
              value={country ? country : ""}
              onChange={(e) => setCountry(e.target.value)}
              autoComplete="country"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Continue
            </Button>
          </form>
        </div>
      </Container>
    </>
  );
};

export default dynamic(() => Promise.resolve(Shipping), { ssr: false });
