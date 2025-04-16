import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css";
import { AuthContext } from "../store/AuthContaxt";

function Login() {
  const auth = useContext(AuthContext); // Get context first
  const navigate = useNavigate();

  if (!auth) {
    console.error("AuthContext is undefined. Make sure AuthProvider is wrapping the App.");
    return <p>Error: AuthContext not found</p>;
  }

  const { setToken, setUser } = auth;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [loginData, setLoginData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!loginData.email || !loginData.password) {
      toast.warn("⚠️ Email and Password are required!", { position: "top-right" });
      return;
    }

    try {
      const response = await axios.post("http://localhost:4000/api/auth/login", loginData);

      // Extract token & user data from response
      const { token, user } = response.data;

      // Save to localStorage & context
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setToken(token);
      setUser(user);

      toast.success("✅ Login successful! Redirecting...", { position: "top-right" });
      
      navigate('/')
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.message || "❌ Invalid credentials. Please try again.", {
        position: "top-right",
      });
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="container1">
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

        <button className="btuu" type="submit">Login</button>
      </form>

      <p>Don't have an account? <Link to="/signup">Signup here</Link></p>
    </div>
  );
}

export default Login;
