import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as OrderService from "../../services/OrderService";
import { useQuery } from "@tanstack/react-query";
import Inputcomponent from "../InputCompunent/Inputcomponent";
import { Button, Checkbox, Form, Modal, Space, Switch } from "antd";
import { SearchOutlined, EditOutlined, CloseOutlined } from "@ant-design/icons";
import { orderContant } from "../../contant";
import { convertPrice } from "../../utils";
import { WrapperHeader } from "./style";
import TableComponent from "../TableComponent/TableComponent";
import DrawerComponent from "../DrawerComponent/DrawerComponent";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as message from "../Message/Message";

const AdminOrder = () => {
  const inittial = () => ({
    fullName: "",
    address: "",
    city: "",
    phone: "",
    totalPrice: "",
    isPaid: "",
    deliveryStatus: "",
  });
  const user = useSelector((state) => state?.user);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [form] = Form.useForm();
  const [stateOrderDetails, setStateOrderDetails] = useState(inittial());
  const [rowSelected, setRowSelected] = useState("");

  const getAllOrder = async () => {
    const res = await OrderService.getAllOrder(user?.access_token);
    return res;
  };

  const queryOrder = useQuery({ queryKey: ["orders"], queryFn: getAllOrder });
  const { isLoading: isLoadingOrders, data: orders } = queryOrder;

  const mutationUpdate = useMutationHooks((data) => {
    const { id, ...rests } = data;
    const res = OrderService.AccessOrder(id, { ...rests });
    return res;
  });
  const {
    data: dataUpdated,
    isSuccess: isSuccessUpdated,
    isError: isErrorUpdated,
  } = mutationUpdate;

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Inputcomponent
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
      }
    },
  });

  const fetchGetDetailsOrder = async (rowSelected) => {
    const res = await OrderService.getDetailsOrder(rowSelected);
    if (res?.data) {
      setStateOrderDetails({
        fullName: res?.data?.shippingAddress?.fullName,
        address: res?.data?.shippingAddress?.address,
        city: res?.data?.shippingAddress?.city,
        phone: res?.data?.shippingAddress?.phone,
        totalPrice: res?.data?.totalPrice,
        isPaid: res?.data?.isPaid,
        deliveryStatus: res?.data?.deliveryStatus,
      });
    }
  };
  useEffect(() => {
    form.setFieldsValue(stateOrderDetails);
  }, [form, stateOrderDetails]);
  useEffect(() => {
    if (rowSelected) {
      fetchGetDetailsOrder(rowSelected);
    }
  }, [rowSelected]);

  const renderAction = (order) => {
    return (
      <div>
        <EditOutlined
          style={{
            color: "black",
            fontSize: "30px",
            cursor: "pointer",
            marginRight: "20px",
          }}
          onClick={handleDetailsOrder}
        />
        {order.deliveryStatus === "Chờ xử lý" && (
          <CloseOutlined
            style={{ color: "red", fontSize: "30px", cursor: "pointer" }}
            onClick={() => setIsModalOpenDelete(true)}
          />
        )}
      </div>
    );
  };

  const columns = [
    {
      title: "Người dùng",
      dataIndex: "userName",
      sorter: (a, b) => a.userName.length - b.userName.length,
      ...getColumnSearchProps("userName"),
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      ...getColumnSearchProps("phone"),
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
    },
    {
      title: "Thanh toán",
      dataIndex: "isPaid",
      sorter: (a, b) => a.isPaid.length - b.isPaid.length,
    },
    {
      title: "Giao hàng",
      dataIndex: "deliveryStatus",
    },
    {
      title: "Đơn giá",
      dataIndex: "totalPrice",
      sorter: (a, b) => a.totalPrice.length - b.totalPrice.length,
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, order) => renderAction(order),
    },
  ];

  const dataTable =
    orders?.data?.length &&
    orders?.data?.map((order) => {
      return {
        ...order,
        key: order._id,
        userName: order?.shippingAddress?.fullName,
        phone: order?.shippingAddress?.phone,
        address:
          order?.shippingAddress?.address + " " + order?.shippingAddress?.city,
        isPaid: order?.isPaid ? "TRUE" : "FALSE",
        deliveryStatus: order?.deliveryStatus
          ? orderContant.statusMap[order.deliveryStatus]
          : orderContant.statusMap.pending,
        totalPrice: convertPrice(order?.totalPrice),
      };
    });

  const handleDetailsOrder = () => {
    setIsOpenDrawer(true);
  };
  const handleCloseDrawer = () => {
    setIsOpenDrawer(false);
    setStateOrderDetails({
      fullName: "",
      address: "",
      city: "",
      phone: "",
      totalPrice: "",
      isPaid: "",
      deliveryStatus: "",
    });
    form.resetFields();
  };

  const onAccessOrder = () => {
    const updatedOrder = {
      ...stateOrderDetails,
      deliveryStatus: stateOrderDetails.deliveryStatus,
    };
    mutationUpdate.mutate(
      {
        id: rowSelected,
        ...updatedOrder,
      },
      {
        onSettled: () => {
          queryOrder.refetch();
        },
      }
    );
  };

  useEffect(() => {
    if (isSuccessUpdated && dataUpdated?.status === "OK") {
      message.success();
      handleCloseDrawer();
    } else if (isErrorUpdated) {
      message.error();
    }
  }, [isSuccessUpdated]);

  const handleOnchangeDetails = (e) => {
    const { name, value } = e.target;

    setStateOrderDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
  };

  const handleDeleteOrder = () => {
    const updatedOrder = {
      ...stateOrderDetails,
      deliveryStatus: "refused",
    };
    mutationUpdate.mutate(
      {
        id: rowSelected,
        ...updatedOrder,
      },
      {
        onSettled: () => {
          queryOrder.refetch();
        },
      }
    );
    setIsModalOpenDelete(false);
  };

  return (
    <div>
      <WrapperHeader>Quản lý đơn hàng</WrapperHeader>
      <div style={{ marginTop: "20px" }}>
        <TableComponent
          columns={columns}
          isLoading={isLoadingOrders}
          data={dataTable}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                setRowSelected(record._id);
              },
            };
          }}
        />
      </div>
      <DrawerComponent
        title="Chi tiết đơn hàng"
        isOpen={isOpenDrawer}
        onClose={() => setIsOpenDrawer(false)}
        width="90%"
      >
        <Form
          name="basic"
          labelCol={{
            span: 2,
          }}
          wrapperCol={{
            span: 22,
          }}
          onFinish={onAccessOrder}
          autoComplete="on"
          form={form}
        >
          <Form.Item label="Tên" name="fullName">
            <Inputcomponent
              value={stateOrderDetails.fullName}
              name="fullName"
              disabled={true}
              style={{
                backgroundColor: "#f5f5f5",
                color: "rgba(0, 0, 0, 0.65)",
                border: "1px solid #d9d9d9",
                cursor: "not-allowed",
              }}
            />
          </Form.Item>

          <Form.Item label="SDT" name="phone">
            <Inputcomponent
              value={stateOrderDetails.phone}
              name="phone"
              disabled={true}
              style={{
                backgroundColor: "#f5f5f5",
                color: "rgba(0, 0, 0, 0.65)",
                border: "1px solid #d9d9d9",
                cursor: "not-allowed",
              }}
            />
          </Form.Item>
          <Form.Item label="Địa chỉ" name="address">
            <Inputcomponent
              value={stateOrderDetails.address}
              name="address"
              disabled={true}
              style={{
                backgroundColor: "#f5f5f5",
                color: "rgba(0, 0, 0, 0.65)",
                border: "1px solid #d9d9d9",
                cursor: "not-allowed",
              }}
            />
          </Form.Item>
          <Form.Item label="Thành phố" name="city">
            <Inputcomponent
              value={stateOrderDetails.city}
              name="city"
              disabled={true}
              style={{
                backgroundColor: "#f5f5f5",
                color: "rgba(0, 0, 0, 0.65)",
                border: "1px solid #d9d9d9",
                cursor: "not-allowed",
              }}
            />
          </Form.Item>

          <Form.Item label="Đơn giá" name="totalPrice">
            <Inputcomponent
              value={stateOrderDetails.totalPrice}
              name="totalPrice"
              disabled={true}
              style={{
                backgroundColor: "#f5f5f5",
                color: "rgba(0, 0, 0, 0.65)",
                border: "1px solid #d9d9d9",
                cursor: "not-allowed",
              }}
            />
          </Form.Item>

          <Form.Item label="Thanh toán" name="isPaid" valuePropName="checked">
            <Switch checked={stateOrderDetails.isPaid} disabled={true} />
          </Form.Item>

          <Form.Item label="Trạng thái">
            <Checkbox.Group
              options={[
                { label: "Giao hàng", value: "delivering" },
                { label: "Chờ xử lý", value: "pending" },
                { label: "Hoàn thành", value: "completed" },
              ]}
              value={
                stateOrderDetails.deliveryStatus
                  ? [stateOrderDetails.deliveryStatus]
                  : []
              }
              onChange={(checkedValues) =>
                handleOnchangeDetails({
                  target: {
                    name: "deliveryStatus",
                    value: checkedValues.length > 0 ? checkedValues[0] : null,
                  },
                })
              }
              disabled={
                stateOrderDetails.deliveryStatus === "completed" ||
                stateOrderDetails.deliveryStatus === "refused"
              }
            />
          </Form.Item>
          {stateOrderDetails.deliveryStatus === "pending" ||
          stateOrderDetails.deliveryStatus === "delivering" ? (
            <Form.Item
              wrapperCol={{
                offset: 20,
                span: 16,
              }}
            >
              <Button type="primary" htmlType="submit">
                Xác nhận
              </Button>
            </Form.Item>
          ) : null}
        </Form>
      </DrawerComponent>

      <Modal
        title="Xóa sản phẩm"
        open={isModalOpenDelete}
        onCancel={handleCancelDelete}
        onOk={handleDeleteOrder}
      >
        <div>Bạn có muốn từ chối đơn hàng này?</div>
      </Modal>
    </div>
  );
};

export default AdminOrder;
