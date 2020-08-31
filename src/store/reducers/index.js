import { combineReducers } from "redux";

const reducers = combineReducers({
  selectedCurrency: (prevState = "USD") => prevState,
});

export default reducers;
