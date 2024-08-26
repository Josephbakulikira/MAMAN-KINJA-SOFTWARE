import express from "express";
import { protect, isAdmin } from "../middleware/authMiddleware.js";
import { createBill, deleteBill, getAllBills, getBill, getBills, removeBill, updateBill } from "../controllers/billController.js";
const router = express.Router();

router.post("/create", protect, isAdmin, createBill);
router.put("/update", protect ,isAdmin, updateBill);
router.delete("/delete/:id", protect, isAdmin, deleteBill);
router.post("/delete", protect, isAdmin, removeBill);

router.get("/all", getAllBills);
router.get("/", getBills);
router.get("/all/:id", getBill);

export default router;