import { combineReducers } from "redux";

import cache from "./cache";
import selectedCurrency from "./selectedCurrency";

const reducers = combineReducers({
  cache,
  selectedCurrency,
});

export default reducers;
