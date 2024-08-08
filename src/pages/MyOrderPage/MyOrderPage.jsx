import React, { useEffect, useState } from "react";
import * as OrderService from "../../services/OrderService";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  WrapperContainer,
  WrapperFooterItem,
  WrapperHeaderItem,
  WrapperItemOrder,
  WrapperListOrder,
  WrapperStatus,
} from "./style";
import { useMutationHooks } from "../../hooks/useMutationHook";
import { convertPrice } from "../../utils";
import * as message from "../../components/Message/Message";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { orderContant } from "../../contant";

const MyOrderPage = () => {
  const location = useLocation();
  const { state } = location;

  const navigate = useNavigate();

  const fetchMyOrder = async () => {
    const res = await OrderService.getOrderByUserId(state?.id, state?.token);
    //return res.data;
    return Array.isArray(res.data) ? res.data : [];
  };

  const user = useSelector((state) => state.user);

  const queryOrder = useQuery({
    queryKey: ["orders"],
    queryFn: fetchMyOrder,
    enabled: !!state?.id && !!state?.token,
  });
  //const { isLoading, data } = queryOrder;
  const { isLoading, data = [] } = queryOrder;

  const handleDetailsOrder = (id) => {
    navigate(`/details-order/${id}`, {
      state: {
        token: state?.token,
      },
    });
  };
  const mutation = useMutationHooks((data) => {
    const { id, token, orderItems, userId } = data;
    const res = OrderService.cancelOrder(id, token, orderItems, userId);
    return res;
  });
  const mutationAccess = useMutationHooks((data) => {
    const { id, ...rests } = data;
    const res = OrderService.AccessOrder(id, { ...rests });
    return res;
  });

  const handleCanceOrder = (order) => {
    if (order?.deliveryStatus === "delivering") {
      message.error("Không thể hủy đơn hàng đang được giao.");
      return;
    }
    mutation.mutate(
      {
        id: order._id,
        token: state?.token,
        orderItems: order?.orderItems,
        userId: user.id,
      },
      {
        onSuccess: () => {
          queryOrder.refetch();
        },
      }
    );
  };
  const handleAccessOrder = (order) => {
    mutationAccess.mutate(
      {
        id: order._id,
        isPaid: true,
        deliveryStatus: "completed",
        DeliveredAt: new Date(),
      },
      {
        onSuccess: () => {
          queryOrder.refetch();
        },
      }
    );
  };

  const {
    isLoading: isLoadingCancel,
    isSuccess: isSuccessCancel,
    isError: isErrorCancle,
    data: dataCancel,
  } = mutation;

  useEffect(() => {
    if (isSuccessCancel && dataCancel?.status === "OK") {
      message.success();
    } else if (isSuccessCancel && dataCancel?.status === "ERR") {
      message.error(dataCancel?.message);
    } else if (isErrorCancle) {
      message.error();
    }
  }, [isErrorCancle, isSuccessCancel]);

  const renderProduct = (data) => {
    return data?.map((order) => {
      return (
        <WrapperHeaderItem key={order?._id}>
          <img
            src={order?.image}
            style={{
              width: "70px",
              height: "70px",
              objectFit: "cover",
              border: "1px solid rgb(238, 238, 238)",
              padding: "2px",
            }}
          />
          <div
            style={{
              width: 260,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              marginLeft: "10px",
            }}
          >
            {order?.name}
          </div>
          <span
            style={{ fontSize: "13px", color: "#242424", marginLeft: "auto" }}
          >
            {convertPrice(order?.price)}
          </span>
        </WrapperHeaderItem>
      );
    });
  };

  return (
    <WrapperContainer>
      <div style={{ height: "100%", width: "1270px", margin: "0 auto" }}>
        <h4 style={{ fontSize: "20px", paddingTop: "20px" }}>
          Đơn hàng của tôi
        </h4>
        <WrapperListOrder>
          {Array.isArray(data) &&
            data?.map((order) => {
              return (
                <WrapperItemOrder key={order?._id}>
                  <WrapperStatus>
                    <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                      Trạng thái
                    </span>
                    <div style={{ marginTop: "3px" }}>
                      <span>
                        Ngày đặt hàng: {order?.createdAt.substring(0, 10)}
                      </span>
                    </div>
                    <div style={{ marginTop: "3px" }}>
                      <span
                        style={{
                          color: "rgb(90, 32, 193)",
                          fontWeight: "bold",
                        }}
                      >
                        {order?.deliveryStatus
                          ? orderContant.statusMap[order.deliveryStatus]
                          : orderContant.statusMap.pending}
                      </span>
                    </div>
                    <div style={{ marginTop: "3px" }}>
                      <span style={{ color: "rgb(255, 66, 78)" }}>
                        Thanh toán:{" "}
                      </span>
                      <span
                        style={{
                          color: "rgb(90, 32, 193)",
                          fontWeight: "bold",
                        }}
                      >
                        {order?.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
                      </span>
                    </div>
                  </WrapperStatus>
                  {renderProduct(order?.orderItems)}
                  <WrapperFooterItem>
                    <div>
                      <span style={{ color: "rgb(255, 66, 78)" }}>
                        Tổng tiền:{" "}
                      </span>
                      <span
                        style={{
                          fontSize: "13px",
                          color: "rgb(56, 56, 61)",
                          fontWeight: 700,
                        }}
                      >
                        {convertPrice(order?.totalPrice)}
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
                      {order?.deliveryStatus === "delivering" ? (
                        <ButtonComponent
                          onClick={() => handleAccessOrder(order)}
                          size={40}
                          styleButton={{
                            height: "36px",
                            border: "1px solid rgb(11,116,229)",
                            borderRadius: "4px",
                          }}
                          textbutton={"Đã nhận hàng"}
                          styleTextButton={{
                            color: "rgb(11,116,229)",
                            fontSize: "14px",
                          }}
                        ></ButtonComponent>
                      ) : order?.deliveryStatus === "pending" ? (
                        <ButtonComponent
                          onClick={() => handleCanceOrder(order)}
                          size={40}
                          styleButton={{
                            height: "36px",
                            border: "1px solid rgb(255,0,0)",
                            borderRadius: "4px",
                          }}
                          textbutton={"Hủy đơn hàng"}
                          styleTextButton={{
                            color: "rgb(255,0,0)",
                            fontSize: "14px",
                          }}
                        ></ButtonComponent>
                      ) : null}

                      <ButtonComponent
                        onClick={() => handleDetailsOrder(order?._id)}
                        size={40}
                        styleButton={{
                          height: "36px",
                          border: "1px solid rgb(11,116,229)",
                          borderRadius: "4px",
                        }}
                        textbutton={"Xem chi tiết"}
                        styleTextButton={{
                          color: "rgb(11,116,229)",
                          fontSize: "14px",
                        }}
                      ></ButtonComponent>
                    </div>
                  </WrapperFooterItem>
                </WrapperItemOrder>
              );
            })}
        </WrapperListOrder>
      </div>
    </WrapperContainer>
  );
};

export default MyOrderPage;
