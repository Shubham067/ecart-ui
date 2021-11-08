import React, { useState, useEffect } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import NextLink from "next/link";

import {
  CircularProgress,
  Grid,
  List,
  ListItem,
  Typography,
  Card,
  Button,
  ListItemText,
  CardContent,
  CardActions,
} from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";

import { Bar } from "react-chartjs-2";

import Message from "../../components/message";

import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../components/header";

import { getSummary } from "../../src/actions/dashboardActions";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(3),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  section: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    borderRadius: 10,
    justifyContent: "center",
  },
}));

const AdminDashboard = () => {
  const classes = useStyles();

  const router = useRouter();

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const fetchSummary = useSelector((state) => state.fetchSummary);
  const { error, loading, summary } = fetchSummary;

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (userInfo && userInfo.user.is_admin) {
      dispatch(getSummary());
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
        <title>Admin Dashboard</title>
      </Head>
      <Header data={categories} />

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
                  <Grid container spacing={5} align="center">
                    <Grid item md={3}>
                      <Card raised>
                        <CardContent>
                          <Typography variant="h3">
                            ₹{summary.ordersPrice}
                          </Typography>
                          <Typography>Sales</Typography>
                        </CardContent>
                        <div
                          style={{ display: "flex", justifyContent: "center" }}
                        >
                          <CardActions>
                            <NextLink
                              href="/admin/orders"
                              passHref
                              align="center"
                            >
                              <Button
                                size="small"
                                variant="contained"
                                color="primary"
                              >
                                View Sales
                              </Button>
                            </NextLink>
                          </CardActions>
                        </div>
                      </Card>
                    </Grid>
                    <Grid item md={3}>
                      <Card raised>
                        <CardContent>
                          <Typography variant="h3">
                            {summary.ordersCount}
                          </Typography>
                          <Typography>Orders</Typography>
                        </CardContent>
                        <div
                          style={{ display: "flex", justifyContent: "center" }}
                        >
                          <CardActions>
                            <NextLink href="/admin/orders" passHref>
                              <Button
                                size="small"
                                variant="contained"
                                color="primary"
                              >
                                View Orders
                              </Button>
                            </NextLink>
                          </CardActions>
                        </div>
                      </Card>
                    </Grid>
                    <Grid item md={3}>
                      <Card raised>
                        <CardContent>
                          <Typography variant="h3">
                            {summary.productsCount}
                          </Typography>
                          <Typography>Products</Typography>
                        </CardContent>
                        <div
                          style={{ display: "flex", justifyContent: "center" }}
                        >
                          <CardActions>
                            <NextLink href="/admin/products" passHref>
                              <Button
                                size="small"
                                variant="contained"
                                color="primary"
                              >
                                View Products
                              </Button>
                            </NextLink>
                          </CardActions>
                        </div>
                      </Card>
                    </Grid>
                    <Grid item md={3}>
                      <Card raised>
                        <CardContent>
                          <Typography variant="h3">
                            {summary.usersCount}
                          </Typography>
                          <Typography>Users</Typography>
                        </CardContent>
                        <div
                          style={{ display: "flex", justifyContent: "center" }}
                        >
                          <CardActions>
                            <NextLink href="/admin/users" passHref>
                              <Button
                                size="small"
                                variant="contained"
                                color="primary"
                              >
                                View Users
                              </Button>
                            </NextLink>
                          </CardActions>
                        </div>
                      </Card>
                    </Grid>
                  </Grid>
                )}
              </ListItem>
              <ListItem className={classes.paper}>
                <Typography component="h3" variant="h3">
                  Sales Chart
                </Typography>
              </ListItem>
              <ListItem>
                <Bar
                  data={{
                    labels: summary.salesData.map((x) => x.id),
                    datasets: [
                      {
                        label: "Sales",
                        backgroundColor: "rgba(162, 222, 208, 1)",
                        data: summary.salesData.map((x) => x.totalSales),
                      },
                    ],
                  }}
                  options={{
                    legend: {
                      display: true,
                      position: "right",
                    },
                  }}
                ></Bar>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default dynamic(() => Promise.resolve(AdminDashboard), { ssr: false });
