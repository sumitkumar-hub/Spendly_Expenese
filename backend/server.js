import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";   // ✅ ADD
import dashboardRoutes from "./routes/dashboardRoutes.js";       // ✅ ADD

dotenv.config();

const app = express();

// ✅ Middleware
app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173"
}));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);   // ✅ ADD
app.use("/api/dashboard", dashboardRoutes);       // ✅ ADD

// ✅ MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// ✅ Server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});