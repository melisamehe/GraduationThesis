import { useEffect, useState } from "react";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import Add from "./Add";
import Edit from "./Edit";
import "./style.css";
import { trackCategoryFilter } from "../../firebase";

// Kategori başlığına göre emoji & renk haritası
const CATEGORY_META = {
  "Tümü":             { emoji: "🛍️", gradient: "from-slate-600 to-slate-700" },
  "Kadın Giyim":      { emoji: "👗", gradient: "from-pink-500 to-rose-700" },
  "Erkek Giyim":      { emoji: "👔", gradient: "from-blue-600 to-blue-800" },
  "Ayakkabı":         { emoji: "👟", gradient: "from-orange-500 to-orange-700" },
  "Çanta & Aksesuar": { emoji: "👜", gradient: "from-amber-600 to-yellow-700" },
  "Elektronik":       { emoji: "💻", gradient: "from-violet-600 to-purple-800" },
  "Kozmetik":         { emoji: "💄", gradient: "from-fuchsia-500 to-pink-700" },
  "Ev & Yaşam":       { emoji: "🏡", gradient: "from-emerald-600 to-teal-800" },
};

const DEFAULT_META = { emoji: "🏷️", gradient: "from-violet-600 to-purple-800" };

export const Categories = ({
  categories,
  setCategories,
  setFiltered,
  products,
  setSelectedCategory,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [categoryTitle, setCategoryTitle] = useState("Tümü");

  // Rolü localStorage'dan oku
  const stored = localStorage.getItem("posUser");
  const isSuperAdmin = stored
    ? JSON.parse(stored)?.role === "superadmin"
    : false;

  useEffect(() => {
    if (categoryTitle === "Tümü") {
      setFiltered(products);
    } else {
      setFiltered(products.filter((item) => item.category === categoryTitle));
    }
  }, [products, setFiltered, categoryTitle]);

  const handleCategoryClick = (title) => {
    setCategoryTitle(title);
    setSelectedCategory(title === "Tümü" ? "" : title);
    trackCategoryFilter(title);
  };

  return (
    <div className="h-full flex flex-col gap-1 py-2">
      <div className="hidden md:flex items-center gap-2 mb-4 px-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-violet-500/30">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h8m-8 6h16" />
          </svg>
        </div>
        <h2 className="text-slate-800 dark:text-white font-bold text-lg tracking-wide uppercase brand-font">
          Kategoriler
        </h2>
      </div>

      <ul className="flex gap-2 md:flex-col text-sm">
        {categories.map((item) => {
          const meta = CATEGORY_META[item.title] || DEFAULT_META;
          const isActive = item.title === categoryTitle;
          const count =
            item.title === "Tümü"
              ? products.length
              : products.filter((p) => p.category === item.title).length;

          return (
            <li
              key={item._id}
              onClick={() => handleCategoryClick(item.title)}
              className={`category-item bg-gradient-to-br ${meta.gradient} ${
                isActive ? "active !ring-2 !ring-white/30" : ""
              }`}
            >
              <span className="category-icon">{meta.emoji}</span>
              <span className="category-label hidden md:block">{item.title}</span>
              {count > 0 && (
                <span className="category-badge hidden md:inline-block">
                  {count}
                </span>
              )}
            </li>
          );
        })}

        {/* Sadece superadmin görebilir */}
        {isSuperAdmin && (
          <li
            className="category-item bg-gradient-to-br from-violet-600 to-purple-900 hover:from-violet-500"
            onClick={() => setIsAddModalOpen(true)}
          >
            <PlusOutlined className="category-icon text-base" />
            <span className="category-label hidden md:block">Kategori Ekle</span>
          </li>
        )}
        {isSuperAdmin && (
          <li
            className="category-item bg-gradient-to-br from-orange-600 to-orange-900 hover:from-orange-500"
            onClick={() => setIsEditModalOpen(true)}
          >
            <EditOutlined className="category-icon text-base" />
            <span className="category-label hidden md:block">Düzenle</span>
          </li>
        )}
      </ul>

      <Add
        isAddModalOpen={isAddModalOpen}
        setIsAddModalOpen={setIsAddModalOpen}
        categories={categories}
        setCategories={setCategories}
      />
      <Edit
        isEditModalOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
        categories={categories}
        setCategories={setCategories}
      />
    </div>
  );
};
