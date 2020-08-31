import { css, jsx } from "@emotion/core";

import Footer from "../../components/footer";
import Header from "./../../components/header";
import Layout from "./../../components/layout";
import Main from "./../../components/main";

import theme from "../../theme";

import CurrencySelector from "./../../views/currencySelector";

/** @jsx jsx */
const SingleCoin = () => {
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

export default SingleCoin;
