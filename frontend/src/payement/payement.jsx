import React, { useState, useEffect } from 'react';
import './payement.css';
import api from '../api/axios';
import moment from 'moment';

export default function Payement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/orders');
      setOrders(res.data || []);
    } catch (err) {
      console.error("Error fetching payment data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filtered Ledger
  const filteredPayments = orders.filter((ord) => {
    const paymentStatus = ord.Payment || 'Paid';
    const matchesStatus =
      filterStatus === 'All' ||
      (filterStatus === 'Paid' && paymentStatus === 'Paid') ||
      (filterStatus === 'Pending' && (paymentStatus === 'Pending' || paymentStatus === 'Unpaid')) ||
      (filterStatus === 'Failed' && paymentStatus === 'Failed');

    const matchesSearch =
      (ord.OrderID && ord.OrderID.toLowerCase().includes(search.toLowerCase())) ||
      (ord.Name && ord.Name.toLowerCase().includes(search.toLowerCase()));

    return matchesStatus && matchesSearch;
  });

  // Calculate Summary KPI Totals
  const paidOrders = orders.filter((o) => o.Payment === 'Paid');
  const pendingOrders = orders.filter((o) => o.Payment === 'Unpaid' || o.Payment === 'Pending');

  const totalRevenue = paidOrders.reduce((sum, o) => sum + (o.Amount || 0), 0);
  const outstandingAmount = pendingOrders.reduce((sum, o) => sum + (o.Amount || 0), 0);

  return (
    <div className="payments-page">
      <div className="payments-header">
        <h1>Payment Ledger & Financial Summary</h1>
        <p>Track settlement statuses, revenue totals, and pending customer dues</p>
      </div>

      <div className="payments-kpi-grid">
        <div className="payments-kpi-card">
          <div className="payments-kpi-icon" style={{ backgroundColor: "#10b981" }}>
            <i className="fa-solid fa-circle-check"></i>
          </div>
          <div className="payments-kpi-info">
            <span>Paid Revenue Collected</span>
            <h2>{'\u20B9'}{totalRevenue.toLocaleString()}</h2>
          </div>
        </div>

        <div className="payments-kpi-card">
          <div className="payments-kpi-icon" style={{ backgroundColor: "#f9d50a" }}>
            <i className="fa-solid fa-clock"></i>
          </div>
          <div className="payments-kpi-info">
            <span>Outstanding Pending Amount</span>
            <h2>{'\u20B9'}{outstandingAmount.toLocaleString()}</h2>
          </div>
        </div>

        <div className="payments-kpi-card">
          <div className="payments-kpi-icon" style={{ backgroundColor: "#329dff" }}>
            <i className="fa-solid fa-receipt"></i>
          </div>
          <div className="payments-kpi-info">
            <span>Settled Transactions</span>
            <h2>{paidOrders.length} Paid</h2>
          </div>
        </div>

        <div className="payments-kpi-card">
          <div className="payments-kpi-icon" style={{ backgroundColor: "#ec6869" }}>
            <i className="fa-solid fa-triangle-exclamation"></i>
          </div>
          <div className="payments-kpi-info">
            <span>Pending Collections</span>
            <h2>{pendingOrders.length} Dues</h2>
          </div>
        </div>
      </div>

      <div className="payments-controls">
        <div className="payments-status-tabs">
          {['All', 'Paid', 'Pending', 'Failed'].map((st) => (
            <p
              key={st}
              className={filterStatus === st ? 'active-tab' : ''}
              onClick={() => setFilterStatus(st)}
            >
              {st} Payments
            </p>
          ))}
        </div>

        <div className="sales-search-box" style={{ maxWidth: '300px' }}>
          <input
            type="text"
            placeholder="Search by Payment ID / Customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <i className="fa-solid fa-magnifying-glass"></i>
        </div>
      </div>

      <div className="sales-table-wrapper">
        <table className="sales-table">
          <thead>
            <tr>
              <th>Payment ID</th>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Amount ({'\u20B9'})</th>
              <th>Payment Method</th>
              <th>Payment Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "24px" }}>Loading payment ledger...</td>
              </tr>
            ) : filteredPayments.length > 0 ? (
              filteredPayments.map((ord, idx) => (
                <tr key={ord._id || idx}>
                  <td><strong>PAY-{(ord._id || idx).toString().slice(-6).toUpperCase()}</strong></td>
                  <td>{ord.OrderID}</td>
                  <td>{ord.Name}</td>
                  <td><strong>{'\u20B9'}{ord.Amount}</strong></td>
                  <td>{ord.PaymentMethod || 'UPI'}</td>
                  <td>
                    <span className={
                      ord.Payment === 'Paid' ? 'payments-badge-paid' :
                      ord.Payment === 'Failed' ? 'payments-badge-failed' : 'payments-badge-pending'
                    }>
                      {ord.Payment || 'Paid'}
                    </span>
                  </td>
                  <td>{moment(ord.Date || ord.createdAt).format("DD-MM-YYYY")}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "24px" }}>No payment records found for selected filter.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}