import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css"; // This should come before App import
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
