const Category = require("../models/Category.js");
const express = require("express");
const router = express.Router();
const requireAdmin = require("../middleware/requireAdmin.js");

// Herkese açık — kategorileri listele
router.get("/get-all", async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Sadece superadmin — kategori ekle
router.post("/add-category", requireAdmin, async (req, res) => {
  try {
    const newCategory = new Category(req.body);
    await newCategory.save();
    res.status(200).json("Kategori başarıyla eklendi.");
  } catch (error) {
    res.status(500).json(error);
  }
});

// Sadece superadmin — kategori güncelle
router.put("/update-category", requireAdmin, async (req, res) => {
  try {
    await Category.findOneAndUpdate({ _id: req.body.categoryId }, req.body);
    res.status(200).json("Kategori başarıyla güncellendi.");
  } catch (error) {
    res.status(500).json(error);
  }
});

// Sadece superadmin — kategori sil
router.delete("/delete-category", requireAdmin, async (req, res) => {
  try {
    await Category.findOneAndDelete({ _id: req.body.categoryId });
    res.status(200).json("Kategori başarıyla silindi.");
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;