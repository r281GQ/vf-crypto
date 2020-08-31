import { START_REQUEST, RESOLVED, REJECTED } from "../../../store/constants";

import cache from "../../../store/reducers/cache";

describe("cache", () => {
  test("Should return empty object with no state", () => {
    const nextState = cache(undefined, {});

    expect(nextState).toEqual({});
  });

  test("Should init new cache entry if its not in the cache", () => {
    const nextState = cache(
      {},
      { type: START_REQUEST, payload: { cacheEntry: "test1" } }
    );

    expect(nextState).toEqual({
      test1: {
        data: undefined,
        error: undefined,
        fetchMoreLoading: false,
        hasMore: true,
        initialLoading: true,
        lastFetched: undefined,
        loading: true,
      },
    });
  });

  test("Should leave entry as it is if it is defined", () => {
    const nextState = cache(
      {
        test1: {
          data: { value: "testValue" },
          error: undefined,
          fetchMoreLoading: false,
          hasMore: true,
          initialLoading: true,
          lastFetched: undefined,
          loading: true,
        },
      },
      { type: START_REQUEST, payload: { cacheEntry: "test1" } }
    );

    expect(nextState).toEqual({
      test1: {
        data: { value: "testValue" },
        error: undefined,
        fetchMoreLoading: false,
        hasMore: true,
        initialLoading: true,
        lastFetched: undefined,
        loading: true,
      },
    });
  });

  test("Should set loading states to false, add timeStamp, clear error and put data on RESOLVED", () => {
    const nextState = cache(
      {
        test1: {
          data: undefined,
          error: "something went wrong",
          fetchMoreLoading: false,
          hasMore: true,
          initialLoading: true,
          lastFetched: undefined,
          loading: true,
        },
      },
      { type: RESOLVED, payload: { cacheEntry: "test1", data: { hey: "ho" } } }
    );

    expect(nextState).toEqual({
      test1: {
        data: { hey: "ho" },
        error: undefined,
        fetchMoreLoading: false,
        hasMore: true,
        initialLoading: false,
        lastFetched: expect.any(Number),
        loading: false,
      },
    });
  });

  test("Should set loading states to false and add error message when REJECTED and error message is string", () => {
    const nextState = cache(
      {
        test1: {
          data: { hey: "ho" },
          error: undefined,
          fetchMoreLoading: false,
          hasMore: true,
          initialLoading: true,
          lastFetched: undefined,
          loading: true,
        },
      },
      {
        type: REJECTED,
        payload: {
          cacheEntry: "test1",
          error: { message: "Not good" },
        },
      }
    );

    expect(nextState).toEqual({
      test1: {
        data: { hey: "ho" },
        error: "Not good",
        fetchMoreLoading: false,
        hasMore: true,
        initialLoading: false,
        lastFetched: undefined,
        loading: false,
      },
    });
  });

  test("Should set loading states to false and add error default message when REJECTED and error message is not string", () => {
    const nextState = cache(
      {
        test1: {
          data: { hey: "ho" },
          error: undefined,
          fetchMoreLoading: false,
          hasMore: true,
          initialLoading: true,
          lastFetched: undefined,
          loading: true,
        },
      },
      {
        type: REJECTED,
        payload: {
          cacheEntry: "test1",
          error: {},
        },
      }
    );

    expect(nextState).toEqual({
      test1: {
        data: { hey: "ho" },
        error: "Something went wrong.",
        fetchMoreLoading: false,
        hasMore: true,
        initialLoading: false,
        lastFetched: undefined,
        loading: false,
      },
    });
  });
});
