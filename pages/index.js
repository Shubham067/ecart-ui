import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Header from "../components/header";
import Box from "@material-ui/core/Box";

import CardMedia from "@material-ui/core/CardMedia";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Link from "next/link";
import { useRouter } from "next/router";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import {
  listProducts,
  listTopRatedProducts,
} from "../src/actions/productActions";
import { wrapper } from "./_app";
import Message from "../components/message";
import dynamic from "next/dynamic";
import { Pagination } from "@material-ui/lab";
import Carousel from "react-material-ui-carousel";

// const Header = dynamic(() => import("../components/header"));

const useStyles = makeStyles((theme) => ({
  example: {
    color: "#ccc",
  },
  cardGrid: {
    paddingBottom: theme.spacing(0),
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    borderRadius: 10,
  },
  cardMedia: {
    // height: "100%",
    paddingTop: "0%", // 16:9,
  },
  box: {
    // border: 2,
    // borderRadius: 2,
  },
  mt1: { margin: "1rem", justifyContent: "center", display: "flex" },
  carousel: {
    backgroundColor: "#2d2d2d",
    margin: theme.spacing(0, 0, 1),
    display: "flex",
    flexDirection: "column",
  },
  image: {
    display: "flex",
    height: "300px",
    width: "320px",
    padding: "0px",
    margin: "10px",
    borderRadius: "10%",
    marginLeft: "auto",
    marginRight: "auto",
    backgroundColor: "white",
  },
}));

const Home = () => {
  const classes = useStyles();
  const router = useRouter();

  const dispatch = useDispatch();

  const productList = useSelector((state) => state.productList);
  const { error, loading, products, page, pages } = productList;

  const productTopRated = useSelector((state) => state.productTopRated);
  const {
    error: errorTopProducts,
    loading: loadingTopProducts,
    products: topProducts,
  } = productTopRated;

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (router.isReady) {
      const _page = router.query.page ? router.query.page : 1;

      dispatch(listProducts(_page));
    }
    dispatch(listTopRatedProducts());
  }, [router, dispatch]);

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

  const handlePage = (event, value) => {
    router.push({
      pathname: router.pathname,
      query: { page: value },
    });
  };

  return (
    <>
      <Header data={categories} />
      {loading ? (
        <h2>Loading...</h2>
      ) : error ? (
        <Message severity="error">{error}</Message>
      ) : (
        <main>
          <Container className={classes.cardGrid} maxWidth="lg">
            <Carousel
              className={classes.carousel}
              animation="slide"
              stopAutoPlayOnHover
              reverseEdgeAnimationDirection
              swipe
              navButtonsAlwaysVisible="true"
            >
              {topProducts.map((product) => (
                <div>
                  <Typography
                    variant="h5"
                    component="div"
                    align="center"
                    style={{ color: "whitesmoke" }}
                  >
                    {product.title} (₹{product.discount_price})
                  </Typography>

                  <Link
                    key={product.id}
                    href={`/product/${encodeURIComponent(product.slug)}`}
                  >
                    <img
                      src={
                        product.product_image.length
                          ? product.product_image.slice(-1)[0].image
                          : "/defaultImage"
                      }
                      alt={
                        product.product_image.length
                          ? product.product_image.slice(-1)[0].alt_text
                          : product.title
                      }
                      className={classes.image}
                    ></img>
                  </Link>
                </div>
              ))}
            </Carousel>
            <Grid container spacing={1}>
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${encodeURIComponent(product.slug)}`}
                  // href={`product/${encodeURIComponent(product.id)}`}
                >
                  <Grid item xs={6} sm={4} md={3}>
                    <Card
                      className={classes.card}
                      elevation={5}
                      variant="outlined"
                    >
                      <CardMedia className={classes.cardMedia}>
                        <div>
                          <Image
                            src={
                              product.product_image.length
                                ? product.product_image.slice(-1)[0].image
                                : "/defaultImage"
                            }
                            title={product.title}
                            alt={
                              product.product_image.length
                                ? product.product_image.slice(-1)[0].alt_text
                                : product.title
                            }
                            width="100%"
                            height="100%"
                            layout="responsive"
                            objectFit="contain"
                          />
                        </div>
                      </CardMedia>
                      <CardContent>
                        <Typography gutterBottom component="div" variant="h5">
                          <Link
                            key={product.id}
                            href={`/product/${encodeURIComponent(
                              product.slug
                            )}`}
                            // href={`product/${encodeURIComponent(product.id)}`}
                          >
                            <a
                              style={{
                                color: "inherit",
                                textDecoration: "inherit",
                              }}
                            >
                              {product.title}
                            </a>
                          </Link>
                        </Typography>
                        <Box
                          className={classes.box}
                          component="div"
                          fontSize={20}
                          fontWeight={700}
                        >
                          <div style={{ color: "maroon" }}>
                            ₹{product.discount_price}
                            <del
                              style={{
                                color: "grey",
                                fontSize: 16,
                                padding: 3,
                              }}
                            >
                              ₹{product.regular_price}
                            </del>
                            <div
                              style={{
                                color: "black",
                                fontSize: 15,
                                fontWeight: 600,
                              }}
                            >
                              Save: ₹
                              {Number(product.regular_price) -
                                Number(product.discount_price)}
                              (
                              {(
                                ((Number(product.regular_price) -
                                  Number(product.discount_price)) /
                                  Number(product.regular_price)) *
                                100
                              ).toFixed(0)}
                              %)
                            </div>
                          </div>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Link>
              ))}
            </Grid>
            {pages > 1 && (
              <Pagination
                className={classes.mt1}
                color="primary"
                // variant="outlined"
                // defaultPage={parseInt(page)}
                page={page}
                count={pages}
                onChange={handlePage}
              ></Pagination>
            )}
          </Container>
        </main>
      )}
    </>
  );
};

// export const getStaticProps = wrapper.getStaticProps((store) => async () => {
//   // const dispatch = useDispatch();

//   await store.dispatch(listProducts());

//   const productList = store.getState().productList;
//   // console.log(productList);
//   // useSelector((state) => state.productList);
//   // const products = [];
//   const { error, loading, products } = productList;
//   // const products = await res.json();

//   const ress = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/categories`);
//   const categories = await ress.json();

//   return {
//     props: {
//       products,
//       categories,
//       error,
//       loading,
//     },
//   };
// });

export default dynamic(() => Promise.resolve(Home), { ssr: false });
