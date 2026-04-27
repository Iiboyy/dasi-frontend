import { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";
import api from "../../lib/api";

const Categories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");

        setCategories(res.data || []);
      } catch (error) {
        console.log(
          "Gagal ambil kategori",
          error.response?.data || error.message
        );
      }
    };

    fetchCategories();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">

        <div className="flex justify-between items-center mb-6">

          <div>
            <p className="text-md text-gray-500">
              {categories.length} kategori tersedia
            </p>
          </div>

          <NavLink to="/categories/add">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
              + Tambah Kategori
            </button>
          </NavLink>

        </div>

        <div className="grid grid-cols-3 gap-6">

          {categories.map((category) => (
            <div
              key={category._id}
              className="bg-white rounded-xl shadow-sm p-6 text-center"
            >
              <div className="text-4xl mb-3">
                {category.icon}
              </div>

              <h3 className="font-semibold">
                {category.name}
              </h3>

              <p className="text-sm text-gray-500">
                {category.productCount} produk
              </p>

              <div className="flex justify-center gap-3 mt-4">

                <NavLink to={`/categories/edit/${category._id}`}>
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg text-blue-600 hover:bg-blue-50 transition">
                    <FontAwesomeIcon icon={faPen} />
                  </button>
                </NavLink>

                <button className="w-8 h-8 flex items-center justify-center rounded-lg text-red-600 hover:bg-red-50 transition">
                  <FontAwesomeIcon icon={faTrash} />
                </button>

              </div>

            </div>
          ))}

        </div>

      </div>
    </AdminLayout>
  );
};

export default Categories;