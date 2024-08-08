import React from "react";
import ProductDetailsComponent from "../../components/ProductDetailsComponent/ProductDetailsComponent";
import { useNavigate, useParams } from "react-router-dom";

export const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  return (
    <div style={{ width: "100%", background: "#efefef", height: "100%" }}>
      <div style={{ width: "1270px", height: "100%", margin: "0 auto" }}>
        <h5>
          <span
            style={{
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "14px",
            }}
            onClick={() => {
              navigate("/");
            }}
          >
            Trang chủ
          </span>{" "}
          <span style={{ fontSize: "14px" }}>- Chi tiết sản phẩm</span>
        </h5>
        <ProductDetailsComponent idProduct={id} />
      </div>
    </div>
  );
};
