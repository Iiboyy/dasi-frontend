import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../services/productService";

const HeroBag = () => (
  <svg viewBox="0 0 100 110" fill="none" stroke="rgba(255,255,255,0.75)"
    strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="w-[42%] h-[42%]">
    <path d="M18 38 L12 92 Q12 96 17 96 L83 96 Q88 96 88 92 L82 38 Z" />
    <path d="M33 38 Q33 18 50 18 Q67 18 67 38" />
    <line x1="12" y1="38" x2="88" y2="38" />
  </svg>
);

const PREVIEW_LIMIT = 10;

export default function Home({ onNavigate, searchQuery }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const data = await getProducts(searchQuery ? { search: searchQuery } : {});
      setProducts(Array.isArray(data) ? data : []);
      setLoading(false);
    };
    fetch();
  }, [searchQuery]);

  const displayed = products.slice(0, PREVIEW_LIMIT);

  return (
    <>
      <style>{`
        @keyframes heroUp { from { opacity:0; transform:translateY(28px) } to { opacity:1; transform:translateY(0) } }
        .hero-anim { animation: heroUp .7s ease both; }
        .hero-anim-delay { animation: heroUp .7s .22s ease both; }
      `}</style>

      {!searchQuery && (
        <section className="w-full flex items-center px-10 py-16 relative overflow-hidden min-h-95"
          style={{ background: "linear-gradient(118deg,#1a3fbd 0%,#2356e8 38%,#2d6ef5 68%,#4b8af7 100%)" }}>
          <div className="absolute -top-36 -right-16 w-135 h-135 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle,rgba(255,255,255,0.07) 0%,transparent 70%)" }} />
          <div className="flex-1 max-w-140 hero-anim">
            <h1 className="font-extrabold text-white leading-tight mb-4 tracking-tight"
              style={{ fontFamily: "var(--font-display)", fontSize: "clamp(30px,3.6vw,52px)" }}>
              Selamat Datang di DASI!
            </h1>
            <p className="text-white/75 leading-relaxed max-w-100"
              style={{ fontSize: "clamp(13px,1.3vw,16px)" }}>
              Platform belanja OSIS yang menyediakan berbagai makanan, minuman, dan kebutuhan sekolah dengan harga terjangkau.
            </p>
          </div>
          <div className="shrink-0 ml-auto pl-12 hero-anim-delay hidden md:flex">
            <div className="rounded-full flex items-center justify-center"
              style={{ width: "clamp(200px,20vw,300px)", height: "clamp(200px,20vw,300px)", background: "rgba(255,255,255,0.1)", border: "2px solid rgba(255,255,255,0.15)" }}>
              <HeroBag />
            </div>
          </div>
        </section>
      )}

      <section className="w-full px-10 py-11 bg-gray-50">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-bold text-gray-900 text-xl" style={{ fontFamily: "var(--font-display)" }}>
              {searchQuery ? `Hasil pencarian "${searchQuery}"` : "Produk Pilihan"}
            </h2>
            <p className="text-sm text-gray-400 mt-0.5">
              Menampilkan {displayed.length} dari {products.length} produk
            </p>
          </div>
          <button onClick={() => onNavigate("all-products")}
            className="flex items-center gap-1.5 text-blue-600 text-sm font-semibold border-none bg-transparent cursor-pointer hover:gap-2 transition-all">
            Lihat Semua
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-400 text-sm">Memuat produk...</div>
        ) : displayed.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">
            Produk tidak ditemukan {searchQuery && `untuk "${searchQuery}"`}
          </div>
        ) : (
          <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))" }}>
            {displayed.map(p => <ProductCard key={p._id} product={p} onNavigate={onNavigate} />)}
          </div>
        )}
      </section>
    </>
  );
}