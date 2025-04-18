import { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { cartContext } from "./Cart/CartContext";
import { FaShoppingCart, FaUser, FaBars, FaTimes, FaHeart, FaSearch } from "react-icons/fa";
import Dropdown from "react-bootstrap/Dropdown";
import { jwtDecode } from "jwt-decode";
import "./Navbar.css";

const Navbar1 = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { cart } = useContext(cartContext);

  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const favoritesCount = Array.isArray(favorites)
    ? favorites.length
    : Object.keys(favorites).length;

  // ✅ Token check and auto-logout
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (userData) {
      setUser(JSON.parse(userData));
    }

    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("✅ Decoded token:", decoded);

        const currentTime = Math.floor(Date.now() / 1000);
        const timeUntilExpiry = decoded.exp - currentTime;

        if (timeUntilExpiry <= 0) {
          console.log("⛔ Token already expired");
          handleLogout();
        } else {
          console.log(`⏳ Token will expire in ${timeUntilExpiry} seconds`);
          const timeoutId = setTimeout(() => {
            console.log("🔒 Token expired, logging out");
            handleLogout();
          }, (timeUntilExpiry-currentTime) * 1000);
          

          return () => clearTimeout(timeoutId);
        }
      } catch (err) {
        console.error("❌ Invalid token:", err);
        handleLogout();
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (location.pathname === "/ProductCardList") {
      const searchParams = new URLSearchParams(location.search);
      const query = searchParams.get("search") || "";
      setSearchQuery(query);
    }
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      const currentParams = new URLSearchParams(location.search);
      if (
        location.pathname !== "/ProductCardList" ||
        currentParams.get("search") !== trimmedQuery
      ) {
        navigate(`/ProductCardList?search=${encodeURIComponent(trimmedQuery)}`);
      }
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="navb" role="navigation">
      <div className="contat">
        <Link className="navbar-brand" to="/" onClick={() => setIsMenuOpen(false)}>
          Flipzon
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          aria-label="Toggle navigation"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <div className={`navbar-collapse ${isMenuOpen ? "show" : ""}`}>
          <ul className="nav-ul">
            <li className="itemm">
              <Link className="nav-link" to="/" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
            </li>
            <li className="itemm">
              <Link className="nav-link" to="/about" onClick={() => setIsMenuOpen(false)}>
                About
              </Link>
            </li>
            <li className="itemm">
              <Link className="nav-link" to="/ProductCardList" onClick={() => setIsMenuOpen(false)}>
                All Products
              </Link>
            </li>
          </ul>

          <form
            className={`searchbar ${isSearchFocused ? "focused" : ""}`}
            onSubmit={handleSearch}
          >
            <input
              className="searchinput"
              type="search"
              placeholder="Search Products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={(e) => {
                e.target.select();
                setIsSearchFocused(true);
              }}
              onBlur={() => setIsSearchFocused(false)}
              aria-label="Search products"
            />
            <button className="buttonserch" type="submit" aria-label="Search">
              <FaSearch />
            </button>
          </form>

          <ul className="nav-ul dropdownkimks">
            <li className="itemm likeofnav">
              <Link
                className="nav-link"
                to="/favorites"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Favorites"
              >
                <FaHeart size={18} style={{ color: "red", marginRight: "5px" }} />
                {favoritesCount > 0 && (
                  <span className="badge">{favoritesCount}</span>
                )}
              </Link>
            </li>

            <li className="itemm cartofnav">
              <Link
                className="nav-link"
                to="/cart"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Cart"
              >
                <FaShoppingCart size={20} />
                {cart.length > 0 && (
                  <span className="badge">{cart.length}</span>
                )}
              </Link>
            </li>

            <li className="nav-item">
              {user ? (
                <Dropdown>
                  <Dropdown.Toggle className="dropdown-toggle">
                    <FaUser className="me-1" /> Hey, {user.name || "User"}
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="dropdown-menu">
                    <Dropdown.Item
                      as={Link}
                      to="/profile"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile
                    </Dropdown.Item>
                    <Dropdown.Item onClick={handleLogout}>
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <Link
                  className="nav-link"
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaUser size={20} className="me-1" /> Account
                </Link>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar1;
