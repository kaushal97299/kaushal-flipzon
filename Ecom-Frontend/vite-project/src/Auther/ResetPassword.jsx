import React, { useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import " ../Auther/ResetPassword.css"; // Assuming you have a CSS file for styling
function ResetPassword() {
  const [password, setPassword] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const handleReset = async () => {
    if (!password) {
      toast.warn("⚠ Please enter a new password");
      return;
    }

    try {
      // eslint-disable-next-line no-unused-vars
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/reset-password`, {
        email,
        token,
        password,
      });

      toast.success("✅ Password reset successful");
      setTimeout(() => navigate("/login"), 2000);
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      toast.error("❌ Reset failed. Try again.");
    }
  };

  return (
    <div className="reset-container">
      <ToastContainer />
      <h2>Reset Password</h2>
      <input
        className="inp2"
        type="password"
        placeholder="Enter new password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="btuu" onClick={handleReset}>Reset Password</button>
    </div>
  );
}

export default ResetPassword;
