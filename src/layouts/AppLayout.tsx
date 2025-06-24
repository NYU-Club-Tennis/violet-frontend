import React, { FC, ReactNode } from "react";
import { Outlet } from "react-router-dom";

const AppLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return <div className="min-h-screen">{children}</div>;
};

export default AppLayout;
