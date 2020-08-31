import React from "react";
import { connect } from "react-redux";

import { setSelectedCurrency } from "./../../store/actions";
import Dropdown from "../../components/dropdown";

const mapStateToProps = (state) => {
  return { selectedCurrency: state.selectedCurrency };
};

const mapDispatchToProps = {
  setSelectedCurrency,
};

/**
 * This is a reusable selector. Communicate with the redux store.
 */
const CurrencySelector = (props) => {
  return (
    <Dropdown
      title="Select currency"
      value={props.selectedCurrency}
      list={[
        {
          title: "USD",
          key: "USD",
        },
        {
          title: "GBP",
          key: "GBP",
        },
        {
          title: "EUR",
          key: "EUR",
        },
        {
          title: "JPY",
          key: "JPY",
        },
        {
          title: "KRW",
          key: "KRW",
        },
      ]}
      onChange={(e) => props.setSelectedCurrency(e.key)}
    />
  );
  // return (
  //   <select
  //     value={props.selectedCurrency}
  //     onChange={(e) => props.setSelectedCurrency(e.target.value)}
  //   >
  //     <option value="USD">usd</option>
  //     <option value="GBP">gbp</option>
  //     <option value="EUR">eur</option>
  //     <option value="JPY">jpy</option>
  //     <option value="KRW">krw</option>
  //   </select>
  // );
};

export default connect(mapStateToProps, mapDispatchToProps)(CurrencySelector);
