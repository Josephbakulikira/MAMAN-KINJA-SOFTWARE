import express from "express";
import { protect, isAdmin } from "../middleware/authMiddleware.js";
import { createItem, deleteItem, getItems, updateItem, getItem, buyItems } from "../controllers/itemController.js";
const router = express.Router();

router.post("/create", protect, isAdmin, createItem);
router.put("/update", protect, isAdmin, updateItem);
router.delete("/delete/:id", protect, isAdmin, deleteItem);
router.get("/:id", getItem);
router.get("/", getItems);
router.post("/buy", buyItems);

export default router;