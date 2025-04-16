import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ProductCart.css";
// import { cartContext } from "./CartContext";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  const updateCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const modifyQuantity = (id, amount) => {
    const updatedCart = cart.map((item) => {
      if (item._id === id) {
        const newQuantity = item.quantity + amount;
        if (newQuantity < 1) {
          return item; // Don't allow less than 1 item
        }
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    updateCart(updatedCart);
  };

  const removeItem = (id) => {
    const updatedCart = cart.filter((item) => item._id !== id);
    updateCart(updatedCart);
  };

  const handleBuyNow = (item) => {
    navigate("/buy-now", { state: { product: item } });
  };

  const handlePlaceOrder = () => {
    alert("Thank you for your purchase! 🎉");
    setCart([]);
    localStorage.removeItem("cart");
  };

  const calculateDiscount = (price, discountPercentage) => (price * discountPercentage) / 100;

  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalDiscount = cart.reduce(
    (acc, item) => acc + calculateDiscount(item.price * item.quantity, item.discount || 0),
    0
  );
  const finalAmount = totalPrice - totalDiscount;

  return (
    <>
      <div className="contain12 mt-4">
        <div className="row">
          <div className="col-md-8  ttt ">
            <h2 className="sho">🛒 Shopping Cart</h2>
            {cart.length === 0 ? (
              <div className="empty-cart text-center">
                <p>Your cart is empty.</p>
                <Link to="/" className="btn btn-secondary">Continue Shopping</Link>
              </div>
            ) : (
              <div className="cart-items1">
                {cart.map((item) => (
                  <div key={item._id} className="cart-item d-flex mb-3">
                    <img
                      src={item.image ? `http://localhost:4000/uploads/${item.image}` : "/image/placeholder.png"}
                      alt={item.name}
                      className="cart-image me-3"
                      style={{ width: "100px", height: "100px" }}
                    />
                    <div className="cart-info flex-grow-1">
                      <h5 className="hed">{item.pname}</h5>
                      <p className="pri">Price: ₹{item.price}</p>
                      <p className="pri">Discount: {item.discount || 0}%</p>
                      <p className="pri">Total Before Discount: ₹{(item.price * item.quantity).toFixed(2)}</p>
                      <p className="pri">Discount Amount: ₹{calculateDiscount(item.price * item.quantity, item.discount || 0).toFixed(2)}</p>
                      <p className="pri">Final Price: ₹{(item.price * item.quantity - calculateDiscount(item.price * item.quantity, item.discount || 0)).toFixed(2)}</p>
                      <div className="quantity-controls d-flex align-items-center">
                        <button className="btn btn-outline-secondary me-2" onClick={() => modifyQuantity(item._id, -1)} disabled={item.quantity <= 1}>➖</button>
                        <span className="pri">{item.quantity}</span>
                        <button className="btn btn-outline-secondary ms-2" onClick={() => modifyQuantity(item._id, 1)}>➕</button>
                      </div>
                      <button className="btn btn-primary mt-2" onClick={() => handleBuyNow(item)}>Buy Now</button>
                      <button className="btn btn-danger mt-2 ms-2" onClick={() => removeItem(item._id)}>❌ Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="col-md-4">
              <div className="card p-3">
                <h4>PRICE DETAILS</h4>
                <hr />
                <p>Price ({cart.length} item{cart.length > 1 ? "s" : ""}): ₹{totalPrice.toFixed(2)}</p>
                <p>Discount: - ₹{totalDiscount.toFixed(2)}</p>
                <p>Delivery Charges: <span className="text-success">Free</span></p>
                <hr />
                <h5>Total Amount: ₹{finalAmount.toFixed(2)}</h5>
                <p className="text-success">You will save ₹{totalDiscount.toFixed(2)} on this order</p>
                <button id="placeOrderButton" className="btn btn-primary w-100" onClick={handlePlaceOrder}>PLACE ORDER</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;
