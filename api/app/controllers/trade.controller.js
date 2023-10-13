import { Web3 } from "web3";
import { ethers } from "ethers";

import { DydxClient, OrderSide, OrderType, TimeInForce, Market } from "@dydxprotocol/v3-client";

import {
  NETWORK_ID,
  WEB3_RPC_URL,
  DYDX_API_URL,
  RETURN_STATUS,
} from "../config/constants.js";

import UsersModel from "../models/users.model.js";

export const openOrder = async (req, res) => {
  if (!req.params.tg_id) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  UsersModel.findUserByTelegramID(req.params.tg_id, async (err, data) => {
    if (err) {
      if (err.kind == "not_found") {
        res.send({
          succeed: RETURN_STATUS.FAILED,
          message: "Account was not created.",
        });
      } else {
        res.send({
          succeed: RETURN_STATUS.FAILED,
          message: "Server error.",
        });
      }
    } else {
      const web3 = new Web3(WEB3_RPC_URL);
      web3.eth.accounts.wallet.add(data.eth_prvkey);

      const client = new DydxClient(DYDX_API_URL, {
        web3: web3,
        web3Provider: WEB3_RPC_URL,
        networkId: NETWORK_ID,
        apiKeyCredentials: {
          key: data.dydx_apikey,
          secret: data.dxdy_secret,
          passphrase: data.dxdy_passphrase,
        },
        starkPrivateKey: data.stk_prvkey,
      });

      const { account } = await client.private.getAccount(data.eth_address);
    
      try {
        const order = await client.private.createOrder(
          {
            market: req.body.market,
            side: req.body.side,
            type: req.body.type,
            timeInForce: req.body.timeInForce, 
            postOnly: req.body.postOnly,
            size: req.body.size,
            price: req.body.price,
            limitFee: req.body.limitFee,
            expiration: '2023-12-21T21:30:20.200Z',
          },
          account.positionId, // required for creating the order signature
        );

        res.send({
          succeed: RETURN_STATUS.SUCCEED,
          message: "Order open succeed.",
          data : order
        });
      } catch (error) {
        res.send({
          succeed: RETURN_STATUS.FAILED,
          message: error.data.errors[0].msg,
        });
      } 
    }
  });    
}

export const getOrder = async (req, res) => {
  if (!req.params.tg_id) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  UsersModel.findUserByTelegramID(req.params.tg_id, async (err, data) => {
    if (err) {
      if (err.kind == "not_found") {
        res.send({
          succeed: RETURN_STATUS.FAILED,
          message: "Account was not created.",
        });
      } else {
        res.send({
          succeed: RETURN_STATUS.FAILED,
          message: "Server error.",
        });
      }
    } else {
      const web3 = new Web3(WEB3_RPC_URL);
      web3.eth.accounts.wallet.add(data.eth_prvkey);

      const client = new DydxClient(DYDX_API_URL, {
        web3: web3,
        web3Provider: WEB3_RPC_URL,
        networkId: NETWORK_ID,
        apiKeyCredentials: {
          key: data.dydx_apikey,
          secret: data.dxdy_secret,
          passphrase: data.dxdy_passphrase,
        },
        starkPrivateKey: data.stk_prvkey,
      });

      const {orders} = await client.private.getOrders(
        {
          market: req.body.market,
          limit: req.body.limit,
        },
      );
      const {fills} = await client.private.getFills(
        {
          market: req.body.market,
        },
      );

      res.send({
        succeed: RETURN_STATUS.SUCCEED,
        message: "Order list.",
        data: {
          order: orders,
          allFills: fills,
        }
      });
    }
  });
}

export const cancelOrder = async(req, res) => {
  UsersModel.findUserByTelegramID(req.params.tg_id, async (err, data) => {
    if (err) {
      if (err.kind == "not_found") {
        res.send({
          succeed: RETURN_STATUS.FAILED,
          message: "Account was not created.",
        });
      } else {
        res.send({
          succeed: RETURN_STATUS.FAILED,
          message: "Server error.",
        });
      }
    } else {
      const web3 = new Web3(WEB3_RPC_URL);
      web3.eth.accounts.wallet.add(data.eth_prvkey);

      const client = new DydxClient(DYDX_API_URL, {
        web3: web3,
        web3Provider: WEB3_RPC_URL,
        networkId: NETWORK_ID,
        apiKeyCredentials: {
          key: data.dydx_apikey,
          secret: data.dxdy_secret,
          passphrase: data.dxdy_passphrase,
        },
        starkPrivateKey: data.stk_prvkey,
      });

      try {
        await client.private.cancelOrder(req.params.order_id);

        res.send({
          succeed: RETURN_STATUS.SUCCEED,
          message: "Order cancel succeed."
        });
      } catch (error) {
        res.send({
          succeed: RETURN_STATUS.FAILED,
          message: "Order cancel failed. Try again later"
        });
      }
    }
  });

}

export const closePosition = async (req, res) => {
  if (!req.params.tg_id) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  UsersModel.findUserByTelegramID(req.params.tg_id, async (err, data) => {
    if (err) {
      if (err.kind == "not_found") {
        res.send({
          succeed: RETURN_STATUS.FAILED,
          message: "Account was not created.",
        });
      } else {
        res.send({
          succeed: RETURN_STATUS.FAILED,
          message: "Server error.",
        });
      }
    } else {
      const web3 = new Web3(WEB3_RPC_URL);
      web3.eth.accounts.wallet.add(data.eth_prvkey);

      const client = new DydxClient(DYDX_API_URL, {
        web3: web3,
        web3Provider: WEB3_RPC_URL,
        networkId: NETWORK_ID,
        apiKeyCredentials: {
          key: data.dydx_apikey,
          secret: data.dxdy_secret,
          passphrase: data.dxdy_passphrase,
        },
        starkPrivateKey: data.stk_prvkey,
      });

      const { account } = await client.private.getAccount(data.eth_address);
      try {
        const order = await client.private.createOrder(
          {
            market: req.body.market,
            side: OrderSide.SELL,
            type: OrderType.MARKET,
            timeInForce: TimeInForce.FOK, 
            size: req.body.size,
            price: req.body.price,
            postOnly: false,
            limitFee: "0.0015",
            expiration: '2023-12-21T21:30:20.200Z',
          },
          account.positionId, // required for creating the order signature
        );

        res.send({
          succeed: RETURN_STATUS.SUCCEED,
          message: "Close position succeed.",
          data : order
        });
      } catch (error) {
        console.log(error)
        res.send({
          succeed: RETURN_STATUS.FAILED,
          message: error.data.errors[0].msg,
        });
      } 
    }
  });    
}