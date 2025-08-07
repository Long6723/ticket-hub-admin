import { DatePicker, type DatePickerProps } from "antd";
import type { FC } from "react";

const BaseDatePicker: FC<DatePickerProps> = (props) => {
  return <MyDatePicker {...props} />;
};

const MyDatePicker = Object.assign(DatePicker, BaseDatePicker);

export default MyDatePicker;
