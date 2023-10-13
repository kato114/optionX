import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

import { Row, Col, Divider, Select, Typography, Badge, Card, Button, Input, Table } from "antd";
import type { ColumnsType } from 'antd/es/table';
import { CaretDownOutlined, CaretUpOutlined, LockFilled } from "@ant-design/icons";

import axios from "axios";

import dxp_icon from "../../assets/img/tokens/dpx.svg";
import usdc_icon from "../../assets/img/tokens/USDC.png";
import tvl_icon from "../../assets/img/icons/TVL.svg";

import { API_URL, OrderSide, OrderType, TRADE_TYPE, TimeInForce } from "../../config/constant";
import { Link } from "react-router-dom";

interface FixedDataType {
  key: React.Key;
  price: string;
  liquidity: string;
  utlization: string;
}
const fixedColumns: ColumnsType<FixedDataType> = [
  {
    title: 'Strike',
    dataIndex: 'price',
    fixed: true,
    width: 100,
  },
  {
    title: 'Liquidity',
    dataIndex: 'liquidity',
  },
  {
    title: 'Utilization',
    dataIndex: 'utlization',
  },
];
const fixedData: FixedDataType[] = [];

interface Fixed1DataType {
  key: React.Key;
  price: string;
  liquidity: string;
  utilization: string;
  discount: string;
  tokens_purchased: string;
  action: string;
}
const fixed1Columns: ColumnsType<Fixed1DataType> = [
  {
    title: 'Strike',
    dataIndex: 'price',
    fixed: true,
    width: 100,
  },
  {
    title: 'Liquidity',
    dataIndex: 'liquidity',
  },
  {
    title: 'Utilization',
    dataIndex: 'utilization',
  },
  {
    title: 'Discount',
    dataIndex: 'discount',
  },
  {
    title: 'Tokens Purchased',
    dataIndex: 'tokens_purchased',
  },
  {
    title: 'Action',
    dataIndex: 'action',
  }
];
const fixed1Data: Fixed1DataType[] = [];

interface Fixed2DataType {
  key: React.Key;
  price: string;
  liquidity: string;
  discount: string;
  action: string;
}
const fixed2Columns: ColumnsType<Fixed2DataType> = [
  {
    title: 'Strike',
    dataIndex: 'price',
    fixed: true,
    width: 100,
  },
  {
    title: 'Liquidity',
    dataIndex: 'liquidity',
  },
  {
    title: 'Discount',
    dataIndex: 'discount',
  },
  {
    title: 'Action',
    dataIndex: 'action',
  }
];
const fixed2Data: Fixed2DataType[] = [];

interface TradeProps {
  userData: any;
}

export const OLP: React.FC<TradeProps> = ({ userData }) => {
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
                    <p>Options LP</p>
                    <small>DPX</small>
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
          <Card title="About OLP"
            extra={<Badge count='BETA' showZero color='#1479fa' />} style={{ width: '100%' }}>
            <Row>
              <Col>
                <p style={{ textAlign: "center" }}>Users can provide liquidity mid-epoch & purchase SSOV options at discounted IV.
                </p>
              </Col>
            </Row>
            <Row style={{ justifyContent: "space-around", marginTop: "15px" }}>
              <Col span={8} style={{ textAlign: "center", padding: "5px" }}>
                <img src={tvl_icon} width="40px" />
                <p style={{ margin: "10px 0px 0px 0px", lineHeight: "10px" }}>TVL</p>
                <p>0</p>
              </Col>
              <Col span={8} style={{ textAlign: "center", padding: "5px" }}>
                <img src={dxp_icon} width="40px" />
                <p style={{ margin: "10px 0px 0px 0px", lineHeight: "10px" }}>DEPOSITS</p>
                <p>0</p>
              </Col>
              <Col span={8} style={{ textAlign: "center", padding: "5px" }}>
                <img src={usdc_icon} width="40px" />
                <p style={{ margin: "10px 0px 0px 0px", lineHeight: "10px" }}>DEPOSITS</p>
                <p>0</p>
              </Col>
            </Row>
          </Card>
        </Row >
        <Row>
          <Card title="Provide LP" style={{ width: '100%' }}>
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
                    <small>Balance</small>
                  </Col>
                  <Col>
                    <small>0</small>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row style={{ marginTop: '10px' }}>
              <Col span={12}>
                <small>Side</small>
                <Row>
                  <Col span="8">
                    <Button block>Put</Button>
                  </Col>
                  <Col span="8">
                    <Button block>Call</Button>
                  </Col>
                </Row>
              </Col>
              <Col span={12}>
                <small>Strike</small>
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
              </Col>
            </Row>
            <Row style={{ marginTop: '10px' }}>
              <Col className="border" span={24} style={{ padding: "5px" }}>
                <Row style={{ justifyContent: "space-between" }}>
                  <Col>
                    <small>Discount</small>
                  </Col>
                  <Col>
                    <small>1% - 100%</small>
                  </Col>
                </Row>
                <Row style={{ justifyContent: "space-between" }}>
                  <Input style={{ width: "100%", textAlign: "right" }} value={1} />
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
                    <small>Withdrawable</small>
                  </Col>
                  <Col>
                    <small>29 Sep 23</small>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row style={{ marginTop: '10px' }}>
              <Button disabled={true} style={{ width: "100%" }}>Expired</Button>
            </Row>
          </Card>
        </Row >
        <Row>
          <Card title="Liquidity" style={{ width: '100%' }}>
            <Table
              columns={fixedColumns}
              dataSource={fixedData}
              pagination={false}
              bordered
              summary={() => (
                <Table.Summary fixed>
                </Table.Summary>
              )}
            />
          </Card>
        </Row>
        <Row>
          <Card title="User LP Positions" style={{ width: '100%' }}>
            <Table
              columns={fixed1Columns}
              dataSource={fixed1Data}
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
          <Card title="All LP Positions" style={{ width: '100%' }}>
            <Table
              columns={fixed2Columns}
              dataSource={fixed2Data}
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
