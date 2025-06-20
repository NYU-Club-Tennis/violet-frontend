import React, { FC } from "react";
import { Outlet } from "react-router-dom";

const HomeLayout: FC = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default HomeLayout;
