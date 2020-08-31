import React from "react";
import { css, jsx } from "@emotion/core";
import { connect } from "react-redux";

import Footer from "../../components/footer";
import Header from "./../../components/header";
import Layout from "./../../components/layout";
import Main from "./../../components/main";

import { startPollingIndividual, stopPolling } from "./../../store/actions";

import theme from "../../theme";

import CurrencySelector from "./../../views/currencySelector";

/** @jsx jsx */
const SingleCoin = (props) => {
  const name = props.match.params.coin;

  const { selectedCurrency, startPollingIndividual, stopPolling } = props;

  React.useEffect(() => {
    startPollingIndividual(name, selectedCurrency);

    return () => {
      stopPolling();
    };
  }, [name, selectedCurrency, startPollingIndividual, stopPolling]);

  const image = props.crypto && props.crypto.data && props.crypto.data.image;
  const initialLoading =
    props.crypto && props.crypto.initialLoading && props.crypto.initialLoading;
  const lastFetched =
    props.crypto && props.crypto.data && props.crypto.lastFetched;
  const marketCap =
    props.crypto && props.crypto.data && props.crypto.data.marketCap;
  const price = props.crypto && props.crypto.data && props.crypto.data.price;
  const supply = props.crypto && props.crypto.data && props.crypto.data.supply;
  const twentyFourHourVolume =
    props.crypto && props.crypto.data && props.crypto.data.twentyFourHourVolume;

  return (
    <Layout>
      <Header>
        <div
          css={css`
            display: flex;
            align-items: center;
          `}
        >
          <CurrencySelector />
        </div>
      </Header>
      <Main>
        <div
          css={css`
            background-color: ${theme().colors.primary};
            width: 100%;
            flex: 1;
          `}
        />
      </Main>
      <Footer>footer</Footer>
    </Layout>
  );
};

export default connect(
  (state, ownProp) => {
    const name = ownProp.match.params.coin;

    return {
      selectedCurrency: state.selectedCurrency,
      crypto: state.cache[`individual_${name}_to_${state.selectedCurrency}`],
    };
  },
  {
    startPollingIndividual,
    stopPolling,
  }
)(SingleCoin);
