import { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import api from "../../lib/api";

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.log(err.response?.data || err.message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // delete user
  const handleDelete = async (id) => {
    const confirmDelete = confirm("Yakin mau hapus user ini?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(users.filter((u) => u._id !== id));
      alert("User berhasil dihapus");
    } catch (err) {
      console.log(err.response?.data || err.message);
      alert("Gagal hapus user");
    }
  };

  // filter
  const filteredUsers = Array.isArray(users)
    ? users.filter((user) =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  return (
    <AdminLayout>
      <div className="space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">
              Manajemen Pengguna
            </h1>
            <p className="text-sm text-gray-500">
              {users.length} pengguna terdaftar
            </p>
          </div>

          <input
            type="text"
            placeholder="Cari pengguna..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <p className="p-6 text-gray-500">Loading...</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-left">
                <tr>
                  <th className="p-4">Nama</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Bergabung</th>
                  <th className="p-4 text-center">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center p-6 text-gray-400">
                      Tidak ada data
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      <td className="p-4 font-medium text-gray-800">
                        {user.name}
                      </td>

                      <td className="p-4 text-gray-500">
                        {user.email}
                      </td>

                      <td className="p-4">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            user.role === "admin"
                              ? "bg-red-100 text-red-500"
                              : "bg-green-100 text-green-500"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>

                      <td className="p-4 text-gray-400">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>

                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="text-red-500 hover:text-red-700 text-lg"
                        >
                          🗑
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </AdminLayout>
  );
};

export default UserPage;