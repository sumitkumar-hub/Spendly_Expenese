import express from "express";
import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";

const router = express.Router();

// ================= AUTH =================

// ✅ REGISTER
router.post("/register", registerUser);

// ✅ LOGIN
router.post("/login", loginUser);

// 🔥 FORGOT PASSWORD
router.post("/forgot-password", forgotPassword);

// 🔥 RESET PASSWORD
router.post("/reset-password/:token", resetPassword);

export default router;