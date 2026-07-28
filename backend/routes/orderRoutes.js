import express from "express";
import { getOrders, createOrder, updateOrder, deleteOrder } from "../controllers/orderController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getOrders);
router.post("/", protect, createOrder);
router.put("/:id", protect, updateOrder);
router.delete("/:id", protect, deleteOrder);

export default router;
