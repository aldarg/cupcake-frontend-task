const port = process.env.NODE_ENV === 'production' ? 3010 : 3000;
const api = `http://localhost:${port}/api/v1`;
const markets = [
  { name: 'First', route: '/first/poll' },
  { name: 'Second', route: '/second/poll' },
  { name: 'Third', route: '/third/poll' },
];
const pairs = [
  'RUB/CUPCAKE',
  'USD/CUPCAKE',
  'EUR/CUPCAKE',
  'RUB/USD',
  'RUB/EUR',
  'EUR/USD',
];

export { api, markets, pairs };
