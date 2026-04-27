import { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import api from "../../lib/api";

const PaymentPage = () => {
  const [payments, setPayments] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await api.get("/admin/transactions");
        setPayments(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.log(
          "Gagal ambil payments",
          error.response?.data || error.message
        );
        setPayments([]);
      }
    };

    fetchPayments();
  }, []);

  // FILTER DATA
  const filteredPayments =
    statusFilter === "all"
      ? payments
      : payments.filter((p) => p.status === statusFilter);

  // hitung total per metode pembayaran
  const getTotalByMethod = (method) => {
    return filteredPayments
      .filter((p) => p?.payment_method === method)
      .reduce((acc, curr) => acc + (curr?.total_amount || 0), 0);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* STATISTIK PEMBAYARAN */}
        <div className="grid grid-cols-2 gap-6">

          <div className="bg-white p-5 rounded-xl shadow-sm flex items-center gap-4">
            <div className="text-blue-500 text-2xl">💳</div>
            <div>
              <p className="font-semibold text-lg">
                Rp {(getTotalByMethod("midtrans") || 0).toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">Midtrans</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm flex items-center gap-4">
            <div className="text-orange-500 text-2xl">📦</div>
            <div>
              <p className="font-semibold text-lg">
                Rp {(getTotalByMethod("cod") || 0).toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">Bayar di Tempat (COD)</p>
            </div>
          </div>

        </div>

        {/* RIWAYAT TRANSAKSI */}
        <div className="bg-white rounded-xl shadow-sm">

        <div className="p-5 border-b flex justify-between items-center">
          <h3 className="font-semibold">Riwayat Transaksi</h3>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">Semua Status</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
            <option value="expired">Expired</option>
          </select>
        </div>

          <table className="w-full text-sm">

            <thead className="text-gray-500 bg-gray-50">
              <tr>
                <th className="p-4 text-left">ID TRANSAKSI</th>
                <th className="p-4 text-left">PELANGGAN</th>
                <th className="p-4 text-left">METODE</th>
                <th className="p-4 text-left">TOTAL</th>
                <th className="p-4 text-left">TANGGAL</th>
                <th className="p-4 text-left">STATUS</th>
              </tr>
            </thead>

            <tbody>

              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center p-6 text-gray-400">
                    Tidak ada transaksi
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment) => (
                  <tr key={payment?._id} className="border-t">

                    <td className="p-4">
                      #{payment?.transaction_id?.slice(-6) || "-"}
                    </td>

                    <td className="p-4">
                      {payment?.buyer_id?.name || "-"}
                    </td>

                    <td className="p-4">
                      {payment?.payment_method || "-"}
                    </td>

                    <td className="p-4">
                      Rp {(payment?.total_amount || 0).toLocaleString()}
                    </td>

                    <td className="p-4">
                      {payment?.createdAt
                        ? new Date(payment.createdAt).toLocaleDateString()
                        : "-"}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          payment?.status === "paid"
                            ? "bg-green-100 text-green-600"
                            : payment?.status === "pending"
                            ? "bg-yellow-100 text-yellow-600"
                            : payment?.status === "failed"
                            ? "bg-red-100 text-red-600"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {payment?.status}
                      </span>
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

export default PaymentPage;