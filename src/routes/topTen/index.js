import React from "react";
import { connect } from "react-redux";

import {
  setSelectedCurrency,
  startPollingTopTen,
  stopPolling,
} from "./../../store/actions";

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

  return "topten";
};

export default connect((state) => ({ state }), {
  setSelectedCurrency,
  startPollingTopTen,
  stopPolling,
})(TopTen);
