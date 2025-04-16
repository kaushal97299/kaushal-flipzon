import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import "./Signup.css";

function Signup() {
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "",
    gender: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const validateEmail = (email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  const validatePhone = (phone) => /^\d{10}$/.test(phone);
  const validatePassword = (password) => /^[A-Za-z]+@+\d+$/.test(password) && password.length >= 9;

  // Send OTP
  const sendOtp = async () => {
    if (!validateEmail(formData.email)) {
      toast.error("❌ Enter a valid email!");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:4000/api/auth/send-otp", {
        email: formData.email,
      });
      
      if (response) {
        toast.success("✅ OTP Sent to your email!");
      }
      setIsOtpSent(true);
      
    } catch (error) {
      toast.error(error.response?.data?.message || "❌ Failed to send OTP. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP
  const verifyOtp = async () => {
    if (!otp) {
      toast.error("❌ Please enter the OTP!");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:4000/api/auth/verify-otp", {
        email: formData.email,
        enteredOtp: otp,
      });

      if (response.status === 200) {
        toast.success("✅ OTP Verified!");
        setIsOtpVerified(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "❌ OTP verification failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Signup
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isOtpVerified) {
      toast.error("❌ Please verify OTP before signing up!");
      return;
    }
    if (!validatePhone(formData.phone)) {
      toast.error("❌ Phone must be exactly 10 digits!");
      return;
    }
    if (!validatePassword(formData.password)) {
      toast.error("❌ Password must be at least 9 characters, contain letters first, then '@', and end with numbers!");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("❌ Passwords do not match!");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:4000/api/auth/signup", formData);
      if (response.status === 201) {
        toast.success("✅ Signup successful!");
        setTimeout(() => navigate("/login"), 1000);

      }
    } catch (error) {
      toast.error(error.response?.data?.message || "❌ User already exists.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="contt">
      <Toaster position="top-right" />

      <h2 className="hg">Signup</h2>

      <form onSubmit={handleSubmit}>
        {/* Name and Email Fields */}
        <input
          className="in1"
          type="text"
          name="name"
          placeholder="Enter your Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          className="in1"
          type="email"
          name="email"
          placeholder="Enter your Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        {/* OTP Section */}
        {isOtpSent ? (
          <>
            <input
              className="in1"
              type="text"
              name="otp"
              placeholder="Enter OTP"
              value={otp}
              onChange={handleOtpChange}
              required
            />
            <button type="button" className="but1" onClick={verifyOtp} disabled={isLoading}>
              {isLoading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        ) : (
          <button type="button" className="but1" onClick={sendOtp} disabled={isLoading}>
            {isLoading ? "Sending..." : "Send OTP"}
          </button>
        )}

        {/* Only show the remaining form once OTP is verified */}
        {isOtpVerified && (
          <>
            <input
              className="in1"
              type="number"
              name="phone"
              placeholder="Enter your Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <input
              className="in1"
              type="password"
              name="password"
              placeholder="Enter your Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <input
              className="in1"
              type="password"
              name="confirmPassword"
              placeholder="Confirm your Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />

            <select name="role" value={formData.role} onChange={handleChange} className="in1" required>
              <option value="">Select Role</option>
              <option value="client">Client</option>
              <option value="user">User</option>
            </select>

            <select name="gender" value={formData.gender} onChange={handleChange} className="in1" required>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>

            <button className="but1" type="submit" disabled={isLoading}>
              {isLoading ? "Signing up..." : "Signup"}
            </button>
          </>
        )}
      </form>

      <p className="pp">
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
}

export default Signup;
