import React from "react";
import { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "pages/Home/Home";
import AppLayout from "layouts/AppLayout";
import HomeLayout from "layouts/HomeLayout";
import AuthLayout from "layouts/AuthLayout";
import Questions from "pages/Questions/Questions";

// import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <AppLayout>
          <Route path="/" element={<HomeLayout />}>
            <Route index element={<Home />} />
            <Route path="/questions" element={<Questions />} />
          </Route>
        </AppLayout>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
