import { useState, useEffect } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../lib/api";

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categoryName, setCategoryName] = useState("");
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  // FETCH ALL PRODUCTS
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        setAllProducts(res.data || []);
      } catch (error) {
        console.log(
          "Gagal ambil products",
          error.response?.data || error.message
        );
      }
    };

    fetchProducts();
  }, []);

  // FETCH CATEGORY
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await api.get(`/categories/${id}`);
        const data = res.data;

        setCategoryName(data.name || "");

        setProducts(
          (data.products || []).map((p) =>
            typeof p === "object" ? p : { _id: p }
          )
        );
      } catch (error) {
        console.log(
          "Gagal ambil kategori",
          error.response?.data || error.message
        );
      }
    };

    fetchCategory();
  }, [id]);

  // ADD PRODUCT
  const handleAdd = (product) => {
    setProducts((prev) => {
      const exists = prev.some(
        (p) => String(p._id) === String(product._id)
      );

      if (exists) return prev;

      return [...prev, product];
    });
  };

  // REMOVE PRODUCT
  const handleRemove = (productId) => {
    setProducts((prev) =>
      prev.filter((p) => String(p._id) !== String(productId))
    );
  };

  // SUBMIT UPDATE CATEGORY
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        name: categoryName,
        products: products.map((p) => p._id),
      };

      await api.patch(`/categories/${id}`, payload);

      alert("Kategori berhasil diupdate!");
      navigate("/categories");
    } catch (error) {
      console.log(
        "Gagal update kategori",
        error.response?.data || error.message
      );
      alert("Gagal update kategori");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">

        {/* CATEGORY NAME */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <label className="text-sm text-gray-500">
            Nama Kategori
          </label>

          <input
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="w-full mt-1 px-3 py-2 border rounded-lg"
          />
        </div>

        {/* LIST PRODUK */}
        <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
          <h2 className="font-semibold">Produk dalam kategori</h2>

          {products.length === 0 && (
            <p className="text-gray-500">Belum ada produk</p>
          )}

          {products.map((product) => (
            <div
              key={product._id}
              className="flex justify-between items-center border-b pb-2"
            >
              <span>{product.name}</span>

              <button
                onClick={() => handleRemove(product._id)}
                className="text-red-500"
              >
                Hapus
              </button>
            </div>
          ))}
        </div>

        {/* TAMBAH PRODUK */}
        <div className="bg-white p-6 rounded-xl shadow-sm space-y-3">
          <h2 className="font-semibold">Tambah Produk</h2>

          <div className="flex gap-2 flex-wrap">
            {allProducts.map((product) => (
              <button
                key={product._id}
                onClick={() => handleAdd(product)}
                className="px-3 py-1 border rounded-lg hover:bg-gray-100"
              >
                + {product.name}
              </button>
            ))}
          </div>
        </div>

        {/* ACTION */}
        <div className="flex justify-end gap-3">

          <button
            onClick={() => navigate("/categories")}
            className="px-4 py-2 border rounded-lg"
          >
            Batal
          </button>

          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Simpan
          </button>

        </div>

      </div>
    </AdminLayout>
  );
};

export default EditCategory;