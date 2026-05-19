import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} from "../controllers/productController.js";
import { protect } from "../middlewares/authMiddleware.js"; // Auth Middleware

const router = express.Router();

router.get("/", protect, getProducts); // Get products (Only user's own)
router.get("/:id", protect, getProductById); // Get single product (Only if user owns it)
router.post("/", protect, createProduct); // Create product
router.put("/:id", protect, updateProduct); // Update product (Only if user owns it)
router.delete("/:id", protect, deleteProduct); // Delete product (Only if user owns it)

export default router;

