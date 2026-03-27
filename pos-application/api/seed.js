/**
 * Superadmin Seed Script
 * ----------------------
 * Çalıştır: node seed.js
 *
 * Bu script MongoDB'de superadmin rolünde bir kullanıcı oluşturur.
 * Eğer aynı e-posta zaten varsa günceller.
 */

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User.js");

// ⚠️ İstediğiniz bilgileri buraya girin:
const SUPERADMIN_USERNAME = "admin";
const SUPERADMIN_EMAIL    = "admin@melsstore.com";
const SUPERADMIN_PASSWORD = "Admin1234!";

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB bağlantısı kuruldu.");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(SUPERADMIN_PASSWORD, salt);

    const result = await User.findOneAndUpdate(
      { email: SUPERADMIN_EMAIL },
      {
        username: SUPERADMIN_USERNAME,
        email:    SUPERADMIN_EMAIL,
        password: hashedPassword,
        role:     "superadmin",
      },
      { upsert: true, new: true }
    );

    console.log(`✅ Superadmin hesabı oluşturuldu / güncellendi:`);
    console.log(`   👤 Kullanıcı Adı : ${result.username}`);
    console.log(`   📧 E-posta        : ${result.email}`);
    console.log(`   🔑 Şifre          : ${SUPERADMIN_PASSWORD}`);
    console.log(`   🛡️  Rol            : ${result.role}`);
    console.log("\n⚠️  Lütfen giriş yaptıktan sonra şifrenizi değiştirin!");

  } catch (err) {
    console.error("❌ Hata:", err);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Bağlantı kapatıldı.");
    process.exit(0);
  }
};

seed();
