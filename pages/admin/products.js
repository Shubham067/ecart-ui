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

import { Pagination } from "@material-ui/lab";

import AddIcon from "@material-ui/icons/Add";

import { makeStyles } from "@material-ui/core/styles";

import Message from "../../components/message";

import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../components/header";

import {
  listProducts,
  deleteProduct,
  createProduct,
} from "../../src/actions/productActions";

import { PRODUCT_CREATE_RESET } from "../../src/constants/productConstants";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(0),
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
  mt1: { marginTop: "1rem", justifyContent: "center", display: "flex" },
}));

const AdminProducts = () => {
  const classes = useStyles();
  const router = useRouter();

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const productList = useSelector((state) => state.productList);
  const { error, loading, products, page, pages } = productList;

  const productDelete = useSelector((state) => state.productDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = productDelete;

  const productCreate = useSelector((state) => state.productCreate);
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    product: createdProduct,
  } = productCreate;

  const [categories, setCategories] = useState([]);
  const [csrfToken, setCsrf] = useState("");

  useEffect(() => {
    dispatch({ type: PRODUCT_CREATE_RESET });

    if (!userInfo) {
      router.push("/login");
    }

    if (successCreate) {
      router.push(`/admin/product/${createdProduct.slug}`);
    } else {
      if (router.isReady) {
        const _page = router.query.page ? router.query.page : 1;

        dispatch(listProducts(_page));
      }
    }
  }, [
    dispatch,
    router,
    userInfo,
    successDelete,
    successCreate,
    createdProduct,
  ]);

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

  const deleteHandler = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(productId));
    }
  };

  const createProductHandler = () => {
    if (window.confirm("Are you sure you want to create a new product?")) {
      dispatch(createProduct(csrfToken));
    }
  };

  const handlePage = (event, value) => {
    router.push({
      pathname: router.pathname,
      query: { page: value },
    });
  };

  return (
    <>
      <Head>
        <title>Products</title>
      </Head>
      <Header data={categories} />

      <Grid container spacing={1}>
        <Grid item md={12} xs={12}>
          <Card className={classes.section}>
            <List>
              <ListItem>
                <Grid container alignItems="center">
                  <Grid item xs={6} align="center">
                    <Typography
                      component="h1"
                      variant="h4"
                      className={classes.paper}
                    >
                      Products
                    </Typography>
                    {loadingDelete && <CircularProgress />}
                    {errorDelete && (
                      <Message severity="error">{errorDelete}</Message>
                    )}
                  </Grid>
                  <Grid item xs={6} align="center">
                    <Button
                      onClick={createProductHandler}
                      color="secondary"
                      variant="contained"
                      startIcon={<AddIcon />}
                    >
                      Create Product
                    </Button>
                    {loadingCreate && <CircularProgress />}
                    {errorCreate && (
                      <Message severity="error">{errorCreate}</Message>
                    )}
                  </Grid>
                </Grid>
              </ListItem>
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
                            <Typography>PRICE</Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography>CATEGORY</Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography>COUNT</Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography>BRAND</Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography>ACTIONS</Typography>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {products.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell align="center">
                              <Typography>{product.id}</Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Typography>{product.title}</Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Typography>₹{product.discount_price}</Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Typography>{product.category.name}</Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Typography>{product.count_in_stock}</Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Typography>
                                {product.brand ? product.brand : "Generic"}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <NextLink
                                href={`/admin/product/${product.slug}`}
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
                                onClick={() => deleteHandler(product.id)}
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
      {pages > 1 && (
        <Pagination
          className={classes.mt1}
          color="primary"
          // variant="outlined"
          defaultPage={parseInt(page)}
          // page={page}
          count={pages}
          onChange={handlePage}
        ></Pagination>
      )}
    </>
  );
};

export default dynamic(() => Promise.resolve(AdminProducts), { ssr: false });
