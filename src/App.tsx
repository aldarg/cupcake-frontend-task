import React from "react";
import "./styles.sass";
import { api, markets, pairs } from "./settings";
import Market from "./Market";

const App = () => {
  return (
    <div id="dataTable" className="data-table">
      <div className="headers column">
        <div className="cell">Pair name/market</div>
        {pairs.map((pair) => (
          <div key={pair} className="cell">
            {pair}
          </div>
        ))}
      </div>
      {markets.map((market, i) => (
        <Market key={i} api={api} data={market} pairs={pairs} />
      ))}
    </div>
  );
};

export default App;
