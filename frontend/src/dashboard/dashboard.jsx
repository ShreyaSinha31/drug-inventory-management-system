import React from 'react';
import { Outlet, useLocation } from 'react-router-dom'; // Import useLocation for current route check
import "./dash.css";
import Navbar from '../navbar/navabar.jsx';
import Sidebar from '../sidebar/sidebar.jsx';
import { useNavigate } from 'react-router-dom';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js"
import { Bar, Doughnut } from 'react-chartjs-2';
import { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
//import products from "../products.json"

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

export default function Dashboard() {
  
  const location = useLocation(); // Get the current location (path)
  const isChildRoute = location.pathname !== "/dashboard"; // Check if the current route is not '/dashboard'
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [outOfstockCount, setOutOfStockCount] = useState(0);

  useEffect(() => {
    // Fetch products on component mount
    const fetchProducts = async () => {
      try {
        // Sending GET request to fetch products from the backend
        const response = await axios.get('http://localhost:8080/api/products', {
          withCredentials: true, // Ensure cookies (including token) are sent with request
        });
          console.log("API Response:", products); // Debugging
          // console.log(response.data.totalPrice);
          // console.log(response.data.totalQuantity);
          
            setProducts(response.data.products || []);
            setTotalQuantity(response.data.totalQuantity || 0);
            setTotalPrice(response.data.totalPrice || 0);
            setLowStockCount(response.data.lowStockCount || 0); // Set low stock count state
            setOutOfStockCount(response.data.outOfstockCount || 0);

      } catch (error) {
        // Handle error, if any
        console.error("Error fetching products:", error);
        setError("Failed to fetch products. Please try again later.");
      }
    };

    fetchProducts(); // Call the function to fetch products
  }, []);

  return (
    <div className='dash'>
      <Navbar />
      <Sidebar />
      <div className="content">
        {!isChildRoute ? (
          <>
            <div className="heading">
              <div className="head">
                <h1>Dashboard</h1>
                <p>A quick overview of the Inventory</p>
              </div>
            </div>
            <div className="details">
              <div className="card up" style={{ backgroundColor: "#329dff" }} onClick={() => { navigate('/dashboard/inventory') }}>
                <div className="info">
                  <div className="icon">
                    <i className="fa-solid fa-plus" style={{ color: "#329dff" }}></i>
                  </div>
                  <div className="about">
                    <p>Inventory</p>
                    <h2>${totalPrice}</h2>
                  </div>
                </div>
                <div className="know">
                  <p>Know More</p>
                </div>
              </div>
              <div className="card up" style={{ backgroundColor: "#1dbfc6" }} onClick={() => { navigate('/dashboard/sales') }}>
                <div className="info">
                  <div className="icon">
                    <i className="fa-solid fa-money-bill" style={{ color: "#1dbfc6" }}></i>
                  </div>
                  <div className="about">
                    <p>Revenue</p>
                    <h2>$35</h2>
                  </div>
                </div>
                <div className="know">
                  <p>Know More</p>
                </div>
              </div>
              <div className="card up" style={{ backgroundColor: "#f9d50a" }} onClick={() => { navigate('/dashboard/inventory') }}>
                <div className="info">
                  <div className="icon">
                    <i className="fa-solid fa-plus" style={{ color: "#f9d50a" }}></i>
                  </div>
                  <div className="about">
                    <p style={{ marginLeft: "0%" }}>Availability</p>
                    <h2>{totalQuantity}</h2>
                  </div>
                </div>
                <div className="know">
                  <p>Know More</p>
                </div>
              </div>
              <div className="card up" style={{ backgroundColor: "#ec6869" }} onClick={() => { navigate('/dashboard/inventory') }}>
                <div className="info">
                  <div className="icon">
                    <i className="fa-solid fa-circle-exclamation" style={{ color: "#ec6869" }}></i>
                  </div>
                  <div className="about">
                    <p>Shortage</p>
                    <h2>{lowStockCount}</h2>
                  </div>
                </div>
                <div className="know">
                  <p>Know More</p>
                </div>
              </div>
            </div>
            <div className="chart">
              <div className="bargraph mup" onClick={() => { navigate('/dashboard/sales') }} style={{ width: "50%" }}>
                <h3>Total Sales</h3>
                <Bar
                  data={{
                    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                    datasets: [
                      {
                        label: "Total Sale",
                        data: [7000, 15000, 8000, 10000, 3000, 12000, 16000],
                        backgroundColor: "#329dff",
                        borderRadius: 10,
                        barPercentage: 0.9,
                        hoverBackgroundColor: "#0c2c61",
                        categoryPercentage: 0.5,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { display: false },
                      tooltip: {
                        callbacks: {
                          label: (tooltipItem) => `$ ${tooltipItem.raw / 1000}K`,
                        },
                      },
                    },
                    scales: {
                      y: {
                        ticks: {
                          callback: (value) => `$ ${value / 1000}K`,
                        },
                        grid: { drawBorder: false },
                      },
                      x: {
                        grid: { display: false },
                      },
                    },
                  }}
                />
              </div>
              <div className="piechart mup" onClick={() => { navigate('/dashboard/inventory') }} style={{ width: "25%" }}>
                <h3>Inventory</h3>
                <Doughnut
                  data={{
                    labels: ["Total product", "Out of stock", "Return", "Expire"],
                    datasets: [
                      {
                        data: [40, 20, 15, 25],
                        backgroundColor: ["#329DFF", "#EC6869", "#F9D50A", "#000"],
                        borderWidth: 0,
                        cutout: "70%",
                        borderRadius: 5,
                        spacing: 5,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: "right",
                        labels: { usePointStyle: true, boxWidth: 8 },
                      },
                      tooltip: {
                        callbacks: {
                          label: (tooltipItem) => `${tooltipItem.raw}%`,
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
            <div className="recived" onClick={() => { navigate('/dashboard/inventory') }}>
              <div className="pro">
    <h2>Products</h2>
    <div className="header">
      <h4>Sl. No.</h4>
      <h4>Name</h4>
      <h4>Price</h4>
      <h4>Qty.</h4>
      <h4>Expiry</h4>
    </div>
    {products.slice(0,5).map((product, index) => (
      <div className="all" key={product._id}>
        <h5>{index + 1}</h5> {/* Fix: Using index directly */}
        <h5>{product.name}</h5>
        <h5>{product.price}</h5>
        <h5>{product.quantity}</h5>
        <h5>{moment(product.expDate).format("DD-MM-YYYY")}</h5> {/* Fix: Proper date formatting */}
      </div>
    ))}
  </div>

            </div>
          </>
        ) : null}

        <Outlet />
        {/* Render nested routes here */}
      </div>
    </div>
  );
}