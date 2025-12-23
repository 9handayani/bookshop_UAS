"use client";

import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { useState, useEffect } from "react";

export default function FavoriteSection({ book }) {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);

  // Cek status favorit saat komponen dimuat
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("favorites") || "[]");
    setIsFavorite(saved.includes(book.slug));
  }, [book.slug]);

  const handleFavorite = () => {
    // 1. Ambil data lama
    const saved = JSON.parse(localStorage.getItem("favorites") || "[]");
    const bookSlug = String(book.slug); // Pastikan slug adalah string

    let updated;
    if (saved.includes(bookSlug)) {
      // Jika sudah ada, hapus (Unfavorite)
      updated = saved.filter((item) => item !== bookSlug);
      setIsFavorite(false);
    } else {
      // Jika belum ada, tambah (Favorite)
      updated = [...saved, bookSlug];
      setIsFavorite(true);
    }

    // 2. Simpan kembali ke localStorage
    localStorage.setItem("favorites", JSON.stringify(updated));
    
    // 3. PENTING: Memicu event 'storage' agar halaman favorit tahu ada perubahan
    window.dispatchEvent(new Event("storage")); 
    
    // 4. Navigasi ke halaman favorit
    router.push("/favorites");
  };

  return (
    <button
      onClick={handleFavorite}
      className={`group flex items-center gap-3 px-6 py-3 rounded-2xl transition-all duration-300 font-bold shadow-sm border active:scale-95 ${
        isFavorite 
        ? "bg-red-50 text-red-600 border-red-100" 
        : "bg-white text-slate-700 border-slate-200 hover:bg-red-50 hover:text-red-600"
      }`}
    >
      <Heart 
        size={20} 
        className={`transition-all duration-300 ${isFavorite ? "fill-red-500 text-red-500" : "group-hover:fill-red-500"}`} 
      />
      <span>{isFavorite ? "Hapus dari Favorit" : "Tambah ke Favorit"}</span>
    </button>
  );
}