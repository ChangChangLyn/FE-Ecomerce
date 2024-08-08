import React, { useEffect, useState } from "react";
import {
  WrapperContentProfile,
  WrapperHeader,
  WrapperInput,
  WrapperLabel,
  WrapperUploadFile,
} from "./style";
import InputForm from "../../components/InputForm/InputForm";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { useDispatch, useSelector } from "react-redux";
import * as UserService from "../../services/UserService";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as message from "../../components/Message/Message";
import { updateUser } from "../../redux/slides/userSlide";
import { Button, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { getBase64 } from "../../utils";

const ProfilePage = () => {
  const user = useSelector((state) => state.user);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [avatar, setAvatar] = useState("");

  const dispatch = useDispatch();
  const mutation = useMutationHooks((data) => {
    const { id, access_token, ...rests } = data;
    UserService.updateUser(id, rests, access_token);
  });
  const { data, isSuccess, isError } = mutation;
  useEffect(() => {
    setName(user?.name);
    setEmail(user?.email);
    setPhone(user?.phone);
    setAddress(user?.address);
    setCity(user?.city);
    setAvatar(user?.avatar);
  }, [user]);
  useEffect(() => {
    if (isSuccess) {
      message.success();
      handleGetDetailsUser(user?.id, user?.access_token);
    } else if (isError) {
      message.error();
    }
  }, [isSuccess, isError]);
  const handleGetDetailsUser = async (id, token) => {
    const res = await UserService.getDetailsUser(id, token);
    dispatch(updateUser({ ...res?.data, access_token: token }));
  };

  const handleOnchangeEmail = (value) => {
    setEmail(value);
  };
  const handleOnchangeName = (value) => {
    setName(value);
  };
  const handleOnchangePhone = (value) => {
    setPhone(value);
  };
  const handleOnchangeAddress = (value) => {
    setAddress(value);
  };
  const handleOnchangeCity = (value) => {
    setCity(value);
  };
  const handleOnchangeAvatar = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setAvatar(file.preview);
  };
  const handleUpdate = () => {
    mutation.mutate({
      id: user?.id,
      email,
      name,
      phone,
      address,
      city,
      avatar,
      access_token: user?.access_token,
    });
  };

  return (
    <div style={{ width: "1270px", margin: "0 auto", height: "500px" }}>
      <WrapperHeader>Thông tin người dùng</WrapperHeader>
      <WrapperContentProfile>
        <WrapperInput>
          <WrapperLabel htmlFor="name">Tên</WrapperLabel>
          <InputForm
            style={{ width: "500px" }}
            id="name"
            value={name}
            onChange={handleOnchangeName}
          />
        </WrapperInput>
        <WrapperInput>
          <WrapperLabel htmlFor="email">Email</WrapperLabel>
          <InputForm
            style={{ width: "500px" }}
            id="email"
            value={email}
            onChange={handleOnchangeEmail}
          />
        </WrapperInput>
        <WrapperInput>
          <WrapperLabel htmlFor="phone">SĐT</WrapperLabel>
          <InputForm
            style={{ width: "500px" }}
            id="phone"
            value={phone}
            onChange={handleOnchangePhone}
          />
        </WrapperInput>
        <WrapperInput>
          <WrapperLabel htmlFor="address">Địa chỉ</WrapperLabel>
          <InputForm
            style={{ width: "500px" }}
            id="address"
            value={address}
            onChange={handleOnchangeAddress}
          />
        </WrapperInput>
        <WrapperInput>
          <WrapperLabel htmlFor="city">Thành phố</WrapperLabel>
          <InputForm
            style={{ width: "500px" }}
            id="city"
            value={city}
            onChange={handleOnchangeCity}
          />
        </WrapperInput>
        <WrapperInput>
          <WrapperLabel htmlFor="avatar">Ảnh</WrapperLabel>
          <WrapperUploadFile onChange={handleOnchangeAvatar} maxCount={1}>
            <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
          </WrapperUploadFile>
          {avatar && (
            <img
              src={avatar}
              style={{
                height: "60px",
                width: "60px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
              alt="avatar"
            />
          )}
        </WrapperInput>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <ButtonComponent
            onClick={handleUpdate}
            size={40}
            styleButton={{
              height: "30px",
              width: "fit-content",
              borderRadius: "4px",
              margin: "2px 6px 6px",
            }}
            textbutton={"Cập nhật"}
            styleTextButton={{
              color: "rgb(26, 148, 255)",
              fontSize: "15px",
              fontWeight: "700",
            }}
          ></ButtonComponent>
        </div>
      </WrapperContentProfile>
    </div>
  );
};

export default ProfilePage;
