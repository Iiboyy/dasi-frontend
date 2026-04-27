import { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import api from "../../lib/api";

const Dashboard = () => {
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    users: 0,
    products: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [orderStatus, setOrderStatus] = useState({
    diproses: 0,
    dikirim: 0,
    selesai: 0,
    dibatalkan: 0,
  });

  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/admin/dashboard");

        const data = res.data;

        setStats({
          revenue: data.totalRevenue || 0,
          orders: data.totalTransactions || 0,
          users: data.totalUsers || 0,
          products: data.totalProducts || 0,
        });

        setRecentOrders(data.recent_orders || []);

        setOrderStatus(
          data.order_status || {
            diproses: 0,
            dikirim: 0,
            selesai: 0,
            dibatalkan: 0,
          }
        );

        setTopProducts(data.top_products || []);
      } catch (error) {
        console.log(
          "Backend belum tersedia / error:",
          error.response?.data || error.message
        );
      }
    };

    fetchDashboard();
  }, []);

  return (
    <AdminLayout>

      <div className="space-y-6">

        {/* STAT CARDS */}
        <div className="grid grid-cols-4 gap-6">

          <div className="bg-white p-5 rounded-xl shadow">
            <p className="text-sm text-gray-500">Total Pendapatan</p>
            <h2 className="text-2xl font-semibold">
              Rp {(stats.revenue || 0).toLocaleString()}
            </h2>
          </div>

          <div className="bg-white p-5 rounded-xl shadow">
            <p className="text-sm text-gray-500">Total Pesanan</p>
            <h2 className="text-2xl font-semibold">
              {stats.orders || 0}
            </h2>
          </div>

          <div className="bg-white p-5 rounded-xl shadow">
            <p className="text-sm text-gray-500">Total Pengguna</p>
            <h2 className="text-2xl font-semibold">
              {stats.users || 0}
            </h2>
          </div>

          <div className="bg-white p-5 rounded-xl shadow">
            <p className="text-sm text-gray-500">Produk Aktif</p>
            <h2 className="text-2xl font-semibold">
              {stats.products || 0}
            </h2>
          </div>

        </div>

        {/* CONTENT GRID */}
        <div className="grid grid-cols-3 gap-6">

          {/* RECENT ORDERS */}
          <div className="col-span-2 bg-white p-6 rounded-xl shadow">

            <div className="flex justify-between mb-4">
              <h3 className="font-semibold">Pesanan Terbaru</h3>
              <span className="text-sm text-blue-500 cursor-pointer">
                Lihat Semua
              </span>
            </div>

            {recentOrders.length === 0 ? (
              <p className="text-gray-400">Belum ada pesanan</p>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} className="flex justify-between py-2 border-b">
                  <div>
                    <p className="font-medium">{order.id}</p>
                    <p className="text-sm text-gray-400">{order.customer}</p>
                  </div>

                  <div className="text-right">
                    <p className="font-medium">
                      Rp {(order.total || 0).toLocaleString()}
                    </p>
                    <span className="text-xs text-gray-400">
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            )}

          </div>

          {/* RIGHT PANEL */}
          <div className="space-y-6">

            {/* ORDER STATUS */}
            <div className="bg-white p-6 rounded-xl shadow">

              <h3 className="font-semibold mb-4">Status Pesanan</h3>

              <div className="space-y-3 text-sm">

                <div className="flex justify-between">
                  <span>Diproses</span>
                  <span>{orderStatus.diproses || 0}</span>
                </div>

                <div className="flex justify-between">
                  <span>Dikirim</span>
                  <span>{orderStatus.dikirim || 0}</span>
                </div>

                <div className="flex justify-between">
                  <span>Selesai</span>
                  <span>{orderStatus.selesai || 0}</span>
                </div>

                <div className="flex justify-between">
                  <span>Dibatalkan</span>
                  <span>{orderStatus.dibatalkan || 0}</span>
                </div>

              </div>

            </div>

            {/* TOP PRODUCTS */}
            <div className="bg-white p-6 rounded-xl shadow">

              <h3 className="font-semibold mb-4">Produk Terlaris</h3>

              {topProducts.length === 0 ? (
                <p className="text-gray-400">Belum ada data</p>
              ) : (
                topProducts.map((product) => (
                  <div key={product.id} className="flex justify-between py-2 border-b">
                    <span>{product.name}</span>
                    <span className="text-gray-500 text-sm">
                      {product.sold} terjual
                    </span>
                  </div>
                ))
              )}

            </div>

          </div>

        </div>

      </div>

    </AdminLayout>
  );
};

export default Dashboard;