import React, { useMemo } from "react";
import {
  WrapperAllPrice,
  WrapperContentInfo,
  WrapperHeaderUser,
  WrapperInfoUser,
  WrapperItem,
  WrapperItemLabel,
  WrapperLable,
  WrapperNameProduct,
  WrapperProduct,
  WrapperStyleContent,
} from "./style";
import { useLocation, useParams } from "react-router-dom";
import * as OrderService from "../../services/OrderService";
import { useQuery } from "@tanstack/react-query";
import { orderContant } from "../../contant";
import { convertPrice } from "../../utils";

const DetailsOrderPage = () => {
  const params = useParams();
  const location = useLocation();
  const { state } = location;
  const { id } = params;
  const fetchDetailsOrder = async () => {
    const res = await OrderService.getDetailsOrder(id, state?.token);
    return res;
  };

  const queryOrder = useQuery({
    queryKey: ["orders-details"],
    queryFn: fetchDetailsOrder,
    enabled: !!id,
  });
  const { isLoading, data } = queryOrder;
  console.log("data", data);

  const priceMemo = useMemo(() => {
    const result = data?.data?.orderItems?.reduce((total, cur) => {
      return total + cur.price * cur.amount;
    }, 0);
    return result;
  }, [data]);

  const priceDiscountMemo = useMemo(() => {
    const result = data?.data?.orderItems?.reduce((total, cur) => {
      const totalDiscount = cur?.discount ? cur?.discount : 0;
      return total + (priceMemo * (totalDiscount * cur?.amount)) / 100;
    }, 0);
    if (Number(result)) {
      return result;
    }
    return 0;
  }, [data]);

  return (
    <div style={{ width: "100%", height: "100hv", background: "#f5f5fa" }}>
      <div style={{ height: "1270px", width: "1270px", margin: "0 auto" }}>
        <h4 style={{ fontSize: "14px" }}>Chi tiết đơn hàng</h4>
        <WrapperHeaderUser>
          <WrapperInfoUser>
            <WrapperLable>Thông tin người nhận</WrapperLable>
            <WrapperContentInfo>
              <div className="name-info">
                {data?.data?.shippingAddress?.fullName}
              </div>
              <div className="address-info">
                <span>Địa chỉ: </span>
                {`${data?.data?.shippingAddress?.address} ${data?.data?.shippingAddress?.city}`}
              </div>
              <div className="phone-info">
                <span>Điện thoại: </span>
                {data?.data?.shippingAddress?.phone}
              </div>
            </WrapperContentInfo>
          </WrapperInfoUser>
          <WrapperInfoUser>
            <WrapperLable>Hình thức giao hàng</WrapperLable>
            <WrapperContentInfo>
              <div className="delivery-info">Giao hàng tiết kiệm</div>
              {data?.data?.deliveryStatus
                ? orderContant.statusMap[data.data.deliveryStatus]
                : orderContant.statusMap.pending}
              <div className="delivery-fee">
                <span>Phí giao hàng: </span>
                {data?.data?.shippingPrice}
              </div>
            </WrapperContentInfo>
          </WrapperInfoUser>
          <WrapperInfoUser>
            <WrapperLable>Hình thức thanh toán</WrapperLable>
            <WrapperContentInfo>
              <div className="payment-info">
                {orderContant.payment[data?.data?.paymentMethod]}
              </div>
              <div className="status-payment">
                {data?.data?.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
              </div>
            </WrapperContentInfo>
          </WrapperInfoUser>
        </WrapperHeaderUser>
        <WrapperStyleContent>
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ width: "670px", fontSize: "14px" }}>Sản phẩm</div>
            <WrapperItemLabel>Giá</WrapperItemLabel>
            <WrapperItemLabel>Số lượng</WrapperItemLabel>
            <WrapperItemLabel>Giảm giá</WrapperItemLabel>
          </div>
          {data?.data?.orderItems?.map((order) => {
            return (
              <WrapperProduct key={order?._id}>
                <WrapperNameProduct>
                  <img
                    src={order?.image}
                    style={{
                      width: "70px",
                      height: "70px",
                      objectFit: "cover",
                      border: "1px solid rgb(238,238,238)",
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
                      height: "70px",
                    }}
                  >
                    {order?.name}
                  </div>
                </WrapperNameProduct>
                <WrapperItem>{convertPrice(order?.price)}</WrapperItem>
                <WrapperItem style={{ marginLeft: "60px" }}>
                  {order?.amount}
                </WrapperItem>
                <WrapperItem>
                  {order?.discount
                    ? convertPrice((order?.price * order?.discount) / 100)
                    : "0 VND"}
                </WrapperItem>
              </WrapperProduct>
            );
          })}
          <WrapperAllPrice>
            <WrapperItemLabel>Tạm tính</WrapperItemLabel>
            <WrapperItem style={{ marginTop: "5px" }}>
              {convertPrice(priceMemo - priceDiscountMemo)}
            </WrapperItem>
          </WrapperAllPrice>
          <WrapperAllPrice>
            <WrapperItemLabel>Phí vận chuyển</WrapperItemLabel>
            <WrapperItem style={{ marginTop: "5px" }}>
              {convertPrice(data?.data?.shippingPrice)}
            </WrapperItem>
          </WrapperAllPrice>
          <WrapperAllPrice>
            <WrapperItemLabel>Tổng cộng</WrapperItemLabel>
            <WrapperItem style={{ marginTop: "5px" }}>
              {convertPrice(data?.data?.totalPrice)}
            </WrapperItem>
          </WrapperAllPrice>
        </WrapperStyleContent>
      </div>
    </div>
  );
};

export default DetailsOrderPage;
