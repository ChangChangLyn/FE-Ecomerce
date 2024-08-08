import React, { useEffect, useState } from "react";
import { Badge, Button, Col, message, Popover } from "antd";
import {
  WrapperContentPopup,
  WrapperHeader,
  WrapperHeaderAccount,
  WrapperTextHeader,
  WrapperTextHeaderSmall,
} from "./style";
import {
  UserOutlined,
  CaretDownOutlined,
  ShoppingCartOutlined,
  AudioOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as UserService from "../../services/UserService";
import { resetUser } from "../../redux/slides/userSlide";
import Loading from "../LoadingComponent/Loading";
import { searchProduct } from "../../redux/slides/productSlide";
import { Modal, Spin } from "antd";
import { notification } from "antd";
import { Input } from "antd";
const { Search } = Input;

const HeaderComponent = ({ isHiddenSearch = false, isHiddenCart = false }) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const order = useSelector((state) => state.order);
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const [userAvatar, setUserAvatar] = useState("");
  const [search, setSearch] = useState("");
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const onPage = () => {
    navigate("/");
  };

  const handleNavigateLogin = () => {
    navigate("/sign-in");
  };
  const handleLogout = async () => {
    setLoading(true);
    await UserService.logoutUser();
    dispatch(resetUser());
    setLoading(false);
  };
  useEffect(() => {
    setLoading(true);
    setUserName(user?.name);
    setUserAvatar(user?.avatar);
    setLoading(false);
  }, [user?.name, user?.avatar]);

  const content = (
    <div>
      <WrapperContentPopup onClick={() => handleClickNavigate("profile")}>
        Thông tin người dùng
      </WrapperContentPopup>
      {user?.isAdmin && (
        <WrapperContentPopup onClick={() => handleClickNavigate("admin")}>
          Quản lý hệ thống
        </WrapperContentPopup>
      )}

      <WrapperContentPopup onClick={() => handleClickNavigate("my-order")}>
        Đơn hàng của tôi
      </WrapperContentPopup>

      <WrapperContentPopup onClick={() => handleClickNavigate()}>
        Đăng xuất
      </WrapperContentPopup>
    </div>
  );

  const handleClickNavigate = (type) => {
    if (type === "profile") {
      navigate("/profile-user");
    } else if (type === "admin") {
      navigate("/system/admin");
    } else if (type === "my-order") {
      navigate("/my-order", {
        state: {
          id: user?.id,
          token: user?.access_token,
        },
      });
    } else {
      handleLogout();
    }
    setIsOpenPopup(false);
  };

  const onSearch = (value) => {
    dispatch(searchProduct(value));
  };
  const handleAudioClick = () => {
    setIsModalVisible(true);
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "vi-VN";

      recognition.onstart = () => {
        notification.info({
          message: "Thông báo",
          description: "Bắt đầu nhận dạng giọng nói. Hãy nói.",
        });
      };

      recognition.onresult = (event) => {
        let transcript = event.results[0][0].transcript;
        transcript = transcript.replace(/[^a-zA-Z0-9\s]/g, "");

        setSearch(transcript);
      };

      recognition.onerror = (event) => {
        notification.error({
          message: "Lỗi",
          description: `Lỗi nhận dạng giọng nói: ${event.error}`,
        });
      };

      recognition.onend = () => {
        notification.info({
          message: "Thông báo",
          description: "Kết thúc nhận dạng giọng nói.",
        });
        setIsModalVisible(false);
      };

      recognition.start();
    } else {
      notification.warning({
        message: "Thông báo",
        description: "Trình duyệt này không hỗ trợ nhận dạng giọng nói.",
      });
    }
  };

  const VoiceSearch = ({ isModalVisible, handleCancel }) => (
    <Modal
      title="Đang nghe..."
      open={isModalVisible}
      footer={null}
      onCancel={handleCancel}
    >
      <div style={{ textAlign: "center" }}>
        <Spin spinning={false} size="large">
          <AudioOutlined style={{ fontSize: 64, color: "red" }} />
        </Spin>
        <p>Đang nhận diện giọng nói...</p>
      </div>
    </Modal>
  );

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        background: "rgb(26,148,255)",
        justifyContent: "center",
      }}
    >
      <WrapperHeader
        style={{
          justifyContent:
            isHiddenSearch && isHiddenCart ? "space-between" : "unset",
        }}
      >
        <Col span={5}>
          <WrapperTextHeader style={{ cursor: "pointer" }} onClick={onPage}>
            Dúm Store
          </WrapperTextHeader>
        </Col>
        {!isHiddenSearch && (
          <Col span={13}>
            <Search
              placeholder="Tìm kiếm tên sản phẩm"
              enterButton="Tìm kiếm"
              size="large"
              suffix={
                <span onClick={handleAudioClick} style={{ cursor: "pointer" }}>
                  <AudioOutlined
                    style={{
                      fontSize: 16,
                      color: "#1677ff",
                    }}
                  />
                </span>
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onSearch={onSearch}
            />
          </Col>
        )}

        <Col
          span={6}
          style={{ display: "flex", gap: "20px", alignItems: "center" }}
        >
          <Loading isLoading={loading}>
            <WrapperHeaderAccount>
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt="avatar"
                  style={{
                    height: "30px",
                    width: "30px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <UserOutlined style={{ fontSize: "30px" }} />
              )}

              {user?.access_token ? (
                <>
                  <Popover content={content} trigger="click" open={isOpenPopup}>
                    <div
                      style={{ cursor: "pointer" }}
                      onClick={() => setIsOpenPopup((prev) => !prev)}
                    >
                      {userName?.length ? userName : user?.email}
                    </div>
                  </Popover>
                </>
              ) : (
                <div
                  onClick={handleNavigateLogin}
                  style={{ cursor: "pointer" }}
                >
                  <WrapperTextHeaderSmall>
                    Đăng nhập/Đăng ký
                  </WrapperTextHeaderSmall>
                  <div>
                    <WrapperTextHeaderSmall>Tài khoản</WrapperTextHeaderSmall>
                    <CaretDownOutlined />
                  </div>
                </div>
              )}
            </WrapperHeaderAccount>
          </Loading>
          {!isHiddenCart && (
            <div
              onClick={() => navigate("/order")}
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Badge count={order?.orderItems?.length} size="small">
                <ShoppingCartOutlined
                  style={{ fontSize: "30px", color: "#fff" }}
                />
              </Badge>

              <WrapperTextHeaderSmall> Giỏ hàng</WrapperTextHeaderSmall>
            </div>
          )}
        </Col>
      </WrapperHeader>
      <VoiceSearch
        isModalVisible={isModalVisible}
        handleCancel={() => setIsModalVisible(false)}
      />
    </div>
  );
};

export default HeaderComponent;
