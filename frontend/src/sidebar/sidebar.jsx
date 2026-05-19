import "./side.css"
import { FaTachometerAlt } from 'react-icons/fa'; // Dashboard
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useNavigate } from "react-router-dom";
//import { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";


export default function Sidebar() {

    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post("https://med-track.onrender.com/api/users/logout", {}, { withCredentials: true });

            navigate("/"); // Redirect to login page
            toast.success("Logout successful!");
        } catch (error) {
            console.error("Logout failed:", error.response?.data || error.message);
            toast.error(error.response?.data?.message || "Logout failed!");
        }
    };
    let activeindex = 0;
    const location = useLocation(); // Access the location object
    const currentPath = location.pathname;

    if (currentPath === "/dashboard" || currentPath === "/dashboard/") {
        activeindex = 0;
    } else if (currentPath === "/dashboard/inventory" || currentPath === "/dashboard/inventory/") {
        activeindex = 1;
    } else if (currentPath === "/dashboard/sales" || currentPath === "/dashboard/sales/") {
        activeindex = 2;
    } else if (currentPath === "/dashboard/chatbot" || currentPath === "/dashboard/chatbot/") {
        activeindex = 3;
    } else if (currentPath === "/dashboard/order" || currentPath === "/dashboard/order/") {
        activeindex = 4;
    } else if (currentPath === "/dashboard/payement" || currentPath === "/dashboard/payement/") {
        activeindex = 5;
    }  else if (currentPath === "/dashboard/feedback" || currentPath === "/dashboard/feedback/") {
        activeindex = 6;
    } 
    else {
        activeindex = 0;
    }

    const handleClick = (index) => {

        switch (index) {
            case 0:
                navigate("/dashboard");
                break;
            case 1:
                navigate("/dashboard/inventory");
                break;
            case 2:
                navigate("/dashboard/sales");
                break;
            case 3:
                navigate("/dashboard/chatbot");
                break;
            case 4:
                navigate("/dashboard/order");
                break;
            case 5:
                navigate("/dashboard/payement");
                break;
            case 6:
                navigate("/dashboard/feedback");
                break;
            default:
                navigate("/dashboard");
                break;
        }
    };

    return (<div className="sbar">
        <div className="heading"><h1>Medtrack</h1></div>
        <div className="options">
            {[
                { icon: <FaTachometerAlt className="icon" />, label: "Dashboard" },
                { icon: <i className="fa-solid fa-warehouse icon"></i>, label: "Inventory" },
                { icon: <i className="fa-solid fa-chart-line icon"></i>, label: "Sales" },
                { icon: <i className="fa-solid fa-robot icon"></i>, label: "Chatbot" },
                { icon: <i className="fa-brands fa-dropbox icon"></i>, label: "Order" },
                { icon: <i className="fa-solid fa-indian-rupee-sign icon"></i>, label: "payement" },
                { icon: <i className="fa-solid fa-user-pen icon"></i>, label: "Feedback" },
            ].map((item, index) => (
                <div
                    key={index}
                    className={`opt ${activeindex === index ? "active" : ""}`}
                    onClick={() => handleClick(index)}
                >
                    {item.icon}
                    <a>{item.label}</a>
                </div>
            ))}
        </div>
        <div className="logout">
            <button onClick={handleLogout}>Logout</button>
        </div>
    </div>)
}
