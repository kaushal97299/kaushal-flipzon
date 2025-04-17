import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import "./Home.css";

const ProductCardList = ({ newProduct }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem("favorites")) || {});
  const [sortOrder, setSortOrder] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [productRatings, setProductRatings] = useState({});
  const productsPerPage = 9;

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("https://kaushal-flipzon.onrender.com/api/products/prod");
        setProducts(response.data);
        fetchAllProductRatings(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const fetchAllProductRatings = async (products) => {
    const ratings = {};
    try {
      for (const product of products) {
        const response = await axios.get(`https://kaushal-flipzon.onrender.com/api/reviews/rew/${product._id}`);
        const reviews = response.data;
        if (reviews.length > 0) {
          const total = reviews.reduce((sum, review) => sum + review.rating, 0);
          ratings[product._id] = (total / reviews.length).toFixed(1);
        } else {
          ratings[product._id] = 0;
        }
      }
      setProductRatings(ratings);
    } catch (error) {
      console.error("Error fetching ratings:", error);
    }
  };

  useEffect(() => {
    if (newProduct) {
      setProducts((prev) => [...prev, newProduct]);
      fetchProductRating(newProduct._id);
    }
  }, [newProduct]);

  const fetchProductRating = async (productId) => {
    try {
      const response = await axios.get(`https://kaushal-flipzon.onrender.com/api/reviews/rew/${productId}`);
      const reviews = response.data;
      const total = reviews.reduce((sum, review) => sum + review.rating, 0);
      const average = (total / reviews.length).toFixed(1);
      setProductRatings((prev) => ({ ...prev, [productId]: average || 0 }));
    } catch (error) {
      console.error("Error fetching rating:", error);
    }
  };

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    const applyFilters = () => {
      let updated = [...products];

      if (selectedCategory !== "All") {
        updated = updated.filter(product => product.category === selectedCategory);
      }

      if (searchQuery) {
        updated = updated.filter(product =>
          product.pname.toLowerCase().includes(searchQuery)
        );
      }

      if (sortOrder) {
        updated.sort((a, b) => {
          const priceA = a.finalPrice ?? a.price;
          const priceB = b.finalPrice ?? b.price;
          return sortOrder === "lowToHigh" ? priceA - priceB : priceB - priceA;
        });
      }

      setFilteredProducts(updated);
      setCurrentPage(1);
    };

    applyFilters();
  }, [products, selectedCategory, searchQuery, sortOrder]);

  useEffect(() => {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [filteredProducts, currentPage]);

  const handleClearFilters = () => {
    setSelectedCategory("All");
    setSortOrder("");
    setFilteredProducts(products);
    setCurrentPage(1);
    window.history.replaceState({}, "", "/ProductCardList");
  };

  const categories = ["All", ...new Set(products.map((product) => product.category))];

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const toggleFavorite = (product) => {
    setFavorites((prev) => {
      const updated = { ...prev };
      if (updated[product._id]) delete updated[product._id];
      else updated[product._id] = product;
      return updated;
    });
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
      <div className="product-rating-stars">
        {[...Array(5)].map((_, i) =>
          i < fullStars ? (
            <span key={i} className="star filled">★</span>
          ) : i === fullStars && hasHalfStar ? (
            <span key={i} className="star half">★</span>
          ) : (
            <span key={i} className="star">★</span>
          )
        )}
        <span className="rating-text">({rating})</span>
      </div>
    );
  };

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="con">
      <div className="row">
        <div className="col-md-2 cat">
          <h4 className="categ">Categories</h4>
          <ul className="list1">
            {categories.map((category) => (
              <li
                key={category}
                className={`list-group-item ${selectedCategory === category ? "active" : ""}`}
                onClick={() => setSelectedCategory(category)}
                style={{ cursor: "pointer" }}
              >
                {category}
              </li>
            ))}
          </ul>
        </div>

        <div className="col-md-10 prodd">
          <h2 className="produ">Product List</h2>

          <div className="price3">
            <h5>Sort by Price:</h5>
            <select
              className="form-select w-auto"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="">Default</option>
              <option value="lowToHigh">Price: Low to High</option>
              <option value="highToLow">Price: High to Low</option>
            </select>
          </div>

          {(searchQuery || selectedCategory !== "All") && (
            <button
              className="btn btn-outline-secondary mb-3"
              onClick={handleClearFilters}
            >
              Clear Filters
            </button>
          )}

          <div className="row1">
            {currentProducts.length > 0 ? (
              currentProducts.map((product) => {
                const discountedPrice = product.finalPrice ?? product.price;
                const rating = productRatings[product._id] || 0;

                return (
                  <div key={product._id} className="claup">
                    <div className="card4">
                      <Link to={`/product/${product._id}`} state={{ product, user }} className="card-link">
                        <img
                          src={product.image}
                          alt={product.pname}
                          className="product-img"
                        />
                      </Link>
                      <div className="carbody">
                        <h5 className="carditle" title={product.pname}>{product.pname}</h5>
                        <div className="product-rating">{renderStars(rating)}</div>
                        <p className="cardext">
                          <span className="text-success fs-5">₹{discountedPrice}</span>
                          {product.discount > 0 && (
                            <span className="text-danger ms-2 fs-6">
                              <del>₹{product.price}</del> {product.discount}% OFF
                            </span>
                          )}
                        </p>
                        <p className="muted">Category: {product.category}</p>
                        <button className="favorite-btn" onClick={() => toggleFavorite(product)}>
                          {favorites[product._id] ? (
                            <FaHeart className="favorite-icon active" />
                          ) : (
                            <FaRegHeart className="favorite-icon" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-danger">No products found in this category.</p>
            )}
          </div>

          <div className="pagina">
            <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
              Previous
            </button>
            {[...Array(Math.ceil(filteredProducts.length / productsPerPage))].map((_, index) => (
              <button
                key={index}
                className={currentPage === index + 1 ? "active-page" : ""}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === Math.ceil(filteredProducts.length / productsPerPage)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardList;