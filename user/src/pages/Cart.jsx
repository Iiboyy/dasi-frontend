import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const formatRp = n => "Rp " + n.toLocaleString("id-ID");

export default function Cart({ onNavigate }) {
  const { items, removeFromCart, updateQty, loading } = useCart();
  const { user } = useAuth();
  const [checked, setChecked] = useState({});

  if (!user) {
    return (
      <div className="w-full min-h-[calc(100vh-64px)] bg-gray-50 flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500 text-sm">Login dulu untuk melihat keranjang</p>
        <button onClick={() => onNavigate("login")}
          className="px-8 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold border-none cursor-pointer hover:bg-blue-700">
          Login
        </button>
      </div>
    );
  }

  const toggleCheck = (id) => setChecked(c => ({ ...c, [id]: !c[id] }));
  const toggleAll = () => {
    const allChecked = items.every(i => checked[i.product_id?._id]);
    const next = {};
    items.forEach(i => { next[i.product_id?._id] = !allChecked; });
    setChecked(next);
  };

  const selectedItems = items.filter(i => checked[i.product_id?._id]);
  const selectedTotal = selectedItems.reduce(
    (sum, i) => sum + (i.product_id?.price || 0) * i.quantity, 0
  );
  const allChecked = items.length > 0 && items.every(i => checked[i.product_id?._id]);

  const handleCheckout = () => {
    if (selectedItems.length === 0) return;
    onNavigate("checkout", { selectedItems });
  };

  return (
    <div className="w-full min-h-[calc(100vh-64px)] bg-gray-50 px-10 py-10 pb-16">
      <h1 className="font-extrabold text-2xl text-gray-900 mb-8" style={{ fontFamily: "var(--font-display)" }}>
        Keranjang Belanja
      </h1>

      <div className="flex gap-6 items-start flex-wrap">
        {/* Items */}
        <div className="flex-[1_1_500px] bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="py-20 text-center text-gray-400 text-sm">Memuat keranjang...</div>
          ) : items.length === 0 ? (
            <div className="py-20 px-10 flex flex-col items-center gap-4">
              <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              <h3 className="text-lg font-bold text-gray-700">Keranjang Kosong</h3>
              <p className="text-gray-400 text-sm">Yuk, mulai belanja!</p>
              <button onClick={() => onNavigate("home")}
                className="mt-2 px-8 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold border-none cursor-pointer hover:bg-blue-700 transition-colors">
                Mulai Belanja
              </button>
            </div>
          ) : (
            <>
              {/* Select all */}
              <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50">
                <input type="checkbox" checked={allChecked} onChange={toggleAll}
                  className="w-4 h-4 accent-blue-600 cursor-pointer" />
                <span className="text-sm font-semibold text-gray-700">
                  Pilih Semua ({items.length} produk)
                </span>
              </div>

              {items.map((item, i) => {
                const pid = item.product_id?._id;
                return (
                  <div key={item._id} className={`flex items-center gap-4 px-6 py-4 ${i < items.length - 1 ? "border-b border-gray-100" : ""}`}>
                    {/* Checkbox */}
                    <input type="checkbox" checked={!!checked[pid]} onChange={() => toggleCheck(pid)}
                      className="w-4 h-4 accent-blue-600 cursor-pointer shrink-0" />

                    {/* Foto */}
                    <div className="w-16 h-16 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100 overflow-hidden">
                      {item.product_id?.thumbnail ? (
                        <img src={item.product_id.thumbnail} alt={item.product_id.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-2xl">🛍️</span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 mb-0.5">{item.product_id?.name}</p>
                      <p className="text-sm font-bold text-blue-600">
                        {formatRp(item.product_id?.price || 0)}
                      </p>
                    </div>

                    {/* Qty */}
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQty(item.product_id._id, item.quantity - 1)}
                        className="w-7 h-7 rounded-md border border-gray-200 bg-white cursor-pointer font-bold flex items-center justify-center hover:bg-gray-50 text-base">−</button>
                      <span className="text-sm font-semibold min-w-5 text-center">{item.quantity}</span>
                      <button onClick={() => updateQty(item.product_id._id, item.quantity + 1)}
                        className="w-7 h-7 rounded-md border border-gray-200 bg-white cursor-pointer font-bold flex items-center justify-center hover:bg-gray-50 text-base">+</button>
                    </div>

                    {/* Hapus */}
                    <button onClick={() => removeFromCart(item.product_id._id)}
                      className="bg-transparent border-none cursor-pointer text-gray-400 hover:text-red-500 transition-colors p-1">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                        <path d="M10 11v6"/><path d="M14 11v6"/>
                        <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                      </svg>
                    </button>
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* Summary */}
        <div className="flex-[0_0_300px] bg-white rounded-2xl border border-gray-200 p-6 sticky top-24">
          <h3 className="text-base font-bold text-gray-900 mb-5">Ringkasan Pesanan</h3>
          <div className="flex justify-between mb-3">
            <span className="text-sm text-gray-600">Produk dipilih</span>
            <span className="text-sm font-semibold">{selectedItems.length} item</span>
          </div>
          <div className="flex justify-between pb-4 border-b border-gray-100">
            <span className="text-sm text-gray-600">Ongkos Kirim</span>
            <span className="text-sm font-semibold text-green-600">Gratis</span>
          </div>
          <div className="flex justify-between mt-4 mb-6">
            <span className="text-sm font-bold">Total</span>
            <span className="text-sm font-bold text-blue-600">{formatRp(selectedTotal)}</span>
          </div>

          <button onClick={handleCheckout} disabled={selectedItems.length === 0}
            className={`w-full py-3.5 rounded-xl text-sm font-bold border-none transition-colors
              ${selectedItems.length > 0
                ? "bg-blue-600 text-white cursor-pointer hover:bg-blue-700"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>
            Checkout ({selectedItems.length})
          </button>

          {selectedItems.length === 0 && items.length > 0 && (
            <p className="text-xs text-gray-400 text-center mt-2">Pilih produk yang ingin di-checkout</p>
          )}
        </div>
      </div>
    </div>
  );
}