import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Spinner, Container } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductReviewTable = ({ Id }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [Id]);

  const fetchReviews = async () => {
    if (!Id) return;
    setLoading(true);
    try {
      const res = await axios.get(`https://kaushal-flipzon.onrender.com/api/reviews/rew/${Id}`);
      setReviews(res.data);
    } catch (error) {
      toast.error('Failed to load reviews');
      console.error('Error:', error.response?.data || error.message);
    }
    setLoading(false);
  };

  const handleDelete = async (reviewId) => {
    try {
      await axios.delete(`https://kaushal-flipzon.onrender.com/api/reviews/rew/${reviewId}`);
      toast.success('Review deleted');
      fetchReviews();
    } catch (error) {
      toast.error('Failed to delete review');
      console.error('Error:', error.response?.data || error.message);
    }
  };

  return (
    <Container className="mt-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="mb-4 text-center">Product Reviews</h2>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>User</th>
              <th>Rating</th>
              <th>Review</th>
              <th>Created At</th>
              <th>Product ID</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {reviews.length > 0 ? (
              reviews.map((review) => {
                const userName = review.userId?.name || review.userName || 'Unknown';
                const createdAt = new Date(review.createdAt).toLocaleString();
                const productId = review.productId || 'N/A';  // Assuming `productId` is passed directly

                return (
                  <tr key={review._id}>
                    <td>{userName}</td>
                    <td>{review.rating}</td>
                    <td>{review.text}</td>
                    <td>{createdAt}</td>
                    <td>{productId}</td>
                    <td>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(review._id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  No reviews found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default ProductReviewTable;
