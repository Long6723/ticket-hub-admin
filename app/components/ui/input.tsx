import { Input, type InputProps } from "antd";
import type { FC } from "react";

const BaseInput: FC<InputProps> = (props) => {
  return <Input {...props} />;
};

const MyInput = Object.assign(Input, BaseInput);

export default MyInput;
