import {
  FETCH_SUMMARY_REQUEST,
  FETCH_SUMMARY_SUCCESS,
  FETCH_SUMMARY_FAIL,
} from "../constants/dashboardConstants";

export const fetchSummaryReducer = (
  state = { summary: { salesData: [] } },
  action
) => {
  switch (action.type) {
    case FETCH_SUMMARY_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case FETCH_SUMMARY_SUCCESS:
      return {
        loading: false,
        summary: action.payload,
      };

    case FETCH_SUMMARY_FAIL:
      return {
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};
