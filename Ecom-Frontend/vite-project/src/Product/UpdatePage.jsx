import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./UpdatePage.css";


const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    brand: "",
    discount: "",
    offerEndDate: "",
    image: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProduct();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:4000/api/products/prod/${id}`);
      console.log("API Response:", response.data);

      if (response.data && typeof response.data === "object") {
        setProduct({
          pname: response.data.pname || "",
          price: response.data.price || "",
          category: response.data.category || "",
          description: response.data.description || "",
          brand: response.data.brand || "",
          discount: response.data.discount || "",
          offerEndDate: response.data.offerEndDate || "",
          image: response.data.image || "",
        });
      } else {
        toast.error("Invalid product data received!", { autoClose: 2000 });
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error(`Error: ${error.response?.data?.message || error.message}`, { autoClose: 2000 });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      console.log("Submitting update for:", id);

      const formData = new FormData();
      Object.entries(product).forEach(([key, value]) => {
        formData.append(key, value);
      });
      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      const response = await axios.put(`http://localhost:4000/api/products/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Update Response:", response.data);
      toast.success("Product updated successfully!", { autoClose: 2000 });

      setTimeout(() => {
        navigate("/ProductManagement");
      }, 2000); // Wait for toast before navigating
    } catch (error) {
      console.error("Update error:", error);
      toast.error(`Error: ${error.response?.data?.message || error.message}`, { autoClose: 2000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="update1">
        <h2 className="ghh">Update Product</h2>
        <p>Product ID: {id}</p>
        {loading && <p>Loading...</p>}
        <form onSubmit={handleSubmit}>
          {Object.entries(product).map(([key, value]) => (
            key !== "image" && (
              <div className="div4" key={key}>
                <input
                  type={key === "price" || key === "discount" ? "number" : key === "offerEndDate" ? "date" : "text"}
                  className="mon1"
                  name={key}
                  placeholder={`Enter your ${key}..`}
                  value={value}
                  onChange={handleChange}
                  required
                />
              </div>
            )
          ))}

          <div className="div4">
            <label className="lb2">Current Image:</label>
            {product.image && (
              <img src={`http://localhost:4000/uploads/${product.image}`} alt="Product" width="100" />
            )}
          </div>

          <div className="div4">
            <label>Change Image:</label>
            <input className="mon1" type="file" name="image" onChange={handleFileChange} />
          </div>

          <button className="btq" type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Product"}
          </button>
        </form>
      </div>
    </>
  );
};

export default UpdateProduct;
