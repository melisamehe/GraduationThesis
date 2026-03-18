const Product = require("../models/Product.js");
const express = require("express");
const router = express.Router();
const requireAdmin = require("../middleware/requireAdmin.js");

// Herkese açık — ürünleri listele
router.get("/get-all", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Herkese açık — tek ürün getir
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Ürün bulunamadı." });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Sadece superadmin — ürün ekle
router.post("/add-product", requireAdmin, async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(200).json("Ürün başarıyla eklendi.");
  } catch (error) {
    res.status(500).json(error);
  }
});

// Sadece superadmin — ürün güncelle
router.put("/update-product", requireAdmin, async (req, res) => {
  try {
    const { productId, ...updateData } = req.body;
    await Product.findOneAndUpdate({ _id: productId }, updateData);
    res.status(200).json("Ürün başarıyla güncellendi.");
  } catch (error) {
    res.status(500).json(error);
  }
});

// Sadece superadmin — ürün sil
router.delete("/delete-product", requireAdmin, async (req, res) => {
  try {
    await Product.findOneAndDelete({ _id: req.body.productId });
    res.status(200).json("Ürün başarıyla silindi.");
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;