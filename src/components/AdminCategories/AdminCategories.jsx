import React, { useEffect, useRef, useState } from "react";
import { WrapperHeader } from "./style";
import {
  PlusCircleFilled,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, Form, Modal, Select, Space } from "antd";
import TableComponent from "../TableComponent/TableComponent";
import Inputcomponent from "../InputCompunent/Inputcomponent";
import * as CategoriesService from "../../services/CategoriesService";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as message from "../Message/Message";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";

const AdminCategories = () => {
  const inittial = () => ({
    nameCate: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowSelected, setRowSelected] = useState("");
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const user = useSelector((state) => state?.user);
  const searchInput = useRef(null);

  const [stateCate, setStateCate] = useState(inittial());
  const [form] = Form.useForm();

  const mutation = useMutationHooks((data) => {
    const { nameCate } = data;
    const res = CategoriesService.createCategories({
      nameCate,
    });
    return res;
  });

  const mutationDeleted = useMutationHooks((data) => {
    const { id, token } = data;
    const res = CategoriesService.deleteCategories(id, token);
    return res;
  });

  const fetchAllCategories = async () => {
    const res = await CategoriesService.getAllCategories();
    return res;
  };

  const { data, isSuccess, isError } = mutation;

  const {
    data: dataDeleted,
    isSuccess: isSuccessDeleted,
    isError: isErrorDeleted,
  } = mutationDeleted;

  const queryCategories = useQuery({
    queryKey: ["categories"],
    queryFn: fetchAllCategories,
  });
  const { isLoading: isLoadingCategories, data: categories } = queryCategories;

  const renderAction = () => {
    return (
      <div>
        <DeleteOutlined
          style={{ color: "red", fontSize: "30px", cursor: "pointer" }}
          onClick={() => setIsModalOpenDelete(true)}
        />
      </div>
    );
  };
  const dataTable =
    categories?.data?.length &&
    categories?.data?.map((cate) => {
      return {
        ...cate,
        key: cate._id,
      };
    });

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
      title: "Tên danh mục",
      dataIndex: "nameCate",
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps("nameCate"),
    },
    {
      title: "Số lượng sản phẩm",
      dataIndex: "count",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: renderAction,
    },
  ];

  useEffect(() => {
    if (isSuccess && data?.status === "OK") {
      message.success();
      handleCancel();
    } else if (isError) {
      message.error();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isSuccessDeleted && dataDeleted?.status === "OK") {
      message.success("Xóa danh mục thành công!");
      handleCancelDelete();
    } else if (isErrorDeleted) {
      message.error("Không thể xóa danh mục!");
    }
  }, [isSuccessDeleted]);

  const handleCancel = () => {
    setIsModalOpen(false);
    setStateCate({
      nameCate: "",
    });
    form.resetFields();
  };
  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
  };

  const handleDeleteCate = () => {
    mutationDeleted.mutate(
      { id: rowSelected, token: user?.access_token },
      {
        onSettled: () => {
          queryCategories.refetch();
        },
      }
    );
    setIsModalOpenDelete(false);
  };

  const onFinish = () => {
    const params = {
      nameCate: stateCate.nameCate,
    };
    mutation.mutate(params, {
      onSettled: () => {
        queryCategories.refetch();
      },
    });
  };
  const handleOnchange = (e) => {
    setStateCate({
      ...stateCate,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      <WrapperHeader>Quản lý danh mục</WrapperHeader>
      <div style={{ marginTop: "10px" }}>
        <Button
          style={{
            height: "50px",
            width: "100px",
            borderRadius: "8px",
            borderStyle: "dashed",
          }}
          onClick={() => setIsModalOpen(true)}
        >
          <PlusCircleFilled style={{ fontSize: "40px" }} />
        </Button>
      </div>
      <div style={{ marginTop: "20px" }}>
        <TableComponent
          columns={columns}
          isLoading={isLoadingCategories}
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
      <Modal
        forceRender
        title="Tạo danh mục"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          name="basic"
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 18,
          }}
          style={{
            maxWidth: 600,
          }}
          onFinish={onFinish}
          autoComplete="on"
          form={form}
        >
          <Form.Item
            label="Tên danh mục"
            name="name"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tên danh mục!",
              },
            ]}
          >
            <Inputcomponent
              value={stateCate.nameCate}
              onChange={handleOnchange}
              name="nameCate"
            />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 20,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit">
              Tạo mới
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Xóa danh mục"
        open={isModalOpenDelete}
        onCancel={handleCancelDelete}
        onOk={handleDeleteCate}
      >
        <div>Bạn có muốn xóa danh mục này?</div>
      </Modal>
    </div>
  );
};

export default AdminCategories;
