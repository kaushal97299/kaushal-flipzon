import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import { Table, Button, Container, Spinner, Image } from "react-bootstrap";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {

      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/prod/${userId}` , {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.data && Array.isArray(response.data)) {
        setProducts(response.data);
      } else {
        toast.error("Invalid product data received!");
      }
    } catch (error) {
      toast.error(`Error fetching products: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      setLoading(true);
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/products/${id}` , {
        headers : {
          Authorization: `Bearer ${token}`,
        }
      });
      toast.success("Product deleted successfully!");
      fetchProducts();
    } catch (error) {
      toast.error(`Error deleting product: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-center mb-4">Product List</h2>
      {loading && (
        <div className="text-center my-3">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}
      <Table striped bordered hover responsive className="text-center">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Description</th>
            <th>Brand</th>
            <th>Discount</th>
            <th>Final Price</th>
            <th>Offer End Date</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product, i) => (
              <tr key={product._id || i}>
                <td>{i + 1}</td>
                <td>{product.pname || "N/A"}</td>
                <td>₹{product.price || "0.00"}</td>
                <td>{product.category || "N/A"}</td>
                <td>{product.description || "No Description"}</td>
                <td>{product.brand || "N/A"}</td>
                <td>{product.discount || "0%"}</td>
                <td>₹{(product.price - (product.price * (product.discount || 0)) / 100).toFixed(2)}</td>
                <td title={product.offerEndDate ? new Date(product.offerEndDate).toLocaleString() : "N/A"}>
                  {product.offerEndDate ? dayjs(product.offerEndDate).fromNow() : "N/A"}
                </td>
                <td>
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      thumbnail
                      width={50}
                    />
                  ) : (
                    <p>No Image</p>
                  )}
                </td>
                <td>
                  <Link to={`/updatePage/${product._id}`}>
                    <Button variant="warning" size="sm" className="me-2">
                      Update
                    </Button>
                  </Link>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(product._id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="11">No products available</td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default ProductManagement;
