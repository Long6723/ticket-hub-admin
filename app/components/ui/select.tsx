import { Select, type SelectProps } from "antd";
import type { FC } from "react";

const BaseSelect: FC<SelectProps> = (props) => {
  return <Select {...props} />;
};

const MySelect = Object.assign(Select, BaseSelect);

export default MySelect;
