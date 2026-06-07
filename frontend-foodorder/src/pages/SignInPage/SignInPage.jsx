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
import { EyeFilled, EyeInvisibleFilled } from "@ant-design/icons";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as UserService from "../../services/UserService";
import { useMutationHooks } from "../../hooks/useMutationHook";
import Loading from "../../components/LoadingComponent/Loading";
import jwt_decode from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../redux/slides/userSlide";
import * as message from "../../components/Message/Message";

const SignInPage = () => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const navigate = useNavigate();

  const mutation = useMutationHooks((data) => UserService.loginUser(data));
  const { isLoading } = mutation;

  const handleGetDetailsUser = async (id, token) => {
    const storage = localStorage.getItem("refresh_token");
    const refreshToken = JSON.parse(storage);
    const res = await UserService.getDetailsUser(id, token);
    dispatch(updateUser({ ...res?.data, access_token: token, refreshToken }));
  };

  const handleNavigateSignUp = () => {
    navigate("/sign-up");
  };

  const handleOnchangeEmail = (value) => {
    setEmail(value);
  };

  const handleOnchangePassword = (value) => {
    setPassword(value);
  };

  const handleSignIn = () => {
    if (!email) {
      message.error("Vui lòng nhập email");
      return;
    }
    if (!password) {
      message.error("Vui lòng nhập mật khẩu");
      return;
    }
    mutation.mutate(
      { email, password },
      {
        onSuccess: (data) => {
          if (data?.status === "OK") {
            // Đăng nhập thành công
            localStorage.setItem(
              "access_token",
              JSON.stringify(data?.access_token),
            );
            localStorage.setItem(
              "refresh_token",
              JSON.stringify(data?.refresh_token),
            );
            if (data?.access_token) {
              const decoded = jwt_decode(data?.access_token);
              if (decoded?.id) {
                handleGetDetailsUser(decoded?.id, data?.access_token);
              }
            }
            message.success("Đăng nhập thành công");
            if (location?.state) {
              navigate(location?.state);
            } else {
              navigate("/");
            }
          } else {
            // Sai tài khoản hoặc mật khẩu (hoặc email sai định dạng)
            if (
              data?.message === "The user is not defined" ||
              data?.message === "The password or user is incorrect"
            ) {
              message.error("Sai tài khoản hoặc mật khẩu");
            } else if (data?.message === "The input is email") {
              message.error("Email không đúng định dạng");
            } else {
              message.error(data?.message || "Đăng nhập thất bại");
            }
          }
        },
        onError: () => {
          message.error("Đăng nhập thất bại, vui lòng thử lại");
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
              type={isShowPassword ? "text" : "password"}
              value={password}
              onChange={handleOnchangePassword}
            />
          </div>
          <Loading isLoading={isLoading}>
            <ButtonComponent
              disabled={isLoading}
              onClick={handleSignIn}
              size={40}
              styleButton={{
                background: "rgb(255, 57, 69)",
                height: "48px",
                width: "100%",
                border: "none",
                borderRadius: "4px",
                margin: "26px 0 10px",
              }}
              textbutton={"Đăng nhập"}
              styleTextButton={{
                color: "#fff",
                fontSize: "15px",
                fontWeight: "700",
              }}
            ></ButtonComponent>
          </Loading>
          <p>
            <WrapperTextLight>Quên mật khẩu?</WrapperTextLight>
          </p>
          <p>
            Chưa có tài khoản?{" "}
            <WrapperTextLight onClick={handleNavigateSignUp}>
              {" "}
              Tạo tài khoản
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
          <h4>Mua đồ ăn tại Food Order </h4>
        </WrapperContainerRight>
      </div>
    </div>
  );
};

export default SignInPage;
