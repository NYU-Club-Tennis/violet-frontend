import React, { FC, ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthStore } from "stores/auth.store";

const AuthLayout: FC<{ children: ReactNode }> = ({ children }) => {
  const { user, token } = AuthStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (!user || !token) {
      navigate("/");
    }
  }, []);

  return <div>{children}</div>;
};

export default AuthLayout;
