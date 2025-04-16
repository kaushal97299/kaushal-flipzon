import React, { useState, useRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AddProduct.css";

const categories = [
  "Electronics",
  "Fashion",
  "Beauty & Personal Care",
  "Home & Living",
  "Toys & Games",
  "Sports & Outdoors",
  "Food & Beverages",
  "Books, Movies & Music",
  "Health & Fitness",
  "Office Supplies",
  "Technology",
  "Mobile",        
  "Earphones",     
];

const ProductForm = () => {
  const [formData, setFormData] = useState({
    pname: "",
    price: "",
    category: "",
    description: "",
    brand: "",
    discount: "",
    offerEndDate: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const calculateFinalPrice = () => {
    const price = parseFloat(formData.price) || 0;
    const discount = parseFloat(formData.discount) || 0;
    return (price - (price * discount) / 100).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.image) {
      toast.error("Please select an image!");
      return;
    }

    const data = new FormData();
    data.append("pname", formData.pname);
    data.append("price", formData.price);
    data.append("category", formData.category);
    data.append("description", formData.description);
    data.append("brand", formData.brand);
    data.append("discount", formData.discount);
    data.append("offerEndDate", formData.offerEndDate);
    data.append("image", formData.image);

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:4000/api/products/add", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(response.data.message || "Product added successfully!");

      setFormData({
        pname: "",
        price: "",
        category: "",
        description: "",
        brand: "",
        discount: "",
        offerEndDate: "",
        image: null,
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Axios Error:", error);

      if (error.response) {
        toast.error(`Error: ${error.response.data.message || "Something went wrong"}`);
      } else if (error.request) {
        toast.error("No response from server. Check API connection.");
      } else {
        toast.error("Request setup error.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="die2">
      <h2 className="pro">Add Product</h2>
      <ToastContainer position="top-right" autoClose={3000} />
      <form onSubmit={handleSubmit}>
        <input
          className="inpp"
          type="text"
          name="pname"
          placeholder="Product Name"
          value={formData.pname}
          onChange={handleChange}
          required
        />

        <input
          className="inpp"
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
        />

        <select
          className="inpp"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="" disabled>Select Category</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <textarea
          className="inpp"
          name="description"
          placeholder="Enter Product Description"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <input
          className="inpp"
          type="text"
          name="brand"
          placeholder="Enter Brand"
          value={formData.brand}
          onChange={handleChange}
          required
        />

        <input
          className="inpp"
          type="number"
          name="discount"
          placeholder="Enter Discount Percentage"
          value={formData.discount}
          onChange={handleChange}
          required
        />

        <input
          className="inpp"
          type="text"
          name="finalPrice"
          placeholder="Final Price"
          value={calculateFinalPrice()}
          readOnly
        />

        <input
          className="inpp"
          type="date"
          name="offerEndDate"
          placeholder="Offer End Date"
          value={formData.offerEndDate}
          onChange={handleChange}
          required
        />

        <input
          className="inpp"
          type="file"
          name="image"
          onChange={handleChange}
          ref={fileInputRef}
          required
        />

        <button className="buut" type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
