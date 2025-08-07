import { InputNumber, type InputNumberProps } from "antd";
import type { FC } from "react";

const BaseInputNumber: FC<InputNumberProps> = (props) => {
  return <InputNumber {...props} />;
};

const MyInputNumber = Object.assign(InputNumber, BaseInputNumber);

export default MyInputNumber;
