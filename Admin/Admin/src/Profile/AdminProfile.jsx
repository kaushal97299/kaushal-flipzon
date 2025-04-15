import React, { useEffect, useState } from "react";



const ProfileAdmin = () => {
  const [user, setUser] = useState({name:"",email:""});
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  useEffect(() => {
    const userData = localStorage.getItem("user");
     if(userData){
      setUser(JSON.parse(userData))
     }
  },[]);

  return (
    <div>
      <h2>Profile Page</h2>
        <div>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      
    </div>
  );
};
export default ProfileAdmin;
