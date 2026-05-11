import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addProduct } from "../redux/cartSlice";
import { trackProductView, trackAddToCart } from "../firebase";
import { Carousel, message } from "antd";

export default function ProductDetail() {
  const { id } = useParams();
  const [dbProduct, setDbProduct] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/api/products/${id}`
        );
        setDbProduct(res.data);
        trackProductView(res.data); // firebase
      } catch (err) {
        console.log(err);
      }
    };
    getProduct();
  }, [id]);

  if (!dbProduct)
    return <div className="p-20 text-center text-gray-500">Yükleniyor...</div>;

  // img her zaman var, images varsa onları da ekle — tekrar etmesin
  const images = [
    dbProduct.img,
    ...(dbProduct.images || []).filter((i) => i && i !== dbProduct.img),
  ];

  const handleAddToBag = (e) => {
    e.preventDefault();
    dispatch(addProduct({ ...dbProduct, quantity: 1 }));
    trackAddToCart(dbProduct, 1); // firebase
    message.success("Ürün sepete eklendi.");
  };

  return (
    // ← overflow-y-auto + h-screen → sayfanın scroll etmesini sağlar
    <div className="bg-white min-h-screen overflow-y-auto">
      <div className="pt-6 pb-24">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb">
          <ol className="mx-auto flex max-w-7xl items-center space-x-2 px-4 sm:px-6 lg:px-8">
            <li className="flex items-center">
              <a href="/" className="mr-2 text-sm font-medium text-gray-900 hover:underline">
                Mels Store
              </a>
              <svg width={16} height={20} viewBox="0 0 16 20" fill="currentColor" className="h-5 w-4 text-gray-300">
                <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
              </svg>
            </li>
            <li>
              <span className="text-sm font-medium text-gray-500 uppercase">
                {dbProduct.category}
              </span>
            </li>
          </ol>
        </nav>

        {/* Görsel + Sağ Panel */}
        <div className="mx-auto mt-6 max-w-7xl px-4 sm:px-6 lg:px-8 lg:grid lg:grid-cols-3 lg:gap-8">

          {/* Carousel — col-span-2 */}
          <div className="lg:col-span-2">
            {images.length > 1 ? (
              <Carousel arrows infinite>
                {images.map((img, index) => (
                  <div key={index}>
                    <img
                      src={img}
                      alt={`${dbProduct.title} - ${index + 1}`}
                      className="w-full max-h-[520px] object-contain rounded-lg bg-gray-50"
                    />
                  </div>
                ))}
              </Carousel>
            ) : (
              <img
                src={images[0]}
                alt={dbProduct.title}
                className="w-full max-h-[520px] object-contain rounded-lg bg-gray-50"
              />
            )}
          </div>

          {/* Sağ panel */}
          <div className="mt-8 lg:mt-0 flex flex-col gap-4">

            {/* Satış sayısı kartı */}
            <div className="bg-blue-50 p-5 rounded-lg border border-blue-100">
              <p className="text-blue-700 font-semibold">🔥 Popüler Ürün</p>
              <p className="text-sm text-blue-600 mt-1">
                Bu ürün şimdiye kadar{" "}
                <span className="font-bold">{dbProduct.salesCount || 0}</span> kez satıldı.
              </p>
            </div>

            {/* Fiyat + Sepete Ekle */}
            <div className="border rounded-lg p-5">
              <p className="text-3xl font-bold text-gray-900">₺{dbProduct.price}</p>
              <form className="mt-4" onSubmit={handleAddToBag}>
                <button
                  type="submit"
                  className="w-full rounded-md bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                >
                  Sepete Ekle
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Ürün Adı + Açıklama */}
        <div className="mx-auto mt-10 max-w-7xl px-4 sm:px-6 lg:px-8 lg:grid lg:grid-cols-3 lg:gap-8">
          <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl uppercase">
              {dbProduct.title}
            </h1>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Ürün Açıklaması
              </h3>
              {dbProduct.description ? (
                <p className="text-gray-700 leading-relaxed text-base">
                  {dbProduct.description}
                </p>
              ) : (
                <p className="text-gray-400 italic">
                  Bu ürün için açıklama henüz eklenmemiş.
                </p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
