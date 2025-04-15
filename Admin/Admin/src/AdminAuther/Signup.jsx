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

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateEmail = (email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  const validatePassword = (password) => password.length >= 8; // At least 8 characters

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

    try {
      const response = await axios.post("https://ecommerce-atbk.onrender.com/api/Adminsignup", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (response.status === 201) {
        toast.success("✅ Signup successful! Redirecting to login...");
        setTimeout(() => navigate("/AdminLogin"), 1000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "❌ Signup failed. Please try again.");
      console.error("Error during signup:", error);
    }
  };

  return (
    <div className="conta">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <h2 className="adminw">Admin Signup</h2>

      <form onSubmit={handleSubmit} className="sig">
        <input className="inn1" 
        type="text"
         name="name"
         placeholder="Enter your Name"
          value={formData.name}
           onChange={handleChange} 
           required />

        <input
         className="inn1"
          type="email"
           name="email"
            placeholder="Enter your Email" 
            value={formData.email} 
            onChange={handleChange} 
            required />

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
            required />

        <button
         className="buut1" 
         type="submit">Signup</button>
      </form>
      <p className="pp">Already have an account? <Link to="/Adminlogin">Login here</Link></p>
    </div>
  );
}

export default AdminSignup;
