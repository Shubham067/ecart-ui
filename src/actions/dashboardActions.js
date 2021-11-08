import {
  FETCH_SUMMARY_REQUEST,
  FETCH_SUMMARY_SUCCESS,
  FETCH_SUMMARY_FAIL,
} from "../constants/dashboardConstants";

export const getSummary = () => async (dispatch, getState) => {
  try {
    dispatch({ type: FETCH_SUMMARY_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_HOST}/api/summary/`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.access}`,
        },
      }
    );

    const data = await res.json();

    dispatch({
      type: FETCH_SUMMARY_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: FETCH_SUMMARY_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
