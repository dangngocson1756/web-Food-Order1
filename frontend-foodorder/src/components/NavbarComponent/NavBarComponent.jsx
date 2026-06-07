import { Checkbox, Rate } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as ProductService from "../../services/ProductService";
import {
  WrapperContent,
  WrapperLableText,
  WrapperTextPrice,
  WrapperTextValue,
} from "./style";

const NavBarComponent = () => {
  const navigate = useNavigate();
  const [typeProducts, setTypeProducts] = useState([]);

  // Lấy danh mục thật từ DB
  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct();
    if (res?.status === "OK") {
      setTypeProducts(res?.data);
    }
  };

  useEffect(() => {
    fetchAllTypeProduct();
  }, []);

  // Bấm vào danh mục -> chuyển sang trang lọc theo loại (giống thanh trên cùng)
  const handleNavigateType = (type) => {
    navigate(
      `/product/${type
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        ?.replace(/ /g, "_")}`,
      { state: type },
    );
  };

  const onChange = () => {};

  const renderContent = (type, options) => {
    switch (type) {
      case "text":
        return options.map((option) => {
          return (
            <WrapperTextValue
              key={option}
              style={{ cursor: "pointer" }}
              onClick={() => handleNavigateType(option)}
            >
              {option}
            </WrapperTextValue>
          );
        });
      case "checkbox":
        return (
          <Checkbox.Group
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
            onChange={onChange}
          >
            {options.map((option) => {
              return (
                <Checkbox
                  key={option.value}
                  style={{ marginLeft: 0 }}
                  value={option.value}
                >
                  {option.label}
                </Checkbox>
              );
            })}
          </Checkbox.Group>
        );
      case "star":
        return options.map((option) => {
          return (
            <div key={option} style={{ display: "flex" }}>
              <Rate
                style={{ fontSize: "12px" }}
                disabled
                defaultValue={option}
              />
              <span> {`tu ${option}  sao`}</span>
            </div>
          );
        });
      case "price":
        return options.map((option) => {
          return <WrapperTextPrice key={option}>{option}</WrapperTextPrice>;
        });
      default:
        return {};
    }
  };

  return (
    <div>
      <WrapperLableText>Danh mục</WrapperLableText>
      <WrapperContent>{renderContent("text", typeProducts)}</WrapperContent>
    </div>
  );
};

export default NavBarComponent;
