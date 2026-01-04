"use client";
import { useState, useRef, useEffect } from "react";
import BookCard from "../app/components/BookCard";

interface Book {
  image: string; 
  title: string;
  author: string;
  price: number;
  discount: number;
  slug: string;
}

export default function Home() {
  const BACKEND_URL = ${process.env.NEXT_PUBLIC_API_URL};
  const banners = ["/banner/book1.jpeg", "/banner/book2.jpeg", "/banner/book3.jpeg"];

  const [current, setCurrent] = useState(0);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State untuk Navigasi Halaman (Pagination)
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const fetchBooks = async (pageNumber: number) => {
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_URL}/api/books?page=${pageNumber}`);
      const result = await response.json();
      
      // Laravel membungkus data dalam 'data' jika menggunakan paginate()
      const dataBuku = result.data ? result.data : result;
      setBooks(Array.isArray(dataBuku) ? dataBuku : []);
      
      setCurrentPage(result.current_page || 1);
      setTotalPages(result.last_page || 1);
    } catch (error) {
      console.error("Gagal mengambil data buku:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks(1);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [banners.length]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#EFF4F7] to-[#D4E1E9] px-6 sm:px-10 py-14">

      {/* ========= BAGIAN SELAMAT DATANG (HERO) ========= */}
      <div className="max-w-4xl mx-auto mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
          Selamat Datang di <span className="text-[#4c4ddc]">BookStore.id</span>
        </h1>
        <p className="text-lg text-gray-600 mt-4 font-medium italic">
          "Surga bagi para pecinta buku. Temukan dunia baru di setiap halaman."
        </p>
      </div>

      {/* ========= BANNER SLIDER ========= */}
      <div className="relative w-full flex flex-col items-center mb-16 select-none">
        <img
          src={banners[current]}
          alt="Promo Banner"
          className="w-full max-w-4xl rounded-2xl shadow-[0_8px_25px_rgba(0,0,0,0.18)] transition-all duration-700 ease-out hover:scale-[1.01]"
        />
        <div className="flex mt-5 gap-2">
          {banners.map((_, index) => (
            <div key={index} onClick={() => setCurrent(index)} className={`w-3 h-3 rounded-full cursor-pointer transition-all ${current === index ? "bg-gray-700 scale-125" : "bg-gray-400/40"}`} />
          ))}
        </div>
      </div>

      {/* ========= KOLEKSI BUKU ========= */}
      <div className="text-center text-gray-800 mb-8 border-b border-gray-300 pb-4 max-w-7xl mx-auto flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-wide text-left">Koleksi Buku</h2>
          <p className="opacity-80 mt-1 text-[15px] text-left">Temukan buku favoritmu di sini</p>
        </div>
        <span className="bg-[#4c4ddc] text-white px-4 py-1 rounded-full text-sm font-bold shadow-md">
           {books.length} Buku Tersedia
        </span>
      </div>

      {loading ? (
        <div className="text-center py-20 font-bold text-gray-500 animate-pulse italic">Sedang menyiapkan koleksi...</div>
      ) : (
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-6">
            {books.length > 0 ? (
              books.map((book) => <BookCard key={book.slug} book={book} />)
            ) : (
              <div className="col-span-full text-center py-20 bg-white/50 rounded-3xl border-2 border-dashed border-gray-300">
                <p className="text-gray-400">Database masih kosong, ayo tambahkan buku baru!</p>
              </div>
            )}
          </div>

          {/* ========= TOMBOL PAGINATION ========= */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-6 mt-16">
              <button
                disabled={currentPage === 1}
                onClick={() => fetchBooks(currentPage - 1)}
                className="px-6 py-2 bg-white text-gray-700 rounded-xl shadow-sm border border-gray-200 font-bold disabled:opacity-30 hover:bg-gray-50 transition-all"
              > ← Prev </button>
              <span className="font-bold text-gray-800 bg-white px-4 py-2 rounded-lg shadow-inner">
                {currentPage} / {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => fetchBooks(currentPage + 1)}
                className="px-6 py-2 bg-[#4c4ddc] text-white rounded-xl shadow-lg font-bold disabled:opacity-30 hover:bg-[#3b3bc7] transition-all"
              > Next → </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}