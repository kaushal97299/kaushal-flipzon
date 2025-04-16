import { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Container, Table, Button, Spinner, Form, InputGroup } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';

function Rewiewproduct() {
    const [reviews, setReviews] = useState([]);
    const [filteredReviews, setFilteredReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchReviewData();
    }, []);

    useEffect(() => {
        const filtered = reviews.filter(review =>
            review.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            review.text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            review.rating?.toString().includes(searchTerm)
        );
        setFilteredReviews(filtered);
    }, [searchTerm, reviews]);

    const fetchReviewData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`https://kaushal-flipzon.onrender.com/api/reviews/rewss`);
            setReviews(response.data || []);
            setFilteredReviews(response.data || []);
        } catch (error) {
            console.error('Error fetching review data:', error.response?.data || error.message);
            toast.error('Failed to fetch review data');
        }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://kaushal-flipzon.onrender.com/api/reviews/${id}`);
            fetchReviewData();
            toast.success('Review deleted successfully');
        } catch (error) {
            console.error('Error deleting review:', error.response?.data || error.message);
            toast.error('Failed to delete review');
        }
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleString();
    };

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

            <Container className="mt-4">
                <h1 className="text-center mb-4">Product Reviews</h1>

                {/* Search Bar */}
                <div className="mb-4">
                    <InputGroup>
                        <Form.Control
                            placeholder="Search by username, review text, or rating..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Button variant="outline-secondary">
                            <FaSearch />
                        </Button>
                    </InputGroup>
                </div>

                {loading ? (
                    <div className="text-center">
                        <Spinner animation="border" variant="primary" />
                        <p>Loading reviews...</p>
                    </div>
                ) : (
                    <Table striped bordered hover responsive>
                        <thead className="table-dark">
                            <tr>
                                <th>User Name</th>
                                <th>Rating</th>
                                <th>Review</th>
                                <th>Submitted On</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredReviews.length > 0 ? (
                                filteredReviews.map((review) => (
                                    <tr key={review._id}>
                                        <td>{review.userName}</td>
                                        <td>{review.rating} ★</td>
                                        <td>{review.text}</td>
                                        <td>{formatDate(review.createdAt)}</td>
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
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center">
                                        {searchTerm ? 'No matching reviews found' : 'No reviews found'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                )}
            </Container>
        </>
    );
}

export default Rewiewproduct;
