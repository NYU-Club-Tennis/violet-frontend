import React, { FC } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";

const HomeLayout: FC = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
};

export default HomeLayout;
