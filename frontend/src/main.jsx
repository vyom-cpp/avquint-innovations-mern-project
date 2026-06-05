import React from "react";
import ReactDOM from "react-dom/client";
import { ToastContainer } from "react-toastify";

import App from "./App";

import { AuthProvider }
from "./context/AuthContext";
import { ThemeProviderCustom } from "./theme/ThemeContext";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProviderCustom>
        <App />
        <ToastContainer
          position="top-right"
          autoClose={3000}
        />
      </ThemeProviderCustom>
    </AuthProvider>
  </React.StrictMode>
);