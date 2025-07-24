import React, { FC, useEffect } from "react";
import { Navigate, Outlet, useNavigate, useLocation } from "react-router-dom";
import { AuthStore } from "stores/auth.store";
import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  CalendarOutlined,
  SettingOutlined,
} from "@ant-design/icons";

const { Header, Sider, Content } = Layout;

const BofLayout: FC = () => {
  const { user, token } = AuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Redirect to home if not logged in or not admin
    if (!user || !token || !user.isAdmin) {
      navigate("/");
    }
  }, [user, token, navigate]);

  // Get the current selected key based on the current path
  const getCurrentSelectedKey = () => {
    const path = location.pathname;
    if (path.includes("/bof/dashboard")) return "dashboard";
    if (path.includes("/bof/users")) return "users";
    if (path.includes("/bof/sessions")) return "sessions";
    if (path.includes("/bof/settings")) return "settings";
    return "dashboard"; // default fallback
  };

  const menuItems = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
      onClick: () => navigate("/bof/dashboard"),
    },
    {
      key: "users",
      icon: <UserOutlined />,
      label: "Users",
      onClick: () => navigate("/bof/users"),
    },
    {
      key: "sessions",
      icon: <CalendarOutlined />,
      label: "Sessions",
      onClick: () => navigate("/bof/sessions"),
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Settings",
      onClick: () => navigate("/bof/settings"),
    },
  ];

  // If not admin, don't render anything
  if (!user?.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider theme="light" breakpoint="lg" collapsedWidth="0">
        <div className="p-4">
          <h1 className="text-xl font-bold text-nyu-purple">Admin Panel</h1>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[getCurrentSelectedKey()]}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header className="bg-white px-4 flex items-center justify-between">
          <h2 className="text-lg">Welcome, {user.firstName}</h2>
        </Header>
        <Content className="m-4 p-4 bg-white">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default BofLayout;
