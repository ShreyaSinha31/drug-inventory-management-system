import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ["pending", "shipped", "delivered"], default: "pending" },
  customerDetails: { type: Object, required: true },
  orderDate: { type: Date, default: Date.now },
});

//export default mongoose.model("Order", orderSchema);
export const Order = mongoose.model("Order", orderSchema);

