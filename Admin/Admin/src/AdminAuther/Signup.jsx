import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AdminSignup.css";

function AdminSignup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateEmail = (email) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  const validatePassword = (password) => password.length >= 8;

  const handleSendOtp = async () => {
    if (!formData.email || !validateEmail(formData.email)) {
      toast.error("❌ Enter a valid email first!");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/Adminsignup/send-otp`,
        { email: formData.email }
      );

      if (res.status === 200) {
        toast.success("✅ OTP sent to your email!");
        setOtpSent(true);
        setOtpVerified(false); // reset if previously verified
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "❌ Failed to send OTP");
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      toast.error("⚠️ Please enter the OTP");
      return;
    }

    try {
      const verifyRes = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/Adminsignup/verify-otp`,
        {
          email: formData.email,
          enteredOtp: otp,
        }
      );

      if (verifyRes.status === 200) {
        toast.success("✅ OTP Verified!");
        setOtpVerified(true);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "❌ OTP Verification Failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error("⚠️ All fields are required!");
      return;
    }
    if (!validateEmail(formData.email)) {
      toast.error("❌ Invalid email format!");
      return;
    }
    if (!validatePassword(formData.password)) {
      toast.error("❌ Password must be at least 8 characters!");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("❌ Passwords do not match!");
      return;
    }
    if (!otpVerified) {
      toast.error("❌ You must verify OTP before signing up!");
      return;
    }

    try {
      const signupResponse = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/Adminsignup`,
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }
      );

      if (signupResponse.status === 201) {
        toast.success("✅ Signup successful! Redirecting...");
        setTimeout(() => navigate("/AdminLogin"), 1500);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "❌ Signup failed.");
      console.error("Signup error:", error);
    }
  };

  return (
    <div className="conta">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <h2 className="adminw">Admin Signup</h2>

      <form onSubmit={handleSubmit} className="sig">
        <input
          className="inn1"
          type="text"
          name="name"
          placeholder="Enter your Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <div style={{ display: "flex", gap: "10px" }}>
          <input
            className="inn1"
            type="email"
            name="email"
            placeholder="Enter your Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            onClick={handleSendOtp}
            className="buut1"
          >
            Send OTP
          </button>
        </div>

        {otpSent && (
          <>
            <input
              className="inn1"
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              type="button"
              onClick={handleVerifyOtp}
              className="buut1"
            >
              Verify OTP
            </button>
          </>
        )}

        <input
          className="inn1"
          type="password"
          name="password"
          placeholder="Enter your Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <input
          className="inn1"
          type="password"
          name="confirmPassword"
          placeholder="Confirm your Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        <button className="buut1" type="submit" disabled={!otpVerified}>
          Signup
        </button>
      </form>

      <p className="pp">
        Already have an account? <Link to="/Adminlogin">Login here</Link>
      </p>
    </div>
  );
}

export default AdminSignup;
