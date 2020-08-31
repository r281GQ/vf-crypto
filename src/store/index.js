import { applyMiddleware, createStore } from "redux";
import logger from "redux-logger";
import createSagaMiddleware from "redux-saga";

import reducers from "./reducers";
import rootSaga from "./sagas";

const sagaMiddleware = createSagaMiddleware();

const middleWares = [
  sagaMiddleware,
  process.env.NODE_ENV === "development" && logger,
].filter(Boolean);

const store = createStore(reducers, applyMiddleware(...middleWares));

sagaMiddleware.run(rootSaga);

export default store;
