import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, onNavigate }) {
  const { user } = useAuth();
  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900">Akses Dibatasi</h2>
        <p className="text-gray-500 text-sm">Kamu perlu masuk untuk mengakses halaman ini.</p>
        <div className="flex gap-3 mt-2">
          <button onClick={() => onNavigate("login")}
            className="px-7 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold border-none cursor-pointer hover:bg-blue-700 transition-colors">
            Masuk
          </button>
          <button onClick={() => onNavigate("register")}
            className="px-7 py-2.5 bg-blue-50 text-blue-600 rounded-xl text-sm font-semibold border-none cursor-pointer hover:bg-blue-100 transition-colors">
            Daftar
          </button>
        </div>
      </div>
    );
  }
  return children;
}