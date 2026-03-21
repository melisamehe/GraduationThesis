const Bill = require("../models/Bill.js");
const Product = require("../models/Product.js");
const express = require("express");
const router = express.Router();

// get all Bill
router.get("/get-all", async (req, res) => {
  try {
    const bills = await Bill.find();
    res.status(200).json(bills);
  } catch (error) {
    res.status(500).json(error);
  }
});

// create — salesCount güncelleme eklendi
router.post("/add-bill", async (req, res) => {
  try {
    const newBill = new Bill(req.body);
    await newBill.save();

    // Her satılan ürünün salesCount'unu artır (AI öneri sistemi için)
    const cartItems = req.body.cartItems || [];
    const bulkOps = cartItems
      .filter((item) => item._id)
      .map((item) => ({
        updateOne: {
          filter: { _id: item._id },
          update: { $inc: { salesCount: item.quantity || 1 } },
        },
      }));

    if (bulkOps.length > 0) {
      await Product.bulkWrite(bulkOps);
    }

    res.status(200).json("Item added successfully.");
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
