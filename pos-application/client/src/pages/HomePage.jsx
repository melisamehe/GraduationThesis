
import { Header } from "../components/Header/Header";
import { Categories } from "../components/categories/Categories";
import { useState, useEffect } from "react";
import Products from "../components/products/Products";
import CartTotal from "../components/cart/CartTotal";
import { Spin } from "antd";
import { trackPageView, trackSearch } from "../firebase";
import { RecommendationsPanel } from "../components/RecommendationCard";
import { useRecommendations } from "../hooks/useRecommendations";
import { trackProductView } from "../firebase";

const HomePage = () => {
  const [categories, setCategories] = useState();
  const [filtered, setFiltered] = useState([]);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const { recommendations, loading: aiLoading } = useRecommendations(selectedCategory);

  useEffect(() => { trackPageView("HomePage"); }, []);

  useEffect(() => {
    if (!search) return;
    const timer = setTimeout(() => trackSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await fetch(process.env.REACT_APP_SERVER_URL + "/api/categories/get-all");
        const data = await res.json();
        data && setCategories(data.map((item) => ({ ...item, value: item.title })));
      } catch (error) { console.log(error); }
    };
    getCategories();
  }, []);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await fetch(process.env.REACT_APP_SERVER_URL + "/api/products/get-all");
        const data = await res.json();
        setProducts(data);
      } catch (error) { console.log(error); }
    };
    getProducts();
  }, []);

  return (
    <div className="bg-app min-h-screen flex flex-col">
      <Header setSearch={setSearch} />

      {products && categories ? (
        <div className="flex md:flex-row flex-col flex-1 overflow-hidden px-4 gap-4 py-4 md:pb-0 pb-20">

          {/* ── Sidebar Kategoriler ── */}
          <aside
            className="categories overflow-auto md:w-[210px] flex-shrink-0
                       glass rounded-2xl px-3 py-4
                       max-h-[calc(100vh_-_140px)]"
          >
            <Categories
              categories={categories}
              setCategories={setCategories}
              setFiltered={setFiltered}
              products={products}
              setSelectedCategory={setSelectedCategory}
            />
          </aside>

          {/* ── Ürünler Ana Alanı ── */}
          <main className="products flex-1 max-h-[calc(100vh_-_140px)] overflow-y-auto pr-1">

            {/* Başlık bandı */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-slate-900 dark:text-white font-bold text-lg leading-tight">
                  {selectedCategory || "Tüm Ürünler"}
                </h2>
                <p className="text-slate-500 dark:text-white/40 text-xs mt-0.5">
                  {filtered.filter(p => p.title.toLowerCase().includes(search)).length} ürün listeleniyor
                </p>
              </div>
              <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 dark:text-white/30">
                <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse inline-block"></span>
                Canlı Güncelleniyor
              </div>
            </div>

            <Products
              categories={categories}
              filtered={filtered}
              products={products}
              setProducts={setProducts}
              search={search}
            />

            {/* AI Önerileri */}
            <div className="mt-8 border-t border-slate-200 dark:border-white/5 pt-6">
              <RecommendationsPanel
                title={
                  selectedCategory
                    ? `${selectedCategory} için Öneriler`
                    : "Günün Trend Ürünleri"
                }
                recommendations={recommendations}
                loading={aiLoading}
                onProductClick={(product) => trackProductView(product)}
              />
            </div>
          </main>

          {/* ── Sepet Paneli ── */}
          <aside className="cart-panel glass rounded-2xl w-full md:w-[300px] flex-shrink-0
                            max-h-[calc(100vh_-_140px)] overflow-hidden flex flex-col">
            <CartTotal />
          </aside>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Spin size="large" />
            <p className="text-slate-500 dark:text-white/40 text-sm mt-4">Yükleniyor...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
