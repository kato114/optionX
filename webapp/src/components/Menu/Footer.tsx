import React from "react";
import { Link } from "react-router-dom";
import {
  Col,
  Row,
  Typography,
  Button,
} from "antd";

import { UserOutlined, SlidersOutlined, SwapOutlined, OrderedListOutlined, SignalFilled, LaptopOutlined, PieChartOutlined, BarChartOutlined, LineChartOutlined, RadarChartOutlined } from "@ant-design/icons";

export const Footer: React.FC = () => {
  return (
    <div className="footer">
      <Row>
        <Col span="6">
          <Link to="/">
            <Button block>
              <LineChartOutlined />
              <p><small>SSOV</small></p>
            </Button>
          </Link>
        </Col>
        <Col span="6">
          <Link to="/olp">
            <Button block>
              <PieChartOutlined />
              <p><small>OLP</small></p>
            </Button>
          </Link>
        </Col>
        <Col span="6">
          <Link to="/atlantic">
            <Button block>
              <RadarChartOutlined />
              <p><small>Atlantic</small></p>
            </Button>
          </Link>
        </Col>
        <Col span="6">
          <Link to="/overview">
            <Button block>
              <UserOutlined />
              <p><small>Portfolio</small></p>
            </Button>
          </Link>
        </Col>
      </Row>
    </div>
  );
};
