import facebook from "./assets/facebook.jpg";
import google from "./assets/google.jpg";
import twitter from "./assets/twitter.jpg";
import linkedin from "./assets/linkedin.jpg";
import { useEffect, useState } from "react";
import register from "./assets/register.svg";
import undraw_medical_care_7m9g from "./assets/undraw_medical-care_7m9g.svg";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import "./login.css"
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name:"",
    password:"",
    email:"",
  });
  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`https://med-track.onrender.com/api/users/login`,user,{
        headers:{
          "Content-Type":"application/json"
        },
        withCredentials:true
      })
      if (res.status === 200) {  // Ensure request was successful
        navigate("/dashboard");
        toast.success(res.data.message || "Login successful!");
      }
    } catch (error) {
      console.error("Login Error:", error);
      toast.error(error.response?.data?.message || "Login failed!");
    }
    setUser({
      name:"",
      email:"",
      password:""
    });
  };

  const handleSubmit1 = async(e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`https://med-track.onrender.com/api/users/register`,user,{
        headers:{
          "Content-Type":"application/json"
        },
        withCredentials:true
      })
      if (res.status === 201) {  // Ensure request was successful
        navigate("/dashboard");
        toast.success(res.data.message || "Registration successful!");
      }
    } catch (error) {
      console.error("Login Error:", error);
      toast.error(error.response?.data?.message || "Registration failed!");
    }
    setUser({
      name:"",
      email:"",
      password:""
    });
  };

  useEffect(() => {
    const sign_in_btn = document.querySelector("#sign-in-btn");
    const sign_up_btn = document.querySelector("#sign-up-btn");
    const container = document.querySelector(".container");

    sign_up_btn?.addEventListener("click", () => {
      container?.classList.add("sign-up-mode");
    });

    sign_in_btn?.addEventListener("click", () => {
      container?.classList.remove("sign-up-mode");
    });

    return () => {
      sign_up_btn?.removeEventListener("click", () => {
        container?.classList.add("sign-up-mode");
      });
      sign_in_btn?.removeEventListener("click", () => {
        container?.classList.remove("sign-up-mode");
      });
    };
  }, []);

  return (
    <div className="container">
      <div className="forms-container">
        <div className="signin-signup">
          <form action="#" className="sign-in-form" onSubmit={handleSubmit}>
            <h2 className="title">Sign in</h2>
            <div className="input-field">
              <FaUser className="icon" />
              <input type="text"
                placeholder="name"
                value={user.name}
                onChange={(e) => setUser({...user,name:e.target.value})}
                required />
            </div>
            <div className="input-field">
              <FaLock className="icon" />
              <input type="password"
                placeholder="Password"
                value={user.password}
                onChange={(e) => setUser({...user,password:e.target.value})}
                required />
            </div>
            <input type="submit" value="Login" className="btn solid" />
            <p className="social-text">Or Sign in with social platforms</p>
            <div className="social-media">
              <a href="#" className="social-icon">
                <img src={facebook} alt="" height='25' width='25' />
              </a>
              <a href="#" className="social-icon">
                <img src={google} alt="" height='25' width='25' />
              </a>
              <a href="#" className="social-icon">
                <img src={twitter} alt="" height='25' width='25' />
              </a>
              <a href="#" className="social-icon">
                <img src={linkedin} alt="" height='25' width='25' />
              </a>
            </div>
          </form>
          <form action="#" className="sign-up-form" onSubmit={handleSubmit1}>
            <h2 className="title">Sign up</h2>
            <div className="input-field">
              <FaUser className="icon" />
              <input type="text"
                placeholder="name"
                value={user.name}
                onChange={(e) => setUser({...user,name:e.target.value})}
                required />
            </div>
            <div className="input-field">
              <FaEnvelope className="icon" />
              <input type="email"
                placeholder="Email"
                value={user.email}
                onChange={(e) => setUser({...user,email:e.target.value})}
                required />
            </div>
            <div className="input-field">
              <FaLock className="icon" />
              <input type="password"
                placeholder="Password"
                value={user.password}
                onChange={(e) => setUser({...user,password:e.target.value})}
                required />
            </div>
            <input type="submit" className="btn" value="Sign up" />
            <p className="social-text">Or Sign up with social platforms</p>
            <div className="social-media">
              <a href="#" className="social-icon">
                <img src={facebook} alt="" height='25' width='25' />
              </a>
              <a href="#" className="social-icon">
                <img src={google} alt="" height='25' width='25' />
              </a>
              <a href="#" className="social-icon">
                <img src={twitter} alt="" height='25' width='25' />
              </a>
              <a href="#" className="social-icon">
                <img src={linkedin} alt="" height='25' width='25' />
              </a>
            </div>
          </form>
        </div>
      </div>

      <div className="panels-container">
        <div className="panel left-panel">
          <div className="contents">
            <h3>New here ?</h3>
            <p>
              Manage & monitor the entire drug supply chain seamlessly.
              From drug inventory tracking to shipment monitoring, we’ve got you covered!
            </p>
            <button className="btn transparent" id="sign-up-btn">
              Sign up
            </button>
          </div>
          <img src={undraw_medical_care_7m9g} className="image" alt="" />
        </div>
        <div className="panel right-panel">
          <div className="contents">
            <h3>One of us ?</h3>
            <p>
              Welcome back!  Continue managing and monitoring effortlessly with just a few clicks.
            </p>
            <button className="btn transparent" id="sign-in-btn">
              Sign in
            </button>
          </div>
          <img src={register} className="image" alt="" />
        </div>
      </div>
    </div>
  );
}
