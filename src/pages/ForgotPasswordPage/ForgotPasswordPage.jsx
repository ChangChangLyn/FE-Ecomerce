import React, { useEffect, useState } from "react";
import {
  WrapperTextLight,
  WrapperContainerLeft,
  WrapperContainerRight,
} from "./style";
import InputForm from "../../components/InputForm/InputForm";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { Image } from "antd";
import imageLogo from "../../assets/images/logo-login.png";
import { useNavigate } from "react-router-dom";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as UserService from "../../services/UserService";
import * as message from "../../components/Message/Message";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  const mutation = useMutationHooks((email) =>
    UserService.forgotPassword(email)
  );
  const { data, isSuccess, isError } = mutation;

  useEffect(() => {
    if (isSuccess) {
      message.success("Gửi email thành công!");
      navigate("/vetify-otp", {
        state: {
          email: email,
        },
      });
    } else if (isError) {
      message.error("Gửi email thất bại!");
    }
  }, [isSuccess, isError]);

  const handleOnChangeEmail = (value) => {
    setEmail(value);
  };

  const handleSignIn = () => {
    navigate("/sign-in");
  };

  const handleSignUp = () => {
    navigate("/sign-up");
  };
  const handleSendOTP = () => {
    try {
      mutation.mutate(email);
    } catch (error) {
      console.error("Failed to send OTP:", error);
      message.error();
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.53)",
        height: "100vh",
      }}
    >
      <div
        style={{
          width: "800px",
          height: "445px",
          borderRadius: "6px",
          backgroundColor: "#fff",
          display: "flex",
        }}
      >
        <WrapperContainerLeft>
          <h1 style={{ fontSize: "24px" }}>Quên mật khẩu</h1>
          <p style={{ fontSize: "15px", marginTop: "0" }}>
            Nhập tài khoản email để nhận mã OTP
          </p>
          <InputForm
            // style={{ marginBottom: "10px" }}
            placeholder="abc@gmail.com"
            value={email}
            onChange={handleOnChangeEmail}
          />

          {data?.status === "ERR" && (
            <span style={{ color: "red" }}>{data?.message}</span>
          )}
          <ButtonComponent
            disabled={!email.length}
            onClick={handleSendOTP}
            size={40}
            styleButton={{
              background: "rgb(255,57,69)",
              height: "48px",
              width: "100%",
              border: "none",
              borderRadius: "4px",
              margin: "10px 0 10px",
            }}
            textbutton={"Gửi OTP"}
            styleTextButton={{
              color: "#fff",
              fontSize: "15px",
              fontWeight: "700",
            }}
          ></ButtonComponent>

          <p style={{ fontSize: "13px" }}>
            <WrapperTextLight onClick={handleSignIn}>
              {" "}
              Đăng nhập{" "}
            </WrapperTextLight>
            hoặc
            <WrapperTextLight onClick={handleSignUp}>
              {" "}
              Tạo tài khoản{" "}
            </WrapperTextLight>
          </p>
        </WrapperContainerLeft>

        <WrapperContainerRight>
          <Image
            src={imageLogo}
            preview={false}
            alt="image-logo"
            height="203px"
            width="203px"
          />
          <h4>Mua sắm tại DúmStore</h4>
        </WrapperContainerRight>
      </div>
    </div>
  );
};

export default ForgotPassword;
