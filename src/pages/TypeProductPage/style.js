import { Col } from "antd";
import styled from "styled-components";

export const WrapperProducts = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 20px;
  flex-wrap: wrap;
`;
export const WrapperNavbar = styled(Col)`
  background: #fff;
  margin-right: 10px;
  padding: 10px;
  border-radius: 4px;
  height: fit-content;
  margin-top: 20px;
  width: 200px;
`;
export const WrapperTextValue = styled.span`
  display: flex;
  padding: 0 10px;
  cursor: pointer;
  &:hover {
    color: #fff !important;
    background: #1a94ff !important;
    span {
      color: #013c9b !important;
    }
  }
`;
export const WrapperLableText = styled.h4`
  color: rgb(56, 56, 61);
  font-size: 14px;
  font-weight: 500;
`;
export const WrapperContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
  justify-content: flex-start;
  height: auto;
`;
