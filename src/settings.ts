const api = "http://localhost:3000/api/v1";
const markets = [
  { name: "First", route: "/first/poll" },
  { name: "Second", route: "/second/poll" },
  { name: "Third", route: "/third/poll" },
];
const pairs = [
  "RUB/CUPCAKE",
  "USD/CUPCAKE",
  "EUR/CUPCAKE",
  "RUB/USD",
  "RUB/EUR",
  "EUR/USD",
];

export { api, markets, pairs };
