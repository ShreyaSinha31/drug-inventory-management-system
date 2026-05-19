import mongoose from "mongoose";
import { User } from "./userModel.js";

const productSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: User, required: true }, // Owner of the product
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  category: { type: String },
  mfgDate: { type: Date, default: Date.now },
  expDate: { type: Date, required: true },
});

export const Product = mongoose.model("Product", productSchema);
