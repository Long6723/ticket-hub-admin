import React from "react";
import { Button, type ButtonProps } from "antd";

interface CommonButtonProps extends ButtonProps {
  label?: string; // Cho phép truyền text riêng
}

const CommonButton: React.FC<CommonButtonProps> = ({
  label,
  children,
  ...rest
}) => {
  return <Button {...rest}>{label || children}</Button>;
};

export default CommonButton;
