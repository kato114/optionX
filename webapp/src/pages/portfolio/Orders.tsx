import { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { API_URL, OrderStatus } from "../../config/constant";
import { Row, Col, Divider, Radio, RadioChangeEvent, Button } from "antd";
import { CloseOutlined, LoadingOutlined } from "@ant-design/icons";

interface OrdersProps {
  userData: any;
}

export const Orders: React.FC<OrdersProps> = ({ userData }) => {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("OPEN");
  const [orders, setOrders] = useState({
    order: [],
    allFills: []
  });
  const [rId, setRId] = useState("");

  const onChangeStatus = (e: RadioChangeEvent) => {
    setStatus(e.target.value)
  };

  const getOrderList = () => {
    axios
      .get(API_URL + "/trade/order/" + localStorage.getItem("tgid"))
      .then((response) => {
        if (response.data.succeed == true) {
          setOrders(response.data.data);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  }

  const cancelOrder = (orderId: string) => {
    if (rId != "") {
      return;
    }
    setRId(orderId);
    axios
      .delete(API_URL + "/trade/order/" + localStorage.getItem("tgid") + "/" + orderId)
      .then((response) => {
        if (response.data.succeed) toast.success(response.data.message);
        else toast.error(response.data.message);

        getOrderList()

        setRId("");
      })
      .catch((error) => {
        console.log("error", error);

        setRId("");
      });
  }

  useEffect(() => {
    getOrderList()
  }, [])

  return (
    <>
      {!loading ?
        <>
          <Row>
            <Col span="24" style={{ justifyContent: "center", display: "flex" }}>
              <Radio.Group value={status} onChange={onChangeStatus} buttonStyle="solid">
                <Radio.Button value={OrderStatus.OPEN} >{OrderStatus.OPEN}</Radio.Button>
                <Radio.Button value={OrderStatus.FILL} >{OrderStatus.FILL}</Radio.Button>
              </Radio.Group>
            </Col>
          </Row>
          <Divider />
          <Row>
            {status == "OPEN" ?
              <Col span="24">
                <h3>Open Orders</h3>
                {orders.order.length == 0 ?
                  <p>You have no open orders.</p> :
                  <div>
                    <Row >
                      <Col span="8">
                        <p>Market</p>
                        <small>Side</small>
                      </Col>
                      <Col span="6" style={{ textAlign: "right" }}>
                        <p>Size</p>
                        <small>price</small>
                      </Col>
                      <Col span="6" style={{ textAlign: "right" }}>
                        <p>Type</p>
                        <small>Fee</small>
                      </Col>
                      <Col span="4" style={{ textAlign: "right" }}>
                      </Col>
                    </Row>
                    <Divider />
                    {orders.order.map((item: any, index: any) => (
                      <Row key={index} style={{ marginTop: "10px" }}>
                        <Col span="2">
                          <img
                            src={require(`../../assets/img/tokens/${item.market
                              .split("-")[0]
                              .toLowerCase()}.svg`)}
                            style={{ width: "100%", maxWidth: "30px" }}
                          />
                        </Col>
                        <Col span="6">
                          <p>{item.market}</p>
                          <small>{item.side}</small>
                        </Col>
                        <Col span="6" style={{ textAlign: "right" }}>
                          <p>{item.size}</p>
                          <small>{item.price}</small>
                        </Col>
                        <Col span="6" style={{ textAlign: "right" }}>
                          <p>{item.type}</p>
                          <small>{item.remainingSize}</small>
                        </Col>
                        <Col span="4" style={{ textAlign: "right" }}>
                          <Button danger onClick={() => { cancelOrder(item.id) }} >
                            {rId == item.id ? <LoadingOutlined /> : "X"}
                          </Button>
                        </Col>
                      </Row>
                    ))}
                  </div>
                }
              </Col>
              :
              <Col span="24">
                <h3>Filled Orders</h3>
                {orders.allFills.length == 0 ?
                  <p>You have no filled orders.</p> :
                  <div>
                    <Row >
                      <Col span="8">
                        <p>Market</p>
                        <small>Side</small>
                      </Col>
                      <Col span="6" style={{ textAlign: "right" }}>
                        <p>Size</p>
                        <small>price</small>
                      </Col>
                      <Col span="10" style={{ textAlign: "right" }}>
                        <p>Type</p>
                        <small>remainingSize</small>
                      </Col>
                    </Row>
                    <Divider />
                    {orders.allFills.map((item: any, index: any) => (
                      <Row key={index} style={{ marginTop: "10px" }}>
                        <Col span="2">
                          <img
                            src={require(`../../assets/img/tokens/${item.market
                              .split("-")[0]
                              .toLowerCase()}.svg`)}
                            style={{ width: "100%", maxWidth: "30px" }}
                          />
                        </Col>
                        <Col span="6">
                          <p>{item.market}</p>
                          <small>{item.side}</small>
                        </Col>
                        <Col span="6" style={{ textAlign: "right" }}>
                          <p>{item.size}</p>
                          <small>{item.price}</small>
                        </Col>
                        <Col span="10" style={{ textAlign: "right" }}>
                          <p>{item.type}</p>
                          <small>{item.fee}</small>
                        </Col>
                      </Row>
                    ))}
                  </div>
                }
              </Col>
            }
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
