import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import "./inventory.css";
import iname from "../assets/name.jpg";
import idesc from "../assets/desc.jpg";
import iprice from "../assets/price.jpg";
import iqty from "../assets/qty.jpg";
import ictg from "../assets/category.jpg";
import imdate from "../assets/mdate.jpg";
import iedate from "../assets/edate.jpg";
import moment from 'moment';

const ProductForm = ({ initialProduct, mode, onClose, refreshProducts }) => {
  // mode can be "create", "update", or "delete"
  const [product, setProduct] = useState(
    initialProduct || {
      name: "",
      description: "",
      price: "",
      quantity: "",
      category: "",
      mfgDate: "",
      expDate: "",
    }
  );

  // This is our unified change handler:
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  // API call for creating a product
  const addData = async () => {
    try {
      const response = await axios.post(
        "https://med-track.onrender.com/api/products",
        product,
        { withCredentials: true }
      );
      toast.success("Product created successfully!");
      refreshProducts(); // Call a parent function to refresh the list if needed
      onClose(); // Close the form
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error creating product"
      );
      console.error(error);
    }
  };

  // API call for updating a product
  const updateData = async () => {
    try {
      const response = await axios.put(
        `https://med-track.onrender.com/api/products/${product._id}`,
        product,
        { withCredentials: true }
      );
      toast.success("Product updated successfully!");
      refreshProducts();
      onClose();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error updating product"
      );
      console.error(error);
    }
  };

  // API call for deleting a product
  const delData = async () => {
    try {
      const response = await axios.delete(
        `https://med-track.onrender.com/api/products/${product._id}`,
        { withCredentials: true }
      );
      toast.success("Product deleted successfully!");
      refreshProducts();
      onClose();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error deleting product"
      );
      console.error(error);
    }
  };
  console.log(product.mfgDate)
  // Render the form. Use the same input fields for all operations.
  // You can disable inputs if in "delete" mode, for example.
  return (
    <div className="addproduct">
      <div className="border"></div>

      <div className="medcontent">
        <div className="medicicon">
          <img src={iname} alt="name icon" />
        </div>
        <div className="medhead">
          <p>Name:</p>
        </div>
        <input
          type="text"
          name="name"
          value={product.name}
          onChange={handleChange}
          placeholder="Product Name"
        />
      </div>

      <div className="medcontent">
        <div className="medicicon">
          <img src={idesc} alt="description icon" />
        </div>
        <div className="medhead">
          <p>Description:</p>
        </div>
        <input
          type="text"
          name="description"
          value={product.description}
          onChange={handleChange}
          placeholder="Description"
        />
      </div>

      <div className="medcontent">
        <div className="medicicon">
          <img src={iprice} alt="price icon" style={{ height: "100%" }} />
        </div>
        <div className="medhead">
          <p>Price:</p>
        </div>
        <input
          type="number"
          name="price"
          value={product.price}
          onChange={handleChange}
          placeholder="Price"
        />
      </div>

      <div className="medcontent">
        <div className="medicicon">
          <img src={iqty} alt="quantity icon" />
        </div>
        <div className="medhead">
          <p>Quantity:</p>
        </div>
        <input
          type="number"
          name="quantity"
          value={product.quantity}
          onChange={handleChange}
          placeholder="Quantity"
        />
      </div>

      <div className="medcontent">
        <div className="medicicon">
          <img src={ictg} alt="category icon" />
        </div>
        <div className="medhead">
          <p>Category:</p>
        </div>
        <input
          type="text"
          name="category"
          value={product.category}
          onChange={handleChange}
          placeholder="Category"
        />
      </div>

      <div className="medcontent">
        <div className="medicicon">
          <img src={imdate} alt="manufacture date icon" />
        </div>
        <div className="medhead">
          <p>Manufactured on:</p>
        </div>
        <input
          type="date"
          name="mfgDate"
          value={product.mfgDate ? product.mfgDate.split("T")[0] : ""}
          onChange={handleChange}
        />
      </div>

      <div className="medcontent">
        <div className="medicicon">
          <img src={iedate} alt="expiry date icon" />
        </div>
        <div className="medhead">
          <p>Expiry date:</p>
        </div>
        <input
          type="date"
          name="expDate"
          value={product.expDate ? product.expDate.split("T")[0] : ""}
          onChange={handleChange}
        />
      </div>

      <div className="medcontent">
        <div className="medbuttons">
          {mode === "create" && (
            <button
              style={{ backgroundColor: "#1DBFC6" }}
              onClick={addData}
            >
              Add
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
