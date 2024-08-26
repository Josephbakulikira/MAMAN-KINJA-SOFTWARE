import express from "express";
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUser,
  updateUserRole,
} from "../controllers/userController.js";
import { isAdmin, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/auth", authUser);
router.post("/register", registerUser);
router.post("/logout", logoutUser);
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router.get("/all", protect, isAdmin, getUsers);
router.get("/all/:id", protect, getUser)
router.put("/role", protect, isAdmin, updateUserRole)

export default router;
