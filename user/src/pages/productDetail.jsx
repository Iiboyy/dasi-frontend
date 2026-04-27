import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useFavorite } from "../context/FavoriteContext";
import { useToast } from "../context/ToastContext";

export default function ProductDetail({ product, onNavigate, previousPage }) {
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorite();
  const { showToast } = useToast();
  const liked = isFavorite(product?._id);

  const [selectedVariants, setSelectedVariants] = useState({});
  const [qty, setQty] = useState(1);

  const [loading, setLoading] = useState(false);

  if (!product) return null;

  const allVariantsSelected =
    !product.variants?.length ||
    product.variants.every((v) => selectedVariants[v.label]);

  const handleAddToCart = async () => {
    const result = await addToCart(product._id, qty);
    if (result?.success) {
      showToast({
        message: `${product.name} ditambahkan ke keranjang!`,
        type: "success",
      });
    } else {
      showToast({
        message: result?.message || "Gagal menambahkan",
        type: "error",
      });
    }
  };

  const handleBuyNow = async () => {
    setLoading(true);
    const result = await addToCart(product._id, qty);
    setLoading(false);
    if (result?.success) {
      onNavigate("checkout");
    } else {
      showToast({
        message: result?.message || "Gagal, coba lagi",
        type: "error",
      });
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-64px)] bg-gray-50 px-10 py-10 pb-16">
      {/* Tombol Back + Breadcrumb */}
      <div className="flex items-center gap-3 mb-7">
        <button
          onClick={() => onNavigate(previousPage || "home")}
          className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center cursor-pointer hover:border-blue-400 hover:text-blue-600 transition-colors text-gray-500 shrink-0 shadow-sm"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <div className="flex items-center gap-1.5 text-sm text-gray-400">
          <button
            onClick={() => onNavigate("home")}
            className="hover:text-blue-600 transition-colors bg-transparent border-none cursor-pointer text-sm text-gray-400"
          >
            Beranda
          </button>
          <button
            onClick={() => onNavigate(previousPage || "home")}
            className="hover:text-blue-600 transition-colors bg-transparent border-none cursor-pointer text-sm text-gray-400"
          ></button>
          <span>/</span>
          <span className="text-gray-700 font-medium truncate max-w-50">
            {product.name}
          </span>
        </div>
      </div>

      <div className="flex gap-8 flex-wrap items-start">
        {/* Gambar */}
        <div className="bg-white rounded-2xl border border-gray-200 flex items-center justify-center h-80 shadow-sm overflow-hidden">
          {product.thumbnail ? (
            <img
              src={product.thumbnail}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-[80px]">🛍️</span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-75">
          <div className="bg-white rounded-2xl border border-gray-200 p-7">
            {/* Judul & favorit */}
            <div className="flex justify-between items-start gap-4 mb-4">
              <h1
                className="text-xl font-bold text-gray-900"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {product.name}
              </h1>
              <button
                onClick={() => toggleFavorite(product)}
                className={`w-10 h-10 rounded-full border flex items-center justify-center cursor-pointer shrink-0 transition-all ${liked ? "bg-red-50 border-red-200" : "bg-gray-50 border-gray-200 hover:bg-red-50"}`}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill={liked ? "#ef4444" : "none"}
                  stroke={liked ? "#ef4444" : "#9ca3af"}
                  strokeWidth="2"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </div>

            {/* Harga */}
            <div className="mb-5">
              <p className="text-xs text-gray-400 line-through mb-1">
                {product.originalPrice}
              </p>
              <p className="text-2xl font-bold text-blue-600">
                {product.price}
              </p>
            </div>

            {/* Deskripsi */}
            <div className="mb-6">
              <h3 className="text-sm font-bold text-gray-700 mb-2">
                Deskripsi Produk
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Varian */}
            {product.variants?.map((variant) => (
              <div key={variant.label} className="mb-5">
                <h3 className="text-sm font-bold text-gray-700 mb-2.5">
                  {variant.label}
                  {selectedVariants[variant.label] && (
                    <span className="ml-2 text-blue-600 font-semibold">
                      : {selectedVariants[variant.label]}
                    </span>
                  )}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {variant.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() =>
                        setSelectedVariants((s) => ({
                          ...s,
                          [variant.label]: opt,
                        }))
                      }
                      className={`px-4 py-2 rounded-xl text-sm font-medium border cursor-pointer transition-all
                        ${
                          selectedVariants[variant.label] === opt
                            ? "border-blue-500 bg-blue-50 text-blue-700 font-semibold"
                            : "border-gray-200 bg-white text-gray-600 hover:border-blue-300"
                        }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Jumlah */}
            <div className="mb-7">
              <h3 className="text-sm font-bold text-gray-700 mb-2.5">Jumlah</h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-9 h-9 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-lg font-bold cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  −
                </button>
                <span className="text-base font-bold min-w-8 text-center">
                  {qty}
                </span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="w-9 h-9 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-lg font-bold cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Tombol aksi */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3 bg-blue-50 text-blue-600 border border-blue-200 rounded-xl text-sm font-bold cursor-pointer hover:bg-blue-100 transition-colors"
              >
                + Keranjang
              </button>
              <button
                onClick={handleBuyNow}
                disabled={loading}
                className={`flex-1 py-3 rounded-xl text-sm font-bold border-none transition-colors
        ${
          loading
            ? "bg-blue-300 cursor-not-allowed text-white"
            : "bg-blue-600 text-white cursor-pointer hover:bg-blue-700"
        }`}
              >
                {loading ? "Memproses..." : "Beli Sekarang"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
