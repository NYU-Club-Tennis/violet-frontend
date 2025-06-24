import React, { FC, ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthStore } from "stores/auth.store";

const AuthLayout: FC<{ children: ReactNode }> = ({ children }) => {
  const { player, token } = AuthStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (!player || !token) {
      navigate("/");
    }
  }, []);

  return <div>{children}</div>;
};

export default AuthLayout;
