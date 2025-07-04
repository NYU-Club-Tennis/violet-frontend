import React, { useEffect, useState } from "react";
import { Tabs, TabsProps } from "antd";
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

  const items: TabsProps["items"] = [
    {
      key: "logo",
      label: <img src={logo} alt="logo" className="w-14 h-16" />,
      children: activeKey === PAGE_TYPE.HOME ? <Home /> : null,
    },
    {
      key: PAGE_TYPE.HOME,
      label: (
        <div className="font-nyu-perstare font-extralight text-2xl text-white">
          Home
        </div>
      ),
      children: activeKey === PAGE_TYPE.HOME ? <Home /> : null,
    },
    {
      key: PAGE_TYPE.JOIN,
      label: (
        <div className="font-nyu-perstare font-extralight text-2xl text-white">
          Join
        </div>
      ),
      children: activeKey === PAGE_TYPE.JOIN ? <Join /> : null,
    },
    {
      key: PAGE_TYPE.QUESTIONS,
      label: (
        <div className="font-nyu-perstare font-extralight text-2xl text-white">
          Questions
        </div>
      ),
      children: activeKey === PAGE_TYPE.QUESTIONS ? <Questions /> : null,
    },
    {
      key: user && token ? PAGE_TYPE.PROFILE : PAGE_TYPE.SIGNUP,
      label: (
        <div className="font-nyu-perstare font-extralight text-2xl text-white">
          {user && token ? "Profile" : "Sign Up/Log in"}
        </div>
      ),
      children:
        user && token && activeKey === PAGE_TYPE.PROFILE ? <Profile /> : null,
    },
  ];

  const handleTabChange = (key: string) => {
    if (key === "logo") {
      setActiveKey(PAGE_TYPE.HOME);
    } else if (key === PAGE_TYPE.SIGNUP) {
      navigate("/login");
    } else {
      setActiveKey(key);
    }
  };

  return (
    <div className="h-screen">
      <Tabs
        activeKey={activeKey}
        onChange={handleTabChange}
        tabPosition="top"
        items={items}
        rootClassName={cn(
          "[&_.ant-tabs-nav]:fixed [&_.ant-tabs-nav]:top-0 [&_.ant-tabs-nav]:z-50 [&_.ant-tabs-nav]:w-full [&_.ant-tabs-nav]:px-10 [&_.ant-tabs-nav]:h-[100px] ",
          "[&_.ant-tabs-nav]:bg-black/80",
          "[&_.ant-tabs-ink-bar]:bg-nyu-purple",
          "[&_.ant-tabs-tab]:flex-1 [&_.ant-tabs-tab]:flex [&_.ant-tabs-tab]:justify-center",
          "[&_.ant-tabs-nav-list]:gap-x-20"
        )}
      />
    </div>
  );
};

export default Navbar;
