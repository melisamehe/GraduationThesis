import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CartPage from "./pages/CartPage";
import BillPage from "./pages/BillPage";
import CustomerPage from "./pages/CustomerPage";
import StatisticPage from "./pages/StatisticPage";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import ProductPage from "./pages/ProductPage";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import ProductDetail from "./pages/ProductDetail";

function App() {
  const cart = useSelector((state) => state.cart);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RouteControl><HomePage /></RouteControl>} />
        <Route path="/cart" element={<RouteControl><CartPage /></RouteControl>} />
        <Route path="/bills" element={<AdminRoute><BillPage /></AdminRoute>} />
        <Route path="/customers" element={<AdminRoute><CustomerPage /></AdminRoute>} />
        <Route path="/statistic" element={<AdminRoute><StatisticPage /></AdminRoute>} />
        <Route path="/products" element={<AdminRoute><ProductPage /></AdminRoute>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/product/:id" element={<ProductDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

/** Giriş yapılmışsa sayfayı göster, yoksa /login'e yönlendir */
export const RouteControl = ({ children }) => {
  if (localStorage.getItem("posUser")) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
};

/** Sadece superadmin görebilir, diğerleri ana sayfaya yönlendirilir */
export const AdminRoute = ({ children }) => {
  const stored = localStorage.getItem("posUser");
  if (!stored) return <Navigate to="/login" />;

  const user = JSON.parse(stored);
  if (user.role === "superadmin") {
    return children;
  }
  return <Navigate to="/" />;
};
