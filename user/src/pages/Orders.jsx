import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

const formatRp = n => "Rp " + n.toLocaleString("id-ID");
const TABS = ["Semua", "pending", "paid", "failed", "expired"];
const TAB_LABEL = { "Semua": "Semua", pending: "Diproses", paid: "Selesai", failed: "Gagal", expired: "Kedaluwarsa" };

const statusStyle = {
  pending: "bg-orange-50 text-orange-600 border-orange-200",
  paid:    "bg-green-50 text-green-600 border-green-200",
  failed:  "bg-red-50 text-red-600 border-red-200",
  expired: "bg-gray-50 text-gray-600 border-gray-200",
};

function CancelModal({ order, onConfirm, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-7 max-w-sm w-full shadow-2xl">
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-50 mx-auto mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <h3 className="text-base font-bold text-gray-900 text-center mb-2">Batalkan Pesanan?</h3>
        <p className="text-sm text-gray-500 text-center mb-1">Pesanan <strong>{order.transaction_id}</strong> akan dibatalkan.</p>
        <p className="text-xs text-gray-400 text-center mb-6">Pembatalan hanya bisa dilakukan dalam 1x24 jam.</p>
        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-50 bg-white">
            Kembali
          </button>
          <button onClick={onConfirm}
            className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-bold border-none cursor-pointer hover:bg-red-600">
            Ya, Batalkan
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Orders({ onNavigate }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("Semua");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelTarget, setCancelTarget] = useState(null);

  useEffect(() => {
    if (user) fetchOrders();
    else setLoading(false);
  }, [user]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await api.get("/transactions/my");
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmCancel = async () => {
    try {
      await api.patch(`/transactions/my/${cancelTarget.transaction_id}/cancel`);
      setCancelTarget(null);
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const canCancel = (order) => {
    if (order.status !== "pending") return false;
    const elapsed = Date.now() - new Date(order.createdAt).getTime();
    return elapsed <= 24 * 60 * 60 * 1000;
  };

  if (!user) {
    return (
      <div className="w-full min-h-[calc(100vh-64px)] bg-gray-50 flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500 text-sm">Login dulu untuk melihat pesanan</p>
        <button onClick={() => onNavigate("login")}
          className="px-8 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold border-none cursor-pointer hover:bg-blue-700">
          Login
        </button>
      </div>
    );
  }

  const filtered = activeTab === "Semua" ? orders : orders.filter(o => o.status === activeTab);

  return (
    <div className="w-full min-h-[calc(100vh-64px)] bg-gray-50 px-10 py-10 pb-16">
      <h1 className="font-extrabold text-2xl text-gray-900 mb-1.5" style={{ fontFamily: "var(--font-display)" }}>
        Pesanan Saya
      </h1>
      <p className="text-gray-500 text-sm mb-7">Pantau status pesananmu di sini</p>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex gap-1 border-b border-gray-200 mb-6">
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 border-none bg-transparent text-sm cursor-pointer transition-colors -mb-px border-b-2
                ${activeTab === tab ? "text-blue-600 font-semibold border-blue-600" : "text-gray-500 font-medium border-transparent hover:text-gray-800"}`}>
              {TAB_LABEL[tab]}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-14 text-center text-gray-400 text-sm">Memuat pesanan...</div>
        ) : filtered.length === 0 ? (
          <div className="py-14 flex flex-col items-center gap-3">
            <h3 className="text-base font-bold text-gray-700">Belum ada pesanan</h3>
            <button onClick={() => onNavigate("home")}
              className="mt-2 px-7 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold border-none cursor-pointer hover:bg-blue-700">
              Mulai Belanja
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((order) => (
              <div key={order._id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
                  <div>
                    <span className="text-sm font-bold text-gray-900">{order.transaction_id}</span>
                    <span className="text-xs text-gray-400 ml-3">
                      {new Date(order.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                    </span>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${statusStyle[order.status]}`}>
                    {TAB_LABEL[order.status] || order.status}
                  </span>
                </div>

                <div className="flex flex-col gap-2 mb-3">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden shrink-0">
    {item.thumbnail ? (
        <img src={item.thumbnail} alt={item.name} className="w-full h-full object-cover" />
    ) : (
        <span className="text-xl flex items-center justify-center h-full">🛍️</span>
    )}
</div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-800">{item.name}</p>
                        <p className="text-xs text-gray-400">x{item.quantity}</p>
                      </div>
                      <span className="text-sm font-semibold text-gray-700">
                        {formatRp(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 pt-3 flex justify-between items-center flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 capitalize">{order.payment_method || "midtrans"}</span>
                    <span className="text-sm font-bold text-blue-600">{formatRp(order.total_amount)}</span>
                  </div>
                  <div className="flex gap-2">
                    {order.status === "pending" && order.payment_url && (
                      <a href={order.payment_url} target="_blank" rel="noreferrer"
                        className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold cursor-pointer hover:bg-blue-700 transition-colors">
                        Bayar Sekarang
                      </a>
                    )}
                    {canCancel(order) && (
                      <button onClick={() => setCancelTarget(order)}
                        className="px-4 py-1.5 bg-red-50 text-red-500 border border-red-200 rounded-lg text-xs font-semibold cursor-pointer hover:bg-red-100 transition-colors">
                        Batalkan
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {cancelTarget && (
        <CancelModal
          order={cancelTarget}
          onConfirm={handleConfirmCancel}
          onClose={() => setCancelTarget(null)}
        />
      )}
    </div>
  );
}