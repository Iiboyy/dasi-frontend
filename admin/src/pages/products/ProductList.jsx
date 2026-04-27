import { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";
import api from "../../lib/api";

const Produk = () => {
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sortPrice, setSortPrice] = useState("");

const deleteProduct = async (id) => {
  try {
    await api.delete(`/products/${id}`);

    setProducts((prev) =>
      prev.filter((p) => p._id !== id)
    );
  } catch (error) {
    console.log("Gagal delete:", error.response?.data || error.message);
  }
};

  // FETCH PRODUCTS
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");

        setProducts(res.data || []);
        setTotalProducts(res.data?.length || 0);
      } catch (error) {
        console.log(
          "Gagal ambil produk",
          error.response?.data || error.message
        );
      }
    };

    fetchProducts();
  }, []);

  // TOGGLE STATUS (FIXED - keluar dari useEffect)
  const toggleStatus = async (id) => {
    try {
      await api.patch(`/products/${id}/toggle`);

      setProducts((prev) =>
        prev.map((product) =>
          product._id === id
            ? { ...product, active: !product.active }
            : product
        )
      );
    } catch (error) {
      console.log(
        "Gagal toggle status",
        error.response?.data || error.message
      );
    }
  };

  const filteredProducts = products
    .filter((product) => {
      const matchSearch = (product.name || "")
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchCategory =
        category === "all" || product.category === category;

      return matchSearch && matchCategory;
    })
    .sort((a, b) => {
      if (sortPrice === "low") return a.price - b.price;
      if (sortPrice === "high") return b.price - a.price;
      return 0;
    });

  return (
    <AdminLayout>
      <div className="space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-md text-gray-500">
              Total {totalProducts} produk aktif
            </p>
          </div>

          <NavLink to="/products/add">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
              + Tambah Produk
            </button>
          </NavLink>
        </div>

        {/* FILTER */}
        <div className="bg-white p-4 rounded-xl shadow flex gap-4">
          <input
            type="text"
            placeholder="🔍︎ Cari produk"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg px-4 py-2 flex-1 focus:outline-none"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border rounded-lg px-3 py-2"
          >
            <option value="all">Semua Kategori</option>
            <option value="Makanan">Makanan</option>
            <option value="Minuman">Minuman</option>
            <option value="Barang">Barang</option>
          </select>

          <select
            value={sortPrice}
            onChange={(e) => setSortPrice(e.target.value)}
            className="border rounded-lg px-3 py-2"
          >
            <option value="">Urutkan Harga</option>
            <option value="low">Harga Terendah</option>
            <option value="high">Harga Tertinggi</option>
          </select>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">

            <thead className="text-gray-500 border-b">
              <tr className="text-left">
                <th className="p-4">Produk</th>
                <th>Kategori</th>
                <th>Harga</th>
                <th>Rating</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center p-6 text-gray-400">
                    Belum ada produk
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product._id} className="border-b">

                    <td className="p-4 flex items-center gap-3">
                      <img
                        src={product.thumbnail}
                        alt=""
                        className="w-10 h-10 rounded object-cover"
                      />

                      <div>
                        <p className="font-medium">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {product.description}
                        </p>
                      </div>
                    </td>

                    <td>
                      <span className="bg-blue-100 text-blue-500 px-2 py-1 text-xs rounded">
                        {product.category}
                      </span>
                    </td>

                    <td>
                      Rp {product.price?.toLocaleString()}
                    </td>

                    <td>
                      ★ {product.rating || 0}
                    </td>

                    <td>
                      <button
                        onClick={() => toggleStatus(product._id)}
                        className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
                          product.active ? "bg-green-500" : "bg-gray-300"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 bg-white rounded-full shadow-md transform transition ${
                            product.active ? "translate-x-6" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </td>

                    <td>
                      <div className="flex items-center space-x-2">
                        <NavLink to={`/products/edit/${product._id}`}>
                          <button className="rounded-lg text-blue-600 hover:bg-blue-50 transition">
                            <FontAwesomeIcon icon={faPen} />
                          </button>
                        </NavLink>

                        <button
                          onClick={() => deleteProduct(product._id)}
                          className="rounded-lg text-red-600 hover:bg-red-50 transition"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
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

export default Produk;