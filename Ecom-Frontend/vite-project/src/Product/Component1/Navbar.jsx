import { useState, useEffect } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { FaUser, FaBars, FaTimes, FaSearch } from "react-icons/fa";
import "./Navbar.css";

function Navb() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")) || null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync user state with localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      setUser(JSON.parse(localStorage.getItem("user")) || null);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
    setIsDropdownOpen(false);
    setIsSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setIsSidebarOpen(false);
    }
  };

  return (
    <>
      <nav className="navv">
        <div className="navrow">
          {/* Mobile Menu Toggle */}
          <button className="menu-toggle" onClick={toggleSidebar}>
            {isSidebarOpen ? <FaTimes /> : <FaBars />}
          </button>

          {/* Brand */}
          <Link className="brand" to="/">Client</Link>


          {/* Navigation Links - Desktop */}
          <ul className="linkks">
            <li><NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>Home</NavLink></li>
            <li><NavLink to="/ProductForm" className={({ isActive }) => isActive ? "active" : ""}>Add Product</NavLink></li>
            <li><NavLink to="/ProductManagement" className={({ isActive }) => isActive ? "active" : ""}>Data Show</NavLink></li>
            <li><NavLink to="/ProductReviewTable" className={({ isActive }) => isActive ? "active" : ""}>Reviews</NavLink></li>
          </ul>

          {/* Search Bar - Desktop */}
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

          {/* User Dropdown - Desktop */}
          <div className="user-se">
            {user ? (
              <div className="dropdown">
                <button 
                  className="dropdown-toggle" 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <FaUser /> {user.name.split(' ')[0]}
                </button>
                <ul className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`}>
                  <li><Link to="/ProfileClient" onClick={() => setIsDropdownOpen(false)}>Profile</Link></li>
                  <li><button onClick={handleLogout}>Logout</button></li>
                </ul>
              </div>
            ) : (
              <Link className="account-btn" to="/login">
                <FaUser /> Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <ul className="linkks">
          <li><NavLink to="/" className={({ isActive }) => isActive ? "active" : ""} onClick={toggleSidebar}>Home</NavLink></li>
          <li><NavLink to="/ProductForm" className={({ isActive }) => isActive ? "active" : ""} onClick={toggleSidebar}>Add Product</NavLink></li>
          <li><NavLink to="/ProductManagement" className={({ isActive }) => isActive ? "active" : ""} onClick={toggleSidebar}>Data Show</NavLink></li>
          <li><NavLink to="ReviewTable" className={({ isActive }) => isActive ? "active" : ""} onClick={toggleSidebar}>Reviews</NavLink></li>
        </ul>

        <form className="search-bar" onSubmit={handleSearch}>
          <input 
            type="text" 
            placeholder="Search..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="bbt">
            <FaSearch /> Search
          </button>
        </form>

        <div className="user-se">
          {user ? (
            <div className="dropdown">
              <button 
                className="dropdown-toggle" 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <FaUser /> {user.name.split(' ')[0]}
              </button>
              <ul className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`}>
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

      {/* Overlay */}
      <div className={`overlay ${isSidebarOpen ? 'open' : ''}`} onClick={toggleSidebar} />
    </>
  );
}

export default Navb;
