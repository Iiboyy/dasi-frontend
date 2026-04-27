import { api } from "../services/api";
import { useEffect, useState } from "react";

const formatRp = n => "Rp " + Number(n).toLocaleString("id-ID");

export default function OrderSuccess({ onNavigate, orderData }) {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (orderData?.transaction_id) {
      fetchOrder();
    }
  }, []);

  const fetchOrder = async () => {
    try {
      const data = await api.get(`/transactions/my/${orderData.transaction_id}`);
      setOrder(data);
    } catch (err) {
      console.error(err);
    }
  };

  const displayOrder = order || orderData;

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-6 py-16 bg-gray-50">
      <div className="text-center w-full max-w-120">
        <div className="w-22 h-22 rounded-full bg-linear-to-br from-green-100 to-green-200 flex items-center justify-center mx-auto mb-6">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.8" strokeLinecap="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h1 className="font-extrabold text-2xl text-gray-900 mb-2.5" style={{ fontFamily: "var(--font-display)" }}>
          Pesanan Dibuat!
        </h1>
        <p className="text-gray-500 text-sm leading-relaxed mb-8">
          Selesaikan pembayaran untuk memproses pesananmu.
        </p>

        <div className="bg-white rounded-2xl border border-gray-200 px-7 py-6 mb-7 shadow-sm text-left">
          <h3 className="text-sm font-bold text-gray-900 mb-5">Ringkasan Pesanan</h3>
          {[
            { label: "No. Pesanan", value: displayOrder?.transaction_id || "-" },
            { label: "Total", value: formatRp(displayOrder?.total_amount || 0) },
            { label: "Status", value: displayOrder?.status || "pending" },
          ].map((row, i) => (
            <div key={i} className="flex justify-between items-center mb-3.5">
              <span className="text-sm text-gray-500">{row.label}</span>
              <span className="text-sm text-gray-700 font-medium">{row.value}</span>
            </div>
          ))}
          <div className="border-t border-gray-100 my-4" />
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-gray-900">Total Pembayaran</span>
            <span className="text-sm font-bold text-blue-600">{formatRp(displayOrder?.total_amount || 0)}</span>
          </div>
        </div>

        {/* Tombol bayar kalau payment_url ada */}
        {displayOrder?.payment_url && (
          <a href={displayOrder.payment_url} target="_blank" rel="noreferrer"
            className="block w-full mb-3 px-12 py-3.5 bg-green-600 text-white rounded-xl text-sm font-bold border-none cursor-pointer hover:bg-green-700 transition-colors text-center">
            Bayar Sekarang
          </a>
        )}

        <button onClick={() => onNavigate("orders")}
          className="block w-full mb-3 px-12 py-3.5 bg-blue-50 text-blue-600 border border-blue-200 rounded-xl text-sm font-bold cursor-pointer hover:bg-blue-100 transition-colors">
          Lihat Pesanan
        </button>

        <button onClick={() => onNavigate("home")}
          className="block w-full px-12 py-3.5 bg-blue-600 text-white rounded-xl text-sm font-bold border-none cursor-pointer hover:bg-blue-700 transition-colors">
          Kembali ke Beranda
        </button>
      </div>
    </div>
  );
}