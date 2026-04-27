import { useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api";

const AddProduct = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    stock: "",
    active: true,
    file: null,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    setForm({
      ...form,
      file: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("category", form.category);
      formData.append("price", form.price);
      formData.append("stock", form.stock);
      formData.append("active", form.active);
      formData.append("thumbnail", form.file);

      await api.post("/products", formData);

      alert("Produk berhasil ditambahkan!");
      navigate("/products");
    } catch (error) {
      console.log("Gagal tambah produk", error.response?.data || error.message);
      alert("Gagal tambah produk");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">

        {/* HEADER */}
        <div>
          <p className="text-sm text-gray-500">
            Tambahkan produk baru ke dalam sistem
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow space-y-6"
        >

          <div className="grid grid-cols-2 gap-4">

            {/* Nama */}
            <div>
              <label className="text-sm text-gray-500">
                Nama Produk
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Kategori */}
            <div>
              <label className="text-sm text-gray-500">
                Kategori
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border rounded-lg"
              >
                <option value="">Pilih Kategori</option>
                <option value="Makanan">Makanan</option>
                <option value="Minuman">Minuman</option>
                <option value="Barang">Barang</option>
              </select>
            </div>

            {/* Harga */}
            <div>
              <label className="text-sm text-gray-500">
                Harga
              </label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border rounded-lg"
              />
            </div>

            {/* Stok */}
            <div>
              <label className="text-sm text-gray-500">
                Stok
              </label>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border rounded-lg"
              />
            </div>

          </div>

          {/* Deskripsi */}
          <div>
            <label className="text-sm text-gray-500">
              Deskripsi Produk
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="3"
              className="w-full mt-1 px-3 py-2 border rounded-lg"
            />
          </div>

          {/* Image */}
          <div>
            <label className="text-sm text-gray-500">
              Upload Gambar
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full mt-1 px-3 py-2 border rounded-lg"
            />
          </div>

          {/* Status */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="active"
              checked={form.active}
              onChange={handleChange}
            />
            <label className="text-sm text-gray-600">
              Produk Aktif
            </label>
          </div>

          {/* BUTTON */}
          <div className="flex justify-end gap-3">

            <button
              type="button"
              onClick={() => navigate("/products")}
              className="px-4 py-2 text-gray-500"
            >
              Batal
            </button>

            <button
              type="submit"
              className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600"
            >
              Simpan Produk
            </button>

          </div>

        </form>

      </div>
    </AdminLayout>
  );
};

export default AddProduct;