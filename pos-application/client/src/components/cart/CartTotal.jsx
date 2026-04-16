import { message, Popconfirm } from "antd";
import {
  ClearOutlined,
  MinusOutlined,
  PlusOutlined,
  ShoppingCartOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { deleteCart, increase, decrease, reset } from "../../redux/cartSlice";
import { useNavigate } from "react-router-dom";
import { trackRemoveFromCart } from "../../firebase";

const CartTotal = () => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const subtotal = cart.total > 0 ? cart.total : 0;
  const taxAmount = (subtotal * cart.tax) / 100;
  const grandTotal = subtotal + taxAmount;

  return (
    <div className="flex flex-col h-full text-slate-800 dark:text-white">
      {/* ── Başlık ── */}
      <div className="px-4 py-4 border-b border-slate-200 dark:border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCartOutlined className="text-violet-600 dark:text-violet-400 text-lg" />
            <span className="font-bold text-sm tracking-wide">Sepetim</span>
          </div>
          {cart.cartItems.length > 0 && (
            <span className="bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300 text-xs font-bold px-2 py-0.5 rounded-full">
              {cart.cartItems.reduce((acc, i) => acc + i.quantity, 0)} ürün
            </span>
          )}
        </div>
      </div>

      {/* ── Ürün Listesi ── */}
      <ul className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-2">
        {cart.cartItems.length > 0 ? (
          [...cart.cartItems].reverse().map((item) => (
            <li
              key={item._id}
              className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5
                         hover:border-slate-300 dark:hover:border-white/10 transition-all group"
            >
              {/* Görsel */}
              <div className="relative flex-shrink-0">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-12 h-12 rounded-lg object-cover"
                />
              </div>

              {/* Bilgi */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-800 dark:text-white truncate">{item.title}</p>
                <p className="text-xs text-slate-500 dark:text-white/40">
                  {item.price.toFixed(2)}₺ × {item.quantity}
                </p>
                <p className="text-xs font-bold text-violet-600 dark:text-violet-300">
                  {(item.price * item.quantity).toFixed(2)}₺
                </p>
              </div>

              {/* Kontroller */}
              <div className="flex flex-col items-center gap-1">
                <button
                  onClick={() => dispatch(increase(item))}
                  className="w-6 h-6 rounded-full bg-slate-200 dark:bg-white/10 hover:bg-violet-100 dark:hover:bg-violet-500/40
                             flex items-center justify-center transition-colors text-slate-700 dark:text-white text-xs"
                >
                  <PlusOutlined style={{ fontSize: 9 }} />
                </button>
                <span className="text-xs font-bold text-slate-800 dark:text-white w-4 text-center">
                  {item.quantity}
                </span>
                <Popconfirm
                  title="Ürünü kaldır"
                  description="Bu ürünü sepetten silmek istiyor musunuz?"
                  okText="Evet"
                  cancelText="Hayır"
                  disabled={item.quantity > 1}
                  onConfirm={() => {
                    dispatch(decrease(item));
                    trackRemoveFromCart(item, 1);
                    message.success("Ürün sepetten silindi.");
                  }}
                >
                  <button
                    onClick={() => {
                      if (item.quantity > 1) {
                        dispatch(decrease(item));
                        trackRemoveFromCart(item, 1);
                      }
                    }}
                    className="w-6 h-6 rounded-full bg-slate-200 dark:bg-white/10 hover:bg-red-100 dark:hover:bg-red-500/40
                               flex items-center justify-center transition-colors text-slate-700 dark:text-white text-xs"
                  >
                    <MinusOutlined style={{ fontSize: 9 }} />
                  </button>
                </Popconfirm>
              </div>
            </li>
          ))
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 py-10 text-slate-400 dark:text-white/20">
            <ShoppingCartOutlined style={{ fontSize: 40 }} />
            <p className="text-sm">Sepetiniz boş</p>
            <p className="text-xs text-center">Ürünleri sepete ekleyerek alışverişe başlayın</p>
          </div>
        )}
      </ul>

      {/* ── Özet & Butonlar ── */}
      <div className="border-t border-slate-200 dark:border-white/5 px-4 py-4 flex flex-col gap-3">
        {/* Özet */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-sm text-slate-500 dark:text-white/50">
            <span>Ara Toplam</span>
            <span>{subtotal.toFixed(2)}₺</span>
          </div>
          <div className="flex justify-between text-sm text-slate-500 dark:text-white/50">
            <span>KDV %{cart.tax}</span>
            <span className="text-rose-500 dark:text-rose-400">+{taxAmount.toFixed(2)}₺</span>
          </div>
          <div className="flex justify-between font-bold text-base pt-1 border-t border-slate-200 dark:border-white/5">
            <span className="text-slate-800 dark:text-white">Toplam</span>
            <span className="text-violet-600 dark:text-violet-300">{grandTotal.toFixed(2)}₺</span>
          </div>
        </div>

        {/* Sipariş Butonu */}
        <button
          disabled={cart.cartItems.length === 0}
          onClick={() => navigate("/cart")}
          className="w-full py-3 rounded-xl font-bold text-sm text-white
                     bg-gradient-to-r from-violet-600 to-indigo-600
                     hover:from-violet-500 hover:to-indigo-500
                     disabled:opacity-30 disabled:cursor-not-allowed
                     shadow-lg shadow-violet-500/20
                     transition-all duration-200 active:scale-[0.98]"
        >
          Siparişi Tamamla →
        </button>

        {/* Temizle */}
        <Popconfirm
          title="Sepeti Temizle"
          description="Tüm ürünler silinecek. Emin misiniz?"
          okText="Evet, Temizle"
          cancelText="Hayır"
          onConfirm={() => {
            cart.cartItems.forEach((item) => trackRemoveFromCart(item, item.quantity));
            dispatch(reset());
            message.success("Sepet temizlendi.");
          }}
        >
          <button
            disabled={cart.cartItems.length === 0}
            className="w-full py-2 rounded-xl text-sm text-slate-500 dark:text-white/40
                       hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10
                       border border-slate-200 dark:border-white/5 hover:border-rose-200 dark:hover:border-rose-500/20
                       disabled:opacity-40 dark:disabled:opacity-20 disabled:cursor-not-allowed
                       transition-all duration-200 flex items-center justify-center gap-2"
          >
            <DeleteOutlined />
            Sepeti Temizle
          </button>
        </Popconfirm>
      </div>
    </div>
  );
};

export default CartTotal;
