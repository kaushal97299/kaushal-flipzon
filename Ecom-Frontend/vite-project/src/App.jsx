import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./Auther/Signup";
import Login from "./Auther/Login";
// import Navbar from "./component/Navbar";
import ProductCardList from "./component/Home";
import About from "./component/About";
import ProductForm from "./Product/AddProduct";
import Nav from "./Product/Component1/Navbar";
import ProductManagement from "./Product/ProductShow";
import UpdateProduct from "./Product/UpdatePage";
import ProductDetail from "./Product/ProductDetails";
import Favorites from "./component/Favorite";
import Cart from "./component/Cart/ProductCart";
import BuyNow from "./component/Cart/BuyNow";
import Profile from "./component/Profile";
import { Navigate } from "react-router-dom";
import Footer from "./Footer/Footers";
import PrivacyPolicy from "./Footer/Policy";
import Navbar1 from "./component/Navbar";
import ProfileClient from "./Product/Component1/ProfileClent";
import Navb from "./Product/Component1/Navbar";
import OwnerHomePage from "./Product/Component1/OwnerHome";
import Home1 from "./component/Home1";
import ContactUs from "./Product/ContactUs";
import ProductReviewTable from "./Product/Component1/Reviewcount";
// import ReviewTable from "./Product/Component1/Reviewcount";




function App() {
  const isAuthenticated = !!localStorage.getItem("token");
  let { role } = JSON.parse(localStorage.getItem("user") || '{"role":null}')
  console.log(role)
  return (
    <Router>
      {
        role == "user" &&
        <>
          <Navbar1 />
          <Routes>
            <Route path="/" element={isAuthenticated?<Home1 />:<Navigate to={"/login"}/>} />
            <Route path="/ProductCardList" element={<ProductCardList />} />
            {/* <Route path="/ProductCardLit" element={<ProductCardList />} /> */}
            <Route path="/Profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/Cart" element={<Cart />} />
            <Route path="/buy-now" element={<BuyNow />} />
            <Route path="/About" element={<About />} />
            <Route path="" element={<Navigate to="/login" />} />
            <Route path="/Footer" element={<Footer />} />
            <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
            <Route path="/ContactUs" element={<ContactUs />} />
          </Routes>
          <Footer />
        </>
      }
      {
        role == "client" &&
        <>
          <Nav />
          <Routes>
            <Route path="/" element={isAuthenticated ? <OwnerHomePage />:<Navigate to={"/login"}/>} />
            <Route path="/Navb" element={<Navb />} />
            <Route path="/ProfileClient" element={<ProfileClient />} />
            <Route path="/ProductForm" element={<ProductForm />} />
            <Route path="/ProductManagement" element={<ProductManagement />} />
            <Route path="/updatePage/:id" element={<UpdateProduct />} />
            <Route path="/About" element={<About />} />
            <Route path="/Footer" element={<Footer />} />
            <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
            <Route path="/ProductReviewTable" element={<ProductReviewTable />} />
          </Routes>
          <Footer />
        </>
      }
      {
        role == null &&
        <Routes>
          <Route path="/" element={<Navigate to={"/login"} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      }
    </Router>
  );
}

export default App;
