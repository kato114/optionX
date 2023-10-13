import React from "react";
import { Col, Row, Divider } from "antd";
import {
  CaretDownOutlined,
  CaretUpFilled,
  CaretUpOutlined,
  CloseOutlined,
} from "@ant-design/icons";

export const MarketList: React.FC<{
  setShowMarketList: any;
  setCurrentMarket: any;
  marketList: any;
}> = ({ setShowMarketList, setCurrentMarket, marketList }) => {
  return (
    <div className="marketList">
      <Row
        style={{
          justifyContent: "space-between",
          padding: "10px 0px 15px 0px",
          borderBottom: "1px solid gray",
        }}
      >
        <Col>Market List</Col>
        <Col>
          <CloseOutlined
            onClick={() => {
              setShowMarketList();
            }}
          />
        </Col>
      </Row>
      <div style={{ height: "calc(100vh - 50px)", overflowY: "auto" }}>
        {Object.keys(marketList).map(function (key) {
          if (key == "LUNA-USD") return;
          return (
            <div
              key={key}
              onClick={() => {
                setCurrentMarket(key);
                setShowMarketList();
              }}
            >
              <Divider />
              <Row
                style={{
                  justifyContent: "space-between",
                  cursor: "pointer",
                  margin: "2px 0px 2px 0px",
                  padding: "10px",
                }}
              >
                <Col
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <img
                    src={require(`../../../assets/img/tokens/${key
                      .split("-")[0]
                      .toLowerCase()}.svg`)}
                    style={{ width: "30px" }}
                  />
                  <span>{marketList[key].market}</span>
                </Col>
                <Col style={{ textAlign: "right" }}>
                  <p
                    style={{
                      textAlign: "right",
                      color:
                        Number(marketList[key].priceChange24H) > 0
                          ? "#5298fd"
                          : "#fd5252",
                    }}
                  >
                    ${Number(marketList[key].indexPrice).toFixed(2)}
                  </p>
                  <small
                    style={{
                      textAlign: "right",
                      color:
                        Number(marketList[key].priceChange24H) > 0
                          ? "#5298fd"
                          : "#fd5252",
                    }}
                  >
                    {Number(marketList[key].priceChange24H) > 0 ? (
                      <CaretUpOutlined />
                    ) : (
                      <CaretDownOutlined />
                    )}
                    {(
                      (Number(marketList[key].priceChange24H) /
                        Number(marketList[key].indexPrice)) *
                      100
                    ).toFixed(2)}
                    %
                  </small>
                </Col>
              </Row>
              <Divider />
            </div>
          );
        })}
      </div>
    </div>
  );
};
