import { Order } from "../models/orderModel.js";

// Get all orders
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("products.productId");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create an order
export const createOrder = async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order status
export const updateOrder = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
