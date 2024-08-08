import { Menu } from "antd";
import { getItem } from "../../utils";
import React, { useState } from "react";
import {
  UserOutlined,
  AppstoreOutlined,
  ShoppingCartOutlined,
  BarChartOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import HeaderComponent from "../../components/HeaderComponent/HeaderComponent";
import AdminUser from "../../components/AdminUser/AdminUser";
import AdminProduct from "../../components/AdminProduct/AdminProduct";
import AdminOrder from "../../components/AdminOrder/AdminOrder";
import AdminRevenue from "../../components/AdminRevenue/AdminRevenue";
import AdminCategories from "../../components/AdminCategories/AdminCategories";

const AdminPage = () => {
  const items = [
    getItem("Người dùng", "user", <UserOutlined />),
    getItem("Sản phẩm", "product", <AppstoreOutlined />),
    getItem("Danh mục loại", "type", <UnorderedListOutlined />),
    getItem("Đơn hàng", "order", <ShoppingCartOutlined />),
    getItem("Thống kê", "revenue", <BarChartOutlined />),
  ];
  // const rootSubmenuKeys = ["user", "product"];
  // const [openKeys, setOpenKeys] = useState(["user"]);
  const [keySelected, setKeySelected] = useState("");

  const renderPage = (key) => {
    switch (key) {
      case "user":
        return <AdminUser />;
      case "product":
        return <AdminProduct />;
      case "type":
        return <AdminCategories />;
      case "order":
        return <AdminOrder />;
      case "revenue":
        return <AdminRevenue />;
      default:
        return <></>;
    }
  };

  const handleOnClick = ({ key }) => {
    setKeySelected(key);
  };
  return (
    <>
      <HeaderComponent isHiddenSearch isHiddenCart />
      <div style={{ display: "flex" }}>
        <Menu
          mode="inline"
          style={{ width: 256, height: "100vh", boxShadow: "1px 1px 2px #ccc" }}
          items={items}
          onClick={handleOnClick}
        />
        <div style={{ flex: 1, padding: "15px" }}>
          {renderPage(keySelected)}
        </div>
      </div>
    </>
  );
};

export default AdminPage;
