import { Web3 } from "web3";

import { DydxClient, Asset } from "@dydxprotocol/v3-client";

import {
  NETWORK_ID,
  WEB3_RPC_URL,
  DYDX_API_URL,
  RETURN_STATUS,
} from "../config/constants.js";

export const markets = async (req, res) => {
  const web3 = new Web3(WEB3_RPC_URL);

  const client = new DydxClient(DYDX_API_URL, {
    web3: web3,
    web3Provider: WEB3_RPC_URL,
    networkId: NETWORK_ID,
  });

  const { markets } = await client.public.getMarkets();

  res.send({
    succeed: RETURN_STATUS.SUCCEED,
    message: "Markets list",
    data: {
      markets: markets,
    }
  });
}

export const lplist = async (req, res) => {
  const web3 = new Web3(WEB3_RPC_URL);
  const client = new DydxClient(DYDX_API_URL, {
    web3: web3,
    web3Provider: WEB3_RPC_URL,
    networkId: NETWORK_ID,
  });

  const { liquidityProviders } = await client.public.getFastWithdrawals(
    { 
      creditAsset: Asset.USDC,
      creditAmount: req.query.amount
    }
  );

  res.send({
    succeed: RETURN_STATUS.SUCCEED,
    message: "LP Providers",
    data: {
      liquidityProviders: liquidityProviders,
    }
  });
}