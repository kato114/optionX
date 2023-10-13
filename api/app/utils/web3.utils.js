import { ethers } from "ethers";

import {
  NETWORK_ID,
  WEB3_RPC_URL,
  USDC_DECIMAL,
  TREASURY_WALLET_ADDRESS,
  DEPOSIT_FEE,
} from "../config/constants.js";
import {
  USDC_TOKEN_ADDRESS,
  DYDX_TREASURY_ADDRESS,
} from "../config/contracts.js";

import { ERC20_ABI } from "../config/abis/ERC20.js";
import { DYDX_TREASURY_ABI } from "../config/abis/DYDX_TREASURY.js";

export const getSignatureForOnboarding = async (user_data) => {
  const domain = { name: "dYdX", version: "1.0", chainId: NETWORK_ID };
  const types = {
    dYdX: [{ type: "string", name: "action" }],
  };
  const value = { action: "dYdX Onboarding" };

  if (NETWORK_ID === 1) {
    types.dYdX.push({ type: "string", name: "onlySignOn" });
    value.onlySignOn = "https://trade.dydx.exchange";
  }

  const provider = new ethers.providers.JsonRpcProvider(WEB3_RPC_URL);

  const wallet = new ethers.Wallet(user_data.eth_prvkey, provider);
  const signer = wallet.connect(provider);

  const signature = await signer._signTypedData(domain, types, value);

  return signature;
};

export const getEthBalance = async (eth_wallet_address) => {
  const provider = new ethers.providers.JsonRpcProvider(WEB3_RPC_URL);
  const balance = await provider.getBalance(eth_wallet_address);

  return balance.toString();
};

export const getUSDCTokenBalance = async (eth_wallet_address) => {
  const provider = new ethers.providers.JsonRpcProvider(WEB3_RPC_URL);
  const contract = new ethers.Contract(USDC_TOKEN_ADDRESS, ERC20_ABI, provider);
  const balance = await contract.balanceOf(eth_wallet_address);

  return balance.toString();
};

export const approveUSDCTokenForDeposit = async (
  eth_wallet_address,
  eth_wallet_privatekey,
  amount
) => {
  const provider = new ethers.providers.JsonRpcProvider(WEB3_RPC_URL);

  const wallet = new ethers.Wallet(eth_wallet_privatekey, provider);
  const signer = wallet.connect(provider);

  const contract = new ethers.Contract(USDC_TOKEN_ADDRESS, ERC20_ABI, signer);
  const allowance = await contract.allowance(
    eth_wallet_address,
    DYDX_TREASURY_ADDRESS
  );
  const deposit_amount = ethers.utils.parseUnits(amount, USDC_DECIMAL);
  if (allowance.gt(deposit_amount)) return true;

  try {
    const tx = await contract.approve(
      DYDX_TREASURY_ADDRESS,
      ethers.constants.MaxUint256
    );

    await tx.wait();

    return true;
  } catch (error) {
    return false;
  }
};

export const depositUSDCTokenIntoDyDx = async (
  eth_wallet_privatekey,
  stk_wallet_publickey,
  position_id,
  signature,
  amount
) => {
  const provider = new ethers.providers.JsonRpcProvider(WEB3_RPC_URL);

  const wallet = new ethers.Wallet(eth_wallet_privatekey, provider);
  const signer = wallet.connect(provider);

  const treasury_contract = new ethers.Contract(
    DYDX_TREASURY_ADDRESS,
    DYDX_TREASURY_ABI,
    signer
  );
  const token_contract = new ethers.Contract(
    USDC_TOKEN_ADDRESS,
    ERC20_ABI,
    signer
  );

  const deposit_amount = ethers.utils.parseUnits(amount, USDC_DECIMAL);
  try {
    const tx1 = await treasury_contract.deposit(
      deposit_amount
        .mul(100 - DEPOSIT_FEE)
        .div(100)
        .toString(),
      ethers.BigNumber.from("0x" + stk_wallet_publickey).toString(),
      position_id,
      signature
    );
    await tx1.wait();

    const tx2 = await token_contract.transfer(
      TREASURY_WALLET_ADDRESS,
      deposit_amount.mul(DEPOSIT_FEE).div(100).toString()
    );
    await tx2.wait();

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
