import { SET_SELECTED_CURRENCY } from "./../constants";

/**
 *  This reducer stores the currency we are currently using.
 *
 *  This can be argued where to put it. Is this app level? Or only a certain route
 *  is concerned about this value. At this point this sits in redux.
 */
const selectedCurrency = (prevState = "USD", action) => {
  if (action.type === SET_SELECTED_CURRENCY) {
    return action.payload.currency;
  }

  return prevState;
};

export default selectedCurrency;
