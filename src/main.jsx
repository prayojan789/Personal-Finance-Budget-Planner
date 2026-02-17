import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { FinanceProvider } from "./context/FinanceContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <FinanceProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </FinanceProvider>
    </AuthProvider>
  </StrictMode>
);
