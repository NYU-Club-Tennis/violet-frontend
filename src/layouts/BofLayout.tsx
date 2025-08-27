import React, { FC, useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate, useLocation } from "react-router-dom";
import { AuthStore } from "stores/auth.store";
import { Layout, Menu, Drawer } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  CalendarOutlined,
  SettingOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { purpleAthleticLogoText } from "assets";

const { Header, Sider, Content } = Layout;

const BofLayout: FC = () => {
  const { user, token } = AuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

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
    if (path.includes("/bof/email")) return "email";
    if (path.includes("/bof/settings")) return "settings";
    return "dashboard"; // default fallback
  };

  const menuItems = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
      onClick: () => {
        navigate("/bof/dashboard");
        setMobileSidebarOpen(false);
      },
    },
    {
      key: "users",
      icon: <UserOutlined />,
      label: "Users",
      onClick: () => {
        navigate("/bof/users");
        setMobileSidebarOpen(false);
      },
    },
    {
      key: "sessions",
      icon: <CalendarOutlined />,
      label: "Sessions",
      onClick: () => {
        navigate("/bof/sessions");
        setMobileSidebarOpen(false);
      },
    },
    {
      key: "email",
      icon: <MailOutlined />,
      label: "Email",
      onClick: () => {
        navigate("/bof/email");
        setMobileSidebarOpen(false);
      },
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Settings",
      onClick: () => {
        navigate("/bof/settings");
        setMobileSidebarOpen(false);
      },
    },
  ];

  // If not admin, don't render anything
  if (!user?.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <Layout
      style={{ minHeight: "100vh" }}
      className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100"
    >
      {/* Mobile Sidebar - Drawer */}
      <Drawer
        placement="left"
        onClose={() => setMobileSidebarOpen(false)}
        open={mobileSidebarOpen}
        width={280}
        className="lg:hidden"
        headerStyle={{ display: "none" }}
        styles={{
          body: {
            padding: 0,
            backgroundColor: "rgba(255, 255, 255, 0.6)",
            backdropFilter: "blur(24px)",
          },
          content: {
            backgroundColor: "rgba(255, 255, 255, 0.6)",
            backdropFilter: "blur(24px)",
          },
          wrapper: {
            position: "fixed",
          },
        }}
      >
        <div className="p-6">
          <div
            className="cursor-pointer hover:opacity-80 transition-all duration-300 flex items-center justify-center p-3 rounded-2xl hover:bg-white/40 hover:shadow-lg hover:scale-105 mb-6"
            onClick={() => navigate("/")}
            title="Go to Home Page"
          >
            <img
              src={purpleAthleticLogoText}
              alt="NYU Tennis Club"
              className="h-[100px] w-auto max-w-full"
            />
          </div>
          <Menu
            mode="inline"
            selectedKeys={[getCurrentSelectedKey()]}
            items={menuItems}
            className="bg-transparent border-none [&_.ant-menu-item]:rounded-xl [&_.ant-menu-item]:mx-2 [&_.ant-menu-item]:my-1 [&_.ant-menu-item]:transition-all [&_.ant-menu-item]:duration-300 [&_.ant-menu-item:hover]:bg-white/30 [&_.ant-menu-item:hover]:backdrop-blur-md [&_.ant-menu-item-selected]:bg-gradient-to-r [&_.ant-menu-item-selected]:from-purple-500/20 [&_.ant-menu-item-selected]:to-blue-500/20 [&_.ant-menu-item-selected]:backdrop-blur-md [&_.ant-menu-item-selected]:border [&_.ant-menu-item-selected]:border-white/30"
            style={{
              backgroundColor: "transparent",
              border: "none",
            }}
          />
        </div>
      </Drawer>

      {/* Desktop Sidebar - Always visible on desktop */}
      <Sider
        theme="light"
        breakpoint="lg"
        collapsedWidth="0"
        className="backdrop-blur-xl bg-white/60 border-r border-white/30 shadow-2xl hidden lg:block"
        style={{ backdropFilter: "blur(24px)" }}
        width="280"
        trigger={null}
        collapsible={false}
      >
        <div className="p-6">
          <div
            className="cursor-pointer hover:opacity-80 transition-all duration-300 flex items-center justify-center p-3 rounded-2xl hover:bg-white/40 hover:shadow-lg hover:scale-105"
            onClick={() => navigate("/")}
            title="Go to Home Page"
          >
            <img
              src={purpleAthleticLogoText}
              alt="NYU Tennis Club"
              className="h-[100px] w-auto max-w-full"
            />
          </div>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[getCurrentSelectedKey()]}
          items={menuItems}
          className="bg-transparent border-none [&_.ant-menu-item]:rounded-xl [&_.ant-menu-item]:mx-2 [&_.ant-menu-item]:my-1 [&_.ant-menu-item]:transition-all [&_.ant-menu-item]:duration-300 [&_.ant-menu-item:hover]:bg-white/30 [&_.ant-menu-item:hover]:backdrop-blur-md [&_.ant-menu-item-selected]:bg-gradient-to-r [&_.ant-menu-item-selected]:from-purple-500/20 [&_.ant-menu-item-selected]:to-blue-500/20 [&_.ant-menu-item-selected]:backdrop-blur-md [&_.ant-menu-item-selected]:border [&_.ant-menu-item-selected]:border-white/30"
          style={{
            backgroundColor: "transparent",
            border: "none",
          }}
        />
      </Sider>

      <Layout className="bg-transparent">
        {/* Header with mobile menu button */}
        <Header className="backdrop-blur-xl bg-white/60 border-b border-white/30 shadow-lg flex items-center justify-between px-6">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg bg-white/30 hover:bg-white/50 transition-colors"
            title="Open Menu"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <h2 className="text-lg font-semibold text-gray-800">
            Welcome, {user.firstName}
          </h2>
        </Header>

        <Content className="m-3 sm:m-6 p-3 sm:p-6">
          <div className="backdrop-blur-xl bg-white/60 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/30 p-3 sm:p-6 hover:shadow-3xl transition-all duration-300">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default BofLayout;
