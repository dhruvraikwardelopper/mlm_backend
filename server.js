// ✅ server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// ✅ Import Routes
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import memberRoutes from "./routes/memberRoutes.js"; // 👈 yahi jaruri line hai
import dashboardRoutes from "./routes/dashboardRoutes.js";


dotenv.config();
const app = express();

// ✅ Middlewares
app.use(cors({ origin: [ "https://dhruvraikwardelopper.github.io",
    "https://mlm-backend-1-0ypb.onrender.com/mlm_Frontend"]}));
app.use(express.json());
app.use("/api/member", memberRoutes);

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.log("MongoDB connection error:", err));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/member", memberRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/products", productRoutes);
 // 👈 ensure this is below authRoutes

// ✅ Default route (for testing)
app.get("/", (req, res) => {
  res.send("🚀 MLM backend is running!");
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
