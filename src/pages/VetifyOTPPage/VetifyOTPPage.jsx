import React, { useEffect, useState } from "react";
import {
  WrapperTextLight,
  WrapperContainerLeft,
  WrapperContainerRight,
} from "./style";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { Flex, Image, Input } from "antd";
import imageLogo from "../../assets/images/logo-login.png";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as UserService from "../../services/UserService";
import * as message from "../../components/Message/Message";

const VetifyOTP = () => {
  const location = useLocation();
  const [otp, setOtp] = useState("");
  const { state } = location;
  const email = state?.email;

  const navigate = useNavigate();

  const mutationVerifyOTP = useMutationHooks((data) =>
    UserService.vetifyOTP(data)
  );

  const {
    data: verifyData,
    isSuccess: isVerifySuccess,
    isError: isVerifyError,
  } = mutationVerifyOTP;

  useEffect(() => {
    if (isVerifySuccess) {
      message.success("Xác nhận OTP thành công!");
      navigate("/reset-password", {
        state: {
          email: email,
        },
      });
    } else if (isVerifyError) {
      message.error("Xác nhận OTP thất bại!");
    }
  }, [isVerifySuccess, isVerifyError]);

  const handleSignIn = () => {
    navigate("/sign-in");
  };

  const handleSignUp = () => {
    navigate("/sign-up");
  };

  const handleOnChangeOTP = (value) => {
    setOtp(value);
  };

  const handleAccessOTP = () => {
    try {
      mutationVerifyOTP.mutate({ email, otp });
    } catch (error) {
      console.error("Failed to verify OTP:", error);
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
          <h1 style={{ fontSize: "24px" }}>Xác nhận OTP</h1>
          <p style={{ fontSize: "15px", marginTop: "0" }}>
            Kiểm tra email và nhập mã OTP
          </p>

          <Flex gap="middle" align="flex-start" vertical>
            {/* <Input.OTP
              formatter={(str) => str.toUpperCase()}
              {...sharedProps}
            /> */}
            <Input
              value={otp}
              onChange={(e) => handleOnChangeOTP(e.target.value)}
            />
          </Flex>
          <ButtonComponent
            disabled={!otp.length}
            onClick={handleAccessOTP}
            size={40}
            styleButton={{
              background: "rgb(255,57,69)",
              height: "48px",
              width: "100%",
              border: "none",
              borderRadius: "4px",
              margin: "10px 0 10px",
            }}
            textbutton={"Xác nhận"}
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

export default VetifyOTP;
