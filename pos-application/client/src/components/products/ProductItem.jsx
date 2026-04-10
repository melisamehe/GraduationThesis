import React from "react";
import { addProduct } from "../../redux/cartSlice";
import { useDispatch } from "react-redux";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { ShoppingCartOutlined, EyeOutlined, FireOutlined } from "@ant-design/icons";

const ProductItem = ({ item }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    dispatch(addProduct({ ...item, quantity: 1 }));
    message.success(`"${item.title}" sepete eklendi! 🛒`);
  };

  const isTrending = item.salesCount >= 200;

  return (
    <div
      className="product-card group relative flex flex-col overflow-hidden rounded-2xl cursor-pointer select-none transition-all duration-300 hover:-translate-y-1"
      onClick={() => navigate(`/product/${item._id}`)}
    >
      {/* Trend Badge */}
      {isTrending && (
        <div className="absolute top-2 left-2 z-10 flex items-center gap-1
                        bg-gradient-to-r from-orange-500 to-rose-500
                        text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
          <FireOutlined />
          <span>Trend</span>
        </div>
      )}

      {/* Görsel */}
      <div className="relative overflow-hidden h-40 bg-white/5">
        <img
          src={item.img}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-90 group-hover:opacity-100"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=400&q=80";
          }}
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300
                        flex items-end justify-center pb-3">
          <span className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm
                           text-white text-xs font-medium px-3 py-1.5 rounded-full border border-white/20">
            <EyeOutlined />
            Detayı Gör
          </span>
        </div>
      </div>

      {/* İçerik */}
      <div className="flex flex-col flex-1 p-3 gap-1.5">
        {/* Kategori */}
        <span className="text-[10px] font-semibold uppercase tracking-widest text-violet-400">
          {item.category}
        </span>

        {/* Başlık */}
        <h3 className="font-semibold text-slate-800 dark:text-white/90 text-sm leading-tight line-clamp-2">
          {item.title}
        </h3>

        {/* Fiyat + Buton */}
        <div className="flex items-center justify-between mt-auto pt-2">
          <div>
            <span className="text-base font-extrabold text-slate-900 dark:text-white leading-none">
              ₺{item.price.toLocaleString("tr-TR")}
            </span>
            {item.salesCount > 0 && (
              <p className="text-[10px] text-slate-400 dark:text-white/30 mt-0.5">{item.salesCount} satış</p>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className="flex items-center gap-1.5
                       bg-gradient-to-r from-violet-600 to-indigo-600
                       hover:from-violet-500 hover:to-indigo-500
                       active:scale-95
                       text-white text-xs font-semibold
                       px-3 py-2 rounded-xl
                       shadow-md shadow-violet-500/20
                       transition-all duration-200"
          >
            <ShoppingCartOutlined />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;