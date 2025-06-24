import React, { FC } from "react";
import { useNavigate } from "react-router-dom";
import { AuthStore } from "stores/auth.store";

const Join: FC = () => {
  const { token, player } = AuthStore();
  const navigate = useNavigate();

  if (!player || !token) {
    navigate("/signup");
  }

  return <div>Join</div>;
};

export default Join;
