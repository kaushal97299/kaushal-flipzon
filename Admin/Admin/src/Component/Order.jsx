import { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Container, Table, Button, Spinner, FormControl, InputGroup } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';

function Orderdet() {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchOrderData();
    }, []);

    useEffect(() => {
        const filtered = orders.filter(order =>
            order.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.phone?.includes(searchTerm)
        );
        setFilteredOrders(filtered);
    }, [searchTerm, orders]);

    const fetchOrderData = async () => {
        setLoading(true);
        try {
            const response = await axios.get("https://kaushal-flipzon.onrender.com/api/orders/Orders");
            setOrders(response.data || []);
            setFilteredOrders(response.data || []);
        } catch (error) {
            console.error('Error fetching order data:', error.response?.data || error.message);
            toast.error('Failed to fetch order data');
        }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://kaushal-flipzon.onrender.com/api/orders/${id}`);
            fetchOrderData();
            toast.success('Order deleted successfully');
        } catch (error) {
            console.error('Error deleting order:', error.response?.data || error.message);
            toast.error('Failed to delete order');
        }
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleString(); // Shows both date and time
    };

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

            <Container className="mt-4">
                <h1 className="text-center mb-4">Order Details</h1>

                {/* Search Bar */}
                <div className="mb-4">
                    <InputGroup>
                        <FormControl
                            placeholder="Search by name, address, or phone..."
                            aria-label="Search orders"
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
                        <p>Loading orders...</p>
                    </div>
                ) : (
                    <Table striped bordered hover responsive>
                        <thead className="table-dark">
                            <tr><th>userId</th>
                                <th>Name</th>
                                <th>Address</th>
                                <th>Mobile</th>
                                <th>productid</th>
                                <th>Product</th>
                                <th>Price</th>
                                <th>Discount</th>
                                <th>Image</th>
                                <th>Razorpay Order ID</th>
                                <th>Payment ID</th>
                                <th>Order Time</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.length > 0 ? (
                                filteredOrders.map((order) => (
                                    <tr key={order._id}>
                                        <td>{order.userId || '-'}</td>
                                        <td>{order.name}</td>
                                        <td>{order.address}</td>
                                        <td>{order.phone}</td>
                                        <td>{order.product?._id}</td>
                                        <td>{order.product?.pname}</td>
                                        <td>₹{order.product?.finalPrice}</td>
                                        <td>{order.product?.discount}%</td>
                                        <td>
                                            <img
                                                src={order.product?.image}
                                                alt="Product"
                                                width="60"
                                                height="60"
                                                style={{ objectFit: 'cover', borderRadius: '8px' }}
                                            />
                                        </td>
                                        <td>{order.razorpayOrderId || '-'}</td>
                                        <td>{order.razorpayPaymentId || '-'}</td>
                                        <td>{order.orderTime ? formatDate(order.orderTime) : '-'}</td>
                                        <td>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => handleDelete(order._id)}
                                            >
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="11" className="text-center">
                                        {searchTerm ? 'No matching orders found' : 'No orders found'}
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

export default Orderdet;
