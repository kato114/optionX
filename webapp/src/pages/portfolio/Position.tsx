import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import axios from "axios";
import { API_URL } from "../../config/constant";
import { Row, Col, Divider, Button, Input, Card } from "antd";

interface PositionProps {
  userData: any;
  init: any;
}

export const Position: React.FC<PositionProps> = ({ userData, init }) => {
  const navigate = useNavigate();
  const { market } = useParams();
  if (market == undefined) navigate("/overview");

  const [position, setPosition] = useState({
    market: "",
    closedAt: "",
    createdAt: "",
    entryPrice: "",
    exitPrice: "",
    maxSize: "",
    netFunding: "",
    realizedPnl: "",
    side: "",
    size: "",
    status: "",
    sumClose: "",
    sumOpen: "",
    unrealizedPnl: "",
  });

  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState(false);

  const [amount, setAmount] = useState(0);
  const onChangeAmount = (value: any) => {
    setAmount(value)
  }

  const closePosition = () => {
    setConfirm(true);
    axios
      .post(API_URL + "/trade/closepos/" + localStorage.getItem("tgid"), {
        market: market,
        price: (Number(position.entryPrice) * 0.95).toFixed(1),
        size: amount.toString(),
      })
      .then((response) => {
        if (response.data.succeed) {
          toast.success(response.data.message);
          init();
        }
        else toast.error(response.data.message);
        setConfirm(false);
      })
      .catch((error) => {
        toast.error("Server error.");
        setConfirm(false);
      });
  }

  useEffect(() => {
    let found = false;
    for (let i = 0; i < userData.positions.length; i++) {
      if (userData.positions[i].market == market) {
        setPosition(userData.positions[i]);
        setAmount(userData.positions[i].size);
        setLoading(false)
        found = true;
      }
    }

    if (!found) navigate("/overview");
  }, [])

  return (
    <>
      {!loading ?
        <>
          <Row>
            <Col
              span={16}
              style={{ borderRight: "1px solid #dadada", padding: "0px 10px" }}
            >
              <Row
                style={{
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <Col>
                  <Row
                    style={{
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <Col>
                      <img
                        src={require(`../../assets/img/tokens/${position.market
                          .split("-")[0]
                          .toLowerCase()}.svg`)}
                        style={{ width: "30px" }}
                      />
                    </Col>
                    <Col>
                      <p>{position.market
                        .split("-")[0]}</p>
                      <small>{position.market}</small>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
            <Col span={8} style={{ textAlign: "right", padding: "0px 10px" }}>
              <p
                style={{
                  color:
                    Number(position.realizedPnl) >
                      0
                      ? "#52fd98"
                      : "#fd5252",
                }}
              >
                ${Number(position.entryPrice).toFixed(2)}
              </p>
              <small
                style={{
                  color:
                    position.side == "LONG"
                      ? "#5298fd"
                      : "#fd5252",
                }}
              >
                {position.side}
              </small>
            </Col>
          </Row>
          <Divider />
          <Row>
            <Col span="24">
              <span>Amount</span>
            </Col>
            <Col span="24">
              <Input type="number" size="large" placeholder="0" suffix={position.market.split("-")[0]}
                value={amount} onChange={(e) => onChangeAmount(e.target.value)} />
            </Col>
          </Row>
          <Row>
            <Col span="2"></Col>
            <Col span="5">
              <Button onClick={() => onChangeAmount(Number(position.size) * 25 / 100)}>25%</Button>
            </Col>
            <Col span="5">
              <Button onClick={() => onChangeAmount(Number(position.size) * 50 / 100)}>50%</Button>
            </Col>
            <Col span="5">
              <Button onClick={() => onChangeAmount(Number(position.size) * 75 / 100)}>75%</Button>
            </Col>
            <Col span="5">
              <Button onClick={() => onChangeAmount(Number(position.size))}>Max</Button>
            </Col>
            <Col span="2"></Col>
          </Row>
          <Row>
            <Col span="24">
              <Card
                actions={[
                  <Button type="primary" danger block onClick={() => closePosition()}>
                    {confirm ? "Confirming..." : "Close Position"}
                  </Button>,
                ]}
              >
                <Row style={{ justifyContent: "space-between" }}>
                  <Col>
                    <small>
                      Expected PRice
                    </small>
                  </Col>
                  <Col>
                    <small>${Number(position.entryPrice).toFixed(4)}</small>
                  </Col>
                </Row>
                <Row style={{ justifyContent: "space-between" }}>
                  <Col>
                    <small>
                      Fee
                    </small>
                  </Col>
                  <Col>
                    <small>${(Number(position.entryPrice) * Number(userData.user.takerFeeRate) * amount).toFixed(3)}</small>
                  </Col>
                </Row>
                <Row style={{ justifyContent: "space-between" }}>
                  <Col>
                    <small>
                      Total
                    </small>
                  </Col>
                  <Col>
                    <small>${(Number(position.entryPrice) * amount).toFixed(5)}</small>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
          <Toaster position="top-center" reverseOrder={false} />
        </>
        :
        <div style={{ textAlign: "center", paddingTop: "48vh" }}>
          Loading...
        </div>
      }
    </>
  );
};
