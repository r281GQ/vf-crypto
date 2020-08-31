import React from "react";
import { connect } from "react-redux";

import { setSelectedCurrency } from "./../../store/actions";

const TopTen = (props) => {
  React.useEffect(() => {
    props.setSelectedCurrency("EUR");
  }, []);

  return "topten";
};

export default connect((state) => ({ state }), { setSelectedCurrency })(TopTen);
