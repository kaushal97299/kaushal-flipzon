import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import "./Signup.css";

function Signup() {
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

  const validateEmail = (email) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

  const validatePhone = (phone) => /^\d{10}$/.test(phone);

  const validatePassword = (password) =>
    /^[A-Za-z]+@+\d+$/.test(password) && password.length >= 9;

  // Handle Signup
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(formData.email)) {
      toast.error("❌ Enter a valid email!");
      return;
    }

    if (!validatePhone(formData.phone)) {
      toast.error("❌ Phone must be exactly 10 digits!");
      return;
    }

    if (!validatePassword(formData.password)) {
      toast.error(
        "❌ Password must be at least 9 characters, contain letters first, then '@', and end with numbers!"
      );
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("❌ Passwords do not match!");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/signup`,
        formData
      );

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

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="in1"
          required
        >
          <option value="">Select Role</option>
          <option value="client">Client</option>
          <option value="user">User</option>
        </select>

        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="in1"
          required
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        <button className="but1" type="submit" disabled={isLoading}>
          {isLoading ? "Signing up..." : "Signup"}
        </button>
      </form>

      <p className="pp">
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
}

export default Signup;
