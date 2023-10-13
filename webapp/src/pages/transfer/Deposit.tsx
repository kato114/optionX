import { useState } from "react";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import { Row, Col } from "antd";
import { Button, Select, Input, Card } from "antd";
import { SwapRightOutlined } from "@ant-design/icons";

import axios from "axios";

import { API_URL } from "../../config/constant";
import USDC_IMG from "../../assets/img/tokens/USDC.png";

interface DepositProps {
  userData: any;
}

export const Deposit: React.FC<DepositProps> = ({ userData }) => {
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  const confirmDeposit = () => {
    if (localStorage.getItem("tgid") != "") {
      setLoading(true);
      axios
        .post(API_URL + "/account/deposit/" + localStorage.getItem("tgid"), {
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
          </Row>
          <Row>
            <Col span="24">
              <Card
                actions={[
                  <Button
                    type="primary"
                    block
                    onClick={() => {
                      confirmDeposit();
                    }}
                  >
                    Confirm Deposit
                  </Button>,
                ]}
              >
                <Row style={{ justifyContent: "space-between" }}>
                  <Col>
                    <small>
                      Equity <code>USD</code>
                    </small>
                  </Col>
                  <Col>
                    <small>${Number(userData.account.equity).toFixed(2)}</small>
                    <SwapRightOutlined />
                    <small>
                      ${(amount + Number(userData.account.equity)).toFixed(2)}
                    </small>
                  </Col>
                </Row>
                <Row style={{ justifyContent: "space-between" }}>
                  <Col>
                    <small>Buying Power</small>
                  </Col>
                  <Col>
                    <small>
                      ${Number(userData.account.equity * 20).toFixed(2)}
                    </small>
                    <SwapRightOutlined />
                    <small>
                      $
                      {(
                        (amount + Number(userData.account.equity)) *
                        20
                      ).toFixed(2)}
                    </small>
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
