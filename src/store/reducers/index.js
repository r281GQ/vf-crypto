import { combineReducers } from "redux";

import selectedCurrency from "./selectedCurrency";

const reducers = combineReducers({
  selectedCurrency,
});

export default reducers;
