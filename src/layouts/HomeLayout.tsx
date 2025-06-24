import React, { FC, useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Layout from "antd/es/layout/layout";
import { HomeLayoutStore } from "stores/home.layout.store";

const HomeLayout: FC = () => {
  const { loadWelcome, setLoadWelcome } = HomeLayoutStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (loadWelcome === "true") {
      navigate("/welcome");
    }
  }, []);

  return (
    <div>
      <Navbar />
    </div>
  );
};

export default HomeLayout;
