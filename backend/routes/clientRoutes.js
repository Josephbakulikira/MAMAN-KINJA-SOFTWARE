import express from "express";
import { protect, isAdmin } from "../middleware/authMiddleware.js";
import { createClient, deleteClient, getClient, getClients, updateHistory, updateHistoryCheckInCheckOutRoom } from "../controllers/clientController.js";
const router = express.Router();

router.get("/all", getClients);
router.get("/single/:id", getClient);

router.post("/create", protect, createClient);
router.post("/delete", protect, isAdmin, deleteClient);
router.put("/update-history", protect, updateHistory);
router.put("/update", protect, updateHistoryCheckInCheckOutRoom);

export default router;