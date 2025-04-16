import { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Container, Table, Button, Spinner, Form, InputGroup } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';

function ClientProduct() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchProductData();
    }, []);

    useEffect(() => {
        // Filter products whenever searchTerm or products change
        const filtered = products.filter(product => 
            product.pname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.price.toString().includes(searchTerm) ||
            product.discount.toString().includes(searchTerm) ||
            product.finalPrice.toString().includes(searchTerm)
        );
        setFilteredProducts(filtered);
    }, [searchTerm, products]);

    const fetchProductData = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:4000/api/products/prod");
            console.log("API Response:", response.data);
            setProducts(response.data || []);
            setFilteredProducts(response.data || []);
        } catch (error) {
            console.error('Error fetching product data:', error.response?.data || error.message);
            toast.error('Failed to fetch product data');
        }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:4000/api/products/${id}`);
            fetchProductData();
            toast.success('Product deleted successfully');
        } catch (error) {
            console.error('Error deleting product:', error.response?.data || error.message);
            toast.error('Failed to delete product');
        }
    };

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

            <Container className="mt-4">
                <h1 className="text-center mb-4">Product Details</h1>
                
                {/* Search Bar */}
                <div className="mb-4">
                    <InputGroup>
                        <Form.Control
                            placeholder="Search by name, price, discount..."
                            aria-label="Search products"
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
                        <p>Loading products...</p>
                    </div>
                ) : (
                    <Table striped bordered hover responsive>
                        <thead className="table-dark">
                            <tr>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Discount</th>
                                <th>Final Price</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map((product) => (
                                    <tr key={product._id}>
                                        <td>{product.pname}</td>
                                        <td>₹{product.price}</td>
                                        <td>{product.discount}%</td>
                                        <td>₹{product.finalPrice}</td>
                                        <td>
                                            <Button 
                                                variant="danger" 
                                                size="sm" 
                                                onClick={() => handleDelete(product._id)}
                                            >
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center">
                                        {searchTerm ? 'No matching products found' : 'No products found'}
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

export default ClientProduct;