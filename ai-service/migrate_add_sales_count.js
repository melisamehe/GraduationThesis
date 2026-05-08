// ai-service/migrate_add_sales_count.js
// Bu script mevcut ürünlere sales_count alanı ekler
// Çalıştır: node migrate_add_sales_count.js

const { MongoClient } = require("mongodb");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";
const DB_NAME = process.env.DB_NAME || "pos-application";

async function migrate() {
  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    console.log("MongoDB bağlantısı kuruldu");

    const db = client.db(DB_NAME);
    const products = db.collection("products");

    // sales_count alanı olmayan ürünlere 0 ekle
    const result = await products.updateMany(
      { sales_count: { $exists: false } },
      { $set: { sales_count: 0 } }
    );

    console.log(`✅ ${result.modifiedCount} ürüne sales_count alanı eklendi`);

    // Fatura verisinden satış sayılarını hesapla (varsa)
    const bills = db.collection("bills");
    const billCount = await bills.countDocuments();

    if (billCount > 0) {
      console.log(`\n📊 ${billCount} fatura bulundu, satış sayıları hesaplanıyor...`);

      // Tüm faturalardaki ürünleri say
      const pipeline = [
        { $unwind: "$cartItems" },
        {
          $group: {
            _id: "$cartItems._id",
            total_sales: { $sum: "$cartItems.quantity" },
          },
        },
      ];

      const salesData = await bills.aggregate(pipeline).toArray();
      console.log(`${salesData.length} farklı ürün için satış verisi bulundu`);

      for (const item of salesData) {
        if (!item._id) continue;
        try {
          const { ObjectId } = require("mongodb");
          await products.updateOne(
            { _id: new ObjectId(item._id) },
            { $set: { sales_count: item.total_sales } }
          );
        } catch (e) {
          // ID formatı uyumsuzsa atla
        }
      }

      console.log("✅ Satış sayıları güncellendi");
    }

    // Örnek kontrol
    const sample = await products.find({}).sort({ sales_count: -1 }).limit(5).toArray();
    console.log("\n🏆 En çok satan 5 ürün:");
    sample.forEach((p) =>
      console.log(`  - ${p.title || p.name}: ${p.sales_count} satış (${p.category})`)
    );
  } catch (err) {
    console.error("Hata:", err);
  } finally {
    await client.close();
  }
}

migrate();
