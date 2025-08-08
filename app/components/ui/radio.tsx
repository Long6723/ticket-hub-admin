import { Radio, type RadioProps } from "antd";
import type { FC } from "react";

const BaseRadio: FC<RadioProps> = (props) => {
  return <Radio {...props} />;
};

const MyRadio = Object.assign(Radio, BaseRadio);

export default MyRadio;
