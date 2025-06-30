import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "pages/Home/Home";
import AppLayout from "layouts/AppLayout";
import HomeLayout from "layouts/HomeLayout";
import AuthLayout from "layouts/AuthLayout";
import Questions from "pages/Questions/Questions";
import Join from "pages/Join/Join";
import Welcome from "pages/Welcome/Welcome";
import Login from "pages/Login/Login";
import SignUp from "pages/SignUp/SignUp";
import CreateProfile from "pages/CreateProfile/CreateProfile";

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/" element={<HomeLayout />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/signup" element={<SignUp />}></Route>
          <Route path="/create-profile" element={<CreateProfile />}></Route>
          <Route path="*" element={<Navigate to="/welcome" replace />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
