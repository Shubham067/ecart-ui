import React, { useState, useEffect } from "react";
import { makeStyles, styled } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import {
  Container,
  Badge,
  Typography,
  Button,
  Menu,
  MenuItem,
  IconButton,
} from "@material-ui/core";

import { Divider } from "@material-ui/core";

import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Link from "next/link";

import { useDispatch, useSelector } from "react-redux";

import { useRouter } from "next/router";

import { logout } from "../src/actions/userActions";

const StyledBadge = styled(Badge)(() => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    border: "2px solid #2d2d2d",
    padding: "0 4px",
  },
}));

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  appbarDesktop: {
    backgroundColor: "#f8f8f8",
    color: "#fff",
  },
  appbarMain: {
    backgroundColor: "#2d2d2d",
  },
  appbarSecondary: {
    backgroundColor: "#525050",
    color: "#fff",
  },
  appbarPromotion: {
    backgroundColor: "#2d2d2d",
    color: "#fff",
    margin: theme.spacing(0, 0, 4),
    ["@media (max-width:600px)"]: {
      margin: theme.spacing(0, 0, 2),
    },
  },
  toolbarDesktop: {
    padding: "0px",
    minHeight: 30,
  },
  toolbarMain: {
    padding: "0px",
    minHeight: 60,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  toolbarSecondary: {
    padding: "0px",
    minHeight: 50,
  },
  toolbarPromotion: {
    padding: "0px",
    minHeight: 50,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  svg: {
    fill: "#fff",
  },
  menuList: {
    display: "flex",
    flexDirection: "row",
    padding: "0",
  },
  menuListItem: {
    padding: 0,
    paddingRight: 20,
    textTransform: "capitalize",
  },
  listItemLink: {
    fontSize: 15,
    color: "#fff",
    textDecoration: "none",
  },
  navbarButton: {
    backgroundColor: "#525050",
    color: "#ffffff",
    // textTransform: "initial",
  },
}));

export default function Header({ data }) {
  const classes = useStyles();

  const router = useRouter();

  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);

  const { cartItems } = cart;

  // console.log("--", cartItems.length);

  const userLogin = useSelector((state) => state.userLogin);

  const { userInfo } = userLogin;

  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const loginClickHandler = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const loginMenuCloseHandler = (e, redirect) => {
    setAnchorEl(null);
    if (redirect !== "backdropClick") {
      router.push(redirect);
    }
  };

  const logoutClickHandler = () => {
    setAnchorEl(null);
    dispatch(logout());
    router.push("/");
  };

  const loginHandler = () => {
    router.push("/login");
  };

  return (
    <nav>
      <AppBar position="static" elevation={0} className={classes.appbarMain}>
        <Container maxWidth="lg">
          <Toolbar className={classes.toolbarMain}>
            <Link href={"/"}>
              <a
                style={{
                  color: "inherit",
                  textDecoration: "inherit",
                  fontSize: 20,
                  fontWeight: 600,
                }}
              >
                ECART
              </a>
            </Link>
            <div>
              <List className={classes.menuList}>
                {userInfo && userInfo.user ? (
                  // <div>
                  <ListItem key="menu" className={classes.menuListItem}>
                    <Button
                      id="profile-button"
                      variant="contained"
                      // disableElevation
                      // color="primary"
                      aria-controls="simple-menu"
                      aria-haspopup="true"
                      aria-expanded={open ? "true" : "false"}
                      onClick={loginClickHandler}
                      className={classes.navbarButton}
                      endIcon={<KeyboardArrowDownIcon />}
                    >
                      {userInfo.user.username}
                    </Button>
                    <Menu
                      // disableBackdropClick
                      id="simple-menu"
                      elevation={1}
                      MenuListProps={{
                        "aria-labelledby": "profile-button",
                      }}
                      anchorEl={anchorEl}
                      keepMounted
                      open={open}
                      onClose={loginMenuCloseHandler}
                      getContentAnchorEl={null} // Adding this was important for correct menu positioning
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "left",
                      }}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                      }}
                    >
                      <MenuItem
                        onClick={(e) => loginMenuCloseHandler(e, "/profile")}
                      >
                        Profile
                      </MenuItem>
                      <MenuItem
                        onClick={(e) =>
                          loginMenuCloseHandler(e, "/order/history")
                        }
                      >
                        Order History
                      </MenuItem>
                      {userInfo.user.is_admin && (
                        <>
                          <MenuItem
                            onClick={(e) =>
                              loginMenuCloseHandler(e, "/admin/dashboard")
                            }
                          >
                            Admin Dashboard
                          </MenuItem>
                          <MenuItem
                            onClick={(e) =>
                              loginMenuCloseHandler(e, "/admin/users")
                            }
                          >
                            Users
                          </MenuItem>
                          <MenuItem
                            onClick={(e) =>
                              loginMenuCloseHandler(e, "/admin/products")
                            }
                          >
                            Products
                          </MenuItem>
                          <MenuItem
                            onClick={(e) =>
                              loginMenuCloseHandler(e, "/admin/orders")
                            }
                          >
                            Orders
                          </MenuItem>
                        </>
                      )}
                      <Divider />
                      <MenuItem onClick={logoutClickHandler}>Logout</MenuItem>
                    </Menu>
                  </ListItem>
                ) : (
                  // <List className={classes.menuList}>
                  <ListItem key="login" className={classes.menuListItem}>
                    <Link href={"/login"}>
                      <Button
                        id="login-button"
                        variant="contained"
                        // disableElevation
                        color="secondary"
                        onClick={loginHandler}
                        className={classes.navbarButton}
                      >
                        Login
                      </Button>
                    </Link>
                  </ListItem>
                )}
                <ListItem key="cart" className={classes.menuListItem}>
                  <Link href={"/cart/[[...slug]]"}>
                    <IconButton aria-label="cart">
                      <StyledBadge
                        color="secondary"
                        badgeContent={cartItems.length}
                      >
                        <ShoppingCartIcon style={{ color: "#fff" }} />
                      </StyledBadge>
                    </IconButton>
                  </Link>
                </ListItem>
              </List>
            </div>
          </Toolbar>
        </Container>
      </AppBar>
      <AppBar
        position="relative"
        elevation={0}
        className={classes.appbarSecondary}
      >
        <Container maxWidth="lg">
          <Toolbar className={classes.toolbarSecondary}>
            <List className={classes.menuList}>
              {data.map((category) => (
                <ListItem key={category.name} className={classes.menuListItem}>
                  <Link href={`/category/${encodeURIComponent(category.slug)}`}>
                    <a className={classes.listItemLink}>{category.name}</a>
                  </Link>
                </ListItem>
              ))}
            </List>
          </Toolbar>
        </Container>
      </AppBar>
      <AppBar
        position="relative"
        elevation={0}
        className={classes.appbarPromotion}
      >
        <Container maxWidth="lg">
          <Toolbar className={classes.toolbarPromotion}></Toolbar>
        </Container>
      </AppBar>
    </nav>
  );
}
