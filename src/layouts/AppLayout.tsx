import React, { FC, ReactNode, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { getCurrentUser } from "../actions/user.action";

const AppLayout: FC<{ children: ReactNode }> = ({ children }) => {
  useEffect(() => {
    const validateUser = async () => {
      try {
        await getCurrentUser();
      } catch (error) {
        console.error("Error validating user:", error);
      }
    };

    validateUser();
  }, []);

  return <div className="min-h-screen">{children}</div>;
};

export default AppLayout;
