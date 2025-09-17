import React, { useState } from "react";
import type { FormProps } from "antd";
import { Button, Form } from "antd";
import MyInput from "~/components/input/input";
import { loginApi } from "~/api/profile";

type FieldType = {
  username?: string;
  password?: string;
};

const MESSAGE = {
  LOGINFAIL: "Thông tin tài khoản hoặc mật khẩu không chính xác",
};

const App: React.FC = () => {
  const [loginFail, setLoginFail] = useState<string | null>(null);

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    try {
      const data = await loginApi(values);
      window.localStorage.setItem("accessToken", data.accessToken);
    } catch (error) {
      if (error) {
        setLoginFail(MESSAGE.LOGINFAIL);
      }
    }
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo,
  ) => {
    console.log("Failed:", errorInfo);
  };

  return (
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
      <Form.Item
        label="Tên đăng nhập"
        name="email"
        rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập!" }]}
      >
        <MyInput />
      </Form.Item>

      <Form.Item
        label="Mật khẩu"
        name="password"
        rules={[
          { required: true, message: "Vui lòng nhập mật khẩu!" },
          {
            validator: async () => {
              if (loginFail) {
                console.log(loginFail);
                return Promise.reject(new Error(loginFail));
              }
              return Promise.resolve();
            },
          },
        ]}
      >
        <MyInput type="password" />
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
};

export default App;
