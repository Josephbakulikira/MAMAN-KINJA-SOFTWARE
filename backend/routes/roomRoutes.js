import express from "express";
import { protect, isAdmin } from "../middleware/authMiddleware.js";
import { createRoom, deleteRoom, getRoom, getRooms, updateAvailability } from "../controllers/roomController.js";
const router = express.Router();

router.get("/all", getRooms);
router.get("/single/:id", getRoom);

router.post("/create", protect, createRoom);
router.post("/delete", protect, isAdmin, deleteRoom);
router.put("/update-availability", protect, updateAvailability);

export default router;