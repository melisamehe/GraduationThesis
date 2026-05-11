// react-components/RecommendationCard.jsx
// Bu dosyayı client/src/components/RecommendationCard.jsx olarak ekle
// Mevcut ProductCard component'in stiline göre düzenleyebilirsin

import React from "react";
import { useDispatch } from "react-redux";
import { addProduct } from "../redux/cartSlice"; // mevcut slice'ın adına göre düzenle
import { trackAddToCart } from "../firebase";
import { useNavigate } from 'react-router-dom';

const RecommendationCard = ({ product, onProductClick }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = () => {
    if (onProductClick) {
      onProductClick(product);
    } else {
      navigate(`/product/${product._id}`);
    }
  };

  const handleAddToCart = (e) => {
  e.stopPropagation();
  // dispatch(addToCart(...)) yerine:
  dispatch(addProduct({ ...product, quantity: 1 })); 
  trackAddToCart(product, 1);
};
  return (
    <div
      className="recommendation-card border rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow bg-white"
      onClick={handleClick}
    >
      {product.img && (
        <img
          src={product.img}
          alt={product.title}
          className="w-full h-28 object-cover rounded mb-2"
        />
      )}
      <div className="flex flex-col gap-1">
        <span className="text-xs text-gray-500 uppercase tracking-wide">
          {product.category}
        </span>
        <h4 className="font-semibold text-sm text-gray-800 line-clamp-2">
          {product.title}
        </h4>
        <div className="flex items-center justify-between mt-1">
          <span className="text-green-600 font-bold text-sm">
            ₺{product.price?.toFixed(2)}
          </span>
          {product.sales_count && (
            <span className="text-xs text-gray-400">
              🔥 {product.sales_count} satış
            </span>
          )}
        </div>
        <button
          onClick={handleAddToCart}
          className="mt-2 w-full bg-blue-500 hover:bg-blue-600 text-white text-xs py-1.5 rounded transition-colors"
        >
          Sepete Ekle
        </button>
      </div>
    </div>
  );
};

// ─── ANA ÖNERI PANELİ ────────────────────────────────────────────────────────

export const RecommendationsPanel = ({ title = "Önerilen Ürünler", recommendations, loading, onProductClick }) => {
  if (loading) {
    return (
      <div className="mt-6">
        <h3 className="text-base font-semibold text-gray-700 mb-3">{title}</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg p-3 animate-pulse bg-gray-100 h-40" />
          ))}
        </div>
      </div>
    );
  }

  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className="mt-6">
      <h3 className="text-base font-semibold text-gray-700 mb-3">
        🎯 {title}
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {recommendations.map((product) => (
          <RecommendationCard
            key={product._id}
            product={product}
            onProductClick={onProductClick}
          />
        ))}
      </div>
    </div>
  );
};

export default RecommendationCard;
