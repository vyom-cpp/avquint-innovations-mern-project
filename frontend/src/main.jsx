import React from "react";
import ReactDOM from "react-dom/client";
import { ToastContainer } from "react-toastify";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import App from "./App";

import { AuthProvider } from "./context/AuthContext";
import { ThemeProviderCustom } from "./theme/ThemeContext";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProviderCustom>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <App />
          <ToastContainer position="top-right" autoClose={3000} />
        </LocalizationProvider>
      </ThemeProviderCustom>
    </AuthProvider>
  </React.StrictMode>,
);
