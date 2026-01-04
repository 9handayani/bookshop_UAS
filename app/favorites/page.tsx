"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Home, ChevronRight, Trash2, BookOpen, Loader2 } from "lucide-react";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  const API_BASE_URL = "http://127.0.0.1:8000";

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const fetchFavoriteBooks = useCallback(async () => {
    try {
      setLoading(true);
      const savedData = localStorage.getItem("favorites");
      const savedSlugs: string[] = savedData ? JSON.parse(savedData) : [];
      
      if (savedSlugs.length === 0) {
        setFavorites([]);
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/books`, {
        headers: { "Accept": "application/json" }
      });
      
      if (!response.ok) throw new Error("Gagal mengambil data");
      
      const result = await response.json();
      const allBooks = Array.isArray(result) ? result : (result.data || []);

      const favBooks = allBooks.filter((b: any) => 
        savedSlugs.includes(String(b.slug))
      );
      
      setFavorites(favBooks);
    } catch (err) {
      console.error("Gagal memuat favorit:", err);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    if (isMounted) {
      fetchFavoriteBooks();
      
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === "favorites") fetchFavoriteBooks();
      };

      window.addEventListener("storage", handleStorageChange);
      return () => window.removeEventListener("storage", handleStorageChange);
    }
  }, [isMounted, fetchFavoriteBooks]);

  const removeFavorite = (e: React.MouseEvent, slug: string) => {
    e.preventDefault();
    e.stopPropagation();

    const savedData = localStorage.getItem("favorites");
    const saved: string[] = savedData ? JSON.parse(savedData) : [];
    const updated = saved.filter((s) => String(s) !== String(slug));
    
    localStorage.setItem("favorites", JSON.stringify(updated));
    setFavorites(prev => prev.filter(b => String(b.slug) !== String(slug)));
    
    window.dispatchEvent(new Event("storage"));
  };

  if (!isMounted) return null;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Menyusun koleksi favoritmu...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 pt-28">
      <div className="max-w-6xl mx-auto px-6">
        
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
              <BookOpen size={32} className="text-slate-300" />
            </div>
            <p className="text-slate-500 text-lg mb-6 font-medium">Belum ada buku yang kamu simpan.</p>
            <Link href="/" className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95">
              Cari Buku Sekarang
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {favorites.map((book) => {
              const price = Number(book.price) || 0;
              const discount = Number(book.discount) || 0;
              const finalPrice = Math.floor(price - (price * discount) / 100);

              /**
               * PERBAIKAN UTAMA:
               * Karena gambar ada di folder 'public/books' proyek Frontend, 
               * kita panggil langsung dari root path "/"
               */
              const imageUrl = book.image 
                ? `/books/${book.image}` 
                : "/books/book1.jpg"; // Fallback ke salah satu gambar lokalmu

              return (
                <div key={book.slug} className="group flex flex-col h-full bg-white rounded-[1.5rem] shadow-sm hover:shadow-xl border border-slate-100 transition-all duration-300 overflow-hidden">
                  
                  <Link href={`/book/${book.slug}`} className="relative aspect-[3/4] overflow-hidden bg-slate-100 block">
                    <img 
                      src={imageUrl} 
                      alt={book.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/books/book1.jpg";
                      }}
                    />
                    {discount > 0 && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-md shadow-md z-10">
                        -{discount}%
                      </div>
                    )}
                  </Link>

                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="font-bold text-slate-800 text-sm leading-snug line-clamp-2 mb-1 group-hover:text-indigo-600 transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-slate-400 text-[11px] mb-3 italic">oleh {book.author || "Anonim"}</p>
                    
                    <div className="mt-auto flex items-center justify-between gap-2">
                      <div className="flex flex-col">
                        {discount > 0 && (
                          <span className="text-[10px] text-slate-400 line-through">Rp {price.toLocaleString("id-ID")}</span>
                        )}
                        <p className="text-indigo-600 font-black text-sm whitespace-nowrap">
                          Rp {finalPrice.toLocaleString("id-ID")}
                        </p>
                      </div>
                      <button 
                        onClick={(e) => removeFavorite(e, book.slug)}
                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
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