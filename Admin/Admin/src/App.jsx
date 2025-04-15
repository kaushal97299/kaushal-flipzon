// import { Route } from "react-router-dom";
import {  Routes, Route, Navigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import './App.css'
import AdminUser from "./Component/usersDetails";
import Orderdet from "./Component/Order";
import ClientProduct from "./Component/ClientProduct";
import AdminSignup from "./AdminAuther/Signup";
import AdminLogin from "./AdminAuther/Login";
import ProfileAdmin from "./Profile/AdminProfile";
import { AuthContext } from "./Store/AuthContaxt";
import { useContext } from "react";
import AdminContacts from "./Component/AdminContacr";
import CarouselUploader from "./Component/CarouselUpload";


const SecureRoute =({children})=>{

  // eslint-disable-next-line no-unused-vars
  let {token ,setToken ,user, setUser } = useContext(AuthContext);
  return token ? children : <Navigate to="/AdminLogin"/>
}

function App() {
  // eslint-disable-next-line no-unused-vars
  let {token ,setToken,user,setUser } = useContext(AuthContext);
  return (
    
    <>
      <AdminNavbar />
      <Routes>
        <Route path="/Orderdet" element={<SecureRoute><Orderdet/></SecureRoute>} />
        <Route path="/AdminUser" element={<SecureRoute><AdminUser/></SecureRoute>} />
        <Route path="/ClientProduct" element={<SecureRoute><ClientProduct/> </SecureRoute>} />
        <Route path="/AdminSignup" element={!token && <AdminSignup/>} />
        <Route path="/AdminLogin" element={!token && <AdminLogin/>} />
        <Route path="/ProfileAdmin" element={<SecureRoute><ProfileAdmin/> </SecureRoute>} />
        <Route path="/AdminContacts" element={<SecureRoute><AdminContacts/> </SecureRoute>} />
        <Route path="/CarouselUploader" element={<SecureRoute><CarouselUploader/> </SecureRoute>} />
      </Routes>

      
    
    </>
  )
}

export default App
