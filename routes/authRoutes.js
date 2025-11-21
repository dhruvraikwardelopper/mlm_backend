

import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/User.js";

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password, sponsorId } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Validate sponsorId
    let sponsorObjectId = null;
    if (sponsorId && mongoose.Types.ObjectId.isValid(sponsorId)) {
      sponsorObjectId = sponsorId;
    }

    // Create user
    const newUser = new User({
      name,
      email: email.toLowerCase(),
      phone,
      password: hashedPassword,
      sponsorId: sponsorObjectId,
      membersCount: 0,
      earnings: 0,
    });
    await newUser.save();

    // Update sponsor
    if (sponsorObjectId) {
      const sponsor = await User.findById(sponsorObjectId);
      if (sponsor) {
        sponsor.membersCount += 1;
        sponsor.earnings += 500; // referral bonus
        await sponsor.save();
      }
    }

    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || "defaultsecret",
      { expiresIn: "2h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        sponsorId: user.sponsorId,
        membersCount: user.membersCount,
        earnings: user.earnings,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
