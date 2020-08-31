import { SET_SELECTED_CURRENCY } from "./../constants";

export const setSelectedCurrency = (currency) => {
  return {
    type: SET_SELECTED_CURRENCY,
    payload: { currency },
  };
};

export const startPollingTopTen = (currency) => {
  return {
    type: "START_POLLING_TOP_TEN",
    payload: { currency },
  };
};

export const stopPolling = () => {
  return {
    type: "STOP_POLLING",
  };
};
