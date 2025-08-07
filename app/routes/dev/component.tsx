import { ConfigProvider, List } from "antd";
import React, { useState } from "react";
import MyAvatar from "~/components/ui/avatar";
import MyButton from "~/components/ui/button";
import MyCheckBox from "~/components/ui/checkbox";
import MyDatePicker from "~/components/ui/date-picker";
import MyInput from "~/components/ui/input";
import MyInputNumber from "~/components/ui/input-number";
import MyModal from "~/components/ui/modal";
import MyTable from "~/components/ui/table";
import MyTimePicker from "~/components/ui/time-picker";
import UploadCP from "~/components/ui/upload";

const Dev: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOk = () => {
    console.log("Đã xác nhận");
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };
  return (
    <ConfigProvider
      theme={{
        token: {
          // colorText: "#fff",
          colorPrimary: "#000",
          borderRadius: 20,
          // colorBgContainer: "#e30713",
        },
      }}
    >
      <MyButton style={{ padding: "20px 30px" }} label="Button" />
      <MyButton
        style={{ padding: "20px 30px" }}
        label="Mở pop-up"
        onClick={() => setIsOpen(true)}
      />
      <MyModal
        open={isOpen}
        title="Xác nhận hành động"
        onOk={handleOk}
        onCancel={handleCancel}
      >
        Bạn có chắc chắn muốn thực hiện hành động này không?
      </MyModal>
      <MyInput />
      <MyInputNumber />
      <UploadCP />
      <MyDatePicker />
      <MyTimePicker />
      <MyCheckBox />
      <List />
      <MyTable />
      <MyAvatar />
    </ConfigProvider>
  );
};

export default Dev;
