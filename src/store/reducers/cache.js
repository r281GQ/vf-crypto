import { REJECTED, RESOLVED, START_REQUEST } from "./../constants";

/**
 * The core idea of the app is to have a central cache.
 *
 * This is a very naive imitation of Apollo's InMemory cache.
 *
 * We can have entries, all of them has their internal state
 * and of course their data.
 *
 * With this structure later we can link two entities together.
 *
 * A cache entry is defined by a unique id. That is set up initially by the
 * "START_REQUEST" action.
 *
 * This checks if the entry is there. If not, it creates it with the default values.
 * If it is, just overwrites some state.
 *
 * These values are:
 *
 * * data: the data that we want to store.
 * * loading: loading state that can change over time. For example when we poll or refetch
 *            this can be toggled.
 * * initialLoading: This will be only true when we try to fetch for the first time. The aim to make two
 *                   different loading indicator is to use the cache without loading state and still be
 *                   able to refetch in the background.
 * * error: whatever error the fetch request or any other business logic might throw. This is deleted
 *          when a subsequent fetch succeeds.
 * * fetchMoreLoading, hasMore: just to support pagination.
 * * lastFetched: timestamp when was the last fetch.
 *
 *
 * Based on the outcome, the cache can have a "RESOLVED" or a "REJECTED" action. They both update the store
 * accordingly.
 */
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
