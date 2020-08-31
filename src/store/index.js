import { applyMiddleware, createStore } from "redux";
import logger from "redux-logger";

import reducers from "./reducers";

const middleWares = [process.env.NODE_ENV === "development" && logger].filter(
  Boolean
);

const store = createStore(reducers, applyMiddleware(...middleWares));

export default store;
