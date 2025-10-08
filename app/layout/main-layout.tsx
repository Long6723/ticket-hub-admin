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
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import { Outlet, useNavigate, useLocation } from "react-router";
import "./main-layout.css";

const { Header, Sider, Content } = Layout;

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const navigate = useNavigate();
  const location = useLocation();

  const getSelectedKeys = () => {
    const path = location.pathname;

    if (path.includes("/voucher/discounts")) return ["voucher/discounts"];
    if (path.includes("/voucher/news")) return ["voucher/news"];

    if (path === "/") return ["/"];
    if (path.includes("/banner")) return ["banner"];
    if (path.includes("/account")) return ["account"];
    if (path.includes("/movies")) return ["movies"];
    if (path.includes("/genre")) return ["genre"];
    if (path.includes("/order")) return ["order"];
    if (path.includes("/room-layout")) return ["room-layout"];
    if (path.includes("/room")) return ["room"];
    if (path.includes("/revenue")) return ["revenue"];
    if (path.includes("/showtime")) return ["showtime"];
    if (path.includes("/profile")) return ["profile"];

    return ["/"];
  };

  const getOpenKeys = () => {
    const path = location.pathname;
    if (path.includes("/voucher")) return ["voucher"];
    return [];
  };

  const [openKeys, setOpenKeys] = useState(getOpenKeys());

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div />
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={getSelectedKeys()}
          openKeys={collapsed ? [] : openKeys}
          onOpenChange={setOpenKeys}
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
              key: "genre",
              icon: <VideoCameraOutlined />,
              label: "Genre",
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
              key: "room-layout",
              icon: <ClusterOutlined />,
              label: "Room layout",
            },
            {
              key: "revenue",
              icon: <BarChartOutlined />,
              label: "Revenue",
            },
            {
              key: "showtime",
              icon: <VideoCameraOutlined />,
              label: "Showtime",
            },
            {
              key: "profile",
              icon: <TeamOutlined />,
              label: "Profile",
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
