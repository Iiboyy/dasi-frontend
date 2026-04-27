import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

const jurusanList = ["TME", "TEK", "TITL", "TMO", "TPFL", "SIJA", "KGS", "KJIJ"];

export default function Profile({ onNavigate }) {
  const { user, updateUser, logout } = useAuth();
  const fileRef = useRef(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    kelas: user?.kelas || "",
    jurusan: user?.jurusan || "",
  });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [changingPw, setChangingPw] = useState(false);
  const [pwForm, setPwForm] = useState({ oldPassword: "", newPassword: "" });
  const [pwError, setPwError] = useState("");
  const [pwSaved, setPwSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        phone: user.phone || "",
        kelas: user.kelas || "",
        jurusan: user.jurusan || "",
      });
    }
  }, [user]);

  const handleSave = async () => {
    setError("");
    setLoading(true);
    try {
      const data = await api.patch("/users/me", form);
      if (data._id) {
        updateUser(data);
        setEditing(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      } else {
        setError(data.message || "Gagal menyimpan perubahan");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setForm({
      name: user?.name || "",
      phone: user?.phone || "",
      kelas: user?.kelas || "",
      jurusan: user?.jurusan || "",
    });
    setEditing(false);
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoLoading(true);
    try {
      const formData = new FormData();
      formData.append("photo", file);
      const BASE_URL = "http://localhost:5000/api";
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/users/me/photo`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (data._id) {
        updateUser(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPhotoLoading(false);
    }
  };

  const handleChangePassword = async () => {
    setPwError("");
    if (!pwForm.oldPassword || !pwForm.newPassword) {
      setPwError("Lengkapi semua field password");
      return;
    }
    if (pwForm.newPassword.length < 6) {
      setPwError("Password baru minimal 6 karakter");
      return;
    }
    try {
      const data = await api.patch("/users/me/password", pwForm);
      if (data.message === "Password updated successfully") {
        setPwSaved(true);
        setChangingPw(false);
        setPwForm({ oldPassword: "", newPassword: "" });
        setTimeout(() => setPwSaved(false), 2500);
      } else {
        setPwError(data.message || "Gagal mengubah password");
      }
    } catch (err) {
      setPwError(err.message);
    }
  };

  const initials = user?.name?.charAt(0)?.toUpperCase() || "U";

  const fieldCls = (disabled) =>
    `flex items-center border rounded-xl overflow-hidden transition-colors ${disabled
      ? "border-gray-100 bg-gray-50"
      : "border-gray-200 bg-white focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100"}`;

  const inputCls = (editable) =>
    `flex-1 border-none outline-none py-3 text-sm bg-transparent ${editable ? "text-gray-900" : "text-gray-400"}`;

  if (!user) {
    return (
      <div className="w-full min-h-[calc(100vh-64px)] bg-gray-50 flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500 text-sm">Login dulu untuk melihat profil</p>
        <button onClick={() => onNavigate("login")}
          className="px-8 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold border-none cursor-pointer hover:bg-blue-700">
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-64px)] bg-gray-50 px-10 py-11 pb-16">
      <div className="flex gap-6 items-start max-w-275 mx-auto flex-wrap">

        {/* Kiri */}
        <div className="flex-[0_0_260px] bg-white rounded-2xl border border-gray-200 px-6 py-7 flex flex-col items-center text-center">
          <div className="relative mb-3.5">
            {user?.photo ? (
              <img src={user.photo} alt="Foto Profil"
                className="w-20 h-20 rounded-full object-cover border-2 border-blue-200" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-linear-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white text-2xl font-extrabold"
                style={{ fontFamily: "var(--font-display)" }}>
                {initials}
              </div>
            )}
            {/* Tombol upload foto */}
            <button onClick={() => fileRef.current?.click()}
              disabled={photoLoading}
              className="absolute bottom-0 right-0 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer border-2 border-white hover:bg-blue-700 transition-colors">
              {photoLoading ? (
                <svg className="animate-spin" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
              )}
            </button>
            <input ref={fileRef} type="file" accept="image/*"
              onChange={handlePhotoChange} className="hidden" />
          </div>

          <h2 className="text-base font-bold text-gray-900 mb-1">{user?.name}</h2>
          <p className="text-xs text-gray-500 mb-1 break-all">{user?.email}</p>
          <p className="text-xs text-blue-600 font-semibold mb-1 capitalize">{user?.role}</p>
          {user?.kelas && user?.jurusan && (
            <p className="text-xs text-gray-500 mb-4">{user.kelas} · {user.jurusan}</p>
          )}
          {!user?.kelas && <div className="mb-4" />}

          <div className="w-full border-t border-gray-100 mb-5" />

          <button onClick={() => { logout(); onNavigate("home"); }}
            className="w-full py-2.5 bg-red-50 text-red-500 border border-red-200 rounded-xl text-sm font-semibold cursor-pointer flex items-center justify-center gap-2 hover:bg-red-100 transition-colors">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Keluar
          </button>
        </div>

        {/* Kanan */}
        <div className="flex-1 flex flex-col gap-5">
          <div className="bg-white rounded-2xl border border-gray-200 px-8 py-7">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-base font-bold text-gray-900 mb-1">Informasi Pribadi</h3>
                <p className="text-sm text-gray-500">Kelola data profil Anda untuk keamanan akun</p>
              </div>
              {!editing && (
                <button onClick={() => setEditing(true)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded-xl text-sm font-semibold cursor-pointer hover:bg-blue-100 transition-colors shrink-0">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  Edit
                </button>
              )}
            </div>

            {saved && (
              <div className="bg-green-50 border border-green-200 rounded-xl px-3.5 py-2.5 mb-5 text-sm text-green-700 font-semibold flex items-center gap-2">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                Perubahan berhasil disimpan!
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5 mb-5 text-sm text-red-600">{error}</div>
            )}

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Nama Lengkap</label>
                <div className={fieldCls(!editing)}>
                  <span className="px-3 text-gray-400 flex items-center shrink-0">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </span>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    readOnly={!editing} placeholder="Nama lengkap"
                    className={inputCls(editing)} style={{ cursor: editing ? "text" : "default" }} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email</label>
                <div className="flex items-center border border-gray-100 rounded-xl bg-gray-50 overflow-hidden">
                  <span className="px-3 text-gray-400 flex items-center shrink-0">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  </span>
                  <input value={user?.email || ""} readOnly
                    className="flex-1 border-none outline-none py-3 text-sm text-gray-400 bg-transparent" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Nomor Telepon</label>
                <div className={fieldCls(!editing)}>
                  <span className="px-3 text-gray-400 flex items-center shrink-0">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.62 19a19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 3.12 4.18 2 2 0 0 1 5.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L9.91 9.09a16 16 0 0 0 6 6l.46-.46a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  </span>
                  <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    readOnly={!editing} placeholder="08xxxxxxxxxx"
                    className={inputCls(editing)} style={{ cursor: editing ? "text" : "default" }} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Kelas</label>
                <div className={fieldCls(!editing)}>
                  <span className="px-3 text-gray-400 flex items-center shrink-0">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                  </span>
                  <input value={form.kelas} onChange={e => setForm(f => ({ ...f, kelas: e.target.value }))}
                    readOnly={!editing} placeholder="Contoh: XI, XII"
                    className={inputCls(editing)} style={{ cursor: editing ? "text" : "default" }} />
                </div>
              </div>
            </div>

            {/* Jurusan */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Jurusan</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                </span>
                <select value={form.jurusan} onChange={e => setForm(f => ({ ...f, jurusan: e.target.value }))}
                  disabled={!editing}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm appearance-none outline-none transition-colors
                    ${!editing ? "border-gray-100 bg-gray-50 text-gray-400" : "border-gray-200 bg-white text-gray-900 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"}`}>
                  <option value="">Pilih jurusan</option>
                  {jurusanList.map(j => <option key={j} value={j}>{j}</option>)}
                </select>
              </div>
            </div>

            {editing && (
              <div className="flex justify-end gap-3">
                <button onClick={handleCancel}
                  className="px-6 py-2.5 bg-transparent border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-50 transition-colors">
                  Batal
                </button>
                <button onClick={handleSave} disabled={loading}
                  className="px-7 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold border-none cursor-pointer hover:bg-blue-700 transition-colors flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                    <polyline points="17 21 17 13 7 13 7 21"/>
                    <polyline points="7 3 7 8 15 8"/>
                  </svg>
                  {loading ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            )}
          </div>

          {/* Ganti Password */}
          <div className="bg-white rounded-2xl border border-gray-200 px-8 py-7">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-base font-bold text-gray-900">Keamanan Akun</h3>
              {!changingPw && (
                <button onClick={() => setChangingPw(true)}
                  className="px-4 py-2 bg-gray-50 text-gray-600 border border-gray-200 rounded-xl text-sm font-semibold cursor-pointer hover:bg-gray-100 transition-colors">
                  Ganti Password
                </button>
              )}
            </div>

            {pwSaved && (
              <div className="bg-green-50 border border-green-200 rounded-xl px-3.5 py-2.5 mb-4 text-sm text-green-700 font-semibold">
                Password berhasil diubah!
              </div>
            )}

            {changingPw && (
              <div className="flex flex-col gap-3">
                {pwError && (
                  <div className="bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5 text-sm text-red-600">{pwError}</div>
                )}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Password Lama</label>
                  <input type="password" placeholder="••••••••" value={pwForm.oldPassword}
                    onChange={e => setPwForm(f => ({ ...f, oldPassword: e.target.value }))}
                    className="w-full px-3.5 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Password Baru</label>
                  <input type="password" placeholder="••••••••" value={pwForm.newPassword}
                    onChange={e => setPwForm(f => ({ ...f, newPassword: e.target.value }))}
                    className="w-full px-3.5 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                </div>
                <div className="flex justify-end gap-3 mt-1">
                  <button onClick={() => { setChangingPw(false); setPwError(""); setPwForm({ oldPassword: "", newPassword: "" }); }}
                    className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-50 bg-transparent">
                    Batal
                  </button>
                  <button onClick={handleChangePassword}
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold border-none cursor-pointer hover:bg-blue-700">
                    Simpan Password
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}