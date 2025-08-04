import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from "./store/AuthContaxt";
import { CartProvider } from "./component/Cart/CartContext";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <CartProvider>
          <App />
        </CartProvider>
      </GoogleOAuthProvider>
    </AuthProvider>
  </React.StrictMode>
);
