import {
  SET_SELECTED_CURRENCY,
  START_POLLING_TOP_TEN,
  START_POLLING_INDIVIDUAL,
  STOP_POLLING,
} from "./../constants";

export const setSelectedCurrency = (currency) => {
  return {
    type: SET_SELECTED_CURRENCY,
    payload: { currency },
  };
};

export const startPollingIndividual = (crypto, baseCurrency) => {
  return {
    type: START_POLLING_INDIVIDUAL,
    payload: { crypto, baseCurrency },
  };
};

export const startPollingTopTen = (currency) => {
  return {
    type: START_POLLING_TOP_TEN,
    payload: { currency },
  };
};

export const stopPolling = () => {
  return {
    type: STOP_POLLING,
  };
};
