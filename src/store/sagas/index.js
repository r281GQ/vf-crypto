import { all, call, take, race, put } from "redux-saga/effects";

import {
  REJECTED,
  RESOLVED,
  START_REQUEST,
  START_POLLING_INDIVIDUAL,
  START_POLLING_TOP_TEN,
  STOP_POLLING,
} from "./../constants";
import { delay } from "./../../util/misc";
import { fetchIndividualCrypto, fetchTop10Crypto } from "./../../util/network";

/**
 *  Higher order function to generalize cache manipulation side effects.
 *
 *  Takes callFunction that must return a promise and idFunction that must return the cache
 *  entry name.
 *
 *  Both function will receive the arguments that the generator function was called with.
 */
const createRequestHandler = ({ callFunction, idFunction }) => {
  return function* (...args) {
    yield put({
      type: START_REQUEST,
      payload: { cacheEntry: idFunction(...args) },
    });

    try {
      const result = yield callFunction(...args);

      yield put({
        type: RESOLVED,
        payload: { cacheEntry: idFunction(...args), data: result },
      });
    } catch (error) {
      yield put({
        type: REJECTED,
        payload: { cacheEntry: idFunction(...args), error },
      });
    }
  };
};

/**
 * Usage of the above HOC. Takes the callFunction and the idFunction and
 * returns a specific generator function to that cacheEntry.
 */
const handleTopTenRequest = createRequestHandler({
  callFunction: (currency) => {
    return call(fetchTop10Crypto, currency);
  },
  idFunction: (currency) => {
    return `top10_${currency}`;
  },
});

const handleIndividualRequest = createRequestHandler({
  callFunction: function (crypto, baseCurrency) {
    return call(fetchIndividualCrypto, crypto, baseCurrency);
  },
  idFunction: function (crypto, baseCurrency) {
    return `individual_${crypto}_to_${baseCurrency}`;
  },
});

/**
 * Fires a request in every 60 sec.
 */
function* pollTopTen(currency) {
  while (true) {
    try {
      yield call(handleTopTenRequest, currency);

      yield call(delay, 60);
    } catch (error) {
      yield put({ type: STOP_POLLING, error });
    }
  }
}

/**
 * Fires a request in every 60 sec.
 */
function* pollIndividual(crypto, baseCurrency) {
  while (true) {
    try {
      yield call(handleIndividualRequest, crypto, baseCurrency);

      yield call(delay, 60);
    } catch (error) {
      yield put({ type: STOP_POLLING, error });
    }
  }
}

/**
 * Watches for "START_POLLING_TOP_TEN" actions.
 */
function* topTenPollWorker() {
  while (true) {
    const action = yield take(START_POLLING_TOP_TEN);

    yield race([call(pollTopTen, action.payload.currency), take(STOP_POLLING)]);
  }
}

/**
 * Watches for "START_POLLING_INDIVIDUAL" actions.
 */
function* individualPollWorker() {
  while (true) {
    const action = yield take(START_POLLING_INDIVIDUAL);

    yield race([
      call(pollIndividual, action.payload.crypto, action.payload.baseCurrency),
      take(STOP_POLLING),
    ]);
  }
}

/**
 * We have two side-effects in the store:
 *
 * * polling of the top ten request
 * * polling of the individual requests
 */
function* rootSaga() {
  yield all([topTenPollWorker(), individualPollWorker()]);
}

export default rootSaga;
