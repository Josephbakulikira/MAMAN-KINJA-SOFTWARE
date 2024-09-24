import express from "express";
import { protect, isAdmin } from "../middleware/authMiddleware.js";
import { generateInventory, getAllInventories } from "../controllers/inventoryController.js";
const router = express.Router();

router.post("/generate", protect, isAdmin, generateInventory);
router.get("/all", getAllInventories);

export default router;