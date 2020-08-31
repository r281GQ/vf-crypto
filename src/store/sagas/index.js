import { all, call, take, race, put } from "redux-saga/effects";

import { REJECTED, RESOLVED, START_REQUEST } from "./../constants";
import { delay } from "./../../util/misc";
import { fetchTop10Crypto } from "./../../util/network";

function* handleTopTenRequest(currency) {
  yield put({
    type: START_REQUEST,
    payload: { cacheEntry: `top10_${currency}` },
  });

  try {
    const result = yield call(fetchTop10Crypto, currency);

    yield put({
      type: RESOLVED,
      payload: { cacheEntry: `top10_${currency}`, data: result },
    });
  } catch (error) {
    yield put({
      type: REJECTED,
      payload: { cacheEntry: `top10_${currency}`, error },
    });
  }
}

function* pollTopTen(currency) {
  while (true) {
    try {
      yield call(handleTopTenRequest, currency);

      yield call(delay, 60);
    } catch (error) {
      yield put({ type: "STOP_POLLING", error });
    }
  }
}

function* topTenPollWorker() {
  while (true) {
    const action = yield take("START_POLLING_TOP_TEN");

    yield race([
      call(pollTopTen, action.payload.currency),
      take("STOP_POLLING"),
    ]);
  }
}

function* rootSaga() {
  yield all([topTenPollWorker()]);
}

export default rootSaga;
