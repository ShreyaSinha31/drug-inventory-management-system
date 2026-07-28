import React, { useState } from "react";
import { toast } from "react-hot-toast";
import api from "../api/axios";
import "./inventory.css";
import moment from "moment";

const ProductForm = ({ initialProduct, mode, onClose, refreshProducts }) => {

  // mode can be "create", "update", or "delete"
  const [product, setProduct] = useState(
    initialProduct || {
      drugId: "",
      name: "",
      description: "",
      price: "",
      quantity: "",
      category: "",
      manufacturer: "",
      batchNumber: "",
      supplier: "",
      mfgDate: "",
      expDate: "",
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!product.name || !product.name.trim()) {
      errs.name = "Product Name is required";
    }
    if (product.price === "" || isNaN(product.price) || Number(product.price) <= 0) {
      errs.price = "Price must be a positive number (> 0)";
    }
    if (product.quantity === "" || isNaN(product.quantity) || Number(product.quantity) < 0) {
      errs.quantity = "Quantity cannot be negative";
    }
    if (!product.expDate) {
      errs.expDate = "Expiry date is required";
    } else if (product.mfgDate && new Date(product.expDate) < new Date(product.mfgDate)) {
      errs.expDate = "Expiry date cannot be before manufacturing date";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const addData = async () => {
    if (!validate()) {
      toast.error("Please fix all form validation errors!");
      return;
    }
    try {
      await api.post("/products", product);
      toast.success("✅ Product Added Successfully!");
      if (refreshProducts) refreshProducts();
      onClose();
    } catch (error) {
      const msg = error.response?.data?.message || "❌ Server Error adding product";
      toast.error(msg);
      console.error(error);
    }
  };

  const updateData = async () => {
    if (!validate()) {
      toast.error("Please fix all form validation errors!");
      return;
    }
    try {
      await api.put(`/products/${product._id}`, product);
      toast.success("✅ Product Updated Successfully!");
      if (refreshProducts) refreshProducts();
      onClose();
    } catch (error) {
      const msg = error.response?.data?.message || "❌ Error updating product";
      toast.error(msg);
      console.error(error);
    }
  };

  const delData = async () => {
    if (!window.confirm(`Are you sure you want to delete '${product.name}'?`)) return;
    try {
      await api.delete(`/products/${product._id}`);
      toast.success("✅ Product Deleted Successfully!");
      if (refreshProducts) refreshProducts();
      onClose();
    } catch (error) {
      const msg = error.response?.data?.message || "❌ Error deleting product";
      toast.error(msg);
      console.error(error);
    }
  };


  return (
    <div className="addproduct" style={{ maxHeight: "85vh", overflowY: "auto" }}>
      <div className="border"></div>
      <h3 style={{ color: "var(--text-primary)", textAlign: "center", marginBottom: "12px", width: "100%" }}>
        {mode === "create" ? "Add New Drug Product" : "Manage Product Details"}
      </h3>

      <div className="medcontent">
        <div className="medicicon">
          <i className="fa-solid fa-barcode" style={{ color: "#329dff", fontSize: "1.2rem" }}></i>
        </div>
        <div className="medhead">
          <p>Drug ID:</p>
        </div>
        <input
          type="text"
          name="drugId"
          value={product.drugId || ""}
          onChange={handleChange}
          placeholder="e.g. DRUG-98421 (Auto-generated if empty)"
        />
      </div>

      <div className="medcontent" style={{ flexDirection: "column", alignItems: "flex-start" }}>
        <div style={{ display: "flex", width: "100%", alignItems: "center" }}>
          <div className="medicicon">
            <i className="fa-solid fa-capsules" style={{ color: "#329dff", fontSize: "1.2rem" }}></i>
          </div>
          <div className="medhead">
            <p>Name:</p>
          </div>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            placeholder="Product Name (e.g. Paracetamol 500mg)"
            required
          />
        </div>
        {errors.name && <span style={{ color: "#ec6869", fontSize: "0.8rem", marginLeft: "40%", marginTop: "2px" }}>{errors.name}</span>}
      </div>

      <div className="medcontent">
        <div className="medicicon">
          <i className="fa-solid fa-tags" style={{ color: "#1dbfc6", fontSize: "1.2rem" }}></i>
        </div>
        <div className="medhead">
          <p>Category:</p>
        </div>
        <input
          type="text"
          name="category"
          value={product.category}
          onChange={handleChange}
          placeholder="Category (e.g. Pain Relief, Antibiotics)"
        />
      </div>

      <div className="medcontent">
        <div className="medicicon">
          <i className="fa-solid fa-industry" style={{ color: "#1dbfc6", fontSize: "1.2rem" }}></i>
        </div>
        <div className="medhead">
          <p>Manufacturer:</p>
        </div>
        <input
          type="text"
          name="manufacturer"
          value={product.manufacturer || ""}
          onChange={handleChange}
          placeholder="e.g. Cipla Pharma / Sun Health"
        />
      </div>

      <div className="medcontent">
        <div className="medicicon">
          <i className="fa-solid fa-layer-group" style={{ color: "#f9d50a", fontSize: "1.2rem" }}></i>
        </div>
        <div className="medhead">
          <p>Batch Number:</p>
        </div>
        <input
          type="text"
          name="batchNumber"
          value={product.batchNumber || ""}
          onChange={handleChange}
          placeholder="e.g. BATCH-7721"
        />
      </div>

      <div className="medcontent">
        <div className="medicicon">
          <i className="fa-solid fa-truck" style={{ color: "#ec6869", fontSize: "1.2rem" }}></i>
        </div>
        <div className="medhead">
          <p>Supplier:</p>
        </div>
        <input
          type="text"
          name="supplier"
          value={product.supplier || ""}
          onChange={handleChange}
          placeholder="e.g. Apex Medical Distributors"
        />
      </div>

      <div className="medcontent">
        <div className="medicicon">
          <i className="fa-solid fa-file-medical" style={{ color: "#329dff", fontSize: "1.2rem" }}></i>
        </div>
        <div className="medhead">
          <p>Description:</p>
        </div>
        <input
          type="text"
          name="description"
          value={product.description}
          onChange={handleChange}
          placeholder="Clinical description or usage details"
        />
      </div>

      <div className="medcontent" style={{ flexDirection: "column", alignItems: "flex-start" }}>
        <div style={{ display: "flex", width: "100%", alignItems: "center" }}>
          <div className="medicicon">
            <i className="fa-solid fa-indian-rupee-sign" style={{ color: "#1dbfc6", fontSize: "1.2rem" }}></i>
          </div>
          <div className="medhead">
            <p>Unit Price ({'\u20B9'}):</p>
          </div>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            placeholder="Price per unit"
            required
          />
        </div>
        {errors.price && <span style={{ color: "#ec6869", fontSize: "0.8rem", marginLeft: "40%", marginTop: "2px" }}>{errors.price}</span>}
      </div>

      <div className="medcontent" style={{ flexDirection: "column", alignItems: "flex-start" }}>
        <div style={{ display: "flex", width: "100%", alignItems: "center" }}>
          <div className="medicicon">
            <i className="fa-solid fa-boxes-stacked" style={{ color: "#f9d50a", fontSize: "1.2rem" }}></i>
          </div>
          <div className="medhead">
            <p>Quantity:</p>
          </div>
          <input
            type="number"
            name="quantity"
            value={product.quantity}
            onChange={handleChange}
            placeholder="Stock quantity available"
            required
          />
        </div>
        {errors.quantity && <span style={{ color: "#ec6869", fontSize: "0.8rem", marginLeft: "40%", marginTop: "2px" }}>{errors.quantity}</span>}
      </div>

      <div className="medcontent">
        <div className="medicicon">
          <i className="fa-solid fa-calendar-plus" style={{ color: "#329dff", fontSize: "1.2rem" }}></i>
        </div>
        <div className="medhead">
          <p>Mfg Date:</p>
        </div>
        <input
          type="date"
          name="mfgDate"
          value={product.mfgDate ? product.mfgDate.split("T")[0] : ""}
          onChange={handleChange}
        />
      </div>

      <div className="medcontent" style={{ flexDirection: "column", alignItems: "flex-start" }}>
        <div style={{ display: "flex", width: "100%", alignItems: "center" }}>
          <div className="medicicon">
            <i className="fa-solid fa-calendar-xmark" style={{ color: "#ec6869", fontSize: "1.2rem" }}></i>
          </div>
          <div className="medhead">
            <p>Expiry Date:</p>
          </div>
          <input
            type="date"
            name="expDate"
            value={product.expDate ? product.expDate.split("T")[0] : ""}
            onChange={handleChange}
            required
          />
        </div>
        {errors.expDate && <span style={{ color: "#ec6869", fontSize: "0.8rem", marginLeft: "40%", marginTop: "2px" }}>{errors.expDate}</span>}
      </div>



      <div className="medcontent">
        <div className="medbuttons">
          {mode === "create" && (
            <button
              style={{ backgroundColor: "#1DBFC6" }}
              onClick={addData}
            >
              Add Product
            </button>
          )}
          {mode === "update" && (
            <button
              style={{ backgroundColor: "#F9D50A" }}
              onClick={updateData}
            >
              Update
            </button>
          )}
          {mode === "update" && (
            <button
              style={{ backgroundColor: "#329DFF" }}
              onClick={delData}
            >
              Delete
            </button>
           )}
          <button
            onClick={onClose}
            style={{ backgroundColor: "#EC6869" }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};


export default ProductForm;
