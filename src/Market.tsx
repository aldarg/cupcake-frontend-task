import React, { useEffect, useState } from "react";

interface Data {
  rates: {
    [curr: string]: number;
  };
  timestamp: number;
}

const getTime = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().substr(-2);
  const seconds = date.getSeconds().toString().substr(-2);
  const formattedTime = `${hours}:${minutes}:${seconds}`;

  return formattedTime;
};

const highlightMinRates = (currencyPairs: string[]) => {
  const table = document.getElementById("dataTable");
  if (table) {
    currencyPairs.forEach((pair) => {
      const cells = Array.from(
        table.querySelectorAll(`.cell[data-currency="${pair}"]`)
      );

      const cellsWithRates = cells.filter((cell) => {
        return (
          cell instanceof HTMLElement &&
          cell.dataset.rate &&
          !Number.isNaN(parseFloat(cell.dataset.rate))
        );
      });

      if (cellsWithRates.length === 0) {
        return;
      }

      cellsWithRates.forEach((cell) =>
        cell.classList.remove("cell_highlighted")
      );

      const minRate = Math.min(
        ...cellsWithRates.map((cell: HTMLElement) =>
          parseFloat(cell.dataset.rate!)
        )
      );

      cellsWithRates
        .filter(
          (cell: HTMLElement) => parseFloat(cell.dataset.rate!) === minRate
        )
        .forEach((cell) => cell.classList.add("cell_highlighted"));
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
  const [isError, setError] = useState(false);

  const updateRates = async (route: string) => {
    let response: Response;
    try {
      response = await fetch(route, {
        headers: {
          Accept: "application/json",
        },
      });
    } catch {
      setError(true);
      return;
    }

    if (response.status !== 200) {
      setError(true);
    } else {
      const data = (await response.json()) as Data;
      setError(false);
      setData(data);
    }
  };

  useEffect(() => {
    highlightMinRates(props.pairs);
    updateRates(route);
  });

  const rates = props.pairs.map((pair) => {
    if (!data.rates) {
      return { pair, value: "-" };
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

  let status: string;
  if (isError) {
    status = "Error";
  } else {
    if (data.timestamp) {
      status = getTime(data.timestamp);
    } else {
      status = "-";
    }
  }

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
      <div className="cell">{status}</div>
    </div>
  );
};

export default Market;
