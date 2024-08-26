import express from "express";
import { protect, isAdmin } from "../middleware/authMiddleware.js";
import { createOrder, deleteOrder, getOrder, getOrders, updateOrder, updateStatus } from "../controllers/orderController.js";
const router = express.Router();

router.post("/create", protect, isAdmin, createOrder);
router.put("/update", protect ,isAdmin, updateOrder);
router.delete("/delete/:id", protect, isAdmin, deleteOrder);
router.post("/update", protect, updateStatus);
router.get("/", protect, getOrders);
router.get("/:id", protect, getOrder);

export default router;