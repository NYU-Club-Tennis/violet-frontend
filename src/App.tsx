import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import Home from "pages/Home/Home";
import AppLayout from "layouts/AppLayout";
import HomeLayout from "layouts/HomeLayout";
import AuthLayout from "layouts/AuthLayout";
import BofLayout from "layouts/BofLayout";
import Questions from "pages/Questions/Questions";
import Join from "pages/Join/Join";
import Welcome from "pages/Welcome/Welcome";
import Login from "pages/Login/Login";
import SignUp from "pages/SignUp/SignUp";
import CreateProfile from "pages/CreateProfile/CreateProfile";
import Dashboard from "pages/Bof/Dashboard/Dashboard";
import Users from "pages/Bof/Users/Users";
import Sessions from "pages/Bof/Sessions/Sessions";
import Email from "pages/Bof/Email/Email";
import Settings from "pages/Bof/Settings/Settings";
import ForgotPassword from "pages/ForgotPassword/ForgotPassword";
import ResetPassword from "pages/ResetPassword/ResetPassword";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/" element={<HomeLayout />}></Route>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/create-profile" element={<CreateProfile />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Back Office Routes */}
            <Route path="/bof" element={<BofLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="users" element={<Users />} />
              <Route path="sessions" element={<Sessions />} />
              <Route path="email" element={<Email />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            <Route path="*" element={<Navigate to="/welcome" replace />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
