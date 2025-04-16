import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import "./BuyNow.css";

const BuyNow = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product || null;

  const [userDetails, setUserDetails] = useState({
    name: "",
    address: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const handleChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value.trim() });
  };

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

  const handleOrderSubmit = async () => {
    if (!product) {
      toast.error("Invalid product. Please try again.");
      return;
    }

    if (!validateForm()) return;

    if (!user) {
      toast.error("You must be logged in to place an order.");
      return;
    }

    setLoading(true);

    const finalPrice = product.price - (product.price * (product.discount || 0)) / 100;

    try {
      const orderResponse = await axios.post("https://kaushal-flipzon.onrender.com/api/orders/create", {
        amount: finalPrice * 100,
      });

      const { orderId, amount, currency } = orderResponse.data;

      const options = {
        key: "rzp_test_4xjKupfTBgr5M6",
        amount,
        currency,
        name: "My E-Commerce",
        description: "Order Payment",
        image: "/logo.png",
        order_id: orderId,
        handler: async function (response) {
          const paymentData = {
            ...userDetails,
            userId: user?._id || "guest", // ✅ Include userId here
            product: { ...product, finalPrice },
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
          };

          try {
            const verifyResponse = await axios.post("https://kaushal-flipzon.onrender.com/api/orders", paymentData);
            if (verifyResponse.status === 201) {
              toast.success("Order placed successfully! 🎉");
              setTimeout(() => navigate("/"), 2000);
            }
          } catch (error) {
            console.error("Verification Error:", error);
            toast.error("Payment verification failed.");
          }
        },
        prefill: {
          name: userDetails.name,
          contact: userDetails.phone,
        },
        theme: { color: "#3399cc" },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Razorpay Order Creation Error:", error);
      toast.error("Failed to initiate payment. Please try again.");
    }

    setLoading(false);
  };

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="conn">
        <h2 className="text-center">Buy Now</h2>
        <div className="roow2">
          <div className="book1">
            <div className="roww">
              <div className="rooww">
                <h4 className="mb3">Product Details</h4>
                {product ? (
                  <>
                    <img
                      src={product.image}
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
