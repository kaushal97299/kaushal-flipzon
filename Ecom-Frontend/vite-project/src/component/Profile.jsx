import React, { useEffect, useState } from "react";
import "./Profile.css"; // Import custom CSS file

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

  // Calculate Profile Completion Percentage
  const requiredFields = ["name", "email", "phone", "dob", "address", "profileImage"];
  const completedFields = requiredFields.filter((field) => user[field]);
  const completionPercentage = Math.round((completedFields.length / requiredFields.length) * 100);
  const pendingPercentage = 100 - completionPercentage;

  // Get list of missing fields
  const missingFields = requiredFields.filter((field) => !user[field]).join(", ");

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

      const response = await fetch("http://localhost:4000/api/auth/profileupdate", {
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
    <div className="profilt">
      <div className="profille">
        {/* Profile Completion Info */}
        <div className="infoprofile">
          <span className="profile-complete">✅ Profile Completed: {completionPercentage}%</span>
          <span className="profile-pending">⚠️ Pending: {pendingPercentage}% ({missingFields})</span>
        </div>

        <h2 className="title3">Profile Page</h2>
        {isEditing ? (
          <form className="profile-formme">

            <label className="proimg">Profile Image</label>
            <input className="inptt" type="file" name="profileImage" onChange={handleChange} />

            <label className="proimg" >Name</label>
            <input className="inptt" type="text" name="name" value={user.name} onChange={handleChange} />

            <label className="proimg">Phone</label>
            <input className="inptt" type="text" name="phone" value={user.phone} onChange={handleChange} />

            <label className="proimg">Date of Birth</label>
            <input className="inptt" type="date" name="dob" value={user.dob} onChange={handleChange} />

            <label className="proimg">Address</label>
            <input className="inptt" type="text" name="address" value={user.address} onChange={handleChange} />

            <div className="button-group">
              <button type="button" className="btnnn" onClick={handleUpdate}>
                Update
              </button>
              <button type="button" className="btntn" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            {user.profileImage && (
              <div className="profile-img-container">
                <img src={`http://localhost:4000/${user.profileImage}`} alt="Profile" />
              </div>
            )}
            <p className="proot"><strong>Name:</strong> {user.name}</p>
            <p className="proot"><strong>Email:</strong> {user.email}</p>
            <p className="proot"><strong>Phone:</strong> {user.phone}</p>
            <p className="proot"><strong>D.O.B.:</strong> {user.dob ? new Date(user.dob).toLocaleDateString("en-GB") : "N/A"}</p>
            <p className="proot"><strong>Address:</strong> {user.address}</p>
            <p className="proot"><strong>Role:</strong> {user.role}</p>
            <button className="btnnt" onClick={() => setIsEditing(true)}>Edit</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;