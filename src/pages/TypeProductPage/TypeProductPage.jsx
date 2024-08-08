import React, { useEffect, useState } from "react";
import CardComponent from "../../components/CardComponent/CardComponent";
import { Col, Row } from "antd";
import {
  WrapperContent,
  WrapperLableText,
  WrapperNavbar,
  WrapperProducts,
  WrapperTextValue,
} from "./style";
import { useLocation, useNavigate } from "react-router-dom";
import * as ProductService from "../../services/ProductService";
import * as CategoriesService from "../../services/CategoriesService";
import { useSelector } from "react-redux";
import { useDebounce } from "../../hooks/useDebounce";
import Loading from "../../components/LoadingComponent/Loading";
const TypeProductPage = () => {
  const searchProduct = useSelector((state) => state?.product?.search);
  const searchDebounce = useDebounce(searchProduct, 500);
  const { state } = useLocation();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  const fetchProductCategories = async (categoryId) => {
    setLoading(true);
    try {
      const res = await ProductService.getProductsByCategory(categoryId);
      if (res && res.length > 0) {
        setLoading(false);
        setProducts(res);
      } else {
        setLoading(false);
        setProducts([]);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching products:", error);
      setProducts([]);
    }
  };
  useEffect(() => {
    if (state) {
      fetchProductCategories(state.id);
    }
  }, [state]);

  const fetchAllCategories = async () => {
    const res = await CategoriesService.getAllCategories();
    if (res?.status === "OK") {
      setCategories(res.data);
    }
    return res;
  };
  useEffect(() => {
    fetchAllCategories();
  }, []);

  const renderContent = (options) => {
    return options.map((option) => {
      return (
        <WrapperTextValue
          key={option._id}
          onClick={() => handleNavigateCate(option._id)}
        >
          {option.nameCate}
        </WrapperTextValue>
      );
    });
  };
  const handleNavigateCate = (id) => {
    navigate(`/product/${id}`, { state: { id } });
  };
  return (
    <Loading isLoading={loading}>
      <div
        style={{
          width: "100%",
          background: "#efefef",
          height: "calc(100vh - 64px)",
        }}
      >
        <div style={{ width: "1270px", margin: "0 auto", height: "100%" }}>
          <Row
            style={{
              flexWrap: "nowrap",
              paddingTop: "10px",
              height: "calc(100% - 20px)",
            }}
          >
            <WrapperNavbar span={4}>
              <div>
                <WrapperLableText>Danh mục</WrapperLableText>
                <WrapperContent style={{ padding: "0 10px" }}>
                  {renderContent(categories)}
                </WrapperContent>
              </div>
            </WrapperNavbar>
            <Col
              span={20}
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <WrapperProducts>
                {products
                  ?.filter((pro) => {
                    if (searchDebounce === "") {
                      return pro;
                    } else if (
                      pro?.name
                        ?.toLowerCase()
                        ?.includes(searchDebounce?.toLowerCase())
                    ) {
                      return pro;
                    }
                  })
                  ?.map((product) => {
                    return (
                      <CardComponent
                        key={product._id}
                        countInStock={product.countInStock}
                        description={product.description}
                        image={product.image}
                        name={product.name}
                        price={product.price}
                        rating={product.rating}
                        type={product.type}
                        selled={product.selled}
                        discount={product.discount}
                        id={product._id}
                      />
                    );
                  })}
              </WrapperProducts>
            </Col>
          </Row>
        </div>
      </div>
    </Loading>
  );
};

export default TypeProductPage;
