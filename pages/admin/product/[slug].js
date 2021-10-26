import React, { useState, useEffect } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import NextLink from "next/link";
import Image from "next/image";

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
  CircularProgress,
} from "@material-ui/core";

import LockOutlinedIcon from "@material-ui/icons/LockOutlined";

import { makeStyles } from "@material-ui/core/styles";

import Message from "../../../components/message";

import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../../components/header";

import {
  listProductDetails,
  updateProduct,
} from "../../../src/actions/productActions";

import { PRODUCT_UPDATE_RESET } from "../../../src/constants/productConstants";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const ProductEdit = ({ params }) => {
  const classes = useStyles();

  const router = useRouter();

  const productSlug = params.slug;

  const [categories, setCategories] = useState([]);
  const [csrfToken, setCsrf] = useState("");
  const [title, setTitle] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [regular_price, setRegularPrice] = useState(0);
  const [discount_price, setDiscountPrice] = useState(0);
  const [count_in_stock, setCountInStock] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [isFeature, setIsFeature] = useState(false);
  const [currentFile, setCurrentFile] = useState(null);

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const productDetails = useSelector((state) => state.productDetails);
  const { error, loading, product } = productDetails;

  const productUpdate = useSelector((state) => state.productUpdate);
  const {
    error: errorUpdate,
    loading: loadingUpdate,
    success: successUpdate,
  } = productUpdate;

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET });
      router.push("/admin/products");
    } else {
      if (!product || !product.title || product.slug !== productSlug) {
        dispatch(listProductDetails(productSlug));
      } else {
        setTitle(product.title);
        setBrand(product.brand);
        setDescription(product.description);
        setSlug(product.slug);
        setRegularPrice(product.regular_price);
        setDiscountPrice(product.discount_price);
        setCountInStock(product.count_in_stock);
      }
    }
  }, [dispatch, product, productSlug, router, successUpdate]);

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

  const uploadHandler = async (e) => {
    const file = currentFile;
    // console.log("file", file);
    const bodyFormData = new FormData();
    bodyFormData.append("image", file);
    bodyFormData.append("id", product.id);
    bodyFormData.append("is_feature", isFeature);

    setUploading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api/products/upload/`,
        {
          method: "POST",
          headers: {
            // "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${userInfo.access}`,
            "X-CSRFToken": csrfToken,
          },
          credentials: "include",
          body: bodyFormData,
        }
      );

      const data = await res.json();
      // console.log("data", data);
      setUploading(false);
    } catch (error) {
      setUploading(false);
    }
  };

  function handleSubmit(e) {
    e.preventDefault();

    dispatch(
      updateProduct(
        {
          id: product.id,
          title: title,
          brand: brand,
          description: description,
          slug: slug,
          regular_price: regular_price,
          discount_price: discount_price,
          count_in_stock: count_in_stock,
        },
        csrfToken
      )
    );
  }

  return (
    <>
      <Head>
        <title>Edit Product</title>
      </Head>
      <Header data={categories} />
      {loadingUpdate && <CircularProgress />}
      {errorUpdate && <Message severity="error">{errorUpdate}</Message>}

      {loading ? (
        <h2>Loading...</h2>
      ) : (
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
            <Typography component="h1" variant="h5">
              Edit Product {product.id}
            </Typography>
            <form className={classes.form} onSubmit={handleSubmit} noValidate>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="title"
                label="Title"
                name="title"
                autoComplete="title"
                placeholder="Enter Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="brand"
                autoComplete="brand"
                label="Brand"
                id="brand"
                placeholder="Enter Brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                autoFocus
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                multiline
                id="description"
                label="Description"
                name="description"
                autoComplete="description"
                placeholder="Enter Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                autoFocus
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="slug"
                label="Slug"
                name="slug"
                autoComplete="slug"
                placeholder="Enter Slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                autoFocus
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="regular price"
                label="Regular Price"
                name="regular price"
                autoComplete="regular price"
                placeholder="Enter Regular Price"
                value={regular_price}
                onChange={(e) => setRegularPrice(e.target.value)}
                autoFocus
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="discount price"
                label="Discount Price"
                name="discount price"
                autoComplete="discount price"
                placeholder="Enter Discount Price"
                value={discount_price}
                onChange={(e) => setDiscountPrice(e.target.value)}
                autoFocus
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="count in stock"
                label="Count In Stock"
                name="count in stock"
                type="number"
                autoComplete="count in stock"
                placeholder="Enter Count In Stock"
                value={count_in_stock}
                onChange={(e) => setCountInStock(e.target.value)}
                autoFocus
              />
              <label htmlFor="btn-upload">
                <input
                  id="btn-upload"
                  name="btn-upload"
                  style={{ display: "none" }}
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCurrentFile(e.target.files[0])}
                />
                <Button variant="outlined" component="span" color="secondary">
                  Choose Image
                </Button>
              </label>

              <div className="file-name" style={{ wordWrap: "break-word" }}>
                <br />
                {currentFile ? (
                  <Typography>{currentFile.name}</Typography>
                ) : null}
                <FormControlLabel
                  label="Is Feature"
                  control={
                    <Checkbox
                      onClick={(e) => setIsFeature(e.target.checked)}
                      checked={isFeature}
                      name="isFeature"
                      color="primary"
                      disabled={currentFile == null}
                    />
                  }
                />
                <br />
                <Button
                  variant="contained"
                  component="label"
                  color="secondary"
                  onClick={uploadHandler}
                  disabled={currentFile == null}
                >
                  Upload Image
                </Button>
                {uploading && <CircularProgress />}
              </div>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Update
              </Button>
            </form>
          </div>
        </Container>
      )}
    </>
  );
};

export async function getServerSideProps({ params }) {
  return {
    props: { params },
  };
}

export default dynamic(() => Promise.resolve(ProductEdit), { ssr: false });
