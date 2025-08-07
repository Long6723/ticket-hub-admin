import React from "react";
import type { FormProps } from "antd";
import { Button, Form } from "antd";
import CommonInput from "~/components/input/input";

type FieldType = {
  username?: string;
  password?: string;
};

const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
  console.log("Success:", values);
};

const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

const App: React.FC = () => (
  <Form
    name="basic"
    labelCol={{ span: 8 }}
    wrapperCol={{ span: 16 }}
    style={{ maxWidth: 600 }}
    initialValues={{ remember: true }}
    onFinish={onFinish}
    onFinishFailed={onFinishFailed}
    autoComplete="off"
  >
    <h1 className="text-3xl font-bold text-center mb-6">Đăng nhập</h1>
    <Form.Item<FieldType>
      label="Tên đăng nhập"
      name="username"
      rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập!" }]}
    >
      <CommonInput />
    </Form.Item>

    <Form.Item<FieldType>
      label="Mật khẩu"
      name="password"
      rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
    >
      <CommonInput type="password" />
    </Form.Item>

    <Form.Item label={null}>
      <Button
        type="primary"
        htmlType="submit"
        className="w-full bg-amber-600 hover:bg-amber-400 text-white font-bold py-2 px-4 rounded"
      >
        Đăng nhập
      </Button>
    </Form.Item>
  </Form>
);

export default App;
