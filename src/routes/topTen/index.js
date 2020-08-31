import React from "react";
import { css, jsx } from "@emotion/core";
import { IoIosArrowRoundDown, IoIosArrowRoundUp } from "react-icons/io";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { createSelector } from "reselect";

import Footer from "./../../components/footer";
import Header from "./../../components/header";
import Layout from "./../../components/layout";
import Main from "./../../components/main";
import Spinner from "./../../components/spinner";
import Table from "./../../components/table";

import {
  setSelectedCurrency,
  startPollingTopTen,
  stopPolling,
} from "./../../store/actions";

import theme from "./../../theme";

import CurrencySelector from "./../../views/currencySelector";
import UpdateNotifier from "./../../views/updateNotifier";

/**
 * One of the most important component in the app.
 *
 * When we order and sort rows we don't provide new information.
 * So with proper "key" usage we can let Fiber know they are the same elements.
 *
 * Also, since all of our props are primitives we can rely on React.memo without custom "equal" func.
 *
 * This means the rows are going to be re-rendered only:
 *
 * * when polling gives us new data
 * * we change the currency
 */
const CryptoInfoRow = React.memo(function CryptoInfoRow(props) {
  const history = useHistory();

  return (
    <Table.Row
      onClick={() => {
        history.push(`/${props.shortHand}`);
      }}
    >
      <Table.TextCell>
        <div
          css={css`
            display: flex;
            align-items: center;
            justify-content: center;
          `}
        >
          <div
            css={css`
              margin-right: 8px;
            `}
          >
            <img
              src={props.image}
              alt={props.currency}
              css={css`
                width: 32px;
                height: 32px;
                border-radius: 50%;
              `}
            />
          </div>
          {props.currency}
        </div>
      </Table.TextCell>
      <Table.TextCell>{props.displayPrice}</Table.TextCell>
      <Table.TextCell>{props.displayMarketCap}</Table.TextCell>
      <Table.TextCell>
        <div
          css={css`
            display: "flex";
            align-items: "center";
            justify-content: "center";
            color: ${props.twentyFourHourChange > 0
              ? theme().colors.green
              : theme().colors.red};
          `}
        >
          {props.displayTwentyFourHourChange}
          {props.twentyFourHourChange > 0 ? (
            <IoIosArrowRoundUp />
          ) : (
            <IoIosArrowRoundDown />
          )}
        </div>
      </Table.TextCell>
    </Table.Row>
  );
});

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
        <Table>
          <Table.Head>
            <Table.HeaderCell defaultSort name="currency">
              Crypto
            </Table.HeaderCell>
            <Table.HeaderCell name="price">Price</Table.HeaderCell>
            <Table.HeaderCell name="marketCap">Market cap</Table.HeaderCell>
            <Table.HeaderCell name="twentyFourHourChange">
              24 hour change
            </Table.HeaderCell>
          </Table.Head>
          <Table.Body>
            {({ order, sort }) => {
              return currencies
                .sort((a, b) => {
                  if (a[sort] > b[sort] && order === "asc") {
                    return 1;
                  }

                  if (a[sort] < b[sort] && order === "asc") {
                    return -1;
                  }

                  if (a[sort] > b[sort] && order === "desc") {
                    return -1;
                  }

                  if (a[sort] < b[sort] && order === "desc") {
                    return 1;
                  }

                  return 0;
                })
                .map((crypto) => {
                  return (
                    <CryptoInfoRow
                      key={crypto.currency}
                      currency={crypto.currency}
                      displayMarketCap={crypto.displayMarketCap}
                      displayPrice={crypto.displayPrice}
                      displayTwentyFourHourChange={
                        crypto.displayTwentyFourHourChange
                      }
                      image={crypto.image}
                      marketCap={crypto.marketCap}
                      price={crypto.price}
                      shortHand={crypto.shortHand}
                      twentyFourHourChange={crypto.twentyFourHourChange}
                    />
                  );
                });
            }}
          </Table.Body>
        </Table>
        {initialLoading && (
          <div
            css={css`
              display: flex;
              flex: 1;
              align-items: center;
              justify-content: center;
            `}
          >
            <Spinner size={96} />
          </div>
        )}
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
