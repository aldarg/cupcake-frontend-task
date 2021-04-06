import React, { useState } from "react";
import "../styles/styles.sass";
import { api, markets, pairs } from "../settings";
import Market from "./Market";

const App: React.FC = () => {
  const [isFetching, setFetching] = useState(false);

  const controller = new AbortController();
  const { signal } = controller;

  return (
    <>
      <div id="dataTable" className="data-table">
        <div className="headers column">
          <div className="cell column_headers">Pair name/market</div>
          {pairs.map((pair) => (
            <div key={pair} className="cell">
              {pair}
            </div>
          ))}
          <div className="cell column_headers">Status/Last updated</div>
        </div>
        {markets.map((market, i) => (
          <Market
            key={i}
            route={api + market.route}
            name={market.name}
            pairs={pairs}
            fetching={{ isFetching, setFetching }}
            signal={signal}
          />
        ))}
      </div>
      <div className="btn-wrapper">
        <button
          type="button"
          className="start-btn"
          onClick={() => {
            setFetching(!isFetching);
            controller.abort();
          }}
        >
          {isFetching ? "Stop" : "Start"}
        </button>
      </div>
    </>
  );
};

export default App;
