import React from "react";
import { css, jsx } from "@emotion/core";
import { connect } from "react-redux";

import Footer from "../../components/footer";
import Header from "./../../components/header";
import Layout from "./../../components/layout";
import Main from "./../../components/main";
import Spinner from "./../../components/spinner";

import { startPollingIndividual, stopPolling } from "./../../store/actions";

import theme from "../../theme";

import Arrow from "../../views/arrow";
import CurrencySelector from "./../../views/currencySelector";
import UpdateNotifier from "../../views/updateNotifier";

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

  const values = [
    {
      title: "market cap",
      value: marketCap,
    },
    { title: "circulating supply", value: supply },
    { title: "24h volume", value: twentyFourHourVolume },
  ];

  return (
    <Layout>
      <Header>
        <div
          css={css`
            width: 100%;
            display: flex;
            justify-content: start;
            align-items: center;
          `}
        >
          <Arrow />
          <div
            css={css`
              margin-right: 8px;
            `}
          />

          {initialLoading ? (
            <Spinner size={16} />
          ) : (
            <img
              src={image}
              alt={name}
              css={css`
                width: 24px;
                height: 24px;
                border-radius: 50%;
              `}
            />
          )}
          <div
            css={css`
              margin-right: 8px;
            `}
          />
          <div>{name}</div>
          <div
            css={css`
              margin-right: 32px;
            `}
          />
          <div>{initialLoading ? <Spinner size={16} /> : price}</div>
        </div>
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
        >
          <div
            css={css`
              display: grid;
              justify-content: center;
              grid-template-columns: repeat(auto-fill, 500px);
              grid-column-gap: 32px;
              grid-row-gap: 32px;
            `}
          >
            {values.map((value) => {
              return (
                <div
                  key={value.title}
                  css={css`
                    padding: 36px;
                    color: ${theme().colors.text.alt};
                  `}
                >
                  <div
                    css={css`
                      text-transform: uppercase;
                      margin-bottom: 18px;
                    `}
                  >
                    {value.title}
                  </div>
                  <div>
                    {value.value ? value.value : <Spinner color="white" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Main>
      <Footer>
        <UpdateNotifier key={lastFetched} lastFetched={lastFetched} />
      </Footer>
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
