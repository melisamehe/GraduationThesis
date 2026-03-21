const User = require("../models/User.js");
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Kayıt — herkes kaydolabilir, varsayılan rol: "user"
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Bu e-posta zaten kayıtlı." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: "user", // Yeni kayıtlar her zaman normal kullanıcı
    });

    await newUser.save();
    res.status(200).json("Kullanıcı başarıyla oluşturuldu.");
  } catch (error) {
    res.status(500).json(error);
  }
});

// Giriş — token + rol döner
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı!" });
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res.status(403).json({ message: "Şifre yanlış!" });
    }

    // JWT Token oluştur
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Şifreyi response'tan çıkar
    const { password, ...userInfo } = user._doc;

    res.status(200).json({ ...userInfo, token });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;