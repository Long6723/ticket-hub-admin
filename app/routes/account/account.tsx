import { ConfigProvider } from "antd";
import type { FC } from "react";
import MyButton from "~/components/ui/button";
import MyInput from "~/components/ui/input";
import { SearchOutlined } from "@ant-design/icons";

const Account: FC = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#fff",
          borderRadius: 20,
        },
      }}
    >
      <div className="text-4xl">Quản lý người dùng</div>
      <div className="flex  mt-15 bg-[#51759a] py-[20px]">
        <MyInput
          className="!w-[30%] !p-2 !pl-6 !text-[16px]"
          placeholder="Tìm kiếm người dùng"
        />

        <MyButton className="!py-[21px] !px-[11px] !ml-[10px]">
          <SearchOutlined className="text-xl" />
        </MyButton>
        <MyButton className="!ml-[150px] !px-[40px] !py-[21px] !text-[16px] ">
          active
        </MyButton>
        <MyButton className="!ml-[30px] !px-[40px] !py-[21px] !text-[16px]">
          inactive
        </MyButton>
        <MyButton className="!ml-[150px] !px-[40px] !py-[21px] !text-[16px]">
          Thêm người dùng mới
        </MyButton>
      </div>
    </ConfigProvider>
  );
};

export default Account;
