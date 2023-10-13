import React, { useEffect } from "react";
import {
  Col,
  Row,
  Radio,
  Input,
  Select,
  Typography,
  Checkbox,
  Card,
  Button,
  RadioChangeEvent,
} from "antd";
import { OrderSide, TimeInForce } from "../../../config/constant";

const { Text } = Typography;

interface OrderProps {
  placeOrder: any;
  marketDetail: any | undefined;
  orderDetail: any;
  setOrderDetail: any;
}

export const TrailingStop: React.FC<OrderProps> = ({ placeOrder, marketDetail, orderDetail, setOrderDetail }) => {

  const onChangeSide = (e: RadioChangeEvent) => {
    setOrderDetail({ ...orderDetail, side: e.target.value })
  };

  const onChangeAmount = (e: any) => {
    setOrderDetail({ ...orderDetail, size: e.target.value })
  }

  const onChangeTrailingPercent = (e: any) => {
    if (e.target.value <= 100)
      setOrderDetail({ ...orderDetail, trailingPercent: e.target.value })
  }

  const onChangeTIF = (e: any) => {
    setOrderDetail({ ...orderDetail, timeInForce: e })
  }

  const onChangeReduceOnly = (e: any) => {
    setOrderDetail({ ...orderDetail, reduceOnly: e.target.checked })
  }

  useEffect(() => {
    setOrderDetail({ ...orderDetail, type: "TRAILING_STOP", price: Number(marketDetail.indexPrice).toFixed(marketDetail.tickSize.split(".")[1].length).toString(), trailingPercent: "100" })
  }, [])

  return (
    <>
      <Row style={{ justifyContent: "center" }}>
        <Col>
          <Radio.Group value={orderDetail.side} onChange={onChangeSide} buttonStyle="solid">
            <Radio.Button value={OrderSide.BUY} >{OrderSide.BUY}</Radio.Button>
            <Radio.Button value={OrderSide.SELL} >{OrderSide.SELL}</Radio.Button>
          </Radio.Group>
        </Col>
      </Row>
      <Row>
        <Col span="24">
          <Text>
            Amount <small>ETH</small>
          </Text>
        </Col>
        <Col span="24" style={{ paddingRight: "2px" }}>
          <Input type="number" size="large" placeholder="0" suffix={marketDetail.baseAsset} value={orderDetail.size} onChange={onChangeAmount} />
        </Col>
      </Row>
      <Row>
        <Col span="24">
          <Text>Trailing Percent</Text>
        </Col>
        <Col span="24">
          <Input size="large" placeholder="0.00" suffix="%" value={orderDetail.trailingPercent} onChange={onChangeTrailingPercent} />
        </Col>
      </Row>
      {/* <Row>
        <Col span="24">
          <Text>Good Til Time</Text>
        </Col>
        <Col span="24">
          <Row>
            <Col span="12" style={{ paddingRight: "2px" }}>
              <Input size="large" value="28" />
            </Col>
            <Col span="12" style={{ paddingLeft: "2px" }}>
              <Select
                size="large"
                style={{ width: "100%" }}
                defaultValue="Days"
                options={[
                  { value: "Mins", label: "Mins" },
                  { value: "Hours", label: "Hours" },
                  { value: "Days", label: "Days" },
                  { value: "Weeks", label: "Weeks" },
                ]}
              />
            </Col>
          </Row>
        </Col>
      </Row> */}
      <Row>
        <Col span="24">
          <Text>Execution</Text>
        </Col>
        <Col span="24">
          <Select
            size="large"
            style={{ width: "100%" }}
            value={orderDetail.timeInForce}
            onChange={onChangeTIF}
            options={[
              { value: TimeInForce.FOK, label: "Fill Or Kill" },
              { value: TimeInForce.IOC, label: "Immediate Or Cancel" },
            ]}
          />
        </Col>
        <Col span="24">
          <Checkbox checked={false}>Reduce-Only</Checkbox>
        </Col>
      </Row>
      <Row>
        <Col span="24">
          <Card
            actions={[
              <Button type="primary" block onClick={() => placeOrder(orderDetail)}>
                Place Trailing Stop
              </Button>,
            ]}
          >
            {/* <Row style={{ justifyContent: "space-between" }}>
              <Col>
                <small>
                  Fee <code>Taker</code>
                </small>
              </Col>
              <Col>
                <small>$1.00</small>
              </Col>
            </Row>
            <Row style={{ justifyContent: "space-between" }}>
              <Col>
                <small>Total</small>
              </Col>
              <Col>
                <small>$1,992.00</small>
              </Col>
            </Row> */}
          </Card>
        </Col>
      </Row>
    </>
  );
};
