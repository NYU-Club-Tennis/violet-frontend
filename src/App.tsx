import React from "react";
import { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "pages/Home/Home";
import AppLayout from "layouts/AppLayout";
import HomeLayout from "layouts/HomeLayout";
import AuthLayout from "layouts/AuthLayout";

// import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route element={<HomeLayout />}>
            <Route index element={<Home />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
