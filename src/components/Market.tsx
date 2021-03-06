/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useEffect, useState } from "react";

interface Data {
  rates: {
    [curr: string]: number;
  };
  timestamp: number;
}

interface MarketProps {
  route: string;
  name: string;
  pairs: string[];
  fetching: {
    isFetching: boolean;
    setFetching: React.Dispatch<React.SetStateAction<boolean>>;
  };
  signal: AbortSignal;
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

  if (!table) {
    return;
  }

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

    cellsWithRates.forEach((cell) => cell.classList.remove("cell_highlighted"));

    const minRate = Math.min(
      ...cellsWithRates.map((cell: HTMLElement) =>
        parseFloat(cell.dataset.rate!)
      )
    );

    cellsWithRates
      .filter((cell: HTMLElement) => parseFloat(cell.dataset.rate!) === minRate)
      .forEach((cell) => cell.classList.add("cell_highlighted"));
  });
};

const Market: React.FC<MarketProps> = ({
  route,
  name,
  pairs,
  fetching: { isFetching, setFetching },
  signal,
}: MarketProps) => {
  const [data, setData] = useState({} as Data);
  const [isError, setError] = useState(false);

  const updateRates = async (route: string) => {
    let response: Response;
    try {
      response = await fetch(route, {
        headers: {
          Accept: "application/json",
        },
        signal: signal,
      });
    } catch (err) {
      if (err.name != "AbortError") {
        setFetching(false);
        setError(true);
      }
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
    highlightMinRates(pairs);

    if (isFetching) {
      updateRates(route);
    }
  });

  const rates = pairs.map((pair) => {
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
  });

  let marketStatus: string;
  if (isError) {
    marketStatus = "Error";
  } else {
    if (data.timestamp) {
      marketStatus = getTime(data.timestamp);
    } else {
      marketStatus = "-";
    }
  }

  return (
    <div className="column">
      <div className="cell column_headers">{name}</div>
      {rates.map((rate, i) => (
        <div
          key={i}
          className="cell cell_data"
          data-currency={rate.pair}
          data-rate={rate.value}
        >
          {rate.value}
        </div>
      ))}
      <div className={`cell cell_data ${isError ? "cell_error" : ""}`}>
        {marketStatus}
      </div>
    </div>
  );
};

export default Market;
