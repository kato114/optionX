import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

import { Row, Col, Divider, Select, Typography } from "antd";
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";

import axios from "axios";

import { API_URL, OrderSide, OrderType, TRADE_TYPE, TimeInForce } from "../../config/constant";

import { LimitOrder } from "./components/LimitOrder";
import { MarketOrder } from "./components/MarketOrder";
import { StopLimit } from "./components/StopLimit";
import { StopMarket } from "./components/StopMarket";
import { TakeProfitLimit } from "./components/TakeProfitLimit";
import { TakeProfitMarket } from "./components/TakeProfitMarket";
import { TrailingStop } from "./components/TrailingStop";

import { MarketList } from "./components/MarketList";

const { Text } = Typography;

interface TradeProps {
  userData: any;
}

export const Trade: React.FC<TradeProps> = ({ userData }) => {
  const [orderType, setOrderType] = useState(TRADE_TYPE.LimitOrder);

  const [marketList, setMarketList] = useState([]);
  const [currentMarket, setCurrentMarket] = useState("ETH-USD");
  const [showMarketList, setShowMarketList] = useState(false);

  const [loading, setLoading] = useState(true);

  const [orderDetail, setOrderDetail] = useState({
    market: "ETH-USD",
    side: OrderSide.BUY,
    type: OrderType.LIMIT,
    timeInForce: TimeInForce.IOC,
    postOnly: false,
    reduceOnly: false,
    size: 0,
    price: 0,
    limitFee: 0.0015,
    expiration: '2023-12-21T21:30:20.200Z'
  });

  useEffect(() => {
    setOrderDetail({ ...orderDetail, market: currentMarket })
  }, [currentMarket])

  useEffect(() => {
    switch (orderType) {
      case 0:
        setOrderDetail({ ...orderDetail, type: OrderType.LIMIT })
        break;
      case 1:
        setOrderDetail({ ...orderDetail, type: OrderType.MARKET })
        console.log(OrderType.MARKET)
        break;
      case 2:
        setOrderDetail({ ...orderDetail, type: OrderType.STOP_LIMIT })
        break;
      case 3:
        setOrderDetail({ ...orderDetail, type: OrderType.MARKET })
        break;
      case 4:
        setOrderDetail({ ...orderDetail, type: OrderType.TAKE_PROFIT })
        break;
      case 5:
        setOrderDetail({ ...orderDetail, type: OrderType.TAKE_PROFIT })
        break;
      case 6:
        setOrderDetail({ ...orderDetail, type: OrderType.TRAILING_STOP })
        break;
      default:
        setOrderDetail({ ...orderDetail, type: OrderType.LIMIT })
        break;
    }
    setOrderDetail({ ...orderDetail, type: OrderType.LIMIT })
  }, [orderType])


  useEffect(() => {
    console.log(orderDetail)
  }, [orderDetail])

  useEffect(() => {
    axios
      .get(API_URL + "/dydx/markets")
      .then((response) => {
        if (response.data.succeed) {
          setMarketList(response.data.data.markets);
          console.log(response.data.data.markets);
          setLoading(false);
        }
      })
      .catch((error) => { });
  }, []);

  useEffect(() => {
    axios
      .get(API_URL + "/trade/order/" + localStorage.getItem("tgid"))
      .then((response) => {
        if (response.data.succeed) {
          setLoading(false);
        }
      })
      .catch((error) => { });
  }, [orderDetail.market, orderDetail.side, orderDetail.type]);

  const getCurrentMarket = (marketKey: string) => {
    for (let key in marketList) {
      if (key == marketKey) {
        return marketList[key];
      }
    }
    return undefined;
  };

  const getCurrentMarketItem = (marketKey: string, dataKey: string) => {
    for (let key in marketList) {
      if (key == marketKey) {
        return marketList[key][dataKey];
      }
    }
    return "";
  };

  const placeOrder = () => {
    axios
      .post(API_URL + "/trade/order/" + localStorage.getItem("tgid"), orderDetail)
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

  return (
    <>
      {loading === false && Object.keys(marketList).length > 0 ? (
        <>
          <Row>
            <Col
              span={16}
              style={{ borderRight: "1px solid #dadada", padding: "0px 10px" }}
            >
              <Row
                onClick={() => {
                  setShowMarketList(true);
                }}
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
                        src={require(`../../assets/img/tokens/${currentMarket
                          .split("-")[0]
                          .toLowerCase()}.svg`)}
                        style={{ width: "30px" }}
                      />
                    </Col>
                    <Col>
                      <p>{getCurrentMarketItem(currentMarket, "baseAsset")}</p>
                      <small>{currentMarket}</small>
                    </Col>
                  </Row>
                </Col>
                <Col>
                  <CaretDownOutlined />
                </Col>
              </Row>
            </Col>
            <Col span={8} style={{ textAlign: "right", padding: "0px 10px" }}>
              <p
                style={{
                  color:
                    Number(getCurrentMarketItem(currentMarket, "priceChange24H")) >
                      0
                      ? "#5298fd"
                      : "#fd5252",
                }}
              >
                $
                {Number(getCurrentMarketItem(currentMarket, "indexPrice")).toFixed(
                  2
                )}
              </p>
              <small
                style={{
                  color:
                    Number(getCurrentMarketItem(currentMarket, "priceChange24H")) >
                      0
                      ? "#5298fd"
                      : "#fd5252",
                }}
              >
                {Number(getCurrentMarketItem(currentMarket, "priceChange24H")) >
                  0 ? (
                  <CaretUpOutlined />
                ) : (
                  <CaretDownOutlined />
                )}
                {(
                  (Number(getCurrentMarketItem(currentMarket, "priceChange24H")) /
                    Number(getCurrentMarketItem(currentMarket, "indexPrice"))) *
                  100
                ).toFixed(2)}
                %
              </small>
            </Col>
          </Row>
          <Divider />
          <Row>
            <Col span="24">
              <Text>Order Type</Text>
            </Col>
            <Col span={24}>
              <Select
                size="large"
                style={{ width: "100%" }}
                defaultValue={TRADE_TYPE.LimitOrder}
                onChange={setOrderType}
                options={[
                  { value: TRADE_TYPE.LimitOrder, label: "Limit Order" },
                  { value: TRADE_TYPE.MarketOrder, label: "Market Order" },
                  { value: TRADE_TYPE.StopLimit, label: "Stop Limit" },
                  { value: TRADE_TYPE.StopMarket, label: "Stop Market" },
                  {
                    value: TRADE_TYPE.TakeProfitLimit,
                    label: "Take Profit Limit",
                  },
                  {
                    value: TRADE_TYPE.TakeProfitMarket,
                    label: "Take Profit Market",
                  },
                  { value: TRADE_TYPE.TrailingStop, label: "Trailing Stop" },
                ]}
              />
            </Col>
          </Row>
          {orderType == TRADE_TYPE.LimitOrder && <LimitOrder placeOrder={placeOrder} marketDetail={getCurrentMarket(currentMarket)} orderDetail={orderDetail} setOrderDetail={setOrderDetail} />}
          {orderType == TRADE_TYPE.MarketOrder && <MarketOrder placeOrder={placeOrder} marketDetail={getCurrentMarket(currentMarket)} orderDetail={orderDetail} setOrderDetail={setOrderDetail} />}
          {orderType == TRADE_TYPE.StopLimit && <StopLimit placeOrder={placeOrder} marketDetail={getCurrentMarket(currentMarket)} orderDetail={orderDetail} setOrderDetail={setOrderDetail} />}
          {orderType == TRADE_TYPE.StopMarket && <StopMarket placeOrder={placeOrder} marketDetail={getCurrentMarket(currentMarket)} orderDetail={orderDetail} setOrderDetail={setOrderDetail} />}
          {orderType == TRADE_TYPE.TakeProfitLimit && <TakeProfitLimit placeOrder={placeOrder} marketDetail={getCurrentMarket(currentMarket)} orderDetail={orderDetail} setOrderDetail={setOrderDetail} />}
          {orderType == TRADE_TYPE.TakeProfitMarket && <TakeProfitMarket placeOrder={placeOrder} marketDetail={getCurrentMarket(currentMarket)} orderDetail={orderDetail} setOrderDetail={setOrderDetail} />}
          {orderType == TRADE_TYPE.TrailingStop && <TrailingStop placeOrder={placeOrder} marketDetail={getCurrentMarket(currentMarket)} orderDetail={orderDetail} setOrderDetail={setOrderDetail} />}
          {showMarketList && (
            <MarketList
              marketList={marketList}
              setCurrentMarket={setCurrentMarket}
              setShowMarketList={() => {
                setShowMarketList(false);
              }}
            />
          )}
        </>
      ) : (
        <div style={{ textAlign: "center", paddingTop: "48vh" }}>
          Loading...
        </div>
      )}
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
};
