import "./navbar.css";
import profile from "../assets/demo_avatar.jpg";
import { useState, useEffect } from "react";
import api from "../api/axios";
import { useTheme } from "../context/ThemeContext";
import ProfileModal from "../profile/ProfileModal.jsx";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await api.get("/users/profile");
        setUser(res.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        const storedUser = localStorage.getItem("user") || localStorage.getItem("userInfo");
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (e) {}
        }
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <>
      <div className="nbar">
        <div className="search">
          <input type="text" placeholder="Search drug inventory, orders..." />
          <i className="fa-solid fa-magnifying-glass"></i>
        </div>
        <div className="option">
          <i className="fa-solid fa-language" title="Language"></i>
          <p>English(US)</p>
          <i
            className={`fa-solid ${theme === "dark" ? "fa-sun" : "fa-moon"} theme-toggle-btn`}
            onClick={toggleTheme}
            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
          ></i>
          <i className="fa-solid fa-bell" title="Notifications"></i>
        </div>
        <div className="profile" onClick={() => setIsProfileOpen(true)} style={{ cursor: 'pointer' }}>
          <div className="picture">
            <img 
              src={profile} 
              alt="User Avatar" 
              onError={(e) => { e.target.onerror = null; e.target.src = profile; }}
            />
          </div>
          <div className="info">
            <p>{user?.name || "Admin User"}</p>
          </div>
        </div>
      </div>

      <ProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
        onUserUpdated={(updatedUser) => setUser(updatedUser)} 
      />
    </>
  );
}


