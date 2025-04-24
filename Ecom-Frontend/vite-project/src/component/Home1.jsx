import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Home1.css";

const Home1 = () => {
  const [carouselImages, setCarouselImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  

  // Fetch Carousel Images from Backend
  useEffect(() => {
    const fetchCarouselImages = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/carousel/images`);
        setCarouselImages(response.data); // Array of image URLs
      } catch (error) {
        console.error("Error fetching carousel images:", error);
      }
    };

    fetchCarouselImages();
  }, []);

  // Fetch Product Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/prod` ,{
         
        });
        const products = response.data || [];
        const categoryMap = new Map();

        products.forEach((product) => {
          if (!categoryMap.has(product.category)) {
            categoryMap.set(product.category, product.image); // ✅ Cloudinary full URL
          }
        });

        setCategories([...categoryMap.entries()]);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <>
      {/* Carousel Section */}
      <div id="carouselExampleAutoplaying" className="carousel slide " data-bs-ride="carousel">
        <div className="carousel-inner">
          {carouselImages.length === 0 ? (
            <div className="carousel-item active">
              <img
                src="/src/image/default.jpg"
                className="d-block w-100 carousel-img"
                alt="Default"
              />
            </div>
          ) : (
            carouselImages.map((image, index) => (
              <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
                <img src={image} className="d-block w-100 carousel-img" alt={`carousel-${index}`} />
              </div>
            ))
          )}
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleAutoplaying"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleAutoplaying"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      {/* Category Section */}
      <div className="category-container">
        <h3 className="category-title">Categories</h3>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="category-grid">
            {categories.map(([category, image]) => (
              <div
                key={category}
                className="category-item"
                onClick={() => navigate(`/ProductCardList`)}
              >
                <img
                  src={image} // ✅ Use Cloudinary full URL directly
                  alt={category}
                  className="category-img"
                />
                <span className="category-name">{category}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Home1;
