import React, { useState, useEffect } from "react";
import "./About.css";
import { FaUsers, FaShoppingCart, FaGlobe } from "react-icons/fa";
const About = () => {
  const [customers, setCustomers] = useState(0);
  const [products, setProducts] = useState(0);
  const [countries, setCountries] = useState(0);

  useEffect(() => {
    let interval = setInterval(() => {
      setCustomers((prev) => (prev < 1000 ? prev + 50 : 1000));
      setProducts((prev) => (prev < 300 ? prev + 20 : 300));
      setCountries((prev) => (prev < 60 ? prev + 1 : 60));
    }, 50);
    
    return () => clearInterval(interval);
  }, []);

  return (<>
    <div className="about-container">
      
      <section className="hero">
        <div className="hero-overlay">
          <h1>About Us</h1>
          <p>Bringing you the best shopping experience since 2024</p>
        </div>
      </section>

    
      <section className="story">
        <h2>Who We Are</h2>
        <p>
          Welcome to *MyShopify*, your trusted online marketplace! We started
          with a vision to make quality products accessible to everyone.
        </p>
        <div className="stats">
          <div className="stat">
            <FaUsers className="icon" />
            <h3>{customers}+</h3>
            <p>Happy Customers</p>
          </div>
          <div className="stat">
            <FaShoppingCart className="icon" />
            <h3>{products}+</h3>
            <p>Products Available</p>
          </div>
          <div className="stat">
            <FaGlobe className="icon" />
            <h3>{countries}+</h3>
            <p>Countries Served</p>
          </div>
        </div>
      </section>

   
      <section className="mission-vision">
        <div className="mission">
          <h2>Our Mission</h2>
          <p>To provide high-quality products with an unbeatable shopping experience.</p>
        </div>
        <div className="vision">
          <h2>Our Vision</h2>
          <p>To become the global leader in e-commerce and customer satisfaction.</p>
        </div>
      </section>

     
      <section className="team">
        <h2>Meet Our Team</h2>
        <div className="team-grid">
          <div className="team-member">
            <div className="flip-card">
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <img src="/src/image/kaushal.jpg" alt="Kaushal" />
                  <h3>Kaushal</h3>
                </div>
                <div className="flip-card-back">
                  <p>Owner</p>
                  <p>Visionary leader in e-commerce.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="team-member">
            <div className="flip-card">
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <img src="/src/image/images.png" alt="Amit Kumar" />
                  <h3>Amit Kumar</h3>
                </div>
                <div className="flip-card-back">
                  <p>Head of Operations</p>
                  <p>Ensuring smooth business flow.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default About;