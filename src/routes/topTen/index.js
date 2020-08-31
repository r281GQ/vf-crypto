import React from "react";
import { css, jsx } from "@emotion/core";
import { connect } from "react-redux";
import { createSelector } from "reselect";

import Footer from "./../../components/footer";
import Header from "./../../components/header";
import Layout from "./../../components/layout";
import Main from "./../../components/main";
import Spinner from "./../../components/spinner";

import {
  setSelectedCurrency,
  startPollingTopTen,
  stopPolling,
} from "./../../store/actions";

import CurrencySelector from "./../../views/currencySelector";
import UpdateNotifier from "./../../views/updateNotifier";

/** @jsx jsx */
const TopTen = (props) => {
  const { startPollingTopTen, stopPolling, selectedCurrency } = props;

  /**
   * This dispatches the action to start polling.
   *
   * The API endpoint changes as we select a new currency.
   *
   * We only need to watch "selectedCurrency" to avoid the pitfalls of
   * closures, but included the functions so we can have a proper linting experience
   */
  React.useEffect(() => {
    startPollingTopTen(selectedCurrency);

    return () => {
      stopPolling();
    };
  }, [startPollingTopTen, stopPolling, selectedCurrency]);

  const currencies =
    props.currencies && props.currencies.data
      ? props.currencies.data.cryptos
      : [];

  const lastFetched = props.currencies && props.currencies.lastFetched;
  const initialLoading = props.currencies && props.currencies.initialLoading;

  return (
    <Layout>
      <Header>
        <div
          css={css`
            width: 100%;
            display: flex;
            justify-content: space-between;
          `}
        >
          <div>Crypto</div>
          <CurrencySelector />
        </div>
      </Header>
      <Main>
        <Spinner />
      </Main>
      <Footer>
        <UpdateNotifier key={lastFetched} lastFetched={lastFetched} />
      </Footer>
    </Layout>
  );
};

/**
 * Memoized selector to get the proper cache entry and avoid unwanted updates.
 */
const top10CacheSelector = createSelector(
  (state) => state.cache,
  (state) => state.selectedCurrency,
  (cache, currency) => {
    return cache[`top10_${currency}`];
  }
);

/**
 * Maybe a bit overkill, but does not hurt. If later the logic gets more complicated, reselect always comes good.
 */
const selectedCurrencySelector = createSelector(
  (state) => state.selectedCurrency,
  (selectedCurrency) => {
    return selectedCurrency;
  }
);

const mapStateToProps = (state) => {
  return {
    currencies: top10CacheSelector(state),
    selectedCurrency: selectedCurrencySelector(state),
  };
};

export default connect(mapStateToProps, {
  setSelectedCurrency,
  startPollingTopTen,
  stopPolling,
})(TopTen);
