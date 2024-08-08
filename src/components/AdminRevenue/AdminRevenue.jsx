import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import * as OrderService from "../../services/OrderService";
import TableComponent from "../TableComponent/TableComponent";

import { useQuery } from "@tanstack/react-query";
import { Button, Card, Col, Space, Statistic, Tooltip } from "antd";
import { orderContant } from "../../contant";
import { convertPrice } from "../../utils";
import { Row } from "antd";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import Inputcomponent from "../InputCompunent/Inputcomponent";
import { Excel } from "antd-table-saveas-excel";

const AdminRevenue = () => {
  const user = useSelector((state) => state?.user);
  const [percentTotal, setPercentTotal] = useState(0);
  const [total, setTotal] = useState(false);
  const searchInput = useRef(null);

  const getAllOrder = async () => {
    const res = await OrderService.revenueMonthly(user?.access_token);
    return res;
  };

  const queryOrder = useQuery({
    queryKey: ["statistic"],
    queryFn: getAllOrder,
  });
  const { isLoading: isLoadingOrders, data: orders } = queryOrder;

  const ArrRevenue = () => {
    const revenue = [];
    if (orders?.data && Array.isArray(orders.data)) {
      for (const order of orders.data) {
        const month = new Date(order.DeliveredAt).getMonth() + 1;
        const year = new Date(order.DeliveredAt).getFullYear();
        const paymentMethod = order.paymentMethod.toLowerCase();
        const key = `${year}-${month}`;

        if (!revenue[key]) {
          revenue[key] = { paypal: 0, later_money: 0 };
        }
        if (paymentMethod === "paypal" || paymentMethod === "later_money") {
          revenue[key][paymentMethod] += order.totalPrice;
        }
      }
    }

    const data = Object.keys(revenue).map((key) => ({
      name: key,
      paypal: revenue[key].paypal,
      later_money: revenue[key].later_money,
      total: revenue[key].paypal + revenue[key].later_money,
    }));

    return data;
  };
  const data = ArrRevenue();

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
  };

  const handleReset = (clearFilters) => {
    clearFilters();
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Inputcomponent
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Tìm kiếm
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Cài lại
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

  const columns = [
    {
      title: "Người đặt hàng",
      dataIndex: "userName",
    },
    {
      title: "Hình thức thanh toán",
      dataIndex: "paymentMethod",
    },
    {
      title: "Ngày hoàn tất",
      dataIndex: "DeliveredAt",
      ...getColumnSearchProps("DeliveredAt"),
      sorter: (a, b) => new Date(a.DeliveredAt) - new Date(b.DeliveredAt),
    },
    {
      title: "Đơn giá",
      dataIndex: "totalPrice",
    },
  ];

  const dataTable =
    orders?.data?.length &&
    orders?.data?.map((order) => {
      return {
        ...order,
        key: order._id,
        userName: order?.shippingAddress?.fullName,

        paymentMethod: orderContant.payment[order?.paymentMethod],
        DeliveredAt: order?.DeliveredAt.substring(0, 10),
        totalPrice: convertPrice(order?.totalPrice),
      };
    });

  const calculateMonthlyRevenue = (monthName) => {
    const monthData = data.find((item) => item.name === monthName);

    if (!monthData) {
      return 0;
    }
    const totalRevenue = monthData.paypal + monthData.later_money;
    return totalRevenue;
  };
  // const month = "5";
  // const totalCurentMonthRevenue = calculateMonthlyRevenue(month);

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const totalCurrentMonthRevenue = calculateMonthlyRevenue(
    `${currentYear}-${currentMonth.toString()}`
  );

  useEffect(() => {
    const percent = () => {
      let percentTotal = 0;
      let lastMonth = currentDate.getMonth();
      let lastYear = currentDate.getFullYear();
      if (lastMonth === "0") {
        lastMonth = 12;
        lastYear = lastYear - 1;
      }
      const totalLastMonth = calculateMonthlyRevenue(
        `${lastYear}-${lastMonth.toString()}`
      );
      if (totalLastMonth < totalCurrentMonthRevenue) {
        percentTotal = (totalCurrentMonthRevenue / totalLastMonth) * 100 - 100;
        setTotal(true);
      } else {
        percentTotal = (totalLastMonth / totalCurrentMonthRevenue) * 100 - 100;
      }
      setPercentTotal(parseFloat(percentTotal.toFixed(2)));
    };
    percent();
  }, [totalCurrentMonthRevenue]);

  const handleExportExcel = () => {
    const excel = new Excel();
    excel
      .addSheet("DoanhThu")
      .addColumns(columns)
      .addDataSource(dataTable, {
        str2Percent: true,
      })
      .saveAs("DoanhThu.xlsx");
  };

  return (
    <div>
      <div style={{ marginTop: "20px" }}>
        <Row gutter={16}>
          <Col span={8}>
            <Col>
              <Card bordered={false}>
                <Statistic
                  title={`Doanh thu tháng này (tháng ${currentMonth})`}
                  value={convertPrice(totalCurrentMonthRevenue)}
                />
              </Card>
            </Col>
            {total ? (
              <Col>
                <Card bordered={false}>
                  <Statistic
                    title="Tăng"
                    value={percentTotal}
                    precision={2}
                    valueStyle={{ color: "#3f8600" }}
                    prefix={<ArrowUpOutlined />}
                    suffix="%"
                  />
                </Card>
              </Col>
            ) : (
              <Card bordered={false}>
                <Statistic
                  title="Giảm"
                  value={percentTotal}
                  precision={2}
                  valueStyle={{
                    color: "#cf1322",
                  }}
                  prefix={<ArrowDownOutlined />}
                  suffix="%"
                />
              </Card>
            )}
          </Col>
          <Col span={8}>
            <ResponsiveContainer width={400} height={300}>
              <BarChart
                data={data}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="paypal"
                  stackId="a"
                  fill="#8884d8"
                  name="PayPal"
                ></Bar>
                <Bar
                  dataKey="later_money"
                  stackId="a"
                  fill="#82ca9d"
                  name="Tiền mặt"
                >
                  <LabelList
                    dataKey="total"
                    position="top"
                    fontSize={"10px"}
                    formatter={(value) => convertPrice(value)}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Col>
        </Row>
      </div>
      <div style={{ marginTop: "20px" }}>
        <button onClick={handleExportExcel}>Xuất Excel</button>
        <TableComponent
          columns={columns}
          isLoading={isLoadingOrders}
          data={dataTable}
        />
      </div>
    </div>
  );
};

export default AdminRevenue;
