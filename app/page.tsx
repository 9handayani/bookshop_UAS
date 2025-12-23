"use client";
import { useState, useRef, useEffect } from "react";
import BookCard from "../app/components/BookCard";

// Sesuaikan interface dengan field dari Laravel (image, bukan img)
interface Book {
  image: string; 
  title: string;
  author: string;
  price: number;
  discount: number;
  slug: string;
}

export default function Home() {
  const banners = [
    "/banner/book1.jpeg",
    "/banner/book2.jpeg",
    "/banner/book3.jpeg",
  ];

  const [current, setCurrent] = useState(0);
  const [books, setBooks] = useState<Book[]>([]); // State untuk data dari API
  const [loading, setLoading] = useState(true);
  
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // ========== FETCH DATA DARI LARAVEL ==========
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/books");
        const data = await response.json();
        setBooks(data);
      } catch (error) {
        console.error("Gagal mengambil data buku:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // ========== AUTO SLIDE ==========
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const nextBanner = () =>
    setCurrent((prev) => (prev + 1) % banners.length);

  const prevBanner = () =>
    setCurrent((prev) => (prev - 1 + banners.length) % banners.length);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const distance = touchStartX.current - touchEndX.current;

    if (distance > 50) nextBanner();
    if (distance < -50) prevBanner();
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#EFF4F7] to-[#D4E1E9] px-6 sm:px-10 py-14">

      {/* ========= BANNER SLIDER ========= */}
      <div className="relative w-full flex flex-col items-center mb-10 select-none">
        <img
          src={banners[current]}
          alt="Promo Banner"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="
            w-full max-w-4xl 
            rounded-2xl shadow-[0_8px_25px_rgba(0,0,0,0.18)]
            transition-all duration-700 ease-out 
            hover:scale-[1.01]
          "
        />

        {/* Dots */}
        <div className="flex mt-5 gap-2">
          {banners.map((_, index) => (
            <div
              key={index}
              onClick={() => setCurrent(index)}
              className={`
                w-3 h-3 rounded-full cursor-pointer transition-all duration-300
                ${current === index ? "bg-gray-700 scale-125" : "bg-gray-400/40"}
              `}
            />
          ))}
        </div>
      </div>

      {/* ========= TITLE ========= */}
      <div className="text-center text-gray-800 mb-6">
        <h2 className="text-3xl font-bold tracking-wide">Koleksi Buku</h2>
        <p className="opacity-80 mt-1 text-[15px]">Temukan buku favoritmu di sini</p>
      </div>

      {/* ========= PRODUK ========= */}
      {loading ? (
        <div className="text-center py-20 font-bold text-gray-500">Memuat katalog buku...</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 mt-6">
          {books.length > 0 ? (
            books.map((book) => (
              <BookCard key={book.slug} book={book} />
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-gray-400">
              Tidak ada buku yang ditemukan di database.
            </div>
          )}
        </div>
      )}
    </div>
  );
}