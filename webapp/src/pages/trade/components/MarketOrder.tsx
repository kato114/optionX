import React, { useEffect, useState } from "react";
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
import { OrderSide } from "../../../config/constant";

const { Text } = Typography;

interface OrderProps {
  placeOrder: any;
  marketDetail: any | undefined;
  orderDetail: any;
  setOrderDetail: any;
}

export const MarketOrder: React.FC<OrderProps> = ({ placeOrder, marketDetail, orderDetail, setOrderDetail }) => {

  const [amount, setAmount] = useState(0);
  const [leverage, setLeverage] = useState(1);

  const onChangeSide = (e: RadioChangeEvent) => {
    setOrderDetail({ ...orderDetail, side: e.target.value })
  };

  const onChangeAmount = (e: any) => {
    setAmount(e.target.value)
  }

  const onChangeLeverage = (leverage: any) => {
    if (leverage <= 20)
      setLeverage(leverage);
  }

  const onChangeReduceOnly = (e: any) => {
    setOrderDetail({ ...orderDetail, reduceOnly: e.target.checked })
  }

  useEffect(() => {
    setOrderDetail({ ...orderDetail, type: "MARKET", size: (amount * (leverage >= 1 ? leverage : 1)).toFixed(2).toString(), price: Number(marketDetail.indexPrice).toFixed(marketDetail.tickSize.split(".")[1].length).toString() })
  }, [amount, leverage])

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
            Amount <small>Set order size</small>
          </Text>
        </Col>
        <Col span="12" style={{ paddingRight: "2px" }}>
          <Input size="large" placeholder="0" suffix={marketDetail.baseAsset} value={amount} onChange={onChangeAmount} />
        </Col>
        <Col span="12" style={{ paddingLeft: "2px" }}>
          <Input size="large" placeholder="0" suffix="USD" value={Number(amount * marketDetail.indexPrice * (leverage >= 1 ? leverage : 1)).toFixed(2)} />
        </Col>
      </Row>
      <Row>
        <Col span="24">
          <Text>
            Leverage <small> Up to 20x </small>
          </Text>
        </Col>
        <Col span="12">
          <Input size="large" placeholder="0" value={leverage} onChange={(e) => onChangeLeverage(e.target.value)} />
        </Col>
        <Col span="4" style={{ paddingLeft: "2px" }}>
          <Button size="large" block value={leverage} onClick={() => onChangeLeverage(2)}>
            2x
          </Button>
        </Col>
        <Col span="4" style={{ paddingLeft: "2px" }}>
          <Button size="large" block value={leverage} onClick={() => onChangeLeverage(5)}>
            5x
          </Button>
        </Col>
        <Col span="4" style={{ paddingLeft: "2px" }}>
          <Button size="large" block value={leverage} onClick={() => onChangeLeverage(10)}>
            10x
          </Button>
        </Col>
      </Row>
      <Row>
        <Col span="24">
          <Text>Execution</Text>
        </Col>
        <Col span="24">
          <Checkbox checked={orderDetail.reduceOnly} onChange={onChangeReduceOnly}>Reduce-Only</Checkbox>
        </Col>
      </Row>
      <Row>
        <Col span="24">
          <Card
            actions={[
              <Button type="primary" block onClick={() => placeOrder(orderDetail)}>
                Place Market Order
              </Button>,
            ]}
          >
            {/* <Row style={{ justifyContent: "space-between" }}>
              <Col>
                <small>Exprected Price</small>
              </Col>
              <Col>
                <small>$1,600.80</small>
              </Col>
            </Row>
            <Row style={{ justifyContent: "space-between" }}>
              <Col>
                <small>Price Impact</small>
              </Col>
              <Col>
                <small>0.00%</small>
              </Col>
            </Row>
            <Row style={{ justifyContent: "space-between" }}>
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
