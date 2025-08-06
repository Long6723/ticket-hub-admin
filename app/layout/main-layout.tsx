import React, { useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  FileImageOutlined,
  TeamOutlined,
  ProductOutlined,
  OrderedListOutlined,
  ShoppingOutlined,
  BarChartOutlined,
  FundProjectionScreenOutlined,
  ClusterOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import { Outlet, useNavigate } from "react-router";

const { Header, Sider, Content } = Layout;

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const navigate = useNavigate();
  return (
    <Layout style={{ height: 911 }}>
      {/* <Layout> */}
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["/"]}
          onClick={(data) => {
            navigate(data.key);
          }}
          items={[
            {
              key: "/",
              icon: <HomeOutlined />,
              label: "Dashboard",
            },
            {
              key: "banner",
              icon: <FileImageOutlined />,
              label: "Banner",
            },
            {
              key: "account",
              icon: <TeamOutlined />,
              label: "Account",
            },
            {
              key: "movies",
              icon: <ProductOutlined />,
              label: "Movies",
            },
            {
              key: "voucher",
              icon: <ShoppingOutlined />,
              label: "Voucher",
              children: [
                { key: "voucher/discounts", label: "Discounts" },
                { key: "voucher/news", label: "News" },
              ],
            },
            {
              key: "order",
              icon: <OrderedListOutlined />,
              label: "Order",
            },
            {
              key: "room",
              icon: <FundProjectionScreenOutlined />,
              label: "Room",
            },
            {
              key: "room layout",
              icon: <ClusterOutlined />,
              label: "Room layout",
            },
            {
              key: "revenue",
              icon: <BarChartOutlined />,
              label: "Revenue",
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
