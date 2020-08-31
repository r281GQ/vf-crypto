import { REJECTED, RESOLVED, START_REQUEST } from "./../constants";

const cache = (prevState = {}, action) => {
  /**
   * Start request when there is no entry in the cache.
   */
  if (action.type === START_REQUEST && !prevState[action.payload.cacheEntry]) {
    return {
      ...prevState,
      [action.payload.cacheEntry]: {
        data: undefined,
        loading: true,
        initialLoading: true,
        error: undefined,
        fetchMoreLoading: false,
        hasMore: true,
        lastFetched: undefined,
      },
    };
  }

  /**
   * Start request when there is amn entry in the cache.
   */
  if (action.type === START_REQUEST && prevState[action.payload.cacheEntry]) {
    return {
      ...prevState.cache,
      [action.payload.cacheEntry]: {
        ...prevState[action.payload.cacheEntry],
        loading: true,
      },
    };
  }

  if (action.type === RESOLVED) {
    return {
      ...prevState,
      [action.payload.cacheEntry]: {
        ...prevState[action.payload.cacheEntry],
        data: action.payload.data,
        loading: false,
        initialLoading: false,
        error: undefined,
        lastFetched: Date.now(),
      },
    };
  }

  if (action.type === REJECTED) {
    let error = "Something went wrong.";

    if (
      action.payload.error.message &&
      typeof action.payload.error.message === "string"
    ) {
      error = action.payload.error.message;
    }

    return {
      ...prevState,
      [action.payload.cacheEntry]: {
        ...prevState[action.payload.cacheEntry],
        loading: false,
        initialLoading: false,
        error,
      },
    };
  }

  return prevState;
};

export default cache;
