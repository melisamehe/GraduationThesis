# ai-service/main.py
# Kurulum: pip install fastapi uvicorn motor python-dotenv
# Çalıştır: uvicorn main:app --reload --port 8000

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from motor.motor_asyncio import AsyncIOMotorClient
from collections import Counter
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="POS Recommendation Engine",
    description="Mels Store için AI tabanlı ürün öneri servisi",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", os.getenv("FRONTEND_URL", "*")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── MongoDB ───────────────────────────────────────────────────────────────────
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME   = os.getenv("DB_NAME", "pos-application")   # .env'den gelir

client = AsyncIOMotorClient(MONGO_URI)
db = client[DB_NAME]

# ─── MODELLER ─────────────────────────────────────────────────────────────────

class CartItem(BaseModel):
    product_id: str
    category: str
    quantity: int = 1

class CartRecommendationRequest(BaseModel):
    cart_items: List[CartItem]
    limit: int = 4

# ─── YARDIMCI ─────────────────────────────────────────────────────────────────

async def get_top_selling_by_category(
    category: str, exclude_id: Optional[str], limit: int
):
    query = {"category": category}
    if exclude_id:
        from bson import ObjectId
        try:
            query["_id"] = {"$ne": ObjectId(exclude_id)}
        except Exception:
            pass

    # Product.js → salesCount (camelCase)
    cursor = db.products.find(query).sort("salesCount", -1).limit(limit)
    products = []
    async for product in cursor:
        product["_id"] = str(product["_id"])
        products.append(product)
    return products

# ─── ENDPOINT'LER ─────────────────────────────────────────────────────────────

@app.get("/")
async def root():
    return {"status": "ok", "service": "POS Recommendation Engine"}


@app.get("/health")
async def health():
    try:
        await client.admin.command("ping")
        return {"status": "healthy", "db": "connected"}
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"DB bağlantı hatası: {e}")


@app.get("/recommendations")
async def get_recommendations(
    category: str = Query(..., description="Ürün kategorisi"),
    exclude_id: Optional[str] = Query(None, description="Hariç tutulacak ürün ID"),
    limit: int = Query(6, ge=1, le=20),
):
    """Kategori bazlı öneri — sadece aynı kategoriden en çok satanlar."""
    recommendations = await get_top_selling_by_category(category, exclude_id, limit)
    return {
        "category": category,
        "total": len(recommendations),
        "recommendations": recommendations,
    }


@app.post("/recommendations/cart")
async def get_cart_recommendations(request: CartRecommendationRequest):
    """Sepetteki ürünlere göre tamamlayıcı öneri."""
    if not request.cart_items:
        raise HTTPException(status_code=400, detail="Sepet boş")

    category_counts  = Counter(item.category for item in request.cart_items)
    cart_product_ids = {item.product_id for item in request.cart_items}
    dominant_category = category_counts.most_common(1)[0][0]

    all_categories = await db.products.distinct("category")
    other_categories = [c for c in all_categories if c != dominant_category]

    recommendations = []
    seen_ids = set(cart_product_ids)

    for category in [dominant_category] + other_categories:
        if len(recommendations) >= request.limit:
            break
        cursor = db.products.find({"category": category}).sort("salesCount", -1).limit(4)
        async for product in cursor:
            pid = str(product["_id"])
            if pid not in seen_ids:
                product["_id"] = pid
                recommendations.append(product)
                seen_ids.add(pid)
                if len(recommendations) >= request.limit:
                    break

    return {
        "based_on_categories": list(category_counts.keys()),
        "total": len(recommendations),
        "recommendations": recommendations,
    }


@app.get("/recommendations/trending")
async def get_trending(limit: int = Query(8, ge=1, le=20)):
    """Tüm sistemdeki en çok satanlar."""
    cursor = db.products.find({}).sort("salesCount", -1).limit(limit)
    products = []
    async for product in cursor:
        product["_id"] = str(product["_id"])
        products.append(product)
    return {"total": len(products), "recommendations": products}


@app.get("/stats/categories")
async def category_stats():
    """Her kategorinin ürün sayısı ve toplam satışı."""
    pipeline = [
        {
            "$group": {
                "_id": "$category",
                "product_count": {"$sum": 1},
                "total_sales":   {"$sum": "$salesCount"},   # salesCount
                "avg_price":     {"$avg": "$price"},
            }
        },
        {"$sort": {"total_sales": -1}},
    ]
    result = []
    async for doc in db.products.aggregate(pipeline):
        result.append(doc)
    return {"categories": result}
