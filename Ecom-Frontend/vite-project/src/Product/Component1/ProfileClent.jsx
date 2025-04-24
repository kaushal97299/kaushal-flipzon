import React, { useEffect, useState } from "react";
import "./ProfileClent.css"; 

const Profile = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "",
    phone: "",
    dob: "",
    address: "",
    profileImage: null,
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);
 

  // Handle input change
  const handleChange = (e) => {
    if (e.target.name === "profileImage") {
      setUser({ ...user, profileImage: e.target.files[0] });
    } else {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };

  // Handle profile update
  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("name", user.name);
      formData.append("email", user.email);
      formData.append("phone", user.phone);
      formData.append("dob", user.dob);
      formData.append("address", user.address);
      if (user.profileImage) {
        formData.append("profileImage", user.profileImage);
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/profileupdate`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(result.user));
        setUser(result.user);
        setIsEditing(false);
      } else {
        alert("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile.");
    }
  };

  return (
    <div className="profileco">
      <div className="profilecard">
        <h2 className="title3">Profile Page</h2>
        {isEditing ? (
          <form className="profile-form">
            
            <label className="profilee">Profile Image</label>
            <input className="innpp" type="file" name="profileImage" onChange={handleChange} />

            <label className="tess">Name</label>
            <input className="innpp"  type="text" name="name" value={user.name} onChange={handleChange} />

            <label className="tess">Phone</label>
            <input className="innpp"  type="text" name="phone" value={user.phone} onChange={handleChange} />

            <label className="tess">Date of Birth</label>
            <input className="innpp"  type="date" name="dob" value={user.dob} onChange={handleChange} />

            <label className="tess">Address</label>
            <input className="innpp"  type="text" name="address" value={user.address} onChange={handleChange} />

            <div className="button-group">
              <button type="button" className="btn-primary" onClick={handleUpdate}>
                Update
              </button>
              <button type="button" className="bttn" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
          <div>
            {user.profileImage && (
              <div className="profile-img-container">
                <img src={`${import.meta.env.VITE_API_URL}/${user.profileImage}`} alt="Profile" />
              </div>
            )}
            <p className="tesst"><strong>Name:</strong> {user.name}</p>
            <p  className="tesst"><strong>Email:</strong> {user.email}</p>
            <p  className="tesst"><strong>Phone:</strong> {user.phone}</p>
            <p  className="tesst"><strong>D.O.B.:</strong> {user.dob ? new Date(user.dob).toLocaleDateString("en-GB") : "N/A"}</p>
            <p  className="tesst"><strong>Address:</strong> {user.address}</p>
            <p  className="tesst"><strong>Role:</strong> {user.role}</p>
            <button className="btnnt" onClick={() => setIsEditing(true)}>Edit</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
