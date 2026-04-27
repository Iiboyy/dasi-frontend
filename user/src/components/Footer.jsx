import logoDasi from "../assets/logo_dasi.jpeg";

export default function Footer() {
  return (
    <footer className="bg-gray-900" style={{ fontFamily: "var(--font-body)" }}>
      <div className="w-full px-10 pt-11 pb-0">
        <div className="flex flex-wrap gap-10 pb-9">

          {/* Brand */}
          <div className="flex-[1.5] min-w-[200px] max-w-[260px]">
            <div className="flex items-center gap-2.5 mb-3.5">
              <img src={logoDasi} alt="DASI" className="w-9 h-9 object-contain" />
              <span className="font-extrabold text-xl text-white tracking-tight" style={{ fontFamily: "var(--font-display)" }}>DASI</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-[220px]">
              DAnusan oSIs – Marketplace terpercaya untuk semua kebutuhanmu.
            </p>
          </div>

          {/* Layanan */}
          <div className="min-w-[140px]">
            <h4 className="text-white text-sm font-bold mb-4">Layanan</h4>
            {["Cara Belanja", "Cara Pembayaran", "Pengiriman"].map(l => (
              <a key={l} href="#" className="block text-slate-500 text-sm mb-2.5 hover:text-slate-200 transition-colors">{l}</a>
            ))}
          </div>

          {/* Tentang */}
          <div className="min-w-[140px]">
            <h4 className="text-white text-sm font-bold mb-4">Tentang</h4>
            {["Tentang Kami", "Kebijakan Privasi", "Syarat & Ketentuan"].map(l => (
              <a key={l} href="#" className="block text-slate-500 text-sm mb-2.5 hover:text-slate-200 transition-colors">{l}</a>
            ))}
          </div>

          {/* Hubungi */}
          <div className="min-w-[180px]">
            <h4 className="text-white text-sm font-bold mb-4">Hubungi Kami</h4>
            <div className="flex items-center gap-2 mb-3">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <span className="text-slate-400 text-sm">support@dasi.id</span>
            </div>
            <div className="flex items-center gap-2">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 01-2.18 2A19.79 19.79 0 0111.62 19a19.5 19.5 0 01-6-6A19.79 19.79 0 013.12 4.18 2 2 0 015.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L9.91 9.09a16 16 0 006 6l.46-.46a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
              </svg>
              <span className="text-slate-400 text-sm">(021) 1234–5678</span>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 py-5 text-center">
          <p className="text-slate-500 text-xs">© 2026 OSIS SMKN 7 Semarang. Semua hak dilindungi.</p>
        </div>
      </div>
    </footer>
  );
}