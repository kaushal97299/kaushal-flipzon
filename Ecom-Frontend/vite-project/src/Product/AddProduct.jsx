import React, { useState, useRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AddProduct.css";

// Categories with Subcategories
const categoryOptions = {
  Electronics: ["Laptops", "Cameras", "Televisions", "Accessories"],
  Fashion: ["Men", "Women", "Kids"],
  "Beauty & Personal Care": ["Makeup", "Skincare", "Hair Care"],
  "Home & Living": ["Furniture", "Decor", "Kitchen"],
  "Toys & Games": ["Action Figures", "Board Games"],
  "Sports & Outdoors": ["Fitness Equipment", "Outdoor Gear"],
  "Food & Beverages": ["Snacks", "Beverages"],
  "Books, Movies & Music": ["Books", "Movies", "Music"],
  "Health & Fitness": ["Supplements", "Yoga", "Medical Devices"],
  "Office Supplies": ["Stationery", "Printers", "Chairs"],
  Technology: ["Smart Home", "Wearables"],
  Mobile: ["Smartphones", "Tablets"],
  Earphones: ["Wired", "Wireless"],
};

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

  const [subcategory, setSubcategory] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else if (name === "category") {
      setFormData({ ...formData, category: value });
      setSubcategory(""); // Reset subcategory when category changes
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const calculateFinalPrice = () => {
    const price = parseFloat(formData.price) || 0;
    const discount = parseFloat(formData.discount) || 0;
    return (price - (price * discount) / 100).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Product name validation
    if (!formData.pname.trim()) {
      toast.error("Product name is required!");
      return;
    }

    // Price validation
    if (!formData.price || parseFloat(formData.price) < 110) {
      toast.error("Price must be at least ₹110!");
      return;
    }

    // Category validation
    if (!formData.category) {
      toast.error("Please select a category!");
      return;
    }

    // Subcategory validation
    if (!subcategory) {
      toast.error("Please select a subcategory!");
      return;
    }

    // Description validation
    if (!formData.description.trim() || formData.description.length < 10) {
      toast.error("Description must be at least 10 characters!");
      return;
    }

    // Brand validation
    if (!formData.brand.trim()) {
      toast.error("Brand is required!");
      return;
    }

    // Discount validation
    const discountValue = parseFloat(formData.discount);
    if (
      formData.discount === "" ||
      isNaN(discountValue) ||
      discountValue < 5 ||
      discountValue > 100
    ) {
      toast.error("Discount must be at least 5% and no more than 100%!");
      return;
    }

    // Offer End Date validation
    if (!formData.offerEndDate) {
      toast.error("Please select offer end date!");
      return;
    }
    const offerEnd = new Date(formData.offerEndDate);
    const today = new Date();
    if (offerEnd < today) {
      toast.error("Offer end date cannot be in the past!");
      return;
    }

    // Image validation
    if (!formData.image) {
      toast.error("Please select an image!");
      return;
    }

    const data = new FormData();
    data.append("userId", userId);
    data.append("pname", formData.pname);
    data.append("price", formData.price);
    data.append("category", formData.category);
    data.append("subcategory", subcategory);
    data.append("description", formData.description);
    data.append("brand", formData.brand);
    data.append("discount", formData.discount);
    data.append("offerEndDate", formData.offerEndDate);
    data.append("image", formData.image);

    try {
      const token = localStorage.getItem("token");
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/products/add`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
      setSubcategory("");

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
          {Object.keys(categoryOptions).map((cat, index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {formData.category && (
          <select
            className="inpp"
            name="subcategory"
            value={subcategory}
            onChange={(e) => setSubcategory(e.target.value)}
            required
          >
            <option value="" disabled>Select Subcategory</option>
            {categoryOptions[formData.category].map((sub, index) => (
              <option key={index} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        )}

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
