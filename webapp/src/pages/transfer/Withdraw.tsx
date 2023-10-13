import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import { Row, Col } from "antd";
import { Button, Select, Input, Card } from "antd";
import { MinusOutlined, SwapRightOutlined } from "@ant-design/icons";

import axios from "axios";
import Web3 from "web3";

import { API_URL, USDC_TOKEN_ADDRESS, WEB3_RPC_URL } from "../../config/constant";
import USDC_IMG from "../../assets/img/tokens/USDC.png";
import { ERC20_ABI } from "../../abis/ERC20";

interface WithdrawProps {
  userData: any;
}

export const Withdraw: React.FC<WithdrawProps> = ({ userData }) => {
  const [walletBalance, setWalletBalance] = useState(0);
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState({
    availableFunds: 0,
    quote: {
      creditAmount: 0,
      debitAmount: 0,
      creditAsset: "USDC",
    },
  });

  const confirmWithdraw = () => {
    if (localStorage.getItem("tgid") != "") {
      if (
        amount > 0 &&
        amount < Number(userData.account.equity) &&
        Number(provider.quote.debitAmount) > Number(userData.account.equity)
      ) {
        toast.error("Withdraw amount is over your balance.");
        return;
      }

      setLoading(true);
      axios
        .post(API_URL + "/account/withdraw/" + localStorage.getItem("tgid"), {
          amount: String(amount),
        })
        .then((response) => {
          if (response.data.succeed) toast.success(response.data.message);
          else toast.error(response.data.message);
          setLoading(false);
        })
        .catch((error) => {
          toast.error("Server error.");
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    if (amount > 0 && amount < userData.account.equity) {
      axios
        .get(API_URL + "/dydx/lplist", {
          params: {
            amount: String(amount),
          },
        })
        .then((response) => {
          let liquidityProviders = response.data.data.liquidityProviders;
          setProvider(liquidityProviders[Object.keys(liquidityProviders)[0]]);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
        });
    } else {
      setProvider({
        availableFunds: 0,
        quote: {
          creditAmount: 0,
          debitAmount: 0,
          creditAsset: "USDC",
        },
      });
    }
  }, [amount]);

  const getWalletBalance = async () => {
    const web3 = new Web3(WEB3_RPC_URL);

    //@ts-ignore
    const tokenContract = new web3.eth.Contract(ERC20_ABI, USDC_TOKEN_ADDRESS);
    let balance = await tokenContract.methods.balanceOf(userData.user.ethereumAddress).call();
    balance = web3.utils.fromWei(balance, 'Mwei');

    setWalletBalance(balance);
  }

  getWalletBalance()

  return (
    <>
      {loading === false ? (
        <>
          <Row>
            <Col span="12">
              <Link to="/deposit">
                <Button block>Deposit</Button>
              </Link>
            </Col>
            <Col span="12">
              <Link to="/withdraw">
                <Button block>Withdraw</Button>
              </Link>
            </Col>
          </Row>
          <Row>
            <Col span="24">
              <p>Asset</p>
            </Col>
            <Col span="24">
              <Select
                size="large"
                style={{ width: "100%" }}
                defaultValue="USDC"
                options={[
                  {
                    value: "USDC",
                    label: (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <img src={USDC_IMG} alt="USDC LOGO" width="25px" />
                        <span>USD Coin</span>
                        <code>USDC</code>
                      </div>
                    ),
                  },
                ]}
              />
            </Col>
          </Row>
          <Row>
            <Col span="24">
              <p>Amount</p>
            </Col>
            <Col span="24">
              <Input
                type="number"
                size="large"
                placeholder="0"
                value={amount}
                onChange={(e) => {
                  setAmount(Number(e.target.value));
                }}
              />
            </Col>
            <Col span="24">
              <Card>
                <Row style={{ justifyContent: "space-between" }}>
                  <Col>
                    <small>Free Collateral</small>
                  </Col>
                  <Col>
                    <small>${Number(userData.account.freeCollateral).toFixed(2)}</small>
                    <SwapRightOutlined />
                    <small>
                      $
                      {(Number(userData.account.freeCollateral) - amount < 0
                        ? 0
                        : Number(userData.account.freeCollateral) - amount
                      ).toFixed(2)}
                    </small>
                  </Col>
                </Row>
                <Row style={{ justifyContent: "space-between" }}>
                  <Col>
                    <small>Max Withdraw</small>
                  </Col>
                  <Col>
                    <small>${Number(provider.availableFunds).toFixed(2)}</small>
                  </Col>
                </Row>
                {/* <Row style={{ justifyContent: "space-between" }}>
                  <Col>
                    <small>Account Leverage</small>
                  </Col>
                  <Col>
                    <MinusOutlined />
                    <SwapRightOutlined />
                    <MinusOutlined />
                  </Col>
                </Row> */}
              </Card>
            </Col>
          </Row>
          <Row>
            <Col span="24">
              <Card
                actions={[
                  <Button
                    type="primary"
                    block
                    onClick={() => {
                      confirmWithdraw();
                    }}
                  >
                    Confirm Withdraw
                  </Button>,
                ]}
              >
                <Row style={{ justifyContent: "space-between" }}>
                  <Col>
                    <small>Fee</small>
                  </Col>
                  <Col>
                    <small>
                      $
                      {provider.quote.debitAmount == 0
                        ? "---"
                        : (
                          provider.quote.debitAmount -
                          provider.quote.creditAmount
                        ).toFixed(2)}
                    </small>
                  </Col>
                </Row>
                <Row style={{ justifyContent: "space-between" }}>
                  <Col>
                    <small>Total</small>
                  </Col>
                  <Col>
                    <small>
                      $
                      {provider.quote.debitAmount == 0
                        ? "---"
                        : provider.quote.debitAmount}
                    </small>
                  </Col>
                </Row>
                <Row style={{ justifyContent: "space-between" }}>
                  <Col>
                    <small>
                      Wallet <code>USDC</code>
                    </small>
                  </Col>
                  <Col>
                    <small>{Number(walletBalance).toFixed(2)} USDC</small>
                    <SwapRightOutlined />
                    <small>
                      {provider.quote.debitAmount == 0
                        ? "---"
                        : (Number(walletBalance) + Number(provider.quote.debitAmount)).toFixed(2)} USDC</small>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </>
      ) : (
        <div style={{ textAlign: "center", paddingTop: "48vh" }}>
          Confirming...
        </div>
      )}
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
};
