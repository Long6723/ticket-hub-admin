import type { CheckboxProps } from "antd/es/checkbox";
import type { FC } from "react";

import { Checkbox } from "antd";

// interface MyButtonProps extends CheckboxProps {}

const BaseCheckBox: FC<CheckboxProps> = (props) => {
  return <Checkbox {...props} />;
};

const MyCheckBox = Object.assign(Checkbox, BaseCheckBox);

export default MyCheckBox;
