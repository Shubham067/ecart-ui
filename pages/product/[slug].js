import { useState, useEffect } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../components/header";

import { makeStyles } from "@material-ui/core/styles";

import Image from "next/image";
import Link from "next/link";
import Router from "next/router";
import {
  Divider,
  Button,
  Paper,
  Grid,
  Box,
  Hidden,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Container,
  Typography,
  List,
  ListItem,
  Card,
  CircularProgress,
  TextField,
} from "@material-ui/core";

import { ToggleButton, ToggleButtonGroup, Rating } from "@material-ui/lab";

import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import {
  listProductDetails,
  createProductReview,
} from "../../src/actions/productActions";

import { PRODUCT_CREATE_REVIEW_RESET } from "../../src/constants/productConstants";
import { wrapper } from "../_app";
import Message from "../../components/message";

const useStyles = makeStyles((theme) => ({
  root: {
    // flexGrow: 1,
    // flexDirection: "column",
  },
  paper: {
    padding: theme.spacing(),
    borderRadius: "0",
  },
  paperImagePreview: {
    paddingTop: "0%",
  },
  paperImage: {
    padding: theme.spacing(0),
    borderRadius: 10,
    // marginLeft: 5,
    ["@media (max-width:600px)"]: {
      marginLeft: -20,
      marginRight: -20,
    },
  },
  paperRight: {
    padding: theme.spacing(0),
    borderRadius: 10,
    paddingLeft: 0,
    paddingTop: "0%",
    marginLeft: 5,
    ["@media (max-width:600px)"]: {
      paddingLeft: 0,
      paddingTop: 10,
    },
  },
  Image: {
    // maxWidth: "100%",
  },
  listItemLink: {
    fontSize: 20,
    color: "#212121",
    textDecoration: "none",
    padding: theme.spacing(0),
    display: "flex",
    flexDirection: "row",
  },
  reviewForm: {
    maxWidth: 800,
    width: "100%",
  },
  reviewItem: {
    marginRight: "1rem",
    borderRight: "1px #808080 solid",
    paddingRight: "1rem",
  },
}));

const Product = ({ product, categories, error, loading, slug }) => {
  const classes = useStyles();
  const router = useRouter();

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const productReviewCreate = useSelector((state) => state.productReviewCreate);
  const {
    error: errorProductReview,
    loading: loadingProductReview,
    success: successProductReview,
    review: detailProductReview,
  } = productReviewCreate;

  const [csrfToken, setCsrf] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [productImage, setProductImage] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [detail, setDetail] = useState({});

  useEffect(() => {
    if (successProductReview) {
      setRating(0);
      setComment("");
      setDetail(detailProductReview);
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
    }
    if (!router.isFallback) {
      dispatch(listProductDetails(slug));
    }
  }, [dispatch, slug, successProductReview]);

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

  const handleChange = (event) => {
    setQuantity(event.target.value);
  };

  const addToCartHandler = () => {
    Router.push(`/cart/${product.slug}?qty=${quantity}`);
  };

  const handleImage = (event, currentImage) => {
    setProductImage(currentImage);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch(
      createProductReview(
        product.id,
        {
          rating,
          comment,
        },
        csrfToken
      )
    );
  };

  if (router.isFallback) {
    return <h2>Loading...</h2>;
  }

  return (
    <>
      <Head>
        <title>{product.title}</title>
      </Head>
      <Header data={categories} />
      <Link href={"/"}>
        <a className={classes.listItemLink}>
          <strong>BACK</strong>
        </a>
      </Link>
      {error ? (
        <Message severity="error">{error}</Message>
      ) : (
        <Container maxWidth="lg" className={classes.root}>
          <Grid container item spacing={1}>
            <Hidden only={["xs", "sm"]}>
              <Grid item sm={1}>
                <Paper className={classes.paperImage} elevation={0}>
                  {product.product_image.map((c) => (
                    <ToggleButtonGroup
                      id="toggle-image"
                      value={productImage}
                      orientation="vertical"
                      onChange={handleImage}
                      aria-label="image"
                      size="medium"
                      exclusive
                    >
                      <ToggleButton
                        value={c.image}
                        aria-label="current image"
                        aria-labelledby="toggle-image"
                        style={{ padding: 0, borderRadius: 10 }}
                      >
                        <Paper
                          key={c.id}
                          className={classes.paperImagePreview}
                          elevation={0}
                          // variant="outlined"
                          style={{ display: "flex" }}
                        >
                          <Image
                            src={c.image}
                            alt={c.alt_text}
                            className={classes.Image}
                            width="100%"
                            height="100%"
                            layout="intrinsic"
                            objectFit="contain"
                          />
                        </Paper>
                      </ToggleButton>
                    </ToggleButtonGroup>
                  ))}
                </Paper>
              </Grid>
            </Hidden>
            <Grid item xs={12} sm={5} lg={5}>
              <Paper
                className={classes.paperImage}
                elevation={0}
                variant="outlined"
              >
                <Image
                  src={
                    productImage
                      ? productImage
                      : setProductImage(product.product_image[0].image)
                  }
                  alt={product.product_image[0].alt_text}
                  className={classes.Image}
                  width="100%"
                  height="100%"
                  layout="responsive"
                  objectFit="contain"
                />
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <Paper
                className={classes.paperRight}
                elevation={0}
                // variant="outlined"
              >
                <Box
                  sx={{ m: 2 }}
                  component="div"
                  fontSize={20}
                  fontWeight="600"
                  style={{ wordWrap: "break-word" }}
                >
                  {product.brand ? (
                    <div style={{ color: "grey" }}>{product.brand}</div>
                  ) : (
                    <div style={{ color: "grey" }}>Generic</div>
                  )}
                  <div style={{ fontSize: 24 }}>{product.title}</div>
                </Box>
                <Divider />
                <Box
                  sx={{ m: 2 }}
                  component="div"
                  fontSize={18}
                  fontWeight="600"
                  style={{ wordWrap: "break-word" }}
                >
                  <Rating value={product.rating} readOnly></Rating>
                  <Link href="#reviews">
                    <div>{product.num_reviews} reviews</div>
                  </Link>
                </Box>
                <Divider />
                <Box
                  sx={{ m: 2 }}
                  component="div"
                  fontSize={18}
                  fontWeight="600"
                  m={0}
                >
                  <div>
                    <strong>M.R.P: </strong>
                    <del>₹ {product.regular_price}</del>
                  </div>
                  <strong>Price: </strong>
                  <span style={{ color: "maroon" }}>
                    ₹ {product.discount_price}
                  </span>
                  <div>
                    <span>You Save: </span>
                    <span style={{ color: "green" }}>
                      ₹
                      {Number(product.regular_price) -
                        Number(product.discount_price)}
                    </span>
                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: "500",
                      }}
                    >
                      Inclusive of all taxes
                    </div>
                  </div>
                </Box>
                <Divider />
                <Box
                  sx={{
                    m: 2,
                  }}
                  component="p"
                  fontSize={18}
                  fontWeight="500"
                  style={{ wordWrap: "break-word" }}
                >
                  <strong>Description: </strong>
                  {product.description}
                </Box>
                <Divider />
                <Box
                  sx={{ m: 2 }}
                  component="p"
                  m={0}
                  fontSize={14}
                  style={{ wordWrap: "break-word" }}
                >
                  Free Delivery & Returns (T&Cs Apply)
                </Box>
              </Paper>
            </Grid>
            <Grid
              key={product.id}
              item
              xs={12}
              sm={5}
              lg={3}
              // justifyContent="right"
            >
              <Paper
                className={classes.paperRight}
                elevation={0}
                variant="outlined"
              >
                <Box
                  sx={{
                    m: 2,
                  }}
                  component="p"
                  fontSize={18}
                  fontWeight="500"
                  style={{ wordWrap: "break-word" }}
                >
                  <strong>Status: </strong>

                  {product.in_stock && product.count_in_stock > 0 ? (
                    <span style={{ color: "green", fontWeight: "700" }}>
                      In Stock
                    </span>
                  ) : (
                    <span style={{ color: "maroon", fontWeight: "700" }}>
                      Out of Stock
                    </span>
                  )}
                </Box>
                <Divider />
                {product.count_in_stock > 0 && product.in_stock && (
                  <Box
                    sx={{
                      m: 2,
                    }}
                    component="div"
                    fontSize={18}
                    fontWeight="500"
                  >
                    <strong>Quantity: </strong>
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                      <Select
                        labelId="quantity-label"
                        id="quantity"
                        value={quantity}
                        onChange={handleChange}
                        autoWidth
                        label="Quantity"
                      >
                        {[...Array(product.count_in_stock).keys()].map(
                          (count) => (
                            <MenuItem key={count + 1} value={count + 1}>
                              {count + 1}
                            </MenuItem>
                          )
                        )}
                      </Select>
                    </FormControl>
                  </Box>
                )}
                <Divider />
                <Box
                  display="flex"
                  justifyContent="center"
                  component="p"
                  fontSize={14}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<ShoppingCartIcon />}
                    onClick={addToCartHandler}
                    disabled={
                      product.in_stock == false || product.count_in_stock == 0
                    }
                  >
                    Add to Cart
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
          <List>
            <ListItem>
              <Typography name="reviews" id="reviews" variant="h4">
                Customer Reviews
              </Typography>
            </ListItem>
            {product.reviews.length === 0 && (
              <ListItem>
                <Typography>No Review</Typography>
              </ListItem>
            )}
            {product.reviews.map((review) => (
              <ListItem key={review.id}>
                <Grid container>
                  <Grid item className={classes.reviewItem}>
                    <Typography>
                      <strong>{review.name}</strong>
                    </Typography>
                    <Typography>
                      {review.created_at.substring(0, 10)}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Rating value={review.rating} readOnly></Rating>
                    <Typography>{review.comment}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
            ))}
            <ListItem>
              {userInfo ? (
                <form onSubmit={submitHandler} className={classes.reviewForm}>
                  <List>
                    <ListItem>
                      <Typography variant="h4">Leave your review</Typography>
                      {loadingProductReview && <CircularProgress />}
                      {Object.keys(detail).length !== 0 && (
                        <Typography>
                          {detail.status == 200 ? (
                            <Message severity="success">
                              {detail.detail}
                            </Message>
                          ) : (
                            <Message severity="error">{detail.detail}</Message>
                          )}
                        </Typography>
                      )}
                      {errorProductReview && (
                        <Message severity="error">{errorProductReview}</Message>
                      )}
                    </ListItem>

                    <ListItem>
                      <TextField
                        multiline
                        variant="outlined"
                        fullWidth
                        name="Review"
                        label="Enter Comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />
                    </ListItem>
                    <ListItem>
                      <Rating
                        name="simple-controlled"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                      />
                    </ListItem>
                    <ListItem>
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        disabled={loadingProductReview}
                      >
                        Submit
                      </Button>
                    </ListItem>
                  </List>
                </form>
              ) : (
                <Typography variant="h4">
                  Please{" "}
                  <Link href={`/login?redirect=/product/${product.slug}`}>
                    login
                  </Link>{" "}
                  to write a review
                </Typography>
              )}
            </ListItem>
          </List>
        </Container>
      )}
    </>
  );
};

export async function getStaticPaths() {
  return {
    paths: [{ params: { slug: "boots-3" } }],
    fallback: true,
  };
}

export const getStaticProps = wrapper.getStaticProps(
  (store) =>
    async ({ params }) => {
      // const dispatch = useDispatch();

      await store.dispatch(listProductDetails(params.slug));

      const productDetails = store.getState().productDetails;
      // console.log(productList);
      // useSelector((state) => state.productList);
      // const products = [];
      const { error, loading, product } = productDetails;
      // const products = await res.json();

      const ress = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api/categories`
      );
      const categories = await ress.json();

      return {
        props: {
          product,
          categories,
          error,
          loading,
          slug: params.slug,
        },
        revalidate: 60,
      };
    }
);

export default dynamic(() => Promise.resolve(Product), { ssr: false });
