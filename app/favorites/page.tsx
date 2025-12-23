"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Home, ChevronRight, Trash2 } from "lucide-react";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavoriteBooks = async () => {
    try {
      setLoading(true);
      const savedSlugs: string[] = JSON.parse(localStorage.getItem("favorites") || "[]");
      
      if (savedSlugs.length === 0) {
        setFavorites([]);
        setLoading(false);
        return;
      }

      const response = await fetch("http://127.0.0.1:8000/api/books");
      const result = await response.json();

      // Memastikan mengambil data dari array atau property .data (Laravel)
      const allBooks = Array.isArray(result) ? result : (result.data || []);

      // Filter buku yang slug-nya ada di localStorage
      const favBooks = allBooks.filter((b: any) => 
        savedSlugs.some(slug => String(slug) === String(b.slug))
      );
      
      setFavorites(favBooks);
    } catch (err) {
      console.error("Gagal memuat favorit:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavoriteBooks();
    
    // Listener agar data update otomatis jika tab lain mengubah favorit
    window.addEventListener("storage", fetchFavoriteBooks);
    return () => window.removeEventListener("storage", fetchFavoriteBooks);
  }, []);

  const removeFavorite = (e: React.MouseEvent, slug: string) => {
    e.preventDefault(); // Mencegah navigasi Link saat klik tombol hapus
    const saved: string[] = JSON.parse(localStorage.getItem("favorites") || "[]");
    const updated = saved.filter((s) => String(s) !== String(slug));
    localStorage.setItem("favorites", JSON.stringify(updated));
    
    // Update UI secara instan
    setFavorites(prev => prev.filter(b => String(b.slug) !== String(slug)));
    window.dispatchEvent(new Event("storage"));
  };

  if (loading) return <div className="p-20 text-center font-bold text-indigo-600 italic">Memuat koleksi favorit...</div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 pt-28">
      <div className="max-w-6xl mx-auto px-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm mb-8 bg-white w-fit px-4 py-2 rounded-xl shadow-sm border border-slate-100">
          <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors">
            <Home size={16} />
            <span>Kembali ke Beranda</span>
          </Link>
          <ChevronRight size={14} className="text-slate-300" />
          <span className="font-bold text-slate-900">Favorit Saya</span>
        </nav>

        <h1 className="text-4xl font-black text-slate-900 mb-10 flex items-center gap-3">
          ❤️ Koleksi Favorit
        </h1>

        {favorites.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] p-20 text-center shadow-sm border border-slate-100">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trash2 size={32} className="text-slate-300" />
            </div>
            <p className="text-slate-500 text-lg mb-6">Belum ada buku yang kamu simpan.</p>
            <Link href="/" className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
              Cari Buku Sekarang
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {favorites.map((book) => {
              const price = Number(book.price) || 0;
              const finalPrice = Math.floor(price - (price * (book.discount || 0)) / 100);

              return (
                <div key={book.slug} className="group relative">
                  <div className="bg-white rounded-[1.5rem] shadow-sm hover:shadow-xl border border-slate-100 transition-all duration-300 flex flex-col h-full overflow-hidden">
                    {/* Gambar */}
                    <Link href={`/book/${book.slug}`} className="relative aspect-[3/4] overflow-hidden bg-slate-100">
                      <img 
                        src={book.image || "/placeholder-book.jpg"} 
                        alt={book.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500" 
                      />
                      {book.discount > 0 && (
                        <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-md">
                          -{book.discount}%
                        </div>
                      )}
                    </Link>

                    {/* Info */}
                    <div className="p-4 flex flex-col flex-grow">
                      <h3 className="font-bold text-slate-800 text-sm leading-snug line-clamp-2 mb-2 group-hover:text-indigo-600 transition-colors">
                        {book.title}
                      </h3>
                      <p className="text-slate-400 text-xs mb-3 italic">oleh {book.author}</p>
                      
                      <div className="mt-auto flex items-center justify-between">
                        <p className="text-indigo-600 font-black text-sm">
                          Rp {finalPrice.toLocaleString("id-ID")}
                        </p>
                        <button 
                          onClick={(e) => removeFavorite(e, book.slug)}
                          className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          title="Hapus dari favorit"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}