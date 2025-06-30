import React, { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthStore } from "stores/auth.store";

const Join: FC = () => {
  const { token, user } = AuthStore();

  useEffect(() => {
    if (!user || !token) {
      console.log("user not logged in/token expired");
    }
  }, []);

  return <div>Join</div>;
};

export default Join;
