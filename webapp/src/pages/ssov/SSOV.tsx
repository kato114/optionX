import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

import { Row, Col, Divider, Select, Typography, Badge, Card, Button, Input, Table } from "antd";
import type { ColumnsType } from 'antd/es/table';
import { CaretDownOutlined, CaretUpOutlined, LockFilled } from "@ant-design/icons";

import axios from "axios";

import dxp_icon from "../../assets/img/tokens/dpx.svg";
import apy_icon from "../../assets/img/icons/APY.svg";
import tvl_icon from "../../assets/img/icons/TVL.svg";

import { API_URL, OrderSide, OrderType, TRADE_TYPE, TimeInForce } from "../../config/constant";

interface FixedDataType {
  key: React.Key;
  price: string;
  available: string;
  purchased: string;
  premiums: string;
  rewards: string;
}

const fixedColumns: ColumnsType<FixedDataType> = [
  {
    title: 'Strike Price',
    dataIndex: 'price',
    fixed: true,
    width: 100,
  },
  {
    title: 'Total Available',
    dataIndex: 'available',
  },
  {
    title: 'Total Purchased',
    dataIndex: 'purchased',
  },
  {
    title: 'Total Premiums',
    dataIndex: 'premiums',
  },
  {
    title: 'Rewards',
    dataIndex: 'rewards',
  },
];

const fixedData: FixedDataType[] = [];

interface Fixed1DataType {
  key: React.Key;
  price: string;
  purchased: string;
  exercisable: string;
  pnl: string;
}

const fixed1Columns: ColumnsType<Fixed1DataType> = [
  {
    title: 'Strike Price',
    dataIndex: 'price',
    fixed: true,
    width: 100,
  },
  {
    title: 'Purchased',
    dataIndex: 'purchased',
  },
  {
    title: 'Exercisable',
    dataIndex: 'exercisable',
  },
  {
    title: 'Final Pnl',
    dataIndex: 'pnl',
  }
];

const fixed1Data: Fixed1DataType[] = [];

interface TradeProps {
  userData: any;
}

export const SSOV: React.FC<TradeProps> = ({ userData }) => {
  const [orderType, setOrderType] = useState(TRADE_TYPE.LimitOrder);
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
              </Col>
              <Col>
                <p>DPX monthly</p>
                <small>Arbitrum
                </small>
              </Col>
            </Row>
          </Col>
          <Col>
            <CaretDownOutlined />
          </Col>
        </Row>
        <Divider />
        <Row>
          <Card title={<div><img src={dxp_icon} width="25px" /> DPX monthly</div>}
            extra={<Badge count='CALL' showZero color='#1479fa' />} style={{ width: '100%' }}>
            <Row style={{ justifyContent: "space-around" }}>
              <Col span={8} style={{ textAlign: "center", padding: "5px" }}>
                <img src={apy_icon} width="40px" />
                <p style={{ margin: "10px 0px 0px 0px", lineHeight: "10px" }}>APY upto</p>
                <p>113%</p>
              </Col>
              <Col span={8} style={{ textAlign: "center", padding: "5px" }}>
                <img src={tvl_icon} width="40px" />
                <p style={{ margin: "10px 0px 0px 0px", lineHeight: "10px" }}>TVL</p>
                <p>635.3k</p>
              </Col>
              <Col span={8} style={{ textAlign: "center", padding: "5px" }}>
                <img src={dxp_icon} width="40px" />
                <p style={{ margin: "10px 0px 0px 0px", lineHeight: "10px" }}>DEPOSITS</p>
                <p>8.8k</p>
              </Col>
            </Row>
            <Divider />
            <Row style={{ justifyContent: "space-between" }}>
              <Col>
                <p style={{ margin: "10px 0px 0px 0px" }}><small>Epoch 14</small></p>
                <p><small>24h Voume: $0</small></p>
              </Col>
              <Col style={{ textAlign: "right" }}>
                <p style={{ margin: "10px 0px 0px 0px" }}><small>29 Sep - 27 Oct</small></p>
                <p><small>Open Interest: $256.2k</small></p>
              </Col>
            </Row>
          </Card>
        </Row >
        <Row>
          <Card title={<h4>Deposit</h4>} style={{ width: '100%' }}>
            <Row>
              <Col className="border" span={24} style={{ padding: "5px" }}>
                <Row style={{ justifyContent: "space-between" }}>
                  <Col>
                    <small>Deposit With</small>
                  </Col>
                  <Col>
                    <small>Deposit Amount</small>
                  </Col>
                </Row>
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
                    <small>Balance</small>
                  </Col>
                  <Col>
                    <small>0</small>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row style={{ marginTop: '10px' }}>
              <Select
                size="large"
                style={{ width: "100%" }}
                onChange={setOrderType}
                defaultValue={3}
                options={[
                  { value: 1, label: "$ 0.81" },
                  { value: 2, label: "$ 0.9" },
                  { value: 3, label: "$ 0.98" },
                  { value: 4, label: "$ 1.06" },
                  { value: 5, label: "$ 1.28" },
                ]}
              />
            </Row>
            <Row style={{ marginTop: '10px' }}>
              <Col className="border" span={24} style={{ padding: "5px" }}>
                <Row style={{ justifyContent: "space-between" }}>
                  <Col>
                    <small>Epoch</small>
                  </Col>
                  <Col>
                    <small>6</small>
                  </Col>
                </Row>
                <Row style={{ justifyContent: "space-between" }}>
                  <Col>
                    <small>Withdrawable</small>
                  </Col>
                  <Col>
                    <small>27 Oct 2023</small>
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
                <Row style={{ justifyContent: "space-between" }}>
                  <Col>
                    <LockFilled />
                    <small>Withdrawals are locked until end of Epoch 6 ( 27 Oct 2023 01:00)</small>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row style={{ marginTop: '10px' }}>
              <Button disabled={true} style={{ width: "100%" }}>Insert an amount</Button>
            </Row>
          </Card>
        </Row >
        <Row>
          <Card title="Stats" style={{ width: '100%' }}>
            <Table
              columns={fixedColumns}
              dataSource={fixedData}
              pagination={false}
              scroll={{ x: 600, y: 500 }}
              bordered
              summary={() => (
                <Table.Summary fixed>
                </Table.Summary>
              )}
            />
          </Card>
        </Row>
        <Row>
          <Card title="Write Positions" style={{ width: '100%' }}>
            <p>Your write positions will appear here.</p>
          </Card>
        </Row>
        <Row>
          <Card title="Your Options" style={{ width: '100%' }}>
            <Table
              columns={fixed1Columns}
              dataSource={fixed1Data}
              pagination={false}
              scroll={{ x: 300, y: 500 }}
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
