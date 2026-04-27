import { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import api from "../../lib/api";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");

  const fetchOrders = async () => {
    try {
      const res = await api.get("/transactions");
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.log(
        "Gagal ambil orders",
        error.response?.data || error.message
      );
      setOrders([]);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // UPDATE STATUS
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await api.patch(`/transactions/${id}/status`, {
        status: newStatus,
      });

      fetchOrders();
    } catch (err) {
      console.log("Gagal update status", err.response?.data || err.message);
    }
  };

  // FILTER
  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter((order) => order?.status === filter);

  // LABEL UI
  const statusMap = {
    pending: "Diproses",
    paid: "Selesai",
    failed: "Dibatalkan",
    expired: "Kadaluarsa",
  };

  const isActive = (val) =>
    filter === val ? "bg-blue-500 text-white" : "bg-gray-100";

  return (
    <AdminLayout>
      <div className="space-y-6">

        {/* FILTER */}
        <div className="flex gap-3 mb-6 bg-white p-3 rounded-xl shadow-sm w-fit">
          <button onClick={() => setFilter("all")} className={`px-4 py-2 rounded-lg ${isActive("all")}`}>Semua</button>
          <button onClick={() => setFilter("pending")} className={`px-4 py-2 rounded-lg ${isActive("pending")}`}>Pending</button>
          <button onClick={() => setFilter("paid")} className={`px-4 py-2 rounded-lg ${isActive("paid")}`}>Paid</button>
          <button onClick={() => setFilter("failed")} className={`px-4 py-2 rounded-lg ${isActive("failed")}`}>Failed</button>
          <button onClick={() => setFilter("expired")} className={`px-4 py-2 rounded-lg ${isActive("expired")}`}>Expired</button>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">

            <thead className="text-gray-500 text-left">
              <tr>
                <th className="p-4">NO. PESANAN</th>
                <th className="p-4">PELANGGAN</th>
                <th className="p-4">PRODUK</th>
                <th className="p-4">TOTAL</th>
                <th className="p-4">TANGGAL</th>
                <th className="p-4">STATUS</th>
                <th className="p-4">AKSI</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center p-6 text-gray-400">
                    Belum ada pesanan
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order?._id} className="border-t">

                    <td className="p-4 font-medium">
                      #{order?.transaction_id?.slice(-6) || "-"}
                    </td>

                    <td className="p-4">
                      {order?.buyer_id?.name || "-"}
                    </td>

                    <td className="p-4">
                      {Array.isArray(order?.items)
                        ? order.items.map((item, i) => (
                            <span key={i}>
                              {item?.name}
                              {i < order.items.length - 1 ? ", " : ""}
                            </span>
                          ))
                        : "-"}
                    </td>

                    <td className="p-4">
                      Rp {(order?.total_amount || 0).toLocaleString()}
                    </td>

                    <td className="p-4">
                      {order?.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : "-"}
                    </td>

                    <td className="p-4">
                      <span className="px-2 py-1 rounded text-xs bg-gray-100">
                        {statusMap[order?.status] || order?.status}
                      </span>
                    </td>

                    {/* ACTION */}
                    <td className="p-4 space-x-2">

                      <select
                        value={order?.status}
                        onChange={(e) =>
                          handleUpdateStatus(order.transaction_id, e.target.value)
                        }
                        className="border rounded px-2 py-1 text-xs"
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="failed">Failed</option>
                        <option value="expired">Expired</option>
                      </select>
                      
                    </td>

                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>

      </div>
    </AdminLayout>
  );
};

export default Orders;