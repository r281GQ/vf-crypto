import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import SingleCoin from "./singleCoin";
import TopTen from "./topTen";

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={TopTen} />
        <Route path="/:coin" exact component={SingleCoin} />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
