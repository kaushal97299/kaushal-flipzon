import { useState, useEffect } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { FaUser, FaBars, FaTimes, FaSearch } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import "./Navbar.css";

function Navb() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")) || null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsDropdownOpen(false);
    setIsSidebarOpen(false);
    window.location.reload(); 
    navigate("/login");
   
  };

  // Token expiry handling
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);
        const timeUntilExpiry = decoded.exp - currentTime;

        if (timeUntilExpiry <= 0) {
          handleLogout();
        } else {
          const timeoutId = setTimeout(() => {
            handleLogout();
          }, timeUntilExpiry * 1000);
          return () => clearTimeout(timeoutId);
        }
      } catch (err) {
        console.error("❌ Invalid token:", err);
        handleLogout();
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown")) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sync user with localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      setUser(JSON.parse(localStorage.getItem("user")) || null);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsSidebarOpen(false);
    }
  };

  return (
    <>
      <nav className="navv">
        <div className="navrow">
          <button className="menu-toggle" onClick={toggleSidebar}>
            {isSidebarOpen ? <FaTimes /> : <FaBars />}
          </button>

          <Link className="brand" to="/">Client</Link>

          <ul className="linkks">
            <li><NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>Home</NavLink></li>
            <li><NavLink to="/ProductForm" className={({ isActive }) => isActive ? "active" : ""}>Add Product</NavLink></li>
            <li><NavLink to="/ProductManagement" className={({ isActive }) => isActive ? "active" : ""}>Data Show</NavLink></li>
            <li><NavLink to="/ProductReviewTable" className={({ isActive }) => isActive ? "active" : ""}>Reviews</NavLink></li>
          </ul>

          <form className="search-bar" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="bbt">
              <FaSearch />
            </button>
          </form>

          <div className="user-se">
            {user ? (
              <div className="dropdown">
                <button className="dropdown-toggle" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                  <FaUser /> {user.name?.split(" ")[0]}
                </button>
                <ul className={`dropdown-menu ${isDropdownOpen ? "show" : ""}`}>
                  <li><Link to="/ProfileClient" onClick={() => setIsDropdownOpen(false)}>Profile</Link></li>
                  <li><button onClick={handleLogout}>Logout</button></li>
                </ul>
              </div>
            ) : (
              <Link className="account-btn" to="/login"><FaUser /> Login</Link>
            )}
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <ul className="linkks">
          <li><NavLink to="/" onClick={toggleSidebar}>Home</NavLink></li>
          <li><NavLink to="/ProductForm" onClick={toggleSidebar}>Add Product</NavLink></li>
          <li><NavLink to="/ProductManagement" onClick={toggleSidebar}>Data Show</NavLink></li>
          <li><NavLink to="/ProductReviewTable" onClick={toggleSidebar}>Reviews</NavLink></li>
        </ul>

        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="bbt"><FaSearch /> Search</button>
        </form>

        <div className="user-se">
          {user ? (
            <div className="dropdown">
              <button className="dropdown-toggle" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                <FaUser /> {user.name?.split(" ")[0]}
              </button>
              <ul className={`dropdown-menu ${isDropdownOpen ? "show" : ""}`}>
                <li><Link to="/ProfileClient" onClick={() => { setIsDropdownOpen(false); toggleSidebar(); }}>Profile</Link></li>
                <li><button onClick={handleLogout}>Logout</button></li>
              </ul>
            </div>
          ) : (
            <Link className="account-btn" to="/login" onClick={toggleSidebar}>
              <FaUser /> Login
            </Link>
          )}
        </div>
      </div>

      <div className={`overlay ${isSidebarOpen ? "open" : ""}`} onClick={toggleSidebar} />
    </>
  );
}

export default Navb;
