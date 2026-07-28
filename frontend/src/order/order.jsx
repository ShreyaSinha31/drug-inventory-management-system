import React, { useEffect, useState } from 'react';
import "./order.css";
import api from '../api/axios';
import toast from 'react-hot-toast';
import moment from 'moment';

export default function Order() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMongoId, setSelectedMongoId] = useState(null);

    const [activeTab, setActiveTab] = useState("All");
    const [search, setSearch] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const [showModal, setShowModal] = useState(0); // 0: Closed, 1: Add, 2: Edit/Delete
    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [productName, setProductName] = useState("");
    const [quantitySold, setQuantitySold] = useState(1);
    const [date, setDate] = useState("");
    const [num, setNum] = useState("");
    const [amt, setAmt] = useState(0);
    const [payment, setPayment] = useState("Paid");
    const [paymentMethod, setPaymentMethod] = useState("UPI");
    const [status, setStatus] = useState("Delivered");

    const refreshOrders = async () => {
        try {
            setLoading(true);
            const res = await api.get('/orders');
            setOrders(res.data || []);
        } catch (err) {
            console.error("Error fetching orders:", err);
            toast.error("Failed to load orders from database");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshOrders();
    }, []);

    // Filter Logic
    const filteredOrders = orders.filter((order) => {
        const matchesSearch =
            (order.OrderID && order.OrderID.toLowerCase().includes(search.toLowerCase())) ||
            (order.Name && order.Name.toLowerCase().includes(search.toLowerCase())) ||
            (order.Email && order.Email.toLowerCase().includes(search.toLowerCase())) ||
            (order.ProductName && order.ProductName.toLowerCase().includes(search.toLowerCase()));

        const orderDate = new Date(order.Date || order.createdAt);
        const matchesFrom = !fromDate || orderDate >= new Date(fromDate);
        const matchesTo = !toDate || orderDate <= new Date(toDate);

        let matchesTab = true;
        if (activeTab === "Pending") matchesTab = order.Status === "Pending";
        else if (activeTab === "Processing") matchesTab = order.Status === "Processing" || order.Status === "Received";
        else if (activeTab === "Delivered") matchesTab = order.Status === "Delivered";
        else if (activeTab === "Cancelled") matchesTab = order.Status === "Cancelled";
        else if (activeTab === "Paid") matchesTab = order.Payment === "Paid";
        else if (activeTab === "Unpaid") matchesTab = order.Payment === "Unpaid" || order.Payment === "Pending" || order.Payment === "Failed";

        return matchesSearch && matchesFrom && matchesTo && matchesTab;
    });

    // Pagination
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
    const paginatedOrders = filteredOrders.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleRowClick = (or) => {
        setShowModal(2);
        setSelectedMongoId(or._id || null);
        setId(or.OrderID || "");
        setName(or.Name || "");
        setEmail(or.Email || "");
        setProductName(or.ProductName || "Paracetamol 500mg");
        setQuantitySold(or.QuantitySold || 1);
        setDate(or.Date ? new Date(or.Date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
        setNum(or.Number || "");
        setAmt(or.Amount || 0);
        setPayment(or.Payment || "Paid");
        setPaymentMethod(or.PaymentMethod || "UPI");
        setStatus(or.Status || "Delivered");
    };

    const handleOpenAdd = () => {
        setShowModal(1);
        setSelectedMongoId(null);
        setId(`ORD-${Math.floor(100000 + Math.random() * 900000)}`);
        setName("");
        setEmail("");
        setProductName("");
        setQuantitySold(1);
        setDate(new Date().toISOString().split('T')[0]);
        setNum("");
        setAmt("");
        setPayment("Paid");
        setPaymentMethod("UPI");
        setStatus("Delivered");
    };

    const handleSaveAdd = async () => {
        if (!name || !amt) {
            toast.error("Please enter Customer Name and Order Amount!");
            return;
        }
        try {
            const payload = {
                OrderID: id || `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
                Name: name,
                Email: email || "customer@example.com",
                ProductName: productName || "Paracetamol 500mg",
                QuantitySold: Number(quantitySold) || 1,
                Date: date || new Date(),
                Number: num || 9876543210,
                Amount: Number(amt),
                Payment: payment,
                PaymentMethod: paymentMethod,
                Status: status,
            };
            await api.post("/orders", payload);
            toast.success("Order created successfully!");
            setShowModal(0);
            refreshOrders();
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to create order");
        }
    };

    const handleSaveUpdate = async () => {
        try {
            const payload = {
                OrderID: id,
                Name: name,
                Email: email,
                ProductName: productName,
                QuantitySold: Number(quantitySold),
                Date: date,
                Number: num,
                Amount: Number(amt),
                Payment: payment,
                PaymentMethod: paymentMethod,
                Status: status,
            };
            if (selectedMongoId) {
                await api.put(`/orders/${selectedMongoId}`, payload);
                toast.success("Order status updated!");
            }
            setShowModal(0);
            refreshOrders();
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to update order");
        }
    };

    const handleSaveDelete = async () => {
        try {
            if (selectedMongoId) {
                await api.delete(`/orders/${selectedMongoId}`);
                toast.success("Order removed!");
            }
            setShowModal(0);
            refreshOrders();
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to delete order");
        }
    };

    const getStatusColorClass = (st) => {
        if (st === "Delivered" || st === "Received") return "green";
        if (st === "Processing" || st === "Pending") return "yellow";
        return "red";
    };

    return (
        <div className="order">
            <div className="orhead">
                <div className="orheading">
                    <div className="tittle">
                        <h1>Order Management</h1>
                        <p>{filteredOrders.length} orders found in repository</p>
                    </div>
                    <div className="oropt">
                        <div className="search1">
                            <input
                                type="text"
                                placeholder="Search Order ID, Customer, or Drug..."
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                            />
                            <i className="fa-solid fa-magnifying-glass"></i>
                        </div>
                    </div>
                </div>

                <div className="oroptions">
                    <div className="orshow">
                        {["All", "Pending", "Processing", "Delivered", "Cancelled", "Paid", "Unpaid"].map((tab) => (
                            <p
                                key={tab}
                                onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
                                className={activeTab === tab ? "active1" : ""}
                            >
                                {tab} Orders
                            </p>
                        ))}
                    </div>
                    <div className="date">
                        <p>From:</p>
                        <input type="date" value={fromDate} onChange={(e) => { setFromDate(e.target.value); setCurrentPage(1); }} />
                        <p>To:</p>
                        <input type="date" value={toDate} onChange={(e) => { setToDate(e.target.value); setCurrentPage(1); }} />
                    </div>
                </div>
            </div>

            <div className="ortable">
                <div className="sales-table-wrapper" style={{ maxHeight: "480px", overflowY: "auto" }}>
                    <table className="sales-table">
                        <thead style={{ position: "sticky", top: 0, zIndex: 5 }}>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer Name</th>
                                <th>Email</th>
                                <th>Date</th>
                                <th>Amount ({'\u20B9'})</th>
                                <th>Payment</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: "center", padding: "24px" }}>Loading orders...</td>
                                </tr>
                            ) : paginatedOrders.length > 0 ? (
                                paginatedOrders.map((ord) => (
                                    <tr key={ord._id} onClick={() => handleRowClick(ord)} style={{ cursor: "pointer" }}>
                                        <td><strong>{ord.OrderID}</strong></td>
                                        <td>{ord.Name}</td>
                                        <td>{ord.Email}</td>
                                        <td>{moment(ord.Date || ord.createdAt).format("DD-MM-YYYY")}</td>
                                        <td><strong>{'\u20B9'}{ord.Amount}</strong></td>
                                        <td>
                                            <span className={ord.Payment === "Paid" ? "green" : "red"}>
                                                {ord.Payment}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={getStatusColorClass(ord.Status)}>
                                                {ord.Status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: "center", padding: "24px" }}>No orders found matching criteria.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="sales-pagination">
                    <span>Showing page {currentPage} of {totalPages}</span>
                    <div className="sales-page-btns">
                        <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}>
                            Prev
                        </button>
                        <button disabled={currentPage >= totalPages} onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}>
                            Next
                        </button>
                    </div>
                </div>

                <div className="orbutton">
                    <div className="oraddbutton" onClick={handleOpenAdd} title="Create New Order">
                        <div className="addcir">
                            <i className="fa-solid fa-plus"></i>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Popup for Add / Edit Order */}
            {showModal > 0 && (
                <div className="profile-modal-overlay" onClick={() => setShowModal(0)}>
                    <div className="profile-modal-card" onClick={(e) => e.stopPropagation()}>
                        <button className="profile-close-btn" onClick={() => setShowModal(0)}>
                            <i className="fa-solid fa-xmark"></i>
                        </button>

                        <h2>{showModal === 1 ? "Create New Order" : "Manage Order Details"}</h2>

                        <div className="profile-form-group">
                            <label>Order ID</label>
                            <input type="text" value={id} onChange={(e) => setId(e.target.value)} required />
                        </div>

                        <div className="profile-form-group">
                            <label>Customer Name</label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. John Doe" required />
                        </div>

                        <div className="profile-form-group">
                            <label>Customer Email</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="e.g. john@example.com" />
                        </div>

                        <div className="profile-form-group">
                            <label>Product Name</label>
                            <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="e.g. Paracetamol 500mg" />
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                            <div className="profile-form-group">
                                <label>Quantity</label>
                                <input type="number" value={quantitySold} onChange={(e) => setQuantitySold(e.target.value)} min={1} />
                            </div>
                            <div className="profile-form-group">
                                <label>Amount ({'\u20B9'})</label>
                                <input type="number" value={amt} onChange={(e) => setAmt(e.target.value)} min={0} required />
                            </div>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                            <div className="profile-form-group">
                                <label>Payment Status</label>
                                <select 
                                    value={payment} 
                                    onChange={(e) => setPayment(e.target.value)}
                                    style={{ height: "42px", borderRadius: "10px", padding: "0 10px", backgroundColor: "var(--bg-input)", color: "var(--text-primary)", border: "1px solid var(--border-color)" }}
                                >
                                    <option value="Paid">Paid</option>
                                    <option value="Unpaid">Unpaid</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Failed">Failed</option>
                                </select>
                            </div>
                            <div className="profile-form-group">
                                <label>Order Status</label>
                                <select 
                                    value={status} 
                                    onChange={(e) => setStatus(e.target.value)}
                                    style={{ height: "42px", borderRadius: "10px", padding: "0 10px", backgroundColor: "var(--bg-input)", color: "var(--text-primary)", border: "1px solid var(--border-color)" }}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Processing">Processing</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>

                        <div className="profile-actions" style={{ marginTop: "12px" }}>
                            {showModal === 1 && (
                                <button className="profile-save-btn" onClick={handleSaveAdd}>
                                    Create Order
                                </button>
                            )}
                            {showModal === 2 && (
                                <>
                                    <button className="profile-save-btn" onClick={handleSaveUpdate}>
                                        Save Changes
                                    </button>
                                    <button className="profile-cancel-btn" style={{ borderColor: "#ef4444", color: "#ef4444" }} onClick={handleSaveDelete}>
                                        Delete Order
                                    </button>
                                </>
                            )}
                            <button className="profile-cancel-btn" onClick={() => setShowModal(0)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}