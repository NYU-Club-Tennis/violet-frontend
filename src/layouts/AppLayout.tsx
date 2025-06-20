import React, { FC, ReactNode } from "react";
import { Outlet } from "react-router-dom";

const AppLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return <div>{children}</div>;
};

export default AppLayout;
