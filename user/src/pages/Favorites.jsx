import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import ProductCard from "../components/ProductCard";

export default function Favorites({ onNavigate }) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === "buyer") fetchFavorites();
    else setLoading(false);
  }, [user]);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const data = await api.get("/favorites");
      setFavorites(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const products = favorites.map(f => f.product_id).filter(Boolean);

  return (
    <div className="w-full min-h-[calc(100vh-64px)] bg-gray-50 px-10 py-10 pb-16">
      <h1 className="font-extrabold text-2xl text-gray-900 mb-1.5" style={{ fontFamily: "var(--font-display)" }}>Produk Favorit</h1>
      <p className="text-gray-500 text-sm mb-9">Produk yang kamu suka, tersimpan di sini</p>

      {loading ? (
        <div className="text-center py-20 text-gray-400 text-sm">Memuat favorit...</div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 py-20 px-10 flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-red-50 border border-red-100 flex items-center justify-center">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="1.8" strokeLinecap="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-800">Belum Ada Favorit</h3>
          <p className="text-gray-500 text-sm text-center">Klik ikon ❤️ pada produk untuk menambahkannya ke sini</p>
          <button onClick={() => onNavigate("home")}
            className="mt-2 px-9 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold border-none cursor-pointer hover:bg-blue-700 transition-colors">
            Jelajahi Produk
          </button>
        </div>
      ) : (
        <>
          <p className="text-gray-500 text-sm mb-5">{products.length} produk favorit</p>
          <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))" }}>
            {products.map(p => <ProductCard key={p._id} product={p} onNavigate={onNavigate} />)}
          </div>
        </>
      )}
    </div>
  );
}