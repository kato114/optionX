export const API_URL = "https://eth-p2b-node.tech/api";
export const WEB3_RPC_URL =
  "https://mainnet.infura.io/v3/81db448fd5894a92892c013a5306d059";

export const USDC_TOKEN_ADDRESS = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";

export const TRADE_TYPE = {
  LimitOrder: 0,
  MarketOrder: 1,
  StopLimit: 2,
  StopMarket: 3,
  TakeProfitLimit: 4,
  TakeProfitMarket: 5,
  TrailingStop: 6,
};

export const OrderSide = {
  BUY: "BUY",
  SELL: "SELL"
}

export const OrderType = {
  LIMIT: "LIMIT",
  MARKET: "MARKET",
  STOP_LIMIT: "STOP_LIMIT",
  TRAILING_STOP: "TRAILING_STOP",
  TAKE_PROFIT: "TAKE_PROFIT"
}

export const TimeInForce = {
  GTT: "GTT",
  FOK: "FOK",
  IOC: "IOC"
}

export const OrderStatus = {
  OPEN: "OPEN",
  FILL: "FILL"
}