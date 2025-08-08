import { List } from "antd";
import React, { useState } from "react";
import MyAvatar from "~/components/ui/avatar";
import MyButton from "~/components/ui/button";
import MyCheckBox from "~/components/ui/checkbox";
import MyDatePicker from "~/components/ui/date-picker";
import MyInput from "~/components/ui/input";
import MyInputNumber from "~/components/ui/input-number";
import MyModal from "~/components/ui/modal";
import MyRadio from "~/components/ui/radio";
import MySelect from "~/components/ui/select";
import MyTable from "~/components/ui/table";
import MyTimePicker from "~/components/ui/time-picker";
import UploadCP from "~/components/ui/upload";
import { UserOutlined } from "@ant-design/icons";

const data = [
  "Racing car sprays burning fuel into crowd.",
  "Japanese princess to wed commoner.",
  "Australian walks 100km after outback crash.",
  "Man charged over missing wedding girl.",
  "Los Angeles battles huge wildfires.",
];
const dataSource = [
  {
    key: "1",
    name: "Mike",
    age: 32,
    address: "10 Downing Street",
  },
  {
    key: "2",
    name: "John",
    age: 42,
    address: "10 Downing Street",
  },
];

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Age",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
  },
];
const onChange = (value: string) => {
  console.log(`selected ${value}`);
};

const onSearch = (value: string) => {
  console.log("search:", value);
};
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
    <div className="p-[100px]">
      <MyAvatar size={64} icon={<UserOutlined />} />
      <MyButton
        style={{ padding: "20px 30px", margin: "0px 30px" }}
        label="Button"
        type="primary"
      />
      <MyButton
        style={{ padding: "20px 30px" }}
        label="Mở pop-up"
        onClick={() => setIsOpen(true)}
        type="primary"
      />
      <MyModal
        open={isOpen}
        title="Xác nhận hành động"
        onOk={handleOk}
        onCancel={handleCancel}
      >
        Bạn có chắc chắn muốn thực hiện hành động này không?
      </MyModal>
      <MyCheckBox style={{ margin: "0px 30px" }} />
      <MyInput
        style={{ padding: "5px 20px", width: "200px", margin: "0px 30px" }}
      />
      <MyInputNumber style={{ margin: "0px 30px" }} />
      <UploadCP />
      <MyDatePicker />
      <MyTimePicker />
      <MySelect
        showSearch
        placeholder="Select a person"
        optionFilterProp="label"
        onChange={onChange}
        onSearch={onSearch}
        options={[
          {
            value: "jack",
            label: "Jack",
          },
          {
            value: "lucy",
            label: "Lucy",
          },
          {
            value: "tom",
            label: "Tom",
          },
        ]}
      />
      <MyRadio.Group
        name="radiogroup"
        defaultValue={1}
        options={[
          { value: 1, label: "A" },
          { value: 2, label: "B" },
          { value: 3, label: "C" },
          { value: 4, label: "D" },
        ]}
      />
      <List
        header={<div>Header</div>}
        footer={<div>Footer</div>}
        bordered
        dataSource={data}
        renderItem={(item) => <List.Item>{item}</List.Item>}
      />
      <MyTable dataSource={dataSource} columns={columns} />
    </div>
  );
};

export default Dev;
