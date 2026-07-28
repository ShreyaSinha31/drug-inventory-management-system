import { Order } from "../models/orderModel.js";

// Get all orders
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create an order
export const createOrder = async (req, res) => {
  try {
    const { OrderID, Name, Email, Date: dateVal, Number: numVal, Amount, Payment, Status } = req.body;
    const generatedID = OrderID || `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder = new Order({
      user: req.user?._id,
      OrderID: generatedID,
      Name,
      Email,
      Date: dateVal || new Date(),
      Number: numVal || 0,
      Amount: Number(Amount) || 0,
      Payment: Payment || "Unpaid",
      Status: Status || "Pending",
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order
export const updateOrder = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete order
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    await order.deleteOne();
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
