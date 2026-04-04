import { Link, useLocation, useNavigate } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { Badge, Input, message } from "antd";
import {
  SearchOutlined,
  HomeOutlined,
  ShoppingCartOutlined,
  CopyOutlined,
  UserOutlined,
  BarChartOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";

export const Header = ({ setSearch }) => {
  const cart = useSelector((state) => state.cart);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const stored = localStorage.getItem("posUser");
  const posUser = stored ? JSON.parse(stored) : null;
  const isSuperAdmin = posUser?.role === "superadmin";

  const logOut = () => {
    localStorage.removeItem("posUser");
    navigate("/login");
    message.success("Çıkış işlemi başarılı.");
  };

  return (
    <header className="app-header px-6 py-3 flex items-center justify-between gap-6">
      {/* ── Logo ── */}
      <Link to="/" className="flex-shrink-0">
        <h1 className="brand-font text-2xl md:text-3xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
            MELS
          </span>
          <span className="text-slate-800 dark:text-white/80 ml-1">STORE</span>
        </h1>
      </Link>

      {/* ── Search ── */}
      <div
        className="flex-1 flex justify-center max-w-[600px] mx-auto"
        onClick={() => pathname !== "/" && navigate("/")}
      >
        <Input
          size="large"
          placeholder="Ürün, kategori ara..."
          prefix={<SearchOutlined />}
          className="w-full"
          onChange={(e) => setSearch && setSearch(e.target.value.toLowerCase())}
        />
      </div>

      {/* ── Nav ── */}
      <nav className="menu-links">
        <Link to="/" className={`menu-link ${pathname === "/" && "active"}`}>
          <HomeOutlined />
          <span>Ana Sayfa</span>
        </Link>

        <Badge count={cart.cartItems.length} color="#7c3aed" offset={[0, 0]} className="md:flex hidden">
          <Link to="/cart" className={`menu-link ${pathname === "/cart" && "active"}`}>
            <ShoppingCartOutlined />
            <span>Sepet</span>
          </Link>
        </Badge>

        {isSuperAdmin && (
          <>
            <Link to="/bills" className={`menu-link ${pathname === "/bills" && "active"}`}>
              <CopyOutlined />
              <span>Faturalar</span>
            </Link>
            <Link to="/customers" className={`menu-link ${pathname === "/customers" && "active"}`}>
              <UserOutlined />
              <span>Müşteriler</span>
            </Link>
            <Link to="/statistic" className={`menu-link ${pathname === "/statistic" && "active"}`}>
              <BarChartOutlined />
              <span>İstatistik</span>
            </Link>
          </>
        )}

        <button
          onClick={logOut}
          className="menu-link bg-transparent border-0 cursor-pointer p-0"
        >
          <LogoutOutlined />
          <span>Çıkış</span>
        </button>
      </nav>

      <div className="flex items-center gap-4">
        {/* ── Theme Toggle ── */}
        <ThemeToggle />

        {/* ── Mobil Sepet ── */}
        <Badge count={cart.cartItems.length} color="#7c3aed" offset={[0, 0]} className="md:hidden flex">
          <Link to="/cart" className={`menu-link ${pathname === "/cart" && "active"}`}>
            <ShoppingCartOutlined style={{ fontSize: 22 }} />
            <span>Sepet</span>
          </Link>
        </Badge>
      </div>
    </header>
  );
};