import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/layout/AdminLayout";
import api from "../../lib/api";

const ProfilePage = () => {
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [user, setUser] = useState(null);

  const [form, setForm] = useState({ name: "" });

  const [password, setPassword] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await api.get("/users/me");
        setUser(res.data);
        setForm({ name: res.data?.name || "" });
      } catch (err) {
        console.log(err);
      }
    };
    fetchMe();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const res = await api.patch("/users/me", { name: form.name });
      setUser(res.data);
      setEditing(false);
    } catch (err) {
      alert("Gagal update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      setLoading(true);
      await api.patch("/users/me/password", password);
      alert("Password berhasil diubah");
      setPassword({ oldPassword: "", newPassword: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Gagal ubah password");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <AdminLayout>Loading...</AdminLayout>;

  return (
    <AdminLayout>
      <div className="space-y-6">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-2xl p-6 flex justify-between items-center shadow">
          <div>
            <h1 className="text-xl font-semibold">Profile</h1>
            <p className="text-sm opacity-80">Kelola akun kamu</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-sm text-white transition">
            Logout
          </button>
        </div>

        {/* PROFILE CARD */}
        <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-blue-500 text-white flex items-center justify-center text-2xl font-bold">
            {user.name.charAt(0)}
          </div>

          <div>
            <h2 className="text-lg font-semibold">{user.name}</h2>
            <p className="text-gray-500 text-sm">{user.email}</p>
            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded mt-2 inline-block">
              {user.role}
            </span>
          </div>
        </div>

        {/* EDIT PROFILE */}
        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex justify-between mb-4">
            <h2 className="font-semibold">Informasi Akun</h2>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="text-blue-600 text-sm"
              >
                Edit
              </button>
            )}
          </div>

          <div className="grid gap-4">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              readOnly={!editing}
              className="border px-3 py-2 rounded-lg"
            />

            <input
              value={user.email}
              readOnly
              className="border px-3 py-2 rounded-lg bg-gray-100"
            />
          </div>

          {editing && (
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setEditing(false)}>Batal</button>
              <button
                onClick={handleUpdate}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          )}
        </div>

        {/* PASSWORD */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="font-semibold mb-4">Ubah Password</h2>

          <div className="space-y-3">
            <input
              type="password"
              placeholder="Password Lama"
              value={password.oldPassword}
              onChange={(e) =>
                setPassword({ ...password, oldPassword: e.target.value })
              }
              className="w-full border px-3 py-2 rounded-lg"
            />

            <input
              type="password"
              placeholder="Password Baru"
              value={password.newPassword}
              onChange={(e) =>
                setPassword({ ...password, newPassword: e.target.value })
              }
              className="w-full border px-3 py-2 rounded-lg"
            />

            <button
              onClick={handleChangePassword}
              className="bg-green-500 text-white px-4 py-2 rounded-lg"
            >
              {loading ? "Processing..." : "Update Password"}
            </button>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};

export default ProfilePage;