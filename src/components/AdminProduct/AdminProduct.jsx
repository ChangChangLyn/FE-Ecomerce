import React, { useEffect, useRef, useState } from "react";
import { WrapperHeader, WrapperUploadFile } from "./style";
import {
  PlusCircleFilled,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, Form, Modal, Select, Space } from "antd";
import TableComponent from "../TableComponent/TableComponent";
import Inputcomponent from "../InputCompunent/Inputcomponent";
import {
  convertPrice,
  getBase64,
  renderOptionsType,
  renderOptionsCate,
} from "../../utils";
import * as ProductService from "../../services/ProductService";
import * as CategoriesService from "../../services/CategoriesService";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as message from "../Message/Message";
import { useQuery } from "@tanstack/react-query";
import DrawerComponent from "../DrawerComponent/DrawerComponent";
import { useSelector } from "react-redux";

const AdminProduct = () => {
  const inittial = () => ({
    name: "",
    price: "",
    description: "",
    rating: "",
    image: "",
    categories: "",
    countInStock: "",
    newType: "",
    discount: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowSelected, setRowSelected] = useState("");
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const user = useSelector((state) => state?.user);
  const searchInput = useRef(null);

  const [stateProduct, setStateProduct] = useState(inittial());
  const [stateProductDetails, setStateProductDetails] = useState(inittial());
  const [form] = Form.useForm();
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);

  const mutation = useMutationHooks((data) => {
    const {
      name,
      price,
      description,
      rating,
      image,
      categories,
      countInStock,
      discount,
    } = data;
    const res = ProductService.createProduct({
      name,
      price,
      description,
      rating,
      image,
      categories,
      countInStock,
      discount,
    });
    return res;
  });

  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rests } = data;
    const res = ProductService.updateProduct(id, token, { ...rests });
    return res;
  });

  const mutationDeleted = useMutationHooks((data) => {
    const { id, token } = data;
    const res = ProductService.deleteProduct(id, token);
    return res;
  });

  const getAllProduct = async () => {
    const res = ProductService.getAllProduct();
    return res;
  };

  // const fetchAllTypeProduct = async () => {
  //   const res = await ProductService.getAllTypeProduct();
  //   return res;
  // };
  const fetchAllCategories = async () => {
    const res = await CategoriesService.getAllCategories();
    return res;
  };

  const { data, isSuccess, isError } = mutation;
  const {
    data: dataUpdated,
    isSuccess: isSuccessUpdated,
    isError: isErrorUpdated,
  } = mutationUpdate;
  const {
    data: dataDeleted,
    isSuccess: isSuccessDeleted,
    isError: isErrorDeleted,
  } = mutationDeleted;
  const queryProduct = useQuery({
    queryKey: ["products"],
    queryFn: getAllProduct,
  });
  // const typeProduct = useQuery({
  //   queryKey: ["type-product"],
  //   queryFn: fetchAllTypeProduct,
  // });
  const categories = useQuery({
    queryKey: ["categories"],
    queryFn: fetchAllCategories,
  });
  const { isLoading: isLoadingProducts, data: products } = queryProduct;

  const handleDetailsProduct = () => {
    setIsOpenDrawer(true);
  };

  const fetchGetDetailsProduct = async (rowSelected) => {
    const res = await ProductService.getDetailsProduct(rowSelected);
    console.log(res.data);
    if (res?.data) {
      setStateProductDetails({
        name: res?.data?.name,
        price: res?.data?.price,
        description: res?.data?.description,
        rating: res?.data?.rating,
        image: res?.data?.image,
        categories: categoriesLookup[res?.data?.categories],
        countInStock: res?.data?.countInStock,
        discount: res?.data?.discount,
      });
    }
  };

  useEffect(() => {
    if (!isModalOpen) {
      form.setFieldsValue(stateProductDetails);
    } else {
      form.setFieldsValue(inittial());
    }
  }, [form, stateProductDetails, isModalOpen]);
  useEffect(() => {
    if (rowSelected) {
      fetchGetDetailsProduct(rowSelected);
    }
  }, [rowSelected]);

  const renderAction = () => {
    return (
      <div>
        <EditOutlined
          style={{
            color: "black",
            fontSize: "30px",
            cursor: "pointer",
            marginRight: "20px",
          }}
          onClick={handleDetailsProduct}
        />
        <DeleteOutlined
          style={{ color: "red", fontSize: "30px", cursor: "pointer" }}
          onClick={() => setIsModalOpenDelete(true)}
        />
      </div>
    );
  };
  const categoriesLookup = categories?.data?.data?.reduce((acc, category) => {
    acc[category._id] = category.nameCate;
    return acc;
  }, {});
  const dataTable =
    products?.data?.length &&
    products?.data?.map((product) => {
      return {
        ...product,
        key: product._id,
        price: convertPrice(product.price),
        discount: product.discount + " %",
        categories: categoriesLookup[product.categories],
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
      title: "Tên sản phẩm",
      dataIndex: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps("name"),
    },
    {
      title: "Giá",
      dataIndex: "price",
      sorter: (a, b) => a.price - b.price,
      filters: [
        {
          text: "Trên 1.000.000",
          value: ">=",
        },
        {
          text: "Dưới 1.000.000",
          value: "<",
        },
      ],
      onFilter: (value, record) => {
        if (value === ">=") {
          return record.price >= 1000000;
        }
        return record.price < 1000000;
      },
    },
    {
      title: "Danh mục",
      dataIndex: "categories",
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps("categories"),
    },
    {
      title: "Số lượng",
      dataIndex: "countInStock",
      sorter: (a, b) => a.countInStock - b.countInStock,
      filters: [
        {
          text: "Trên 50",
          value: ">=",
        },
        {
          text: "Dưới 50",
          value: "<",
        },
      ],
      onFilter: (value, record) => {
        if (value === ">=") {
          return Number(record.countInStock) >= 50;
        }
        return Number(record.countInStock) < 50;
      },
    },
    {
      title: "Giảm giá",
      dataIndex: "discount",
      sorter: (a, b) => a.discount - b.discount,
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
    if (isSuccessUpdated && dataUpdated?.status === "OK") {
      message.success();
      handleCloseDrawer();
    } else if (isErrorUpdated) {
      message.error();
    }
  }, [isSuccessUpdated]);

  useEffect(() => {
    if (isSuccessDeleted && dataDeleted?.status === "OK") {
      message.success();
      handleCancelDelete();
    } else if (isErrorDeleted) {
      message.error();
    }
  }, [isSuccessDeleted]);

  const handleCloseDrawer = () => {
    setIsOpenDrawer(false);
    setStateProductDetails({
      name: "",
      price: "",
      description: "",
      rating: "",
      image: "",
      categories: "",
      countInStock: "",
      discount: "",
    });
    form.resetFields();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setStateProduct({
      name: "",
      price: "",
      description: "",
      rating: "",
      image: "",
      categories: "",
      countInStock: "",
      discount: "",
    });
    form.resetFields();
  };
  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
  };

  const handleDeleteProduct = () => {
    mutationDeleted.mutate(
      { id: rowSelected, token: user?.access_token },
      {
        onSettled: () => {
          queryProduct.refetch();
        },
      }
    );
    setIsModalOpenDelete(false);
  };

  const onFinish = () => {
    const params = {
      name: stateProduct.name,
      price: stateProduct.price,
      description: stateProduct.description,
      rating: stateProduct.rating,
      image: stateProduct.image,
      categories: stateProduct.categories,
      countInStock: stateProduct.countInStock,
      discount: stateProduct.discount,
    };
    mutation.mutate(params, {
      onSettled: () => {
        queryProduct.refetch();
      },
    });
  };
  const handleOnchange = (e) => {
    setStateProduct({
      ...stateProduct,
      [e.target.name]: e.target.value,
    });
  };
  const handleSelectCate = (selectedOption) => {
    setStateProduct({
      ...stateProduct,
      categories: selectedOption,
    });
  };
  const handleSelectCateDetails = (selectedOption) => {
    setStateProductDetails({
      ...stateProductDetails,
      categories: selectedOption,
    });
  };

  const handleOnchangeDetails = (e) => {
    setStateProductDetails({
      ...stateProductDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnchangeAvatar = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateProduct({
      ...stateProduct,
      image: file.preview || file.url || "",
    });
  };
  const handleOnchangeAvatarDetails = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateProductDetails({
      ...stateProductDetails,
      image: file.preview || file.url || "",
    });
  };

  const onUpdateProduct = () => {
    mutationUpdate.mutate(
      {
        id: rowSelected,
        token: user?.access_token,
        ...stateProductDetails,
      },
      {
        onSettled: () => {
          queryProduct.refetch();
        },
      }
    );
  };

  const handleChangeSelect = (value) => {
    setStateProduct({
      ...stateProduct,
      type: value,
    });
  };
  const handleChangeSelectDetails = (value) => {
    setStateProductDetails({
      ...stateProductDetails,
      type: value,
    });
  };

  return (
    <div>
      <WrapperHeader>Quản lý sản phẩm</WrapperHeader>
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
          isLoading={isLoadingProducts}
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
        title="Tạo sản phẩm"
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
            label="Tên sản phẩm"
            name="name"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tên sản phẩm!",
              },
            ]}
          >
            <Inputcomponent
              value={stateProduct.name}
              onChange={handleOnchange}
              name="name"
            />
          </Form.Item>
          <Form.Item
            label="Danh mục"
            name="categories"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn danh mục!",
              },
            ]}
          >
            <Select
              name="categories"
              value={stateProduct.categories}
              onChange={handleSelectCate}
              options={renderOptionsCate(categories?.data?.data)}
            />
          </Form.Item>
          <Form.Item
            label="Số lượng"
            name="countInStock"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập số lượng!",
              },
            ]}
          >
            <Inputcomponent
              value={stateProduct.countInStock}
              onChange={handleOnchange}
              name="countInStock"
            />
          </Form.Item>
          <Form.Item
            label="Giá"
            name="price"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập giá!",
              },
            ]}
          >
            <Inputcomponent
              value={stateProduct.price}
              onChange={handleOnchange}
              name="price"
            />
          </Form.Item>
          <Form.Item
            label="Mô tả"
            name="description"
            rules={[
              {
                required: true,
                message: "Vui lòng mô tả sản phẩm!",
              },
            ]}
          >
            <Inputcomponent
              value={stateProduct.description}
              onChange={handleOnchange}
              name="description"
            />
          </Form.Item>

          <Form.Item label="Giảm giá" name="discount">
            <Inputcomponent
              value={stateProduct.discount}
              onChange={handleOnchange}
              name="discount"
            />
          </Form.Item>
          <Form.Item
            label="Hình ảnh"
            name="image"
            rules={[
              {
                required: true,
                message: "Vui lòng thêm hình ảnh!",
              },
            ]}
          >
            <WrapperUploadFile onChange={handleOnchangeAvatar} maxCount={1}>
              <Button>Tải ảnh lên</Button>
              {stateProduct?.image && (
                <img
                  src={stateProduct?.image}
                  style={{
                    height: "60px",
                    width: "60px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    marginLeft: "10px",
                  }}
                  alt="avatar"
                />
              )}
            </WrapperUploadFile>
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

      <DrawerComponent
        title="Chi tiết sản phẩm"
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
          onFinish={onUpdateProduct}
          autoComplete="on"
          form={form}
        >
          <Form.Item
            label="Tên sản phẩm"
            name="name"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tên sản phẩm!",
              },
            ]}
          >
            <Inputcomponent
              value={stateProductDetails.name}
              onChange={handleOnchangeDetails}
              name="name"
            />
          </Form.Item>
          <Form.Item
            label="Danh mục"
            name="categories"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn danh mục!",
              },
            ]}
          >
            <Select
              name="categories"
              value={stateProductDetails.categories}
              onChange={handleSelectCateDetails}
              options={renderOptionsCate(categories?.data?.data)}
            />
          </Form.Item>

          <Form.Item
            label="Số lượng"
            name="countInStock"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập số lượng!",
              },
            ]}
          >
            <Inputcomponent
              value={stateProductDetails.countInStock}
              onChange={handleOnchangeDetails}
              name="countInStock"
            />
          </Form.Item>
          <Form.Item
            label="Giá"
            name="price"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập giá!",
              },
            ]}
          >
            <Inputcomponent
              value={stateProductDetails.price}
              onChange={handleOnchangeDetails}
              name="price"
            />
          </Form.Item>
          <Form.Item
            label="Mô tả"
            name="description"
            rules={[
              {
                required: true,
                message: "Vui lòng mô tả sản phẩm!",
              },
            ]}
          >
            <Inputcomponent
              value={stateProductDetails.description}
              onChange={handleOnchangeDetails}
              name="description"
            />
          </Form.Item>

          <Form.Item label="Giảm giá" name="discount">
            <Inputcomponent
              value={stateProductDetails.discount}
              onChange={handleOnchangeDetails}
              name="discount"
            />
          </Form.Item>

          <Form.Item
            label="Hình ảnh"
            name="image"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn hình ảnh!",
              },
            ]}
          >
            <WrapperUploadFile
              onChange={handleOnchangeAvatarDetails}
              maxCount={1}
            >
              <Button>Tải ảnh lên</Button>
              {stateProductDetails?.image && (
                <img
                  src={stateProductDetails?.image}
                  style={{
                    height: "60px",
                    width: "60px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    marginLeft: "10px",
                  }}
                  alt="avatar"
                />
              )}
            </WrapperUploadFile>
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 20,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit">
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      </DrawerComponent>

      <Modal
        title="Xóa sản phẩm"
        open={isModalOpenDelete}
        onCancel={handleCancelDelete}
        onOk={handleDeleteProduct}
      >
        <div>Bạn có muốn xóa sản phẩm này?</div>
      </Modal>
    </div>
  );
};

export default AdminProduct;
