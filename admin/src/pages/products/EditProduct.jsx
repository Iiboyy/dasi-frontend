import { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../lib/api";

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    thumbnail: "",
    file: null,
    stock: "",
    active: true,
  });

  const handleFileChange = (e) => {
    setForm({ ...form, file: e.target.files[0] });
  };

  // FETCH DETAIL PRODUCT
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        const data = res.data;

        setForm({
          name: data?.name || "",
          description: data?.description || "",
          category: data?.category || "",
          price: data?.price || "",
          thumbnail: data?.thumbnail || "",
          file: null,
          stock: data?.stock || "",
          active: data?.active ?? true,
        });
      } catch (error) {
        console.log("Gagal ambil data produk", error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // SUBMIT UPDATE
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

      if (form.file) {
        formData.append("thumbnail", form.file);
      }

      await api.patch(`/products/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Produk berhasil diupdate!");
      navigate("/products");
    } catch (error) {
      console.log(error);
      alert("Gagal update produk");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">

        <div>
          <p className="text-sm text-gray-500">
            Ubah data produk yang sudah ada
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow space-y-6"
        >

          <div className="grid grid-cols-2 gap-4">

            <div>
              <label className="text-sm text-gray-500">Nama Produk</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="text-sm text-gray-500">Kategori</label>
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

            <div>
              <label className="text-sm text-gray-500">Harga</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="text-sm text-gray-500">Stok</label>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border rounded-lg"
              />
            </div>

          </div>

          <div>
            <label className="text-sm text-gray-500">Deskripsi Produk</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="3"
              className="w-full mt-1 px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="text-sm text-gray-500">Upload Gambar</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full mt-1 px-3 py-2 border rounded-lg"
            />
          </div>

          {/* PREVIEW */}
          {form.file ? (
            <img
              src={URL.createObjectURL(form.file)}
              className="w-32 h-32 object-cover rounded-lg border"
            />
          ) : form.thumbnail ? (
            <img
              src={form.thumbnail}
              className="w-32 h-32 object-cover rounded-lg border"
            />
          ) : null}

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
              className="bg-yellow-500 text-white px-5 py-2 rounded-lg"
            >
              Update Produk
            </button>

          </div>

        </form>

      </div>
    </AdminLayout>
  );
};

export default EditProduct;