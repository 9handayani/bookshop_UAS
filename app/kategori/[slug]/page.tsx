"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

interface Book {
  id: number;
  image: string;
  title: string;
  author: string;
  price: number;
  discount: number;
  slug: string;
  category?: { name: string };
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function KategoriPage({ params }: PageProps) {
  const { slug } = use(params);
  const router = useRouter();
  
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://127.0.0.1:8000/api/books");
        const data = await res.json();
        
        // 1. Decode slug dari URL (misal %20 jadi spasi)
        const categorySearch = decodeURIComponent(slug).toLowerCase().trim();
        
        // 2. Filter yang lebih fleksibel (mengatasi masalah Komik/Buku vs Komik)
        const filtered = data.filter((book: any) => {
          const dbCategory = book.category?.name?.toLowerCase().trim() || "";
          // Jika nama kategori di DB mengandung kata dari URL, atau sebaliknya
          return dbCategory.includes(categorySearch) || categorySearch.includes(dbCategory);
        });
        
        setBooks(filtered);
      } catch (err) {
        console.error("Gagal mengambil data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [slug]);

  if (loading) return <div className="p-10 text-center font-bold text-indigo-600">Sedang memuat koleksi...</div>;

  return (
    <div className="min-h-screen bg-[#f5f7fa] px-6 py-10 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* NAVIGATION */}
        <nav className="mb-8 flex items-center gap-3">
          <button onClick={() => router.push("/")} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition-all group">
             <div className="p-2 bg-white rounded-lg shadow-sm group-hover:bg-indigo-50 border border-slate-100">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
             </div>
             <span className="text-sm text-slate-400">Kembali ke Beranda</span>
          </button>
          <span className="text-slate-300">/</span>
          <span className="text-slate-800 font-bold text-sm capitalize">{decodeURIComponent(slug)}</span>
        </nav>

        {/* HEADER */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl font-black text-slate-800 capitalize tracking-tight">
            Kategori: <span className="text-indigo-600">{decodeURIComponent(slug)}</span>
          </h1>
          <p className="text-slate-500 mt-1 font-medium italic">
            Menampilkan {books.length} koleksi buku terbaik
          </p>
        </div>

        {/* GRID PRODUK */}
        {books.length === 0 ? (
          <div className="bg-white p-12 rounded-[30px] text-center shadow-sm border border-slate-100">
            <p className="text-slate-400 text-lg">Tidak ada buku di kategori ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-stretch">
            {books.map((book) => {
              const originalPrice = Number(book.price);
              const finalPrice = originalPrice - (originalPrice * (book.discount || 0)) / 100;

              return (
                <Link href={`/book/${book.slug}`} key={book.id} className="h-full">
                  <div className="group bg-white rounded-[25px] p-4 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-slate-50 h-full flex flex-col">
                    
                    {/* Gambar */}
                    <div className="w-full aspect-[3/4] overflow-hidden rounded-xl bg-slate-100">
                      <img
                        src={book.image}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => (e.currentTarget.src = "/placeholder-book.jpg")}
                      />
                    </div>

                    {/* Konten */}
                    <div className="mt-4 flex flex-col flex-grow">
                      {/* Judul: min-height 40px agar rata 2 baris */}
                      <h3 className="font-bold text-slate-800 leading-snug line-clamp-2 min-h-[40px] text-[13px] mb-1">
                        {book.title}
                      </h3>
                      <p className="text-[11px] text-slate-400 font-medium mb-3">{book.author}</p>

                      {/* Harga & Diskon (mt-auto memaksa ke bawah) */}
                      <div className="mt-auto">
                        <p className="text-base font-black text-green-600">
                          Rp {Math.floor(finalPrice).toLocaleString("id-ID")}
                        </p>
                        
                        {/* Area Diskon: min-height 34px agar kartu tanpa diskon tidak pendek */}
                        <div className="min-h-[34px] flex flex-col justify-end">
                          {book.discount > 0 && (
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] line-through text-slate-300 font-bold">
                                Rp {originalPrice.toLocaleString("id-ID")}
                              </span>
                              <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded font-black">
                                -{book.discount}%
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
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