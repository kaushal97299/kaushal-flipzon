import React, { useEffect, useState , useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./productDetail.css";
import { cartContext } from "../component/Cart/CartContext";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  // const [cart, setCart] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const { cart, setCart } = useContext(cartContext);

  useEffect(() => {
    const fetchProductAndReviews = async () => {
      setLoading(true);
      try {
        const productResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/prod/${id}`);
        setProduct(productResponse.data);

        const reviewsResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/reviews/rew/${id}`);
        setReviews(reviewsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error loading product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndReviews();

    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const handleBuyNow = () => {
    navigate("/buy-now", { state: { product } });
  };

  const updateCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const addToCart = () => {
    if (!product) return;

    const existingItem = cart.find((item) => item._id === product._id);
    let updatedCart;

    if (existingItem) {
      updatedCart = cart.map((item) =>
        item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updatedCart = [...cart, { ...product, quantity: 1 }];
    }

    updateCart(updatedCart);
    toast.success("Product added to cart!", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const handleReviewSubmit = async () => {
    if (!newReview.trim() || rating === 0) {
      toast.error("Please enter a review and select a rating.");
      return;
    }

    if (!user) {
      toast.error("You must be logged in to submit a review.");
      return;
    }

    try {
      const reviewData = {
        productId: id,
        userId: user ? user._id : "guest",
        userName: user ? user.name : "Anonymous",
        rating,
        text: newReview,
      };

      const config = user
        ? { headers: { Authorization: `Bearer ${user.token}` } }
        : {};

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/reviews/rew`, reviewData, config);
      setReviews([response.data, ...reviews]);
      setNewReview("");
      setRating(0);
      toast.success("Review submitted successfully!");
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(error.response?.data?.message || "Failed to submit review");
      if (error.response?.status === 401) {
        localStorage.removeItem("user");
        // navigate("/login");
      }
    }
  };

  // Add this function to handle review deletion
  const handleDeleteReview = async (reviewId) => {
    if (!user) {
      toast.error("You must be logged in to delete a review.");
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` }
      };

      await axios.delete(`${import.meta.env.VITE_API_URL}/api/reviews/${reviewId}`, config);
      setReviews(reviews.filter(review => review._id !== reviewId));
      toast.success("Review deleted successfully!");
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error(error.response?.data?.message || "Failed to delete review");
      if (error.response?.status === 401) {
        localStorage.removeItem("user");
        // navigate("/login");
      }
    }
  };

  const renderStars = (selectedStars, setFunction) => {
    return [...Array(5)].map((_, index) => (
      <span
        key={index}
        onClick={() => setFunction && setFunction(index + 1)}
        style={{
          cursor: setFunction ? "pointer" : "default",
          color: index < selectedStars ? "gold" : "gray",
          fontSize: "24px",
        }}
      >
        ★
      </span>
    ));
  };

  if (loading) return <p className="loading">Loading product details...</p>;
  if (!product) return <p className="error">Product not found.</p>;

  const discountedPrice = (product.price - (product.price * (product.discount / 100))).toFixed(2);
  const averageRating = calculateAverageRating();

  return (
    <div className="product-detail-container">
      <div className="product-main-section">
        <div className="product-image-section">
          <img
            src={product.image}
            alt={product.name}
            className="product-image"
          />
        </div>
        <div className="product-info-section">
          <h2 className="product-name">{product.pname}</h2>
          
          {/* Rating display under product name */}
          <div className="product-rating-section">
            <div className="average-rating">
              {renderStars(averageRating, null)}
              <span className="rating-text">
                {averageRating} ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          </div>

          <p className="product-price">
            ₹{discountedPrice}
            {product.discount > 0 && (
              <span className="original-price">
                <del>₹{product.price}</del> {product.discount}% OFF
              </span>
            )}
          </p>
          
          <ul className="product-details">
            <li><strong>Category:</strong> {product.category || "N/A"}</li>
            <li><strong>Brand:</strong> {product.brand || "N/A"}</li>
            <li><strong>Offer Ends On:</strong> {product.offerEndDate ? new Date(product.offerEndDate).toLocaleDateString() : "N/A"}</li>
          </ul>
          
          <p className="product-description">{product.description}</p>
          
          <div className="product-actions">
            <button className="add-to-cart-btn" onClick={addToCart}>
              🛒 Add to Cart
            </button>
            <button className="buy-now-btn" onClick={handleBuyNow}>
              ⚡ Buy Now
            </button>
          </div>
        </div>
      </div>

      <h4 className="texx">Customer Reviews</h4>
      <div className="reviews-section">
        <div className="add-review-section">
          <h5>Add Your Review</h5>
          <div className="rating-input">
            {renderStars(rating, setRating)}
          </div>
          <textarea 
            className="review-textarea" 
            value={newReview} 
            onChange={(e) => setNewReview(e.target.value)} 
            rows={4} 
            placeholder="Write your review..."
          />
          <button className="submit-review-btn" onClick={handleReviewSubmit}>
            Submit Review
          </button>
        </div>
        
        <div className="customer-reviews-section">
          {reviews.length === 0 ? (
            <p className="no-reviews">No reviews yet. Be the first to review!</p>
          ) : (
            reviews.map(review => (
              <div key={review._id} className="review-item">
                <div className="review-header">
                  <div className="review-rating">
                    {renderStars(review.rating, null)}
                  </div>
                  <div className="review-meta">
                    <span className="review-author">{review.userName || "Anonymous"}</span>
                    <span className="review-date">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {/* Add delete button - only show if current user is the review author */}
                  {user && user._id === review.userId && (
                    <button 
                      className="delete-review-btn" 
                      onClick={() => handleDeleteReview(review._id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
                <p className="review-text">{review.text}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;