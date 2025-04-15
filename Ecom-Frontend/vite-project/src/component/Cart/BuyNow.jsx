import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import "./BuyNow.css"; // Ensure styles are updated for flex display

const BuyNow = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product || null;

  const [userDetails, setUserDetails] = useState({
    name: "",
    address: "",
    phone: "",
  });
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch user ID
  useEffect(() => {
    const fetchUserId = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in to place an order.");
        return;
      }

      try {
        const response = await axios.get("https://ecommerce-atbk.onrender.com/api/auth/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserId(response.data.userId);
      } catch (error) {
        console.error("Failed to fetch user ID:", error);
      }
    };

    fetchUserId();
  }, []);

  // Remove product from the user's cart
  useEffect(() => {
    if (!userId || !product) return;

    const savedCart = JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];
    const updatedCart = savedCart.filter((item) => item._id !== product._id);
    localStorage.setItem(`cart_${userId}`, JSON.stringify(updatedCart));
  }, [userId, product]);

  // Handle input changes
  const handleChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  // Validate form inputs
  const validateForm = () => {
    const { name, address, phone } = userDetails;
    const nameRegex = /^[A-Za-z\s]{3,50}$/;
    const addressRegex = /^[A-Za-z0-9\s,.-]{5,100}$/;
    const phoneRegex = /^\d{10}$/;

    if (!nameRegex.test(name)) {
      toast.error("Name should only contain letters & spaces (3-50 characters).");
      return false;
    }
    if (!addressRegex.test(address)) {
      toast.error("Address must be between 5-100 characters and can include letters, numbers, comma, dot.");
      return false;
    }
    if (!phoneRegex.test(phone)) {
      toast.error("Phone number must be exactly 10 digits.");
      return false;
    }
    return true;
  };

  // Handle order submission
  const handleOrderSubmit = async () => {
    const userId = localStorage.getItem("user");
    if (!userId) {
      toast.error("User not logged in. Please log in to proceed.");
      return;
    }

    if (!product) {
      toast.error("Invalid product. Please try again.");
      return;
    }

    if (!validateForm()) return;

    setLoading(true);

    const finalPrice = product.price - (product.price * (product.discount || 0)) / 100;

    const orderDetails = {
      userId,
      ...userDetails,
      product: { ...product, finalPrice },
      orderTime: new Date().toISOString(),
    };

    try {
      console.log("Sending Order Details:", orderDetails);
      const response = await fetch("https://ecommerce-atbk.onrender.com/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" ,userId },
        body: JSON.stringify(orderDetails),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(`Order failed: ${errorData.message || "Please try again."}`);
        return;
      }

      toast.success("Order placed successfully! 🎉");
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      toast.error("Error placing order. Please try again.");
      console.error("Order Error:", error);
    }

    setLoading(false);
  };

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} />

      <div className="conn ">
        <h2 className="text-center">Buy Now</h2>
        <div className="roow2">
          <div className="book1">
            <div className="roww">
              <div className="rooww">
                <h4 className="mb3">Product Details</h4>
                {product ? (
                  <>
                    <img
                      src={`https://ecommerce-atbk.onrender.com/uploads/${product.image}`}
                      alt={product.pname}
                      className="imggs"
                      style={{ maxWidth: "200px" }}
                    />
                    <p className="pper"><strong>Name:</strong> {product.pname}</p>
                    <p className="pper"><strong>Price:</strong> ₹{product.price}</p>
                    <p className="pper"><strong>Discount:</strong> {product.discount || 0}%</p>
                    <p className="pper"><strong>Final Price:</strong> ₹{(product.price - (product.price * (product.discount || 0)) / 100).toFixed(2)}</p>
                  </>
                ) : (
                  <p className="text-danger">No product details available.</p>
                )}
              </div>
              <div className="cdetai">
                <h4 className="mbb">User Details</h4>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  className="formm"
                  onChange={handleChange}
                  value={userDetails.name}
                />
                <input
                  type="text"
                  name="address"
                  placeholder="Enter your address"
                  className="formm"
                  onChange={handleChange}
                  value={userDetails.address}
                />
                <input
                  type="text"
                  name="phone"
                  placeholder="Enter your phone"
                  className="formm"
                  onChange={handleChange}
                  value={userDetails.phone}
                />
                <button className="btnn btn-success" onClick={handleOrderSubmit} disabled={loading}>
                  {loading ? "Processing..." : "Confirm Order"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BuyNow;
