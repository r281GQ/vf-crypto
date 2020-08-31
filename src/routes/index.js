import React from "react";
import { BrowserRouter, Route } from "react-router-dom";

const TopTen = () => "topTen";
const SingleCoin = () => "singleCoin";

const Routes = () => {
  return (
    <BrowserRouter>
      <Route path="/" exact component={TopTen} />
      <Route path="/:coin" exact component={SingleCoin} />
    </BrowserRouter>
  );
};

export default Routes;
