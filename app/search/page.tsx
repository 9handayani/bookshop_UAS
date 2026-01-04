"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState, Suspense } from "react";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const q = searchParams.get("q")?.trim() || "";

  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = ${process.env.NEXT_PUBLIC_API_URL};

  // FIX GAMBAR: Mengarah ke folder public/books Next.js (sama seperti halaman kategori)
  const getImageUrl = (path: string) => {
    if (!path) return "https://placehold.co/400x600?text=No+Image";
    if (path.startsWith('http')) return path;

    // Ambil nama filenya saja (misal: book1.jpeg)
    const fileName = path.split('/').pop(); 
    
    // Memanggil dari folder /public/books/ di project Next.js
    return `/books/${fileName}`;
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setBooks([]); // KOSONGKAN data lama agar tidak muncul semua saat loading pencarian baru

        // Memanggil API Laravel dengan query parameter 'q'
        const res = await fetch(`${API_BASE_URL}/api/books?q=${q}`);
        const result = await res.json();
        
        // Ambil data dari result.data (standar Laravel)
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
  }, [q]); // Re-fetch setiap kali kata kunci 'q' berubah

  if (loading) return <div className="p-20 text-center font-bold text-[#4c4ddc]">Sedang mencari buku...</div>;

  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="max-w-6xl mx-auto p-6">
        
        {/* NAVIGATION */}
        <nav className="mb-10 flex items-center gap-3">
            <button onClick={() => router.push("/")} className="flex items-center gap-2 text-gray-500 hover:text-[#4c4ddc] transition-all group">
              <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-indigo-50 border border-gray-100 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              </div>
              <span className="text-sm font-medium">Kembali ke Beranda</span>
            </button>
            <span className="text-gray-300">/</span>
            <span className="text-gray-800 font-bold text-sm">Pencarian</span>
        </nav>

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
            {q ? (
              <>Hasil pencarian: <span className="text-[#4c4ddc]">"{q}"</span></>
            ) : (
              "Semua Koleksi"
            )}
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Ditemukan {books.length} buku yang cocok.
          </p>
        </div>

        {/* GRID PRODUK */}
        {books.length === 0 ? (
          <div className="bg-gray-50 p-12 rounded-[30px] text-center border border-dashed border-gray-200">
            <p className="text-gray-400 text-lg">Ups! Buku <b>"{q}"</b> tidak ditemukan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {books.map((book) => {
              const originalPrice = Number(book.price);
              const discount = Number(book.discount || 0);
              const finalPrice = originalPrice - (originalPrice * discount) / 100;

              return (
                <Link
                  key={book.id}
                  href={`/book/${book.slug}`}
                  className="group bg-white rounded-[24px] p-4 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 flex flex-col h-full"
                >
                  <div className="overflow-hidden rounded-2xl mb-4 aspect-[3/4] bg-gray-50">
                    <img
                      src={getImageUrl(book.image)} 
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = "https://placehold.co/400x600?text=No+Image";
                      }}
                    />
                  </div>

                  <div className="flex flex-col flex-grow">
                    <p className="text-gray-800 font-bold leading-tight line-clamp-2 min-h-[40px] text-[15px] mb-2">
                      {book.title}
                    </p>
                    <div className="mt-auto">
                      <p className="text-[#4c4ddc] font-bold text-lg">
                        Rp {Math.floor(finalPrice).toLocaleString("id-ID")}
                      </p>
                      {discount > 0 && (
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[11px] line-through text-gray-300">
                            Rp {originalPrice.toLocaleString("id-ID")}
                          </span>
                          <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold">
                            {discount}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center text-[#4c4ddc] font-bold">Memuat pencarian...</div>}>
      <SearchContent />
    </Suspense>
  );
}