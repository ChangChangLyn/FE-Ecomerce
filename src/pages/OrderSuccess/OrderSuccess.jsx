import React from "react";
import {
  Lable,
  WrapperInfo,
  WrapperContainer,
  WrapperValue,
  WrapperItemOrder,
} from "./style";
import { useSelector } from "react-redux";
import { convertPrice } from "../../utils";
import { useLocation } from "react-router-dom";
import { orderContant } from "../../contant";

const OrderSuccess = () => {
  const order = useSelector((state) => state.order);
  const location = useLocation();
  const { state } = location;
  return (
    <div style={{ background: "#f5f5fa", with: "100%", height: "100vh" }}>
      <div
        style={{
          height: "100%",
          width: "1270px",
          margin: "0 auto",
        }}
      >
        <h3
          style={{ fontSize: "16px", fontWeight: "bold", paddingTop: "20px" }}
        >
          Đặt hàng thành công
        </h3>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            paddingTop: "50px",
          }}
        >
          <WrapperContainer>
            <WrapperInfo>
              <div>
                <Lable>Phương thức giao hàng</Lable>
                <WrapperValue>
                  <span style={{ color: "#ea8500", fontWeight: "bold" }}>
                    {orderContant.delivery[state?.delivery]}
                  </span>{" "}
                  Giao hàng tiết kiệm
                </WrapperValue>
              </div>
            </WrapperInfo>
            <WrapperInfo>
              <div>
                <Lable>Phương thức thanh toán</Lable>
                <WrapperValue>
                  {orderContant.payment[state?.payment]}
                </WrapperValue>
              </div>
            </WrapperInfo>
            <WrapperInfo>
              {state.orders?.map((order) => {
                return (
                  <WrapperItemOrder key={order?.name}>
                    <div
                      style={{
                        width: "390px",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <img
                        src={order?.image}
                        style={{
                          width: "77px",
                          height: "79px",
                          objectFit: "cover",
                        }}
                      />
                      <div
                        style={{
                          width: 260,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {order?.name}
                      </div>
                    </div>
                    <div
                      style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>
                        <span style={{ fontSize: "13px", color: "@242424" }}>
                          Giá tiền: {convertPrice(order?.price)}
                        </span>
                      </span>
                      <span>
                        <span style={{ fontSize: "13px", color: "@242424" }}>
                          Số lượng: {order?.amount}
                        </span>
                      </span>
                      <span>
                        <span style={{ fontSize: "13px", color: "@242424" }}>
                          Thành tiền:{" "}
                          {convertPrice(order?.price * order?.amount)}
                        </span>
                      </span>
                    </div>
                  </WrapperItemOrder>
                );
              })}
            </WrapperInfo>
            <div
              style={{
                alignSelf: "flex-end",
                fontSize: "15px",
                color: "#242424",
                marginTop: "16px",
              }}
            >
              Tổng tiền: {convertPrice(state?.totalPriceMeMo)}
            </div>
          </WrapperContainer>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
