import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

import { Row, Col, Divider, Select, Typography, Badge, Card, Button, Input, Table, RadioChangeEvent, Radio, Switch } from "antd";
import type { ColumnsType } from 'antd/es/table';
import { CaretDownOutlined, CaretUpOutlined, LockFilled } from "@ant-design/icons";

import axios from "axios";

import dxp_icon from "../../assets/img/tokens/dpx.svg";
import usdc_icon from "../../assets/img/tokens/USDC.png";
import apy_icon from "../../assets/img/icons/APY.svg";
import tvl_icon from "../../assets/img/icons/TVL.svg";

import { API_URL, OrderSide, OrderType, TRADE_TYPE, TimeInForce } from "../../config/constant";

interface FixedDataType {
  key: React.Key;
  amount: string;
  epoch: string;
  premium_funding: string;
  action: string;
}

const fixedColumns: ColumnsType<FixedDataType> = [
  {
    title: 'Amount',
    dataIndex: 'amount',
    fixed: true,
    width: 100,
  },
  {
    title: 'Epoch',
    dataIndex: 'epoch',
  },
  {
    title: 'Premium & Funding',
    dataIndex: 'premium_funding',
  },
  {
    title: 'Action',
    dataIndex: 'action',
  },
];

const fixedData: FixedDataType[] = [];

interface Fixed1DataType {
  key: React.Key;
  amount: string;
  ap_strike: string;
  pnl: string;
  epoch: string;
  action: string;
}

const fixed1Columns: ColumnsType<Fixed1DataType> = [
  {
    title: 'Amount',
    dataIndex: 'amount',
    fixed: true,
    width: 100,
  },
  {
    title: 'AP Strike',
    dataIndex: 'ap_strike',
  },
  {
    title: 'Pnl',
    dataIndex: 'pnl',
  },
  {
    title: 'Epoch',
    dataIndex: 'epoch',
  },
  {
    title: 'Action',
    dataIndex: 'action',
  }
];

const fixed1Data: Fixed1DataType[] = [];


const options = [
  { label: 'Deposit', value: 'Deposit' },
  { label: 'Purchase', value: 'Purchase' },
];

interface TradeProps {
  userData: any;
}

export const Atlantic: React.FC<TradeProps> = ({ userData }) => {
  const [orderType, setOrderType] = useState(TRADE_TYPE.LimitOrder);
  const [value3, setValue3] = useState('Deposit');

  const onChange3 = ({ target: { value } }: RadioChangeEvent) => {
    console.log('radio3 checked', value);
    setValue3(value);
  };

  return (
    <>
      {/* {loading === false && Object.keys(marketList).length > 0 ? ( */}
      <>
        <Row
          onClick={() => {
            // setShowMarketList(true);
          }}
          style={{
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          <Col span={18}>
            <Row
              style={{
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
              }}>
              <Col>
                <Row
                  style={{
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <Col>
                    <img
                      src={dxp_icon}
                      style={{ width: "30px" }}
                    />
                    <img
                      src={usdc_icon}
                      style={{ width: "30px" }}
                    />
                  </Col>
                  <Col>
                    <p>LONG STRADDLE DPX</p>
                    <small>Arbitrum
                    </small>
                  </Col>
                </Row>
              </Col>
              <Col>
                <CaretDownOutlined />
              </Col>
            </Row>
          </Col>
          <Col span={6} style={{ textAlign: "right" }}>
            <p>$71.981</p>
            <small>Price</small>
          </Col>
        </Row>
        <Divider />
        <Row>
          <Card title="Strategy" extra={<Badge count='Long Straddle' showZero color='#7914fa' />} style={{ width: '100%' }}>
            <Row style={{ justifyContent: "space-between" }}>
              <Col>
                <p style={{ margin: "10px 0px 0px 0px" }}><small>Funding %</small></p>
                <p style={{ margin: "10px 0px 0px 0px" }}><small>Total Liquidity</small></p>
                <p style={{ margin: "10px 0px 0px 0px" }}><small>Annualized Premium</small></p>
                <p style={{ margin: "10px 0px 0px 0px" }}><small>Utilization</small></p>
                <p style={{ margin: "10px 0px 0px 0px" }}><small>Epoch Length</small></p>
                <p style={{ margin: "10px 0px 0px 0px" }}><small>Implied Volatility</small></p>
                <p style={{ margin: "10px 0px 0px 0px" }}><small>Premiums</small></p>
                <p style={{ margin: "10px 0px 0px 0px" }}><small>Settlement Price</small></p>
              </Col>
              <Col style={{ textAlign: "right" }}>
                <p style={{ margin: "10px 0px 0px 0px" }}><small>0%</small></p>
                <p style={{ margin: "10px 0px 0px 0px" }}><small>$179,288.33</small></p>
                <p style={{ margin: "10px 0px 0px 0px" }}><small>0%</small></p>
                <p style={{ margin: "10px 0px 0px 0px" }}><small>$0</small></p>
                <p style={{ margin: "10px 0px 0px 0px" }}><small>2 Days</small></p>
                <p style={{ margin: "10px 0px 0px 0px" }}><small>0</small></p>
                <p style={{ margin: "10px 0px 0px 0px" }}><small>$0</small></p>
                <p style={{ margin: "10px 0px 0px 0px" }}><small>$71.98</small></p>
              </Col>
            </Row>
          </Card>
        </Row >
        <Row>
          <Col span={24} style={{ justifyContent: "center", display: "flex" }}>
            <Radio.Group options={options} onChange={onChange3} value={value3} optionType="button" buttonStyle="solid" />
          </Col>
          {value3 == "Deposit" ?
            <Col className="border" span={24} style={{ padding: "5px" }}>
              <Row>
                <Col className="border" span={24} style={{ padding: "5px" }}>
                  <Row style={{ justifyContent: "space-between", alignItems: "center" }}>
                    <Col className="token-selector" style={{ padding: "5px 10px" }}>
                      <img src={usdc_icon} width="25px" /> USDC.e
                    </Col>
                    <Col>
                      <Input type="number" defaultValue={0} style={{ width: "200px", textAlign: "right", border: "0px" }} />
                    </Col>
                  </Row>
                  <Row style={{ justifyContent: "space-between" }}>
                    <Col>
                      <small>Balance</small>
                    </Col>
                    <Col>
                      <small>0 USDC.e</small>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row style={{ marginTop: '10px' }}>
                <Col className="border" span={24} style={{ padding: "5px" }}>
                  <Row style={{ justifyContent: "space-between" }}>
                    <Col>
                      <small>Deposit</small>
                    </Col>
                    <Col>
                      <small>0 {`->`} 0</small>
                    </Col>
                  </Row>
                  <Row style={{ justifyContent: "space-between" }}>
                    <Col>
                      <small>Vault Share</small>
                    </Col>
                    <Col>
                      <small>0% {`->`} 0%</small>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row style={{ marginTop: '10px' }}>
                <Col className="border" span={24} style={{ padding: "5px" }}>
                  <Row style={{ justifyContent: "space-between" }}>
                    <Col>
                      <Switch defaultChecked />
                    </Col>
                    <Col>
                      <small>Rollover</small>
                    </Col>
                  </Row>
                  <Row style={{ justifyContent: "space-between", marginTop: "5px" }}>
                    <Col>
                      <small>This vault roll deposits over between epochs by default. You can unselect this option above.
                      </small>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row style={{ marginTop: '10px' }}>
                <Col className="border" span={24} style={{ padding: "5px" }}>
                  <Row style={{ justifyContent: "space-between" }}>
                    <Col>
                      <small>Est. Gas cost</small>
                    </Col>
                    <Col>
                      <small>~$0.08 ( 0 ETH )</small>
                    </Col>
                  </Row>
                  <Row style={{ justifyContent: "space-between", marginTop: "5px" }}>
                    <Col>
                      <LockFilled />
                      <small>Deposit now for epoch 161 that will start on10 Oct 2023 and withdraw after13 Oct 2023</small>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row style={{ marginTop: '10px' }}>
                <Button disabled={true} style={{ width: "100%" }}>Insert an amount</Button>
              </Row>
            </Col>
            :
            <Col className="border" span={24} style={{ padding: "5px" }}>
              <Row>
                <Col className="border" span={24} style={{ padding: "5px" }}>
                  <Row style={{ justifyContent: "space-between", alignItems: "center" }}>
                    <Col className="token-selector" style={{ padding: "5px 10px" }}>
                      <img src={dxp_icon} width="25px" /> DPX
                    </Col>
                    <Col>
                      <Input type="number" defaultValue={0} style={{ width: "200px", textAlign: "right", border: "0px" }} />
                    </Col>
                  </Row>
                  <Row style={{ justifyContent: "space-between" }}>
                    <Col>
                      <small>Straddles Available:</small>
                    </Col>
                    <Col>
                      <small>0 DPX</small>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row style={{ marginTop: '10px' }}>
                <Col className="border" span={24} style={{ padding: "5px" }}>
                  <Row style={{ justifyContent: "space-between" }}>
                    <Col>
                      <p><small>ETH Price</small></p>
                      <p><small>Estimated Pnl</small></p>
                      <p><small>Lower Breakeven</small></p>
                      <p><small>Upper Breakeven</small></p>
                    </Col>
                    <Col>
                      <p style={{ textAlign: "right" }}><small>$71</small></p>
                      <p style={{ textAlign: "right", color: "#10b17b" }}><small>+ $71</small></p>
                      <p style={{ textAlign: "right" }}><small>$0</small></p>
                      <p style={{ textAlign: "right" }}><small>$0</small></p>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row style={{ marginTop: '10px' }}>
                <Col className="border" span={24} style={{ padding: "5px" }}>
                  <Row style={{ justifyContent: "space-between" }}>
                    <Col>
                      <p><small>Premium</small></p>
                      <p><small>Funding</small></p>
                      <p><small>Fees</small></p>
                    </Col>
                    <Col>
                      <p style={{ textAlign: "right" }}><small>~0 USDC.e</small></p>
                      <p style={{ textAlign: "right" }}><small>~0 USDC.e</small></p>
                      <p style={{ textAlign: "right" }}><small>~0 USDC.e</small></p>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <small style={{ color: "red" }}>Note that the above cost breakdown is an approximation. You will see the actual amount after you approve.</small>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row style={{ marginTop: '10px' }}>
                <Col className="border" span={24} style={{ padding: "5px" }}>
                  <Row style={{ justifyContent: "space-between" }}>
                    <Col>
                      <p><small>You will spend</small></p>
                    </Col>
                    <Col>
                      <p style={{ textAlign: "right" }}><small>0 USDC.e</small></p>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row style={{ marginTop: '10px' }}>
                <Col className="border" span={24} style={{ padding: "5px" }}>
                  <Row style={{ justifyContent: "space-between" }}>
                    <Col>
                      <p><small>You will swap using</small></p>
                    </Col>
                    <Col>
                      <p style={{ textAlign: "right" }}><small>Uniswap V3 and Sushiswap</small></p>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row style={{ marginTop: '10px' }}>
                <Col className="border" span={24} style={{ padding: "5px" }}>
                  <Row style={{ justifyContent: "space-between" }}>
                    <Col>
                      <small>Est. Gas cost</small>
                    </Col>
                    <Col>
                      <small>~$0.08 ( 0 ETH )</small>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row style={{ marginTop: '10px' }}>
                <Button disabled={true} style={{ width: "100%" }}>Insert an amount</Button>
              </Row>
            </Col>}
        </Row >
        <Row>
          <Card title="Deposits" style={{ width: '100%' }}>
            <Table
              columns={fixedColumns}
              dataSource={fixedData}
              pagination={false}
              scroll={{ x: 400, y: 500 }}
              bordered
              summary={() => (
                <Table.Summary fixed>
                </Table.Summary>
              )}
            />
          </Card>
        </Row>
        <Row>
          <Card title="Positions" style={{ width: '100%' }}>
            <Table
              columns={fixed1Columns}
              dataSource={fixed1Data}
              pagination={false}
              scroll={{ x: 500, y: 500 }}
              bordered
              summary={() => (
                <Table.Summary fixed>
                </Table.Summary>
              )}
            />
          </Card>
        </Row>
      </>
      {/* ) : (
        <div style={{ textAlign: "center", paddingTop: "48vh" }}>
          Loading...
        </div>
      )} */}
      < Toaster position="top-center" reverseOrder={false} />
    </>
  );
};
