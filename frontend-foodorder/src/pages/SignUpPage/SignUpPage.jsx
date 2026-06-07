import React from "react";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import InputForm from "../../components/InputForm/InputForm";
import {
  WrapperContainerLeft,
  WrapperContainerRight,
  WrapperTextLight,
} from "./style";
import imageLogo from "../../assets/images/logo-login.png";
import { Image } from "antd";
import { useState } from "react";
import { EyeFilled, EyeInvisibleFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import * as UserService from "../../services/UserService";
import { useMutationHooks } from "../../hooks/useMutationHook";
import Loading from "../../components/LoadingComponent/Loading";
import * as message from "../../components/Message/Message";

const SignUpPage = () => {
  const navigate = useNavigate();

  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleOnchangeEmail = (value) => {
    setEmail(value);
  };

  const mutation = useMutationHooks((data) => UserService.signupUser(data));

  const { isLoading } = mutation;

  const handleOnchangePassword = (value) => {
    setPassword(value);
  };

  const handleOnchangeConfirmPassword = (value) => {
    setConfirmPassword(value);
  };

  const handleNavigateSignIn = () => {
    navigate("/sign-in");
  };

  const handleSignUp = () => {
    // Kiểm tra email trước khi gửi
    if (!email) {
      message.error("Vui lòng nhập email");
      return;
    }
    const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    if (!reg.test(email)) {
      message.error("Email không đúng định dạng");
      return;
    }
    // Kiểm tra mật khẩu
    if (!password) {
      message.error("Vui lòng nhập mật khẩu");
      return;
    }
    if (!confirmPassword) {
      message.error("Vui lòng nhập lại mật khẩu");
      return;
    }
    if (password !== confirmPassword) {
      message.error("Mật khẩu nhập lại không khớp");
      return;
    }
    mutation.mutate(
      { email, password, confirmPassword },
      {
        onSuccess: (data) => {
          if (data?.status === "OK") {
            message.success("Đăng ký thành công");
            handleNavigateSignIn();
          } else if (data?.message === "The email is already") {
            message.error(
              "Email này đã được đăng ký, vui lòng dùng email khác",
            );
          } else {
            message.error(data?.message || "Đăng ký thất bại");
          }
        },
        onError: () => {
          message.error("Đăng ký thất bại, vui lòng thử lại");
        },
      },
    );
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0, 0, 0, 0.53)",
        height: "100vh",
      }}
    >
      <div
        style={{
          width: "800px",
          height: "445px",
          borderRadius: "6px",
          background: "#fff",
          display: "flex",
        }}
      >
        <WrapperContainerLeft>
          <h1>Xin chào</h1>
          <p>Đăng nhập vào tạo tài khoản</p>
          <InputForm
            style={{ marginBottom: "10px" }}
            placeholder="abc@gmail.com"
            value={email}
            onChange={handleOnchangeEmail}
          />
          <div style={{ position: "relative" }}>
            <span
              onClick={() => setIsShowPassword(!isShowPassword)}
              style={{
                zIndex: 10,
                position: "absolute",
                top: "4px",
                right: "8px",
              }}
            >
              {isShowPassword ? <EyeFilled /> : <EyeInvisibleFilled />}
            </span>
            <InputForm
              placeholder="password"
              style={{ marginBottom: "10px" }}
              type={isShowPassword ? "text" : "password"}
              value={password}
              onChange={handleOnchangePassword}
            />
          </div>
          <div style={{ position: "relative" }}>
            <span
              onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}
              style={{
                zIndex: 10,
                position: "absolute",
                top: "4px",
                right: "8px",
              }}
            >
              {isShowConfirmPassword ? <EyeFilled /> : <EyeInvisibleFilled />}
            </span>
            <InputForm
              placeholder="confirm password"
              type={isShowConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={handleOnchangeConfirmPassword}
            />
          </div>
          <Loading isLoading={isLoading}>
            <ButtonComponent
              disabled={isLoading}
              onClick={handleSignUp}
              size={40}
              styleButton={{
                background: "rgb(255, 57, 69)",
                height: "48px",
                width: "100%",
                border: "none",
                borderRadius: "4px",
                margin: "26px 0 10px",
              }}
              textbutton={"Đăng ký"}
              styleTextButton={{
                color: "#fff",
                fontSize: "15px",
                fontWeight: "700",
              }}
            ></ButtonComponent>
          </Loading>
          <p>
            Bạn đã có tài khoản?{" "}
            <WrapperTextLight onClick={handleNavigateSignIn}>
              {" "}
              Đăng nhập
            </WrapperTextLight>
          </p>
        </WrapperContainerLeft>
        <WrapperContainerRight>
          <Image
            src={imageLogo}
            preview={false}
            alt="iamge-logo"
            height="203px"
            width="203px"
          />
          <h4>Mua đồ ăn tại Food Order</h4>
        </WrapperContainerRight>
      </div>
    </div>
  );
};

export default SignUpPage;
