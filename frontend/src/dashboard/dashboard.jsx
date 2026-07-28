import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import "./dash.css";
import Navbar from '../navbar/navabar.jsx';
import Sidebar from '../sidebar/sidebar.jsx';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";
import { Bar, Doughnut } from 'react-chartjs-2';
import { useState, useEffect } from 'react';
import api from '../api/axios';
import moment from 'moment';
import FloatingBot from '../chatbot/FloatingBot.jsx';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const location = useLocation();
  const isChildRoute = location.pathname !== "/dashboard" && location.pathname !== "/dashboard/";
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [outOfstockCount, setOutOfStockCount] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        setProducts(response.data.products || []);
        setTotalQuantity(response.data.totalQuantity || 0);
        setTotalPrice(response.data.totalPrice || 0);
        setLowStockCount(response.data.lowStockCount || 0);
        setOutOfStockCount(response.data.outOfStockCount || response.data.outOfstockCount || 0);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to fetch products. Please try again later.");
      }
    };

    fetchProducts();
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
              <div className="card up" style={{ backgroundColor: "#329dff" }} onClick={() => navigate('/dashboard/inventory')}>
                <div className="info">
                  <div className="icon">
                    <i className="fa-solid fa-boxes-stacked" style={{ color: "#329dff" }}></i>
                  </div>
                  <div className="about">
                    <p>Inventory Value</p>
                    <h2>{'\u20B9'}{totalPrice.toLocaleString()}</h2>
                  </div>
                </div>
                <div className="know">
                  <p>Know More <i className="fa-solid fa-arrow-right"></i></p>
                </div>
              </div>

              <div className="card up" style={{ backgroundColor: "#1dbfc6" }} onClick={() => navigate('/dashboard/sales')}>
                <div className="info">
                  <div className="icon">
                    <i className="fa-solid fa-indian-rupee-sign" style={{ color: "#1dbfc6" }}></i>
                  </div>
                  <div className="about">
                    <p>Revenue</p>
                    <h2>{'\u20B9'}35,000</h2>
                  </div>
                </div>
                <div className="know">
                  <p>Know More <i className="fa-solid fa-arrow-right"></i></p>
                </div>
              </div>

              <div className="card up" style={{ backgroundColor: "#f9d50a" }} onClick={() => navigate('/dashboard/inventory')}>
                <div className="info">
                  <div className="icon">
                    <i className="fa-solid fa-cubes" style={{ color: "#f9d50a" }}></i>
                  </div>
                  <div className="about">
                    <p>Availability</p>
                    <h2>{totalQuantity} Units</h2>
                  </div>
                </div>
                <div className="know">
                  <p>Know More <i className="fa-solid fa-arrow-right"></i></p>
                </div>
              </div>

              <div className="card up" style={{ backgroundColor: "#ec6869" }} onClick={() => navigate('/dashboard/inventory')}>
                <div className="info">
                  <div className="icon">
                    <i className="fa-solid fa-triangle-exclamation" style={{ color: "#ec6869" }}></i>
                  </div>
                  <div className="about">
                    <p>Shortage / Low Stock</p>
                    <h2>{lowStockCount} Items</h2>
                  </div>
                </div>
                <div className="know">
                  <p>Know More <i className="fa-solid fa-arrow-right"></i></p>
                </div>
              </div>
            </div>

            <div className="chart">
              <div className="bargraph mup" onClick={() => navigate('/dashboard/sales')}>
                <h3>Total Sales Overview</h3>
                <div className="chart-container">
                  <Bar
                    data={{
                      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                      datasets: [
                        {
                          label: "Total Sale (\u20B9)",
                          data: [7000, 15000, 8000, 10000, 3000, 12000, 16000],
                          backgroundColor: "#329dff",
                          borderRadius: 8,
                          barPercentage: 0.6,
                          hoverBackgroundColor: "#0c2c61",
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: false },
                        tooltip: {
                          callbacks: {
                            label: (tooltipItem) => `\u20B9 ${tooltipItem.raw.toLocaleString()}`,
                          },
                        },
                      },
                      scales: {
                        y: {
                          ticks: {
                            callback: (value) => `\u20B9${value / 1000}K`,
                          },
                          grid: { color: "rgba(150, 150, 150, 0.1)" },
                        },
                        x: {
                          grid: { display: false },
                        },
                      },
                    }}
                  />
                </div>
              </div>

              <div className="piechart mup" onClick={() => navigate('/dashboard/inventory')}>
                <h3>Inventory Status</h3>
                <div className="chart-container">
                  <Doughnut
                    data={{
                      labels: ["In Stock", "Out of Stock", "Low Stock", "Expired"],
                      datasets: [
                        {
                          data: [
                            products.filter(p => p.quantity > 75).length || 40,
                            outOfstockCount || 10,
                            lowStockCount || 15,
                            5
                          ],
                          backgroundColor: ["#329DFF", "#EC6869", "#F9D50A", "#6c757d"],
                          borderWidth: 0,
                          cutout: "70%",
                          borderRadius: 4,
                          spacing: 4,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: "bottom",
                          labels: { usePointStyle: true, boxWidth: 8, padding: 15 },
                        },
                        tooltip: {
                          callbacks: {
                            label: (tooltipItem) => ` ${tooltipItem.label}: ${tooltipItem.raw}`,
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="recived" onClick={() => navigate('/dashboard/inventory')}>
              <div className="pro">
                <h2>Top Inventory Products</h2>
                <div className="header">
                  <h4>Sl. No.</h4>
                  <h4>Name</h4>
                  <h4>Price</h4>
                  <h4>Qty.</h4>
                  <h4>Expiry</h4>
                </div>
                {products.length > 0 ? (
                  products.slice(0, 5).map((product, index) => (
                    <div className="all" key={product._id || index}>
                      <h5>{index + 1}</h5>
                      <h5>{product.name}</h5>
                      <h5>{'\u20B9'}{product.price}</h5>
                      <h5>{product.quantity}</h5>
                      <h5>{product.expDate ? moment(product.expDate).format("DD-MM-YYYY") : "N/A"}</h5>
                    </div>
                  ))
                ) : (
                  <div className="all">
                    <h5 style={{ flex: 5, textCenter: "center" }}>No products available. Click to manage inventory.</h5>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : null}

        <Outlet />
        <FloatingBot />
      </div>
    </div>
  );
}