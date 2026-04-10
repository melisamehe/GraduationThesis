import { useState } from "react";
import ProductItem from "./ProductItem";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import Add from "./Add";
import { useNavigate } from "react-router-dom";

const Products = ({ categories, filtered, products, setProducts, search }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const navigate = useNavigate();

  const stored = localStorage.getItem("posUser");
  const isSuperAdmin = stored ? JSON.parse(stored)?.role === "superadmin" : false;

  const visibleProducts = filtered.filter((p) =>
    p.title.toLowerCase().includes(search)
  );

  return (
    <div className="products-wrapper">
      {visibleProducts.map((item) => (
        <ProductItem item={item} key={item._id} />
      ))}

      {/* Admin butonları */}
      {isSuperAdmin && (
        <div
          className="flex flex-col items-center justify-center rounded-2xl cursor-pointer
                     border-2 border-dashed border-violet-500/30 hover:border-violet-500/60
                     bg-violet-500/5 hover:bg-violet-500/10
                     min-h-[200px] transition-all duration-300 group"
          onClick={() => setIsAddModalOpen(true)}
        >
          <PlusOutlined className="text-violet-400 text-2xl group-hover:scale-125 transition-transform" />
          <span className="text-violet-400/60 text-xs mt-2 font-medium">Ürün Ekle</span>
        </div>
      )}
      {isSuperAdmin && (
        <div
          className="flex flex-col items-center justify-center rounded-2xl cursor-pointer
                     border-2 border-dashed border-orange-500/30 hover:border-orange-500/60
                     bg-orange-500/5 hover:bg-orange-500/10
                     min-h-[200px] transition-all duration-300 group"
          onClick={() => navigate("/products")}
        >
          <EditOutlined className="text-orange-400 text-2xl group-hover:scale-125 transition-transform" />
          <span className="text-orange-400/60 text-xs mt-2 font-medium">Ürünleri Düzenle</span>
        </div>
      )}

      <Add
        isAddModalOpen={isAddModalOpen}
        setIsAddModalOpen={setIsAddModalOpen}
        categories={categories}
        products={products}
        setProducts={setProducts}
      />
    </div>
  );
};

export default Products;