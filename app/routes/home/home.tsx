import { ConfigProvider } from "antd";
import React from "react";
import MyButton from "~/components/ui/button";

const Banner: React.FC = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorText: "#fff",
          colorPrimary: "#fff",
          borderRadius: 20,
          colorBgContainer: "#e30713",
        },
      }}
    >
      <div>Welcome to admin</div>
      <MyButton style={{ padding: "20px 30px" }} label="Click" />
    </ConfigProvider>
  );
};

export default Banner;
