


import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

/*
---------------------------------------------
 GET Products with Pagination
 Endpoint: /api/products?skip=0&limit=8
---------------------------------------------
*/
router.get("/", async (req, res) => {
  try {
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 0; // default: no pagination

    let products;
    const total = await Product.countDocuments();

    if (limit > 0) {
      products = await Product.find().skip(skip).limit(limit);
    } else {
      products = await Product.find();
    }

    res.status(200).json({
      success: true,
      products,
      total,
    });

  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/*
---------------------------------------------
 Add new product (Optional)
---------------------------------------------
*/
router.post("/", async (req, res) => {
  const { name, description, price, image } = req.body;

  if (!name || !price) {
    return res.status(400).json({ error: "Name and price required" });
  }

  try {
    const newProduct = new Product({ name, description, price, image });
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    console.error("Error adding product:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
