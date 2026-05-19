import "./navbar.css"
import profile  from "../assets/profile.webp"
import { useState, useEffect } from "react";
import axios from "axios";

export default function Navbar() {

 const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get("https://med-track.onrender.com/api/users/profile", {
          withCredentials: true, // Ensures cookies are sent with the request
          headers: {
            "Content-Type": "application/json",
          },
        });
        setUser(res.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);
    return (<div className="nbar">
        <div className="search"><input type="text" placeholder="Search here..." /><i class="fa-solid fa-magnifying-glass"></i></div>
        <div className="option">
        <i class="fa-solid fa-language"></i>
        <p>English(US)</p>
        <i class="fa-solid fa-sun"></i>
        <i class="fa-solid fa-bell"></i>
        </div>
        <div className="profile">
            <div className="picture"><img src={user ? user.pfp : profile} alt ="" /></div>
            <div className="info"><p>{user ? user.name : "Guest"}</p></div>
        </div>
    </div>)
}
