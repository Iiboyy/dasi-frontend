import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import logoDasi from "../assets/logo_dasi.jpeg";

const SearchIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#9ca3af"
    strokeWidth="2.2"
    strokeLinecap="round"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const CartIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);
const UserIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const ChevronDown = ({ open }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#6b7280"
    strokeWidth="2.5"
    strokeLinecap="round"
    className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const MenuIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#374151"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);
const CloseIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#374151"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

function UserDropdown({ user, onLogout, onNavigate, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [onClose]);

  const guestItems = [
    { label: "Masuk", action: () => onNavigate("login") },
    { label: "Daftar", action: () => onNavigate("register") },
  ];
  const userItems = [
    { label: "Profil Saya", action: () => onNavigate("profile") },
    { label: "Pesanan Saya", action: () => onNavigate("orders") },
    { label: "Keluar", action: onLogout, danger: true },
  ];
  const items = user ? userItems : guestItems;

  return (
    <div
      ref={ref}
      className="absolute top-[calc(100%+10px)] right-0 bg-white border border-gray-200 rounded-xl shadow-xl min-w-42.5 z-50 overflow-hidden animate-[ddFade_0.18s_ease]"
    >
      {items.map((item, i) => (
        <button
          key={item.label}
          onClick={() => {
            item.action();
            onClose();
          }}
          className={`flex items-center gap-2.5 w-full px-4 py-3 text-left text-sm font-medium border-b border-gray-100 last:border-none hover:bg-gray-50 transition-colors ${item.danger ? "text-red-500" : "text-gray-700"}`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

export default function Navbar({
  activePage,
  onNavigate,
  navSearch,
  setNavSearch,
}) {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: "Beranda", page: "home" },
    { label: "Pesanan", page: "orders" },
    { label: "Favorit", page: "favorites" },
  ];

  return (
    <>
      <style>{`@keyframes ddFade { from { opacity:0; transform:translateY(-6px) } to { opacity:1; transform:translateY(0) } }`}</style>
      <header className="w-full sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="w-full px-10 h-16 flex items-center">
          {/* Logo */}
          <button
            onClick={() => onNavigate("home")}
            className="flex items-center gap-2.5 bg-transparent border-none cursor-pointer shrink-0 mr-9"
          >
            <img src={logoDasi} alt="DASI" className="w-9 h-9 object-contain" />
            <span
              className="font-extrabold text-xl text-gray-900 tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              DASI
            </span>
          </button>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-1 shrink-0">
            {navLinks.map((l) => (
              <button
                key={l.page}
                onClick={() => onNavigate(l.page)}
                className={`px-4 py-2 rounded-lg border-none text-sm font-medium cursor-pointer transition-colors relative
                  ${activePage === l.page ? "text-blue-600 font-semibold" : "text-gray-500 bg-transparent hover:text-gray-900 hover:bg-gray-50"}`}
              >
                {l.label}
                {activePage === l.page && (
                  <span className="absolute -bottom-5 left-4 right-4 h-0.5 bg-blue-600 rounded-t" />
                )}
              </button>
            ))}
          </nav>

          {/* Search */}
          <div className="flex-1 min-w-0 mx-8 hidden sm:block">
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                <SearchIcon />
              </span>
              <input
                type="text"
                placeholder="Cari produk di DASI..."
                value={navSearch}
                onChange={(e) => setNavSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border border-transparent rounded-xl text-sm text-gray-900 outline-none transition-all focus:bg-white focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Cart */}
            <button
              onClick={() => onNavigate("cart")}
              className="relative w-10 h-10 rounded-xl border-none bg-transparent flex items-center justify-center cursor-pointer text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <CartIcon />
              <span className="absolute top-0.5 right-0.5 min-w-4.25 h-4.25 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 border-2 border-white">
                {count}
              </span>
            </button>

            {/* User */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen((o) => !o)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-gray-200 bg-transparent cursor-pointer hover:bg-gray-50 hover:border-gray-300 transition-colors"
              >
                <span className="w-7 h-7 rounded-full overflow-hidden bg-linear-to-br from-blue-100 to-blue-200 flex items-center justify-center text-gray-700">
                  {user?.photo ? (
                    <img
                      src={user.photo}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserIcon />
                  )}
                </span>
                <ChevronDown open={dropdownOpen} />
              </button>
              {dropdownOpen && (
                <UserDropdown
                  user={user}
                  onLogout={() => {
                    logout();
                    setDropdownOpen(false);
                  }}
                  onNavigate={onNavigate}
                  onClose={() => setDropdownOpen(false)}
                />
              )}
            </div>

            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen((o) => !o)}
              className="md:hidden w-10 h-10 rounded-xl border-none bg-transparent flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors ml-1"
            >
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-5 py-3">
            <div className="relative mb-2.5">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                <SearchIcon />
              </span>
              <input
                type="text"
                placeholder="Cari produk di DASI..."
                value={navSearch}
                onChange={(e) => setNavSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border border-transparent rounded-xl text-sm outline-none"
              />
            </div>
            {navLinks.map((l) => (
              <button
                key={l.page}
                onClick={() => {
                  onNavigate(l.page);
                  setMobileOpen(false);
                }}
                className={`block w-full px-3 py-3 text-left text-sm font-medium rounded-xl border-none cursor-pointer mb-1 transition-colors
                  ${activePage === l.page ? "text-blue-600 font-semibold bg-blue-50" : "text-gray-700 bg-transparent hover:bg-gray-50"}`}
              >
                {l.label}
              </button>
            ))}
          </div>
        )}
      </header>
    </>
  );
}
