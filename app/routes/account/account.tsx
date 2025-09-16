import { ConfigProvider } from "antd";
import type { FC } from "react";
import MyInput from "~/components/ui/input";

const Account: FC = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          //   colorText: "#fff",
          colorPrimary: "#fff",
          borderRadius: 20,
          //   colorBgContainer: "#e30713",
        },
      }}
    >
      <div className="text-4xl">Quản lý người dùng</div>
      <div>
        <MyInput className="text-2xl" />
      </div>
    </ConfigProvider>
  );
};

export default Account;
