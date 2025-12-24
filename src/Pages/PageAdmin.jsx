// src/pages/AdminLayout.jsx
import React, { useMemo } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../feature/loginSlice";
import { Layout, Avatar, Typography, Dropdown, Menu, App as AntdApp } from "antd";
import {
  BarChartOutlined,
  MessageOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;
const PageAdmin = () => {
  const nav = useNavigate();
  const { pathname } = useLocation();
  const { message } = AntdApp.useApp();
  const dispatch = useDispatch();

  const me = useMemo(() => {
    try {
      const raw = localStorage.getItem("me");
      if (raw) return JSON.parse(raw);
    } catch {}
    return { username: "admin", avatar: null };
  }, []);
  const username = me?.username || me?.userName || "admin";

  const onUserClick = ({ key }) => {
    if (key === "logout") {
      localStorage.removeItem("token");
      localStorage.removeItem("me");
      message.success("Đã đăng xuất");
      dispatch(logout());
      nav("/login");
    }
  };

  const userMenu = {
    items: [
      { key: "profile", icon: <UserOutlined />, label: "Hồ sơ" },
      { type: "divider" },
      { key: "logout", icon: <LogoutOutlined />, danger: true, label: "Đăng xuất" },
    ],
    onClick: onUserClick,
  };

  const sideItems = [
    { key: "/page-admin/stats", icon: <BarChartOutlined />, label: "Thống kê" },
    { key: "/page-admin/messages", icon: <MessageOutlined />, label: "Luồng tin nhắn" },
  ];
  const onSideClick = (e) => nav(e.key);

  return (
    <Layout className="h-screen bg-transparent">
      {/* Header FULL WIDTH */}
      <div></div>
      <Header className="!bg-white dark:!bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 h-16 px-4 grid grid-cols-3 items-center">
        <div />
        <div className="text-center">
          <Title level={4} className="!m-0 !font-bold !text-2xl !text-orange-600 ">Quản lý WebChat</Title>
        </div>
        <div className="flex justify-end items-center gap-3">
          <Dropdown menu={userMenu} placement="bottomRight" trigger={["click"]}>
            <div className="flex items-center gap-2 cursor-pointer">
              <Avatar size={36} src={me?.avatar || undefined} icon={!me?.avatar && <UserOutlined />} />
              <Text strong className="hidden sm:inline">{username}</Text>
            </div>
          </Dropdown>
        </div>
      </Header>

      {/* Phần dưới: Sider + Content */}
      <Layout className="bg-transparent">
        <Sider
          width={240}
          breakpoint="lg"
          collapsedWidth={72}
          className="!bg-white dark:!bg-neutral-900 !border-r !border-neutral-200 dark:!border-neutral-800"
          style={{ height: "calc(100vh - 64px)", position: "sticky", top: 64 }}
        >
          <Menu
            mode="inline"
            selectedKeys={[pathname]}
            onClick={onSideClick}
            items={sideItems}
            className="!border-0 !mt-3"
          />
        </Sider>

        <Content className="p-4 lg:p-6">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm p-4 min-h-[calc(100vh-64px-32px)]">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
export default PageAdmin;