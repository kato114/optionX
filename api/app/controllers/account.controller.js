import axios from "axios";
import { Web3 } from "web3";
import { ethers } from "ethers";

import { DydxClient, Asset, AccountAction, OrderSide, OrderType, TimeInForce, Market } from "@dydxprotocol/v3-client";
import { generateKeyPairUnsafe } from "@dydxprotocol/starkex-lib";

import {
  NETWORK_ID,
  WEB3_RPC_URL,
  DYDX_API_URL,
  RETURN_STATUS,
  USER_STATUS,
  USDC_DECIMAL,
} from "../config/constants.js";

import UsersModel from "../models/users.model.js";

import {
  getEthBalance,
  getUSDCTokenBalance,
  getSignatureForOnboarding,
  approveUSDCTokenForDeposit,
  depositUSDCTokenIntoDyDx,
} from "../utils/web3.utils.js";

export const create = (req, res) => {
  if (!req.params.tg_id) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  try {
    UsersModel.findUserByTelegramID(req.params.tg_id, async (err, data) => {
      if (err) {
        if (err.kind == "not_found") {
          console.log("Start creating new account");

          const eth_wallet = ethers.Wallet.createRandom();

          const user_data = { tg_id: req.params.tg_id };
          user_data.eth_phrase = eth_wallet._mnemonic().phrase;
          user_data.eth_prvkey = eth_wallet._signingKey().privateKey;
          user_data.eth_address = eth_wallet.address;

          const stk_wallet = generateKeyPairUnsafe();
          user_data.stk_prvkey = stk_wallet.privateKey;
          user_data.stk_pubkey = stk_wallet.publicKey;
          user_data.stk_yordkey = stk_wallet.publicKeyYCoordinate;

          const signature = await getSignatureForOnboarding(user_data);

          axios
            .post(
              DYDX_API_URL + "/v3/onboarding",
              {
                starkKey: user_data.stk_pubkey,
                starkKeyYCoordinate: user_data.stk_yordkey,
              },
              {
                headers: {
                  "Dydx-Ethereum-Address": user_data.eth_address,
                  "Dydx-Signature": signature + "00",
                },
              }
            )
            .then((response) => {
              console.log(response.data);

              user_data.public_id = response.data.user.publicId;
              user_data.stk_posId = response.data.account.positionId;

              user_data.dydx_apikey = response.data.apiKey.key;
              user_data.dxdy_passphrase = response.data.apiKey.passphrase;
              user_data.dxdy_secret = response.data.apiKey.secret;

              user_data.user_status = USER_STATUS.ACTIVE;
              user_data.create_date = response.data.account.createdAt;

              UsersModel.registerUser(user_data, async (err, data) => {
                if (err) {
                  res.send({
                    succeed: RETURN_STATUS.FAILED,
                    message: "Server error.",
                  });
                } else {
                  res.send({
                    succeed: RETURN_STATUS.SUCCEED,
                    message: "User created successfully.",
                    data: {
                      "eth_address" : user_data.eth_address,
                      "eth_prvkey" : user_data.eth_prvkey,
                      "eth_phrase" : user_data.eth_phrase,
                      "stk_prvkey" : user_data.stk_prvkey,
                      "stk_pubkey" : user_data.stk_pubkey,
                      "stk_yordkey" : user_data.stk_yordkey,
                    }
                  });
                }
              });
            })
            .catch((error) => {
              console.log("error", error);
              res.send({
                succeed: RETURN_STATUS.FAILED,
                message: "Server error.",
              });
            });
        } else {
          res.send({
            succeed: RETURN_STATUS.FAILED,
            message: "Server error.",
          });
        }
      } else {
        res.send({
          succeed: RETURN_STATUS.FAILED,
          message: "Account already created.",
        });
      }
    });
  } catch (error) {
    res.send({
      succeed: RETURN_STATUS.FAILED,
      message: "Server error.",
    });
  }
};

export const deposit = async (req, res) => {
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
      const user = await client.private.getUser();
      const { account } = await client.private.getAccount(data.eth_address);

      const signature = await client.private.getRegistration();
      
      const eth_balance = await getEthBalance(data.eth_address);
      const usdc_balance = await getUSDCTokenBalance(data.eth_address);

      if (req.body.amount * 10 ** USDC_DECIMAL <= usdc_balance) {
        const approve_status = await approveUSDCTokenForDeposit(
          data.eth_address,
          data.eth_prvkey,
          req.body.amount
        );
        if (approve_status == true) {
          const deposit_status = await depositUSDCTokenIntoDyDx(
            data.eth_prvkey,
            data.stk_pubkey,
            data.stk_posId,
            Number(account.quoteBalance) > 0 ? "0x" : signature.signature,
            req.body.amount
          );

          if (deposit_status) {
            res.send({
              succeed: RETURN_STATUS.SUCCEED,
              message: "Check balance after about 5 minnutes.",
            });
          } else {
            res.send({
              succeed: RETURN_STATUS.FAILED,
              message:
                "Deposit token failed. Check if your ETH balance is enough and try again.",
            });
          }
        } else {
          res.send({
            succeed: RETURN_STATUS.FAILED,
            message:
              "Approve token failed. Check if your ETH balance is enough and try again.",
          });
        }
      } else {
        res.send({
          succeed: RETURN_STATUS.FAILED,
          message:
            "You don't have enough USDC. Please send USDC to the connected wallet.",
        });
      }
    }
  });
};

export const withdraw = async (req, res) => {
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

      const { user } = await client.private.getUser();
      const { account } = await client.private.getAccount(data.eth_address);
      

      const { liquidityProviders } = await client.public.getFastWithdrawals(
        { 
          creditAsset: Asset.USDC,
          creditAmount: req.body.amount
        }
      );

      const lpIds = Object.keys(liquidityProviders);

      try {
        for( let i  = 0; i < lpIds.length; i++) {
          if(Number(liquidityProviders[lpIds[i]].availableFunds) > Number(req.body.amount)
          && liquidityProviders[lpIds[i]].quote.creditAmount > 0) {
            const fastWithdrawal = await client.private.createFastWithdrawal(
              {
                lpStarkKey :liquidityProviders[lpIds[i]].starkKey,
                creditAsset: Asset.USDC,
                creditAmount: liquidityProviders[lpIds[i]].quote.creditAmount,
                debitAmount: liquidityProviders[lpIds[i]].quote.debitAmount,
                toAddress: user.ethereumAddress,
                lpPositionId: lpIds[i],
                signature: false,
                expiration: '2023-10-30T22:49:31.588Z',
              },
              account.positionId,
            );

            res.send({
              succeed: RETURN_STATUS.SUCCEED,
              message: "Withdrawal request success.",
              data: fastWithdrawal
            });
            
            return;
          }
        }
      } catch (error) {
        console.log(error)
        res.send({
          succeed: RETURN_STATUS.FAILED,
          message: "Server error",
        });
      }
    }
  });
}

export const onboarding = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  res.send({ succeed: RETURN_STATUS.SUCCEED, tgId: req.params.tg_id });
};

export const user = async (req, res) => {
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

      const { user } = await client.private.getUser();
      const { account } = await client.private.getAccount(data.eth_address);
      const profilePrivate = await client.private.getProfilePrivate();
      const { positions } = await client.private.getPositions({});

    
      res.send({
        succeed: RETURN_STATUS.SUCCEED,
        message: "User is registered.",
        data: {
          user: user,
          account: account,
          profilePrivate: profilePrivate,
          positions: positions,
        }
      });
    }
  });
}