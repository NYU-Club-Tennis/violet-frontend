import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Tabs, TabsProps } from "antd";
import { PAGE_TYPE } from "constants/enum/page.enum";
import Home from "pages/Home/Home";
import Join from "pages/Join/Join";
import Questions from "pages/Questions/Questions";

const Navbar: React.FC = () => {
  const [activeKey, setActiveKey] = useState<string>(PAGE_TYPE.HOME);

  const items: TabsProps["items"] = [
    {
      key: PAGE_TYPE.HOME,
      label: <div className="text-NYUPerstare-light text-black">Home</div>,
      children: <Home />,
    },
    {
      key: PAGE_TYPE.JOIN,
      label: <div className="text-NYUPerstare-light text-black">Join</div>,
      children: <Join />,
    },
    {
      key: PAGE_TYPE.QUESTIONS,
      label: <div className="text-NYUPerstare-light text-black">Questions</div>,
      children: <Questions />,
    },
  ];

  const handleTabChange = (key: string) => {
    setActiveKey(key);
  };

  return (
    <Tabs activeKey={activeKey} onChange={handleTabChange} items={items} />
  );
};

export default Navbar;
