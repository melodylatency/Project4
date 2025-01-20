import express from "express";
const router = express.Router();
import {
  authUser,
  registerUser,
  logoutUser,
  getUsers,
  getUserById,
  deleteUser,
  updateUser,
  blockUser,
  unblockUser,
} from "../controllers/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

// ROUTE ORDER MATTERS!!!

router.route("/").get(protect, admin, getUsers);

router.post("/auth", authUser);
router.post("/register", registerUser);
router.post("/logout", logoutUser);

router
  .route("/:id")
  .get(protect, admin, getUserById)
  .delete(protect, admin, deleteUser)
  .put(protect, admin, updateUser);

router.route("/:id/block").put(protect, admin, blockUser);
router.route("/:id/unblock").put(protect, admin, unblockUser);

export default router;
