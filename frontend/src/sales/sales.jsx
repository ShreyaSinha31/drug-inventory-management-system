import React, { useState, useEffect } from 'react';
import './salex.css';
import api from '../api/axios';
import moment from 'moment';

const Sales = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/orders');
      setOrders(res.data || []);
    } catch (err) {
      console.error("Error fetching sales orders:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter Completed / Paid Orders for Sales
  const filteredOrders = orders.filter((ord) => {
    const matchesSearch =
      (ord.OrderID && ord.OrderID.toLowerCase().includes(search.toLowerCase())) ||
      (ord.Name && ord.Name.toLowerCase().includes(search.toLowerCase())) ||
      (ord.ProductName && ord.ProductName.toLowerCase().includes(search.toLowerCase()));

    const orderDate = new Date(ord.Date || ord.createdAt);
    const matchesFrom = !fromDate || orderDate >= new Date(fromDate);
    const matchesTo = !toDate || orderDate <= new Date(toDate);

    return matchesSearch && matchesFrom && matchesTo;
  });

  // Calculate Metrics
  const totalProductsSold = filteredOrders.reduce((sum, o) => sum + (o.QuantitySold || 1), 0);
  const totalSalesAmount = filteredOrders.reduce((sum, o) => sum + (o.Amount || 0), 0);

  const todayStr = new Date().toISOString().split('T')[0];
  const salesToday = filteredOrders
    .filter((o) => (o.Date || o.createdAt || '').toString().startsWith(todayStr))
    .reduce((sum, o) => sum + (o.Amount || 0), 0);

  const currentMonthStr = new Date().toISOString().slice(0, 7);
  const monthlySales = filteredOrders
    .filter((o) => (o.Date || o.createdAt || '').toString().startsWith(currentMonthStr))
    .reduce((sum, o) => sum + (o.Amount || 0), 0);

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // CSV Export
  const exportToCSV = () => {
    if (filteredOrders.length === 0) return;

    const headers = ["Order ID", "Product Name", "Quantity Sold", "Selling Price", "Total Amount", "Date", "Customer"];
    const rows = filteredOrders.map((o) => [
      o.OrderID || 'N/A',
      `"${o.ProductName || 'Paracetamol 500mg'}"`,
      o.QuantitySold || 1,
      `₹${Math.round((o.Amount || 0) / (o.QuantitySold || 1))}`,
      `₹${o.Amount || 0}`,
      moment(o.Date || o.createdAt).format('YYYY-MM-DD'),
      `"${o.Name || 'Anonymous Customer'}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `medtrack_sales_${moment().format('YYYY-MM-DD')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="sales-page">
      <div className="sales-header">
        <div className="sales-header-title">
          <h1>Pharmaceutical Sales Analytics</h1>
          <p>Real-time revenue monitoring and completed order ledgers</p>
        </div>
        <button className="sales-export-btn" onClick={exportToCSV}>
          <i className="fa-solid fa-file-csv"></i> Export CSV
        </button>
      </div>

      <div className="sales-kpi-grid">
        <div className="sales-kpi-card">
          <div className="sales-kpi-icon" style={{ backgroundColor: "#329dff" }}>
            <i className="fa-solid fa-boxes-stacked"></i>
          </div>
          <div className="sales-kpi-info">
            <span>Total Units Sold</span>
            <h2>{totalProductsSold} Units</h2>
          </div>
        </div>

        <div className="sales-kpi-card">
          <div className="sales-kpi-icon" style={{ backgroundColor: "#1dbfc6" }}>
            <i className="fa-solid fa-indian-rupee-sign"></i>
          </div>
          <div className="sales-kpi-info">
            <span>Total Gross Sales</span>
            <h2>{'\u20B9'}{totalSalesAmount.toLocaleString()}</h2>
          </div>
        </div>

        <div className="sales-kpi-card">
          <div className="sales-kpi-icon" style={{ backgroundColor: "#f9d50a" }}>
            <i className="fa-solid fa-calendar-day"></i>
          </div>
          <div className="sales-kpi-info">
            <span>Sales Today</span>
            <h2>{'\u20B9'}{salesToday.toLocaleString()}</h2>
          </div>
        </div>

        <div className="sales-kpi-card">
          <div className="sales-kpi-icon" style={{ backgroundColor: "#ec6869" }}>
            <i className="fa-solid fa-chart-line"></i>
          </div>
          <div className="sales-kpi-info">
            <span>Monthly Revenue</span>
            <h2>{'\u20B9'}{monthlySales.toLocaleString()}</h2>
          </div>
        </div>
      </div>

      <div className="sales-controls">
        <div className="sales-search-box">
          <input
            type="text"
            placeholder="Search by Order ID, Product, or Customer..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
          />
          <i className="fa-solid fa-magnifying-glass"></i>
        </div>

        <div className="sales-date-filters">
          <label>From:</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => { setFromDate(e.target.value); setCurrentPage(1); }}
          />
          <label>To:</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => { setToDate(e.target.value); setCurrentPage(1); }}
          />
        </div>
      </div>

      <div className="sales-table-wrapper">
        <table className="sales-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Product Name</th>
              <th>Qty Sold</th>
              <th>Selling Price</th>
              <th>Total Amount</th>
              <th>Date</th>
              <th>Customer</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "24px" }}>Loading sales data...</td>
              </tr>
            ) : paginatedOrders.length > 0 ? (
              paginatedOrders.map((ord) => (
                <tr key={ord._id}>
                  <td><strong>{ord.OrderID}</strong></td>
                  <td>{ord.ProductName || "Paracetamol 500mg"}</td>
                  <td>{ord.QuantitySold || 1}</td>
                  <td>{'\u20B9'}{Math.round((ord.Amount || 0) / (ord.QuantitySold || 1))}</td>
                  <td><strong style={{ color: "#10b981" }}>{'\u20B9'}{ord.Amount}</strong></td>
                  <td>{moment(ord.Date || ord.createdAt).format("DD-MM-YYYY")}</td>
                  <td>{ord.Name}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "24px" }}>No sales records match filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="sales-pagination">
        <span>Showing {paginatedOrders.length} of {filteredOrders.length} records</span>
        <div className="sales-page-btns">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          >
            Prev
          </button>
          <button>Page {currentPage} of {totalPages}</button>
          <button
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sales;