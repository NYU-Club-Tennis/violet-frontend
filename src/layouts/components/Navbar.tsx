import React, { useEffect, useState } from "react";
import { Tabs, TabsProps, Drawer, Button } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { PAGE_TYPE } from "constants/enum/page.enum";
import Home from "pages/Home/Home";
import Join from "pages/Join/Join";
import Questions from "pages/Questions/Questions";
import Profile from "pages/Profile/Profile";
import { whiteAthleticLogoText as logo } from "assets";
import { cn } from "utils/style.util";
import { AuthStore } from "stores/auth.store";
import { useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const [activeKey, setActiveKey] = useState<string>(PAGE_TYPE.HOME);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const { user, token } = AuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !token) {
      // If user logs out and was on profile page, redirect to home
      if (activeKey === PAGE_TYPE.PROFILE) {
        setActiveKey(PAGE_TYPE.HOME);
      }
    }
  }, [user, token, activeKey]);

  const navItems = [
    {
      key: PAGE_TYPE.HOME,
      label: "Home",
      onClick: () => handleTabChange(PAGE_TYPE.HOME),
    },
    {
      key: PAGE_TYPE.JOIN,
      label: "Join",
      onClick: () => handleTabChange(PAGE_TYPE.JOIN),
    },
    {
      key: PAGE_TYPE.QUESTIONS,
      label: "Questions",
      onClick: () => handleTabChange(PAGE_TYPE.QUESTIONS),
    },
    {
      key: user && token ? PAGE_TYPE.PROFILE : PAGE_TYPE.SIGNUP,
      label: user && token ? "Profile" : "Sign Up/Log in",
      onClick: () =>
        handleTabChange(user && token ? PAGE_TYPE.PROFILE : PAGE_TYPE.SIGNUP),
    },
  ];

  const items: TabsProps["items"] = [
    {
      key: "logo",
      label: <img src={logo} alt="logo" className="w-14 h-16" />,
      children: activeKey === PAGE_TYPE.HOME ? <Home /> : null,
    },
    ...navItems.map((item) => ({
      key: item.key,
      label: (
        <div className="font-nyu-perstare font-extralight md:text-2xl text-lg text-white">
          {item.label}
        </div>
      ),
      children:
        activeKey === item.key ? (
          item.key === PAGE_TYPE.HOME ? (
            <Home />
          ) : item.key === PAGE_TYPE.JOIN ? (
            <Join />
          ) : item.key === PAGE_TYPE.QUESTIONS ? (
            <Questions />
          ) : user && token && item.key === PAGE_TYPE.PROFILE ? (
            <Profile />
          ) : null
        ) : null,
    })),
  ];

  const handleTabChange = (key: string) => {
    if (key === "logo") {
      setActiveKey(PAGE_TYPE.HOME);
    } else if (key === PAGE_TYPE.SIGNUP) {
      navigate("/login");
    } else {
      setActiveKey(key);
    }
    setMobileDrawerOpen(false);
  };

  return (
    <div className="min-h-screen">
      {/* Mobile Header */}
      <div className="max-[900px]:flex hidden justify-between items-center fixed top-0 left-0 right-0 z-50 bg-black/80 h-[50px] px-4">
        <img src={logo} alt="logo" className="h-8" />
        <Button
          type="text"
          icon={<MenuOutlined className="text-white text-2xl" />}
          onClick={() => setMobileDrawerOpen(true)}
        />
      </div>

      {/* Mobile Drawer */}
      <Drawer
        placement="right"
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        className="bg-black/80"
        styles={{
          body: {
            padding: 0,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
          },
          content: {
            backgroundColor: "rgba(0, 0, 0, 0.8)",
          },
          wrapper: {
            position: "fixed",
          },
        }}
      >
        <div className="flex flex-col gap-6 py-4">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={item.onClick}
              className={cn(
                "font-nyu-perstare font-extralight text-xl text-white py-3 px-6 text-left hover:bg-nyu-purple/20 transition-colors",
                activeKey === item.key && "bg-nyu-purple/30"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </Drawer>

      {/* Desktop Navigation */}
      <div>
        <Tabs
          activeKey={activeKey}
          onChange={handleTabChange}
          tabPosition="top"
          items={items}
          rootClassName={cn(
            "[&_.ant-tabs-nav]:fixed [&_.ant-tabs-nav]:top-0 [&_.ant-tabs-nav]:z-50 [&_.ant-tabs-nav]:w-full [&_.ant-tabs-nav]:px-4 min-[901px]:[&_.ant-tabs-nav]:px-10 [&_.ant-tabs-nav]:h-[100px]",
            "[&_.ant-tabs-nav]:bg-black/80",
            "[&_.ant-tabs-ink-bar]:bg-nyu-purple",
            "[&_.ant-tabs-tab]:flex-1 [&_.ant-tabs-tab]:flex [&_.ant-tabs-tab]:justify-center",
            "[&_.ant-tabs-nav-list]:gap-x-4 min-[901px]:[&_.ant-tabs-nav-list]:gap-x-20",
            "max-[900px]:[&_.ant-tabs-nav]:hidden"
          )}
        />
      </div>
    </div>
  );
};

export default Navbar;
