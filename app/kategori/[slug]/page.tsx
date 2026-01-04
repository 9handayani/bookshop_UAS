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
  category?: { name: string; slug: string }; // Tambahkan slug di sini
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function KategoriPage({ params }: PageProps) {
  const { slug } = use(params);
  const router = useRouter();
  
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper untuk membersihkan path gambar
  const getImageUrl = (path: string) => {
    if (!path) return "/placeholder-book.jpg";
    // Ambil nama file saja, misal dari "books/book1.jpg" jadi "book1.jpg"
    const fileName = path.split('/').pop(); 
    return `/books/${fileName}`;
  };

  useEffect(() => {
    const fetchBooks = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        // Pastikan URL API sesuai dengan route di Laravel Anda
        const res = await fetch(`${API_BASE_URL}/books?category=${slug}`, {
            headers: { "Accept": "application/json" }
        });
        
        const response = await res.json();

        // Laravel biasanya membungkus data dalam properti 'data'
        const booksData = response.data || (Array.isArray(response) ? response : []);
        setBooks(booksData);
      } catch (err) {
        console.error("Gagal mengambil data:", err);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [slug, API_BASE_URL]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f7fa]">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="font-bold text-indigo-600">Sedang memuat koleksi...</p>
      </div>
    </div>
  );

  // Format nama kategori untuk judul (misal: "self-improvement" jadi "Self Improvement")
  const displayTitle = decodeURIComponent(slug).replace(/-/g, ' ');

  return (
    <div className="min-h-screen bg-[#f5f7fa] px-6 py-10 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* BREADCRUMB NAVIGATION */}
        <nav className="mb-8 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition-all group">
             <div className="p-2 bg-white rounded-lg shadow-sm group-hover:bg-indigo-50 border border-slate-100">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
             </div>
             <span className="text-sm">Beranda</span>
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-800 font-bold text-sm capitalize">{displayTitle}</span>
        </nav>

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-3xl font-black text-slate-800 capitalize tracking-tight">
            Kategori: <span className="text-indigo-600">{displayTitle}</span>
          </h1>
          <p className="text-slate-500 mt-1 font-medium">
            {books.length > 0 
              ? `Ditemukan ${books.length} buku dalam kategori ini` 
              : "Belum ada koleksi untuk kategori ini"}
          </p>
        </div>

        {/* GRID PRODUK */}
        {books.length === 0 ? (
          <div className="bg-white p-20 rounded-[40px] text-center shadow-sm border border-slate-100">
            <div className="mb-4 text-slate-200 flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M8 7h6"/><path d="M8 11h8"/>
              </svg>
            </div>
            <p className="text-slate-400 text-lg font-medium">Ops! Kategori ini masih kosong.</p>
            <Link href="/" className="mt-6 inline-block text-indigo-600 font-bold hover:underline">
                Lihat Semua Koleksi
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {books.map((book) => {
              const price = Number(book.price);
              const finalPrice = Math.floor(price - (price * (book.discount || 0)) / 100);

              return (
                <Link href={`/book/${book.slug}`} key={book.id} className="group">
                  <div className="bg-white rounded-[25px] p-4 shadow-sm group-hover:shadow-xl group-hover:-translate-y-2 transition-all duration-300 border border-slate-50 h-full flex flex-col">
                    
                    <div className="w-full aspect-[3/4] overflow-hidden rounded-xl bg-slate-100">
                      <img
                        src={getImageUrl(book.image)}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder-book.jpg";
                        }}
                      />
                    </div>

                    <div className="mt-4 flex flex-col flex-grow">
                      <h3 className="font-bold text-slate-800 leading-snug line-clamp-2 min-h-[40px] text-[14px] mb-1">
                        {book.title}
                      </h3>
                      <p className="text-[12px] text-slate-400 font-medium mb-3">{book.author}</p>

                      <div className="mt-auto">
                        <p className="text-lg font-black text-indigo-600">
                          Rp {finalPrice.toLocaleString("id-ID")}
                        </p>
                        
                        {book.discount > 0 && (
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] line-through text-slate-300 font-bold">
                              Rp {price.toLocaleString("id-ID")}
                            </span>
                            <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded font-black">
                              -{book.discount}%
                            </span>
                          </div>
                        )}
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