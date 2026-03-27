/**
 * E-Ticaret Kategori & Ürün Seed Script
 * ----------------------------------------
 * Çalıştır: node seedData.js
 */

require("dotenv").config();
const mongoose = require("mongoose");
const Category = require("./models/Category.js");
const Product  = require("./models/Product.js");

// ── Kategoriler ────────────────────────────────────────────────────────────────
const categories = [
  { title: "Tümü" },
  { title: "Kadın Giyim" },
  { title: "Erkek Giyim" },
  { title: "Ayakkabı" },
  { title: "Çanta & Aksesuar" },
  { title: "Elektronik" },
  { title: "Kozmetik" },
  { title: "Ev & Yaşam" },
];

// ── Ürünler ────────────────────────────────────────────────────────────────────
const products = [
  // ─── Kadın Giyim ─────────────────────────────────────────────────────────────
  {
    title: "Oversize Blazer",
    img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&q=80",
    price: 849,
    category: "Kadın Giyim",
    description: "Şık kesim, her ortama uygun oversize blazer ceket. S-XXL beden aralığı.",
    salesCount: 312,
  },
  {
    title: "Midi Etek",
    img: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400&q=80",
    price: 459,
    category: "Kadın Giyim",
    description: "Saten kumaş, A-line kesim midi etek. Siyah ve bej seçeneği.",
    salesCount: 275,
  },
  {
    title: "Crop Top",
    img: "https://images.unsplash.com/photo-1554568218-0f1715e72254?w=400&q=80",
    price: 249,
    category: "Kadın Giyim",
    description: "Yumuşak pamuklu kumaş, fitted crop top. 8 renk seçeneği.",
    salesCount: 480,
  },
  {
    title: "Trençkot",
    img: "https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=400&q=80",
    price: 1299,
    category: "Kadın Giyim",
    description: "Klasik çift taraflı trençkot, yağmura dayanıklı kumaş. Bej ve siyah.",
    salesCount: 198,
  },
  {
    title: "Yüksek Bel Jean",
    img: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&q=80",
    price: 699,
    category: "Kadın Giyim",
    description: "Slim fit, yüksek bel, esnek denim. 24-34 beden.",
    salesCount: 530,
  },

  // ─── Erkek Giyim ─────────────────────────────────────────────────────────────
  {
    title: "Oxford Gömlek",
    img: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&q=80",
    price: 549,
    category: "Erkek Giyim",
    description: "Slim fit Oxford kumaş gömlek. Beyaz, mavi ve açık gri renklerde.",
    salesCount: 360,
  },
  {
    title: "Slim Fit Chino",
    img: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&q=80",
    price: 629,
    category: "Erkek Giyim",
    description: "Esnek kumaş slim fit chino pantolon. Bej, lacivert, haki seçenekleri.",
    salesCount: 290,
  },
  {
    title: "Oversize Hoodie",
    img: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&q=80",
    price: 479,
    category: "Erkek Giyim",
    description: "Kalın pamuklu kumaş oversize kapüşonlu sweatshirt.",
    salesCount: 420,
  },
  {
    title: "Keten Ceket",
    img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&q=80",
    price: 999,
    category: "Erkek Giyim",
    description: "Hafif keten kumaş, düğmeli ceket. Yaz ve ilkbahar için ideal.",
    salesCount: 175,
  },
  {
    title: "Basic Tişört (5'li Paket)",
    img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80",
    price: 399,
    category: "Erkek Giyim",
    description: "Organik pamuklu basic tişört seti. XS-3XL beden. 5 farklı renk.",
    salesCount: 610,
  },

  // ─── Ayakkabı ─────────────────────────────────────────────────────────────────
  {
    title: "Deri Sneaker",
    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
    price: 1499,
    category: "Ayakkabı",
    description: "Gerçek deri üst, hafif EVA taban. Beyaz ve siyah.",
    salesCount: 340,
  },
  {
    title: "Platform Bot",
    img: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&q=80",
    price: 1199,
    category: "Ayakkabı",
    description: "5 cm platform taban, fermuarlı Chelsea bot. Siyah deri.",
    salesCount: 215,
  },
  {
    title: "Loafer Ayakkabı",
    img: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=400&q=80",
    price: 899,
    category: "Ayakkabı",
    description: "Kayış detaylı, bağcıksız loafer. Erkek ve kadın modeli mevcut.",
    salesCount: 280,
  },
  {
    title: "Spor Koşu Ayakkabısı",
    img: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&q=80",
    price: 1799,
    category: "Ayakkabı",
    description: "Çevre dostu geri dönüştürülmüş malzeme, yüksek esneklik tabanlı koşu ayakkabısı.",
    salesCount: 390,
  },

  // ─── Çanta & Aksesuar ─────────────────────────────────────────────────────────
  {
    title: "Mini Crossbody Çanta",
    img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80",
    price: 749,
    category: "Çanta & Aksesuar",
    description: "Vegan deri mini omuz çantası, altın toka detayı. 5 renk.",
    salesCount: 430,
  },
  {
    title: "Canvas Tote Çanta",
    img: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=400&q=80",
    price: 299,
    category: "Çanta & Aksesuar",
    description: "Geri dönüştürülmüş pamuklu kanvas tote çanta. Baskılı ve düz seçenek.",
    salesCount: 560,
  },
  {
    title: "Güneş Gözlüğü",
    img: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80",
    price: 449,
    category: "Çanta & Aksesuar",
    description: "UV400 korumalı, polarize camlı cat-eye güneş gözlüğü.",
    salesCount: 310,
  },
  {
    title: "Deri Kemer",
    img: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=400&q=80",
    price: 349,
    category: "Çanta & Aksesuar",
    description: "Tam tahıllı gerçek deri kemer, gümüş toka. 85-110 cm.",
    salesCount: 195,
  },

  // ─── Elektronik ───────────────────────────────────────────────────────────────
  {
    title: "Kablosuz Kulaklık",
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
    price: 2499,
    category: "Elektronik",
    description: "40 saat pil ömrü, aktif gürültü engelleme, aptX HD. Siyah ve beyaz.",
    salesCount: 280,
  },
  {
    title: "Akıllı Saat",
    img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80",
    price: 3999,
    category: "Elektronik",
    description: "AMOLED ekran, GPS, kalp ritmi ve SpO2 sensörü. 7 gün pil ömrü.",
    salesCount: 195,
  },
  {
    title: "Taşınabilir Şarj Aleti",
    img: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&q=80",
    price: 699,
    category: "Elektronik",
    description: "20.000 mAh, 65W hızlı şarj, 3 çıkış portu. Kompakt tasarım.",
    salesCount: 450,
  },

  // ─── Kozmetik ─────────────────────────────────────────────────────────────────
  {
    title: "Nemlendirici Serum",
    img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80",
    price: 599,
    category: "Kozmetik",
    description: "Hyaluronik asit ve C vitamini içerikli, aydınlatıcı nemlendirici serum. 30 ml.",
    salesCount: 520,
  },
  {
    title: "Mat Ruj Seti",
    img: "https://images.unsplash.com/photo-1512207736890-6ffed8a84e8d?w=400&q=80",
    price: 349,
    category: "Kozmetik",
    description: "12 saat kalıcı, transfersiz mat ruj. 6'lı set, nude + bold tonlar.",
    salesCount: 380,
  },
  {
    title: "Parfüm EDP 50ml",
    img: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&q=80",
    price: 1299,
    category: "Kozmetik",
    description: "Odun ve amber notaları, 8-10 saat kalıcılık. Unisex EDP.",
    salesCount: 240,
  },

  // ─── Ev & Yaşam ───────────────────────────────────────────────────────────────
  {
    title: "Pamuklu Nevresim Takımı",
    img: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80",
    price: 899,
    category: "Ev & Yaşam",
    description: "200 iplik sayısı, saf pamuk nevresim takımı. Çift kişilik. 6 renk.",
    salesCount: 175,
  },
  {
    title: "Seramik Vazo Seti",
    img: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&q=80",
    price: 449,
    category: "Ev & Yaşam",
    description: "El yapımı seramik vazo, 3 farklı boy. Beyaz mat ve bej tonları.",
    salesCount: 210,
  },
  {
    title: "Bambu Mutfak Seti",
    img: "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400&q=80",
    price: 329,
    category: "Ev & Yaşam",
    description: "Sürdürülebilir bambu mutfak gereçleri seti. Spatula, kaşık, maşa.",
    salesCount: 295,
  },
];

// ── Ana Fonksiyon ──────────────────────────────────────────────────────────────
const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB bağlantısı kuruldu.");

    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log("🗑️  Eski kategoriler ve ürünler silindi.");

    const insertedCategories = await Category.insertMany(categories);
    console.log(`📂 ${insertedCategories.length} kategori eklendi:`);
    insertedCategories.forEach((c) => console.log(`   • ${c.title}`));

    const insertedProducts = await Product.insertMany(products);
    console.log(`\n🛍️  ${insertedProducts.length} ürün eklendi.`);

    console.log("\n✅ E-ticaret seed işlemi tamamlandı!");
  } catch (err) {
    console.error("❌ Hata:", err);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Bağlantı kapatıldı.");
    process.exit(0);
  }
};

seed();
