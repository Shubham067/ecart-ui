import {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_SAVE_SHIPPING_ADDRESS,
  CART_SAVE_PAYMENT_METHOD,
} from "../constants/cartConstants";

export const addToCart = (slug, qty) => async (dispatch, getState) => {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/products/${slug}`);
    const data = await res.json();

    dispatch({
      type: CART_ADD_ITEM,
      payload: {
        product: data.id,
        slug: data.slug,
        brand: data.brand,
        title: data.title,
        image: data.product_image[0],
        price: data.discount_price,
        count_in_stock: data.count_in_stock,
        qty,
      },
    });

    if (typeof window !== "undefined") {
      localStorage.setItem(
        "cartItems",
        JSON.stringify(getState().cart.cartItems)
      );
    }
  } catch (error) {
    // dispatch({
    //   type: PRODUCT_LIST_FAIL,
    //   payload:
    //     error.response && error.response.data.message
    //       ? error.response.data.message
    //       : error.message,
    // });
  }
};

export const removeFromCart = (id) => async (dispatch, getState) => {
  dispatch({
    type: CART_REMOVE_ITEM,
    payload: id,
  });

  if (typeof window !== "undefined") {
    localStorage.setItem(
      "cartItems",
      JSON.stringify(getState().cart.cartItems)
    );
  }
};

export const saveShippingAddress = (data) => async (dispatch) => {
  dispatch({
    type: CART_SAVE_SHIPPING_ADDRESS,
    payload: data,
  });

  if (typeof window !== "undefined") {
    localStorage.setItem("shippingAddress", JSON.stringify(data));
  }
};

export const savePaymentMethod = (data) => async (dispatch) => {
  dispatch({
    type: CART_SAVE_PAYMENT_METHOD,
    payload: data,
  });

  if (typeof window !== "undefined") {
    localStorage.setItem("paymentMethod", JSON.stringify(data));
  }
};
