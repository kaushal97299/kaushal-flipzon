import { useState } from "react";
import { Link ,useNavigate } from "react-router-dom";
import { Navbar, Nav, Button, Dropdown, Container } from "react-bootstrap";
import { FaUser, FaBars, FaTimes, FaBox, FaClipboardList, FaUsers, FaImages } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
// import { useNavigate } from "react-router-dom";
import "./adminNavbar.css"; // Import the CSS file

const AdminNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")) || null);
   const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.reload(); // Reload the page to reflect the new user state
    navigate("/Adminlogin"); // Redirect to login page
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="admin-navbar">
      <Container fluid>
        {/* Brand / Logo */}
        <Navbar.Brand as={Link} to="/">
          Admin Panel
        </Navbar.Brand>

        {/* Navbar Toggle for Mobile */}
        <Button 
          variant="outline-light" 
          onClick={() => setIsMenuOpen(!isMenuOpen)} 
          className="d-lg-none navbar-toggler"
          aria-label="Toggle navigation"
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </Button>

        {/* Center - Navigation Menu */}
        <Navbar.Collapse className={`${isMenuOpen ? "show" : ""}`}>
          <Nav className="mx-auto">
            <Nav.Link as={Link} to="/AdminUser">
              <FaClipboardList className="nav-icon" /> Users
            </Nav.Link>
            <Nav.Link as={Link} to="/Orderdet">
              <FaClipboardList className="nav-icon" /> Orders
            </Nav.Link>
            <Nav.Link as={Link} to="/ClientProduct">
              <FaBox className="nav-icon" /> Products
            </Nav.Link>
            <Nav.Link as={Link} to="/AdminContacts">
              <FaUsers className="nav-icon" /> Contacts
            </Nav.Link>
            <Nav.Link as={Link} to="/CarouselUploader">
              <FaImages className="nav-icon" /> Carousel
            </Nav.Link>
          </Nav>

          {/* Right Section - User Account Dropdown/Login */}
          <div className="d-flex align-items-center">
            {user ? (
              <Dropdown className="user-dropdown" align="end">
                <Dropdown.Toggle variant="light" id="dropdown-basic">
                  {user.name}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/ProfileAdmin">Profile</Dropdown.Item>
                  <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <Button as={Link} to="/AdminSignup" variant="outline-light" className="login-btn">
                <FaUser />
              </Button>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AdminNavbar;