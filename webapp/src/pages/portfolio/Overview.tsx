import { CaretUpOutlined, MinusOutlined } from "@ant-design/icons";
import { Row, Col, Divider } from "antd";
import { Link } from "react-router-dom";

interface OverviewProps {
  userData: any;
}

export const Overview: React.FC<OverviewProps> = ({ userData }) => {
  return (
    <>
      <Row>
        <Col span="24">
          <h3>$300M +</h3>
          <p>All Time Open Interest.</p>
        </Col>
      </Row>
      <Divider />
      <Row>
        <Col span="24">
          <h3>Open Positions</h3>
          <span>You do not have any positions yet.</span>
        </Col>
      </Row>
      <Row>
        <Col span="24">
          <h3>Your Deposits</h3>
          <span>You do not have any deposits yet.</span>
        </Col>
      </Row>
    </>
  );
};
