

// memberRoutes.js
import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import EarningHistory from "../models/EarningHistory.js";
import Earning from "../models/Earning.js"; // 👈 import top me


const router = express.Router();

// 🔹 Add new member
router.post("/add", async (req, res) => {
  try {
    const { name, email, phone, password, loginUserId, referralId } = req.body;
    console.log("🟢 Request body received:", req.body); // 👈 ye line add kar
    console.log("🟠 loginUserId:", loginUserId);        // 👈 ye line add kar
    // ✅ Validate fields
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Check duplicate
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create new member
    const newUser = new User({ name, email, phone, password: hashedPassword });
    await newUser.save();

    // ✅ Update the user who added this member
    if (loginUserId && mongoose.Types.ObjectId.isValid(loginUserId)) {
      const updatedLoginUser = await User.findByIdAndUpdate(
        loginUserId,
        {
          $inc: { membersCount: 1, earnings: 500 }, // Increment directly
        },
        { new: true } // return updated document
      );
        await EarningHistory.create({
    userId: loginUserId,
    amount: 500,
  });
       // ✅ Add earning record for dashboard chart
      await Earning.create({
        userId: loginUserId,
        amount: 500,
        date: new Date(),
      });


      console.log("✅ Updated login user:", updatedLoginUser);
    }else {
      console.log("❌ Invalid or missing loginUserId:", loginUserId);
    }

    // ✅ If referral also exists, update that user too
    if (referralId && mongoose.Types.ObjectId.isValid(referralId)) {
      const updatedReferralUser = await User.findByIdAndUpdate(
        referralId,
        {
          $inc: { membersCount: 1, earnings: 500 },
        },
        { new: true }
      );


          // ✅ Add daily earning entry


      console.log("✅ Updated referral user:", updatedReferralUser);
    }

    return res.status(201).json({
      success: true,
      message: "Member added successfully!",
      user: newUser,
    });
  } catch (error) {
    console.error("❌ Add member error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
});

router.get("/all", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
