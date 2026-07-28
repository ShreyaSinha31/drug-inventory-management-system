import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    OrderID: { type: String, required: true },
    Name: { type: String, required: true },
    Email: { type: String, required: true },
    ProductName: { type: String, default: "Paracetamol 500mg" },
    QuantitySold: { type: Number, default: 1 },
    Date: { type: Date, default: Date.now },
    Number: { type: Number, default: 0 },
    Amount: { type: Number, required: true },
    Payment: { type: String, enum: ["Paid", "Unpaid", "Pending", "Failed"], default: "Paid" },
    PaymentMethod: { type: String, enum: ["UPI", "Card", "Cash", "NetBanking"], default: "UPI" },
    Status: { type: String, enum: ["Pending", "Processing", "Received", "Delivered", "Cancelled"], default: "Delivered" },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);


