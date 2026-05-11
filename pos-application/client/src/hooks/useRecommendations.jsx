// react-components/useRecommendations.js
// Bu dosyayı client/src/hooks/useRecommendations.js olarak ekle

import { useState, useEffect, useCallback } from "react";

const AI_SERVICE_URL =
  process.env.REACT_APP_AI_SERVICE_URL || "http://localhost:8000";

/**
 * Ürün önerilerini getiren custom hook
 * @param {string} category - Mevcut kategori
 * @param {string} currentProductId - Şu an görüntülenen ürün ID'si
 */
export const useRecommendations = (category, currentProductId) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRecommendations = useCallback(async () => {
    if (!category) return;

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({ category, limit: 6 });
      if (currentProductId) params.append("exclude_id", currentProductId);

      const res = await fetch(
        `${AI_SERVICE_URL}/recommendations?${params.toString()}`
      );

      if (!res.ok) throw new Error("AI servis yanıt vermedi");

      const data = await res.json();
      setRecommendations(data.recommendations || []);
    } catch (err) {
      setError(err.message);
      console.error("Öneri hatası:", err);
    } finally {
      setLoading(false);
    }
  }, [category, currentProductId]);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  return { recommendations, loading, error, refetch: fetchRecommendations };
};

/**
 * Sepetteki ürünlere göre tamamlayıcı ürün önerileri
 * @param {Array} cartItems - [{_id, title, category, price, quantity}]
 */
export const useCartRecommendations = (cartItems) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      setRecommendations([]);
      return;
    }

    const fetchCartRecs = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${AI_SERVICE_URL}/recommendations/cart`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cart_items: cartItems.map((item) => ({
              product_id: item._id,
              category: item.category,
              quantity: item.quantity,
            })),
            limit: 4,
          }),
        });

        if (!res.ok) throw new Error("Servis hatası");
        const data = await res.json();
        setRecommendations(data.recommendations || []);
      } catch (err) {
        console.error("Sepet önerisi hatası:", err);
      } finally {
        setLoading(false);
      }
    };

    // Sepet değiştiğinde 500ms bekle (debounce)
    const timer = setTimeout(fetchCartRecs, 500);
    return () => clearTimeout(timer);
  }, [cartItems]);

  return { recommendations, loading };
};
