import React from "react";
import { Button, type ButtonProps } from "antd";

interface MyButtonProps extends ButtonProps {
  label?: string; // Cho phép truyền text riêng
}

const MyButton: React.FC<MyButtonProps> = ({ label, children, ...rest }) => {
  return <Button {...rest}>{label || children}</Button>;
};

export default MyButton;
