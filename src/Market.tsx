import React, { useEffect, useState } from "react";

interface Data {
  rates: {
    [curr: string]: number;
  };
  timestamp: number;
}

const showError = () => {
  return <div>Error</div>;
};

const highlightMinRates = (currencyPairs: string[]) => {
  const table = document.getElementById("dataTable");
  if (table) {
    currencyPairs.forEach((pair) => {
      const cells = Array.from(
        table.querySelectorAll(`.cell[data-currency="${pair}"]`)
      );

      cells.forEach((cell) => cell.classList.remove("cell_highlighted"));

      cells.sort((a, b) => {
        if (
          a instanceof HTMLElement &&
          a.dataset.rate &&
          b instanceof HTMLElement &&
          b.dataset.rate
        ) {
          return Number(a.dataset.rate) < Number(b.dataset.rate) ? -1 : 1;
        }

        return 0;
      });

      cells[0].classList.add("cell_highlighted");
    });
  }
};

const Market = (props: {
  api: string;
  data: { name: string; route: string };
  pairs: string[];
}) => {
  const name = props.data.name;
  const route = `${props.api}${props.data.route}`;

  const [data, setData] = useState({} as Data);

  const updateRates = async (route: string) => {
    const response = await fetch(route, {
      headers: {
        Accept: "application/json",
      },
    });

    if (response.status !== 200) {
      showError();
    } else {
      const data = (await response.json()) as Data;
      setData(data);
    }
  };

  useEffect(() => {
    highlightMinRates(props.pairs);
    updateRates(route);
  });

  const rates = props.pairs.map((pair) => {
    if (!data.rates) {
      return { pair, value: 0 };
    }

    const [curr, base] = pair.split("/");
    if (base === "CUPCAKE") {
      const value = Number(data.rates[curr]).toFixed(2);
      return { pair, value };
    } else {
      const value = Number(data.rates[curr] / data.rates[base]).toFixed(2);
      return { pair, value };
    }
  }, {});

  return (
    <div className="column">
      <div className="cell">{name}</div>
      {rates.map((rate, i) => (
        <div
          key={i}
          className="cell"
          data-currency={rate.pair}
          data-rate={rate.value}
        >
          {rate.value}
        </div>
      ))}
    </div>
  );
};

export default Market;
