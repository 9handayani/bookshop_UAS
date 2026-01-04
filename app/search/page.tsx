"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import BookCard from "@/app/components/BookCard"; // Gunakan BookCard agar desain seragam

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Ambil keyword pencarian dari URL (?q=...)
  const q = searchParams.get("q") || "";

  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchBooks = async () => {
      // Jika tidak ada query, kita bisa arahkan balik ke home atau tampilkan semua
      try {
        setLoading(true);
        
        // Memanggil API Laravel dengan query parameter 'q'
        // Pastikan endpoint Laravel Anda sudah menangani $request->q
        const res = await fetch(`${API_BASE_URL}/books?q=${encodeURIComponent(q)}`, {
          headers: {
            "Accept": "application/json"
          }
        });
        
        const result = await res.json();
        
        // Standardisasi pengambilan data dari Laravel (Paginate vs All)
        const booksData = result.data || (Array.isArray(result) ? result : []);
        setBooks(booksData);
      } catch (err) {
        console.error("Gagal mengambil data buku:", err);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBooks();
  }, [q, API_BASE_URL]); // Trigger ulang setiap kali keyword 'q' berubah

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans">
      <div className="max-w-7xl mx-auto p-6 md:p-10">
        
        {/* NAVIGATION / BREADCRUMB */}
        <nav className="mb-8 flex items-center gap-3">
            <button 
              onClick={() => router.push("/")} 
              className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-all group"
            >
              <div className="p-2 bg-white shadow-sm rounded-xl border border-slate-100 group-hover:bg-indigo-50 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              </div>
              <span className="text-sm font-bold">Kembali ke Beranda</span>
            </button>
            <span className="text-slate-300">/</span>
            <span className="text-slate-800 font-bold text-sm">Pencarian</span>
        </nav>

        {/* HEADER HASIL PENCARIAN */}
        <div className="mb-10 bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            {q ? (
              <>Hasil pencarian: <span className="text-indigo-600">"{q}"</span></>
            ) : (
              "Semua Koleksi Buku"
            )}
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            Ditemukan <span className="text-slate-800 font-bold">{books.length}</span> buku yang cocok dengan pencarian Anda.
          </p>
        </div>

        {/* GRID PRODUK */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="font-bold text-slate-400 italic">Mencari buku favoritmu...</p>
          </div>
        ) : books.length === 0 ? (
          <div className="bg-white p-20 rounded-[40px] text-center shadow-sm border border-slate-100">
            <div className="mb-6 text-slate-200 flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Buku Tidak Ditemukan</h2>
            <p className="text-slate-400 max-w-md mx-auto">
              Maaf, kami tidak bisa menemukan buku dengan kata kunci <b>"{q}"</b>. Coba gunakan kata kunci lain.
            </p>
            <button 
              onClick={() => router.push("/")}
              className="mt-8 bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all"
            >
              Lihat Semua Buku
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-bold text-indigo-600">Menyiapkan hasil pencarian...</p>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}