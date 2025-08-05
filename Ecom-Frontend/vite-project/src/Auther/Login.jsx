/* eslint-disable no-unused-vars */
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css";
import { AuthContext } from "../store/AuthContaxt";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

function Login() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  if (!auth) {
    console.error("AuthContext is undefined. Make sure AuthProvider is wrapping the App.");
    return <p>Error: AuthContext not found</p>;
  }

  const { setToken, setUser } = auth;

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!loginData.email || !loginData.password) {
      toast.warn("⚠ Email and Password are required!", { position: "top-right" });
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, loginData);
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setToken(token);
      setUser(user);

      toast.success("✅ Login successful! Redirecting...", { position: "top-right" });
      navigate('/');
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.message || "❌ Invalid credentials. Please try again.", {
        position: "top-right",
      });
    }
  };

  const handleGooglelogin = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/google-login`, {
        email: decoded.email,
        name: decoded.name,
        googleId: decoded.sub,
      });

      toast.success("Login Successful", { position: "top-center" });
      setToken(data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);

      navigate("/");
      window.location.reload();
    } catch (err) {
      console.error(err);
      toast.error("Google Login Failed", { position: "top-center" });
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotEmail) {
      toast.warn("⚠ Please enter your email");
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/forgot-password`, {
        email: forgotEmail,
      });

      toast.success("📩 Reset link sent to your email");
      setShowForgotModal(false);
      setForgotEmail("");
    } catch (err) {
      toast.error("❌ Failed to send reset link");
    }
  };

  return (
    <>
      <div className="container1">
        <div className="btuuv">
          <GoogleLogin
            onSuccess={handleGooglelogin}
            onError={() => toast.error("❌ Google Login Failed!")}
          />
        </div>
        <br />
        <h2 className="la2">Login</h2>

        <ToastContainer />

        <form onSubmit={handleSubmit}>
          <input
            className="inp2"
            type="email"
            name="email"
            placeholder="Enter your Email"
            value={loginData.email}
            onChange={handleChange}
            required
          />

          <input
            className="inp2"
            type="password"
            name="password"
            placeholder="Enter your Password"
            value={loginData.password}
            onChange={handleChange}
            required
          />

          <p
            style={{
              textAlign: "right",
              fontSize: "14px",
              color: "blue",
              cursor: "pointer",
              marginBottom: "5px",
            }}
            onClick={() => setShowForgotModal(true)}
          >
            Forgot Password?
          </p>

          <button className="btuu" type="submit">Login</button>
        </form>

        <p>Don't have an account? <Link to="/signup">Signup here</Link></p>
      </div>

      {showForgotModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3 style={{ marginBottom: "10px" }}>Forgot Password</h3>
            <input
              className="inp2"
              type="email"
              placeholder="Enter your email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
            />
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <button className="btuu" onClick={handleForgotPassword}>Send Link</button>
              <button className="btuu" style={{ backgroundColor: "#6c757d" }} onClick={() => setShowForgotModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Login;
