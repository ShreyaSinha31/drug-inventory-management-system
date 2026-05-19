import express from "express";
import { getOrders, createOrder, updateOrder } from "../controllers/orderController.js";
import { protect, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", protect, isAdmin, getOrders);
router.post("/", protect, createOrder);
router.put("/:id", protect, isAdmin, updateOrder);

export default router;
