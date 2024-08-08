import React from "react";
import { useNavigate } from "react-router-dom";
import { WrapperType } from "./style";

const TypeProduct = ({ name, id }) => {
  const navigate = useNavigate();

  const handleNavigateType = (id) => {
    navigate(`/product/${id}`, { state: { id } });
  };
  return (
    <WrapperType
      style={{ padding: "0 10px", cursor: "pointer" }}
      onClick={() => handleNavigateType(id)}
    >
      {name}
    </WrapperType>
  );
};

export default TypeProduct;
