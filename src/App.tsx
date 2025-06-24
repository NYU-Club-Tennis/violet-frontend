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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/welcome" element={<Welcome />} />
        <Route
          path="/"
          element={
            <AppLayout>
              <HomeLayout />
            </AppLayout>
          }
        >
          <Route index element={<Home />} />
          <Route path="/questions" element={<Questions />} />
          <Route path="/join" element={<Join />} />
        </Route>
        <Route path="*" element={<Navigate to="/welcome" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
