import { TimePicker, type TimePickerProps } from "antd";
import type { FC } from "react";

const BaseTimePicker: FC<TimePickerProps> = (props) => {
  return <TimePicker {...props} />;
};

const MyTimePicker = Object.assign(TimePicker, BaseTimePicker);

export default MyTimePicker;
