import axios from "axios";
import Web3 from "web3";
import { BigNumber } from "ethers";

import {
  WEB3_RPC_URL,
  ETHERSCAN_API_URL,
  ETHERSCAN_API_KEY,
  P2B_TOKEN_SUPPLY,
  P2B_MAX_OUT,
  P2B_MIN_KEEP,
  RETURN_STATUS,
  TREASURY_WALLET_ADDRESS,
  TREASURY_WALLET_PRVKEY,
  REFERRAL_FEE,
  DEV_WALLET_ADDRESS,
} from "../config/constants.js";
import { P2B_TOKEN_ADDRESS } from "../config/contracts.js";

import {
  getEthBalance,
  getUSDCTokenBalance,
  getSignatureForOnboarding,
  approveUSDCTokenForDeposit,
} from "../utils/web3.utils.js";

import RequestsModel from "../models/requests.model.js";
import ReferralsModel from "../models/referrals.model.js";
import RewardsModel from "../models/rewards.model.js";
import FundsModel from "../models/funds.model.js";

import { ERC20_ABI } from "../config/abis/ERC20.js";

export const history = async (req, res) => {
  if (!req.params.address) {
    res.status(400).send({
      message: "Content can not be empty!",
    });

    return;
  }

  try {
    let history_rewards = await RewardsModel.getHistoryByUser({
      address: req.params.address,
    });

    res.send({
      succeed: RETURN_STATUS.SUCCEED,
      message: "Get history successfully.",
      data: history_rewards,
    });
  } catch (error) {
    console.log(error);

    res.send({
      succeed: RETURN_STATUS.FAILED,
      message: "Server error.",
    });
  }
};

export const claimed = async (req, res) => {
  if (!req.params.address) {
    res.status(400).send({
      message: "Content can not be empty!",
    });

    return;
  }

  try {
    let history_requests = await RequestsModel.getHistoryByUser({
      address: req.params.address,
    });

    res.send({
      succeed: RETURN_STATUS.SUCCEED,
      message: "Get history successfully.",
      data: history_requests,
    });
  } catch (error) {
    console.log(error);

    res.send({
      succeed: RETURN_STATUS.FAILED,
      message: "Server error.",
    });
  }
};

export const statistic = async (req, res) => {
  if (!req.params.address) {
    res.status(400).send({
      message: "Content can not be empty!",
    });

    return;
  }

  try {
    let pending_rewards = await RewardsModel.find({
      address: req.params.address,
      status: 0,
    });

    let pending_reward_amount = BigNumber.from("0");
    for (let i = 0; i < pending_rewards.length; i++) {
      pending_reward_amount = pending_reward_amount.add(
        BigNumber.from(pending_rewards[i].unclaimed_rewards)
      );
    }

    let claimed_rewards = await RewardsModel.find({
      address: req.params.address,
      status: 1,
    });

    let claimed_reward_amount = BigNumber.from("0");
    for (let i = 0; i < claimed_rewards.length; i++) {
      claimed_reward_amount = claimed_reward_amount.add(
        BigNumber.from(claimed_rewards[i].unclaimed_rewards)
      );
    }

    let total_reward_amount = pending_reward_amount.add(claimed_reward_amount);

    res.send({
      succeed: RETURN_STATUS.SUCCEED,
      message: "Get Statstic Successfully.",
      data: {
        total_reward: total_reward_amount.toString(),
        claimed_reward: claimed_reward_amount.toString(),
        unclaimed_reward: pending_reward_amount.toString(),
      },
    });
  } catch (error) {
    res.send({
      succeed: RETURN_STATUS.FAILED,
      message: "Server error.",
    });
  }
};

export const analysis = async (req, res) => {
  let holders_response = await axios.get(
    ETHERSCAN_API_URL +
      "?module=token" +
      "&action=tokenholderlist" +
      "&contractaddress=" +
      P2B_TOKEN_ADDRESS +
      "&apikey=" +
      ETHERSCAN_API_KEY
  );

  let holders = holders_response.data.result;

  let total_rewards = await FundsModel.getAll({ status: 0 });
  let total_reward_amount = BigNumber.from("0");
  for (let i = 0; i < total_rewards.length; i++) {
    total_reward_amount = total_reward_amount.add(
      BigNumber.from(total_rewards[i].amount)
    );
  }

  let claimed_rewards = await RequestsModel.getAll();
  let claimed_reward_amount = BigNumber.from("0");
  for (let i = 0; i < claimed_rewards.length; i++) {
    claimed_reward_amount = claimed_reward_amount.add(
      BigNumber.from(claimed_rewards[i].reward)
    );
  }

  let unclaimed_rewards = await RewardsModel.getAll({ status: 0 });
  let unclaimed_reward_amount = BigNumber.from("0");
  for (let i = 0; i < unclaimed_rewards.length; i++) {
    unclaimed_reward_amount = unclaimed_reward_amount.add(
      BigNumber.from(unclaimed_rewards[i].unclaimed_rewards)
    );
  }

  let reffered_users = await ReferralsModel.getAll();

  res.send({
    succeed: RETURN_STATUS.SUCCEED,
    message: "Get analysis succeed.",
    data: {
      holder_count: holders.length,
      referred_count: reffered_users.length,
      total_reward: total_reward_amount.toString(),
      total_claimed_reward: claimed_reward_amount.toString(),
      total_unclaimed_reward: unclaimed_reward_amount.toString(),
    },
  });
};

export const calculate = async (req, res) => {
  try {
    let web3 = new Web3(WEB3_RPC_URL);

    let tokenContract = new web3.eth.Contract(ERC20_ABI, P2B_TOKEN_ADDRESS);
    let total_supply = BigNumber.from(
      web3.utils.toWei(P2B_TOKEN_SUPPLY, "ether")
    );
    let max_out_amount = BigNumber.from(web3.utils.toWei(P2B_MAX_OUT, "ether"));
    let min_keep_amount = BigNumber.from(
      web3.utils.toWei(P2B_MIN_KEEP, "ether")
    );

    let current_block = await web3.eth.getBlockNumber();
    let previous_block = await FundsModel.getLastBlock();

    let rewards_response = await axios.get(
      ETHERSCAN_API_URL +
        "?module=account" +
        "&action=txlist" +
        "&address=" +
        TREASURY_WALLET_ADDRESS +
        "&startblock=" +
        previous_block +
        "&endblock=" +
        current_block +
        "&apikey=" +
        ETHERSCAN_API_KEY
    );
    let rewards = rewards_response.data.result;

    let total_reward = BigNumber.from(web3.utils.toWei("0", "ether"));
    for (let i = 0; i < rewards.length; i++) {
      if (rewards[i].methodId != "0x") continue;

      total_reward = total_reward.add(BigNumber.from(rewards[i].value));
    }

    FundsModel.add({
      amount: total_reward.toString(),
      block: current_block,
    });

    if (total_reward.toString() == "0") {
      res.send({
        succeed: RETURN_STATUS.SUCCEED,
        message: "No more added rewards.",
      });
    } else {
      let holders_response = await axios.get(
        ETHERSCAN_API_URL +
          "?module=token" +
          "&action=tokenholderlist" +
          "&contractaddress=" +
          P2B_TOKEN_ADDRESS +
          "&apikey=" +
          ETHERSCAN_API_KEY
      );

      let holders = holders_response.data.result;

      for (let i = 0; i < holders.length; i++) {
        let holder_balance = BigNumber.from(holders[i].TokenHolderQuantity);
        if (holder_balance.gt(min_keep_amount)) {
          let holder_reward = total_reward
            .mul(holder_balance)
            .div(total_supply);

          let transferEvents = await tokenContract.getPastEvents("Transfer", {
            filter: { from: holders[i].TokenHolderAddress },
            fromBlock: previous_block,
            toBlock: current_block,
          });

          RewardsModel.add({
            address: holders[i].TokenHolderAddress,
            unclaimed_rewards: holder_reward
              .mul(100 - REFERRAL_FEE)
              .div(100)
              .toString(),
            block_number: current_block,
          });

          let ref_address = await ReferralsModel.findRef({
            address: holders[i].TokenHolderAddress,
          });
          RewardsModel.add({
            address: ref_address,
            unclaimed_rewards: holder_reward
              .mul(REFERRAL_FEE)
              .div(100)
              .toString(),
            type: 1,
            block_number: current_block,
          });

          let out_amount = BigNumber.from("0");
          for (let j = 0; j < transferEvents.length; j++) {
            out_amount = out_amount.add(
              BigNumber.from(transferEvents[j].returnValues.value)
            );
          }

          if (out_amount.gt(max_out_amount)) {
            RewardsModel.updateStatus([2, holders[i].TokenHolderAddress, 0]);
            RewardsModel.add({
              address: DEV_WALLET_ADDRESS,
              unclaimed_rewards: holder_reward
                .mul(100 - REFERRAL_FEE)
                .div(100)
                .toString(),
              block_number: current_block,
            });
          }
        }
      }

      res.send({
        succeed: RETURN_STATUS.SUCCEED,
        message: "Update rewards data succeed.",
      });
    }
  } catch (error) {
    res.send({
      succeed: RETURN_STATUS.FAILED,
      message: "Server error.",
    });
  }
};

export const request = async (req, res) => {
  if (!req.params.address) {
    res.status(400).send({
      message: "Content can not be empty!",
    });

    return;
  }

  try {
    let web3 = new Web3(WEB3_RPC_URL);

    let tokenContract = new web3.eth.Contract(ERC20_ABI, P2B_TOKEN_ADDRESS);
    let max_out_amount = BigNumber.from(web3.utils.toWei(P2B_MAX_OUT, "ether"));
    let min_keep_amount = BigNumber.from(
      web3.utils.toWei(P2B_MIN_KEEP, "ether")
    );

    let current_block = await web3.eth.getBlockNumber();
    let previous_block = await FundsModel.getLastBlock();

    let balance_response = await axios.get(
      ETHERSCAN_API_URL +
        "?module=account" +
        "&action=tokenbalance" +
        "&contractaddress=" +
        P2B_TOKEN_ADDRESS +
        "&address=" +
        req.params.address +
        "&apikey=" +
        ETHERSCAN_API_KEY
    );

    let user_balance = BigNumber.from(balance_response.data.result);
    if (user_balance.gt(min_keep_amount)) {
      let transferEvents = await tokenContract.getPastEvents("Transfer", {
        filter: { from: req.params.address },
        fromBlock: previous_block,
        toBlock: current_block,
      });

      let out_amount = BigNumber.from("0");
      for (let j = 0; j < transferEvents.length; j++) {
        out_amount = out_amount.add(
          BigNumber.from(transferEvents[j].returnValues.value)
        );
      }

      if (out_amount.gt(max_out_amount)) {
        RewardsModel.updateStatus([2, req.params.address, 0]);

        res.send({
          succeed: RETURN_STATUS.FAILED,
          message: `Your request was declined and pending rewards was cleared because you transfered over ${P2B_MAX_OUT} PB tokens.`,
        });
      } else {
        let pending_rewards = await RewardsModel.find({
          address: req.params.address,
          status: 0,
        });

        if (pending_rewards.length > 0) {
          let pending_reward_amount = BigNumber.from("0");
          for (let i = 0; i < pending_rewards.length; i++) {
            pending_reward_amount = pending_reward_amount.add(
              BigNumber.from(pending_rewards[i].unclaimed_rewards)
            );
          }

          if (pending_reward_amount.toString() != "0") {
            const nonce = await web3.eth.getTransactionCount(
              TREASURY_WALLET_ADDRESS
            );
            const signedTx = await web3.eth.accounts.signTransaction(
              {
                to: req.params.address,
                value: web3.utils.toHex(pending_reward_amount.toString()),
                gas: web3.utils.toHex(21000),
                nonce: web3.utils.toHex(nonce),
              },
              TREASURY_WALLET_PRVKEY
            );

            const txReceipt = await web3.eth.sendSignedTransaction(
              signedTx.rawTransaction
            );

            RequestsModel.add({
              address: req.params.address,
              block: current_block,
              reward: pending_reward_amount.toString(),
              status: 1,
              txn: txReceipt.transactionHash,
            });
            RewardsModel.updateStatus([1, req.params.address, 0]);
          }

          res.send({
            succeed: RETURN_STATUS.SUCCEED,
            message: `Your request is registered. Will be proceed in 24 hours.`,
          });
        } else {
          res.send({
            succeed: RETURN_STATUS.FAILED,
            message: `You don't have claimable rewards.`,
          });
        }
      }
    } else {
      res.send({
        succeed: RETURN_STATUS.FAILED,
        message: `You have to keep over ${P2B_MIN_KEEP} PB tokens to get rewards.`,
      });
    }
  } catch (error) {
    res.send({
      succeed: RETURN_STATUS.FAILED,
      message: "Server error.",
    });
  }
};

export const process = async (req, res) => {
  let request = await RequestsModel.getOneRequest();
  if (Object.keys(request).length > 0) {
    let web3 = new Web3(WEB3_RPC_URL);
    const nonce = await web3.eth.getTransactionCount(TREASURY_WALLET_ADDRESS);

    const signedTx = await web3.eth.accounts.signTransaction(
      {
        to: request.address,
        value: web3.utils.toHex(request.reward),
        gas: web3.utils.toHex(21000),
        nonce: web3.utils.toHex(nonce),
      },
      TREASURY_WALLET_PRVKEY
    );

    const txReceipt = await web3.eth.sendSignedTransaction(
      signedTx.rawTransaction
    );

    RequestsModel.update([1, txReceipt.transactionHash, request.id]);

    res.send({
      succeed: RETURN_STATUS.SUCCEED,
      message: `Process request succeed.`,
    });
  } else {
    res.send({
      succeed: RETURN_STATUS.FAILED,
      message: "No reuqest is registered.",
    });
  }
};

export const referral = async (req, res) => {
  if (!req.params.tgId || !req.params.address) {
    res.status(400).send({
      message: "Content can not be empty!",
    });

    return;
  }

  try {
    let referral = await ReferralsModel.find({
      tgId: req.params.tgId,
      ref_address: req.params.address,
    });

    if (referral == null) {
      ReferralsModel.add({
        tgId: req.params.tgId,
        ref_address: req.params.address,
      });
    }

    res.send({
      succeed: RETURN_STATUS.SUCCEED,
      message: `Referral address is registered.`,
    });
  } catch (error) {
    res.send({
      succeed: RETURN_STATUS.FAILED,
      message: `Server error.`,
    });
  }
};
