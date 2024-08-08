import React, { useEffect, useState } from "react";
import { WrapperContent, WrapperLableText, WrapperTextValue } from "./style";
import * as ProductService from "../../services/ProductService";
import { useNavigate } from "react-router-dom";

const NavbarComponent = () => {
  const [typeProducts, setTypeProducts] = useState([]);

  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct();
    if (res?.status === "OK") {
      setTypeProducts(res?.data);
    }
    return res;
  };
  useEffect(() => {
    fetchAllTypeProduct();
  }, []);

  const renderContent = (options) => {
    return options.map((option, index) => {
      return <WrapperTextValue key={index}>{option}</WrapperTextValue>;
    });
  };
  return (
    <div>
      <WrapperLableText>Danh mục</WrapperLableText>
      <WrapperContent>{renderContent(typeProducts)}</WrapperContent>
    </div>
  );
};

export default NavbarComponent;
