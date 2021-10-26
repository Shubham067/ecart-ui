import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../components/header";
import Container from "@material-ui/core/Container";

import { addToCart, removeFromCart } from "../../src/actions/cartActions";
import { wrapper } from "../_app";
import Message from "../../components/message";

import NextLink from "next/link";
import dynamic from "next/dynamic";
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
  Select,
  MenuItem,
  Button,
  Card,
  List,
  ListItem,
  IconButton,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";

// import red from "@material-ui/core/colors/red";

const Cart = () => {
  const [categories, setCategories] = useState([]);

  const router = useRouter();
  const slug = router.query.slug || [];
  const qty = Number(router.query.qty) || [];

  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);

  const { cartItems } = cart;

  useEffect(() => {
    if (slug.length) {
      dispatch(addToCart(slug, qty));
    }
  }, [dispatch, slug, qty]);

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

  const updateCartHandler = async (item, qty) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_HOST}/api/products/${item.slug}`
    );
    const data = await res.json();

    if (data.count_in_stock < qty) {
      window.alert("Sorry! Product is Out of Stock.");
      return;
    }
    dispatch(addToCart(item.slug, qty));
    router.push("/cart");
  };
  const removeItemHandler = (id) => {
    dispatch(removeFromCart(id));
    router.push("/cart");
  };

  const checkoutHandler = () => {
    router.push("/shipping");
  };

  const continueShoppingHandler = () => {
    router.push("/");
  };

  if (router.isFallback) {
    return <h2>Loading...</h2>;
  }

  return (
    <>
      <Head>
        <title>Shopping Cart</title>
      </Head>
      <Header data={categories} />

      <Typography component="h1" variant="h4" align="center">
        Shopping Cart
      </Typography>
      {cartItems.length === 0 ? (
        <div align="center">
          <br></br>
          <Message severity="info">Your cart is empty.</Message>
          <br></br>
          <Button
            id="continue-shopping-button"
            variant="contained"
            // disableElevation
            color="primary"
            onClick={continueShoppingHandler}
            // className={classes.navbarButton}
          >
            Continue Shopping
          </Button>
        </div>
      ) : (
        <Grid container spacing={1}>
          <Grid item md={9} xs={12}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Image</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Brand</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cartItems.map((item) => (
                    <TableRow key={item.product}>
                      <TableCell>
                        <NextLink href={`/product/${item.slug}`} passHref>
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
                        <NextLink href={`/product/${item.slug}`} passHref>
                          <Link>
                            <Typography>{item.title}</Typography>
                          </Link>
                        </NextLink>
                      </TableCell>
                      <TableCell>{item.brand}</TableCell>
                      <TableCell align="right">
                        <Select
                          value={item.qty}
                          onChange={(e) =>
                            updateCartHandler(item, e.target.value)
                          }
                        >
                          {[...Array(item.count_in_stock).keys()].map(
                            (count) => (
                              <MenuItem key={count + 1} value={count + 1}>
                                {count + 1}
                              </MenuItem>
                            )
                          )}
                        </Select>
                      </TableCell>
                      <TableCell align="right">₹{item.price}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          // variant="contained"
                          style={{ color: "#b71c1c" }}
                          // color="secondary"
                          // startIcon={<DeleteIcon />}
                          onClick={() => removeItemHandler(item.product)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item md={3} xs={12}>
            <Card>
              <List>
                <ListItem>
                  <Typography component="p" variant="h4">
                    Subtotal (
                    {cartItems.reduce((acc, item) => acc + item.qty, 0)} items)
                    : ₹
                    {cartItems.reduce(
                      (acc, item) => acc + item.qty * item.price,
                      0
                    )}
                  </Typography>
                </ListItem>
                <ListItem>
                  <Button
                    onClick={checkoutHandler}
                    variant="contained"
                    color="primary"
                    fullWidth
                  >
                    Proceed To Buy (
                    {cartItems.reduce((acc, item) => acc + item.qty, 0)} items)
                  </Button>
                </ListItem>
              </List>
            </Card>
          </Grid>
        </Grid>
      )}
    </>
  );
};

// export async function getStaticPaths() {
//   return {
//     paths: [{ params: { slug: [] } }],
//     fallback: true,
//   };
// }

// export const getServerSideProps = wrapper.getServerSideProps(
//   (store) => async (context) => {
//     await store.dispatch(addToCart(context.query.slug, context.query.qty));

//     const cart = store.getState().cart;

//     const { cartItems } = cart;

//     const ress = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/categories`);
//     const categories = await ress.json();

//     return {
//       props: {
//         cartItems,
//         categories,
//         // error,
//       },
//     };
//   }
// );

export default dynamic(() => Promise.resolve(Cart), { ssr: false });
