import { useState } from "react";
import { useFavorite } from "../context/FavoriteContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";

const HeartIcon = ({ filled }) => (
  <svg width="17" height="17" viewBox="0 0 24 24"
    fill={filled ? "#ef4444" : "none"}
    stroke={filled ? "#ef4444" : "#9ca3af"} strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

export default function ProductCard({ product, onNavigate }) {
  const [hovered, setHovered] = useState(false);
  const { toggleFavorite, isFavorite } = useFavorite();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const liked = isFavorite(product._id);

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    const result = await addToCart(product._id, 1);
    if (result?.success) {
      showToast(`${product.name} ditambahkan ke keranjang!`);
    } else {
      showToast(result?.message || "Gagal menambahkan ke keranjang", "error");
    }
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onNavigate?.("product-detail", product)}
      className={`bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col cursor-pointer transition-all duration-200 ${hovered ? "shadow-lg -translate-y-1" : "shadow-sm"}`}
    >
      {/* Image */}
      <div className="bg-gray-50 h-40 flex items-center justify-center relative overflow-hidden">
        {product.thumbnail ? (
          <img src={product.thumbnail} alt={product.name}
            className="w-full h-full object-cover" />
        ) : (
          <span className="text-6xl leading-none">🛍️</span>
        )}
        <button
          onClick={e => { e.stopPropagation(); toggleFavorite(product); }}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center cursor-pointer shadow-sm transition-transform duration-150 ${liked ? "scale-110" : "scale-100"}`}>
          <HeartIcon filled={liked} />
        </button>
      </div>

      <div className="p-3.5 flex flex-col gap-1 flex-1">
        <p className="text-sm font-semibold text-gray-900 leading-snug">{product.name}</p>
        <p className="text-xs text-gray-500 capitalize">{product.category}</p>
        <p className="text-sm font-bold text-blue-600 mt-0.5">
          Rp {product.price?.toLocaleString("id-ID")}
        </p>
        <p className="text-xs text-gray-400">Stok: {product.stock}</p>
        <button
          onClick={handleAddToCart}
          className="mt-auto pt-2 w-full py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors border-none cursor-pointer">
          + Keranjang
        </button>
      </div>
    </div>
  );
}