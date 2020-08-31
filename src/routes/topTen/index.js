import React from "react";
import { css, jsx } from "@emotion/core";
import { connect } from "react-redux";

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

/** @jsx jsx */
const TopTen = (props) => {
  React.useEffect(() => {
    props.setSelectedCurrency("EUR");
  }, []);

  React.useEffect(() => {
    props.startPollingTopTen("EUR");

    return () => {
      props.stopPolling();
    };
  }, []);

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
      <Footer>footer</Footer>
    </Layout>
  );
};

export default connect((state) => ({ state }), {
  setSelectedCurrency,
  startPollingTopTen,
  stopPolling,
})(TopTen);
