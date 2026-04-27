import { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api";

const AddCategory = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    icon: "",
    active: true,
  });

  const [allProducts, setAllProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);

  // FETCH PRODUCTS
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

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ADD PRODUCT (FIX SAFE)
  const handleAddProduct = (product) => {
    setSelectedProducts((prev) => {
      const exists = prev.some(
        (p) => String(p._id) === String(product._id)
      );

      if (exists) return prev;

      return [...prev, product];
    });
  };

  // REMOVE PRODUCT (FIX SAFE)
  const handleRemoveProduct = (id) => {
    setSelectedProducts((prev) =>
      prev.filter((p) => String(p._id) !== String(id))
    );
  };

  // SUBMIT CATEGORY
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        name: form.name.trim(),
        icon: form.icon || "📦",
        active: form.active,
        products: selectedProducts.map((p) => p._id),
      };

      await api.post("/categories", payload);

      alert("Kategori berhasil ditambahkan!");
      navigate("/categories");
    } catch (error) {
      console.log(
        "ERROR:",
        error.response?.data || error.message
      );
      alert("Gagal tambah kategori");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow space-y-6"
        >

          {/* FORM UTAMA */}
          <div className="grid grid-cols-2 gap-4">

            <div>
              <label className="text-sm text-gray-500">
                Nama Kategori
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full mt-1 px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="text-sm text-gray-500">
                Icon (emoji)
              </label>
              <input
                type="text"
                name="icon"
                value={form.icon}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border rounded-lg"
              />
            </div>

          </div>

          {/* PREVIEW */}
          {form.icon && (
            <div className="text-3xl">
              {form.icon}
            </div>
          )}

          {/* STATUS */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="active"
              checked={form.active}
              onChange={handleChange}
            />
            <label className="text-sm text-gray-600">
              Kategori Aktif
            </label>
          </div>

          {/* SELECTED PRODUCTS */}
          <div className="border p-4 rounded-lg space-y-3">
            <h2 className="font-semibold">Produk dalam kategori</h2>

            {selectedProducts.length === 0 && (
              <p className="text-gray-500 text-sm">
                Belum ada produk
              </p>
            )}

            {selectedProducts.map((product) => (
              <div
                key={product._id}
                className="flex justify-between items-center border-b pb-2 last:border-none"
              >
                <span>{product.name}</span>

                <button
                  type="button"
                  onClick={() => handleRemoveProduct(product._id)}
                  className="text-red-500"
                >
                  Hapus
                </button>
              </div>
            ))}
          </div>

          {/* ALL PRODUCTS */}
          <div className="border p-4 rounded-lg space-y-3">
            <h2 className="font-semibold">Tambah Produk</h2>

            <div className="flex gap-2 flex-wrap">
              {allProducts.map((product) => (
                <button
                  type="button"
                  key={product._id}
                  onClick={() => handleAddProduct(product)}
                  className="px-3 py-1 border rounded-lg hover:bg-gray-100"
                >
                  + {product.name}
                </button>
              ))}
            </div>
          </div>

          {/* BUTTON */}
          <div className="flex justify-end gap-3">

            <button
              type="button"
              onClick={() => navigate("/categories")}
              className="px-4 py-2 text-gray-500"
            >
              Batal
            </button>

            <button
              type="submit"
              className="bg-blue-500 text-white px-5 py-2 rounded-lg"
            >
              Simpan Kategori
            </button>

          </div>

        </form>

      </div>
    </AdminLayout>
  );
};

export default AddCategory;