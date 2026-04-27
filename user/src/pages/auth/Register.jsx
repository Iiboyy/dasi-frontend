import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import logoDasi from "../../assets/logo_dasi.jpeg";

const jurusanList = [
  "TME",
  "TEK",
  "TITL",
  "TMO",
  "TPFL",
  "SIJA",
  "KGS",
  "KJIJ",
];

const BackIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const EyeIcon = ({ show }) =>
  show ? (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );

export default function Register({ onNavigate }) {
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "buyer",
    kelas: "",
    jurusan: "",
  });
  const [showPw, setShowPw] = useState(false);
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    if (!form.name || !form.email || !form.phone || !form.password) {
      setError("Lengkapi semua field.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }
    if (!agree) {
      setError("Setujui syarat & ketentuan terlebih dahulu.");
      return;
    }

    setLoading(true);
    const result = await register(
      form.name,
      form.email,
      form.password,
      "buyer",
      { phone: form.phone, kelas: form.kelas, jurusan: form.jurusan },
    );
    setLoading(false);

    if (!result.success) {
      setError(result.message || "Gagal mendaftar, coba lagi.");
      return;
    }
    onNavigate("home");
  };

  const inputCls =
    "w-full px-3.5 py-3 border border-gray-200 rounded-xl text-sm outline-none bg-white transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-100";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-6 relative">
      <button
        onClick={() => onNavigate("home")}
        className="absolute top-6 left-6 flex items-center gap-1.5 bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-sm font-semibold text-gray-600 cursor-pointer shadow-sm hover:border-blue-400 hover:text-blue-600 transition-colors"
      >
        <BackIcon /> Beranda
      </button>

      <div className="bg-white rounded-2xl px-9 py-10 w-full max-w-sm shadow-xl border border-gray-100">
        <div className="flex flex-col items-center mb-7">
          <img
            src={logoDasi}
            alt="DASI"
            className="w-16 h-16 object-contain mb-4"
          />
          <h1
            className="font-extrabold text-xl text-gray-900 mb-1.5"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Daftar di DASI
          </h1>
          <p className="text-gray-500 text-sm">
            Buat akun baru untuk mulai belanja
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5 mb-4 text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Nama, Email, Phone */}
        {[
          {
            key: "name",
            label: "Nama Lengkap",
            placeholder: "Masukkan nama lengkap",
            type: "text",
          },
          {
            key: "email",
            label: "Email",
            placeholder: "nama@email.com",
            type: "email",
          },
          {
            key: "phone",
            label: "Nomor Telepon",
            placeholder: "08xxxxxxxxxx",
            type: "tel",
          },
        ].map((f) => (
          <div key={f.key} className="mb-3.5">
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              {f.label}
            </label>
            <input
              type={f.type}
              placeholder={f.placeholder}
              value={form[f.key]}
              onChange={(e) =>
                setForm((p) => ({ ...p, [f.key]: e.target.value }))
              }
              className={inputCls}
            />
          </div>
        ))}

        {/* Kelas & Jurusan */}
        <div className="grid grid-cols-2 gap-3 mb-3.5">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Kelas
            </label>
            <input
              type="text"
              placeholder="XI, XII"
              value={form.kelas}
              onChange={(e) =>
                setForm((p) => ({ ...p, kelas: e.target.value }))
              }
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Jurusan
            </label>
            <select
              value={form.jurusan}
              onChange={(e) =>
                setForm((p) => ({ ...p, jurusan: e.target.value }))
              }
              className={inputCls}
            >
              <option value="">Pilih</option>
              {jurusanList.map((j) => (
                <option key={j} value={j}>
                  {j}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              placeholder="Minimal 6 karakter"
              value={form.password}
              onChange={(e) =>
                setForm((p) => ({ ...p, password: e.target.value }))
              }
              className={`${inputCls} pr-11`}
            />
            <button
              onClick={() => setShowPw((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none text-gray-400 cursor-pointer hover:text-gray-600 p-0.5"
            >
              <EyeIcon show={showPw} />
            </button>
          </div>
        </div>

        <label className="flex items-start gap-2 mb-5 cursor-pointer">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="mt-0.5 accent-blue-600 w-3.5 h-3.5 shrink-0"
          />
          <span className="text-sm text-gray-600 leading-relaxed">
            Saya setuju dengan{" "}
            <span className="text-blue-600 font-semibold">
              Syarat & Ketentuan
            </span>{" "}
            dan{" "}
            <span className="text-blue-600 font-semibold">
              Kebijakan Privasi
            </span>
          </span>
        </label>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full py-3 rounded-xl text-sm font-bold border-none mb-5 transition-colors ${loading ? "bg-blue-300 cursor-not-allowed text-white" : "bg-blue-600 text-white cursor-pointer hover:bg-blue-700"}`}
        >
          {loading ? "Memproses..." : "Daftar Sekarang"}
        </button>

        <p className="text-center text-sm text-gray-500">
          Sudah punya akun?{" "}
          <button
            onClick={() => onNavigate("login")}
            className="bg-transparent border-none text-blue-600 font-bold cursor-pointer text-sm"
          >
            Masuk
          </button>
        </p>
      </div>
    </div>
  );
}
