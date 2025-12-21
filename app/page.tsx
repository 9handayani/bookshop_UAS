"use client";
import { useState, useRef, useEffect } from "react";
import BookCard from "../app/components/BookCard";

interface Book {
  img: string;
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
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

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

  // ====== DATA BUKU ======
  const books: Book[] = [
    { img: "/books/book1.jpg", title: "Mashle 12", author: "Hajime Komoto", price: 45000, discount: 30, slug: "mashle-12" },
    { img: "/books/book2.jpg", title: "UUD 1945", author: "Tim Miracle - M&C", price: 40000, discount: 30, slug: "uud-1945" },
    { img: "/books/book3.jpg", title: "Seporsi Mie Ayam", author: "Brian Khrisna", price: 78000, discount: 25, slug: "mie-ayam" },
    { img: "/books/book4.jpg", title: "Optimalisasi AI", author: "Alex", price: 60000, discount: 15, slug: "ai-digital-marketing" },
    { img: "/books/book5.jpg", title: "Piano Dasar", author: "Rendra", price: 45000, discount: 15, slug: "piano-dasar" },
    { img: "/books/book6.jpeg", title: "Sandi nusantara 3", author: "hokky situngkir", price: 30000, discount: 15, slug: "sandi-nusantara" },
    { img: "/books/book7.jpeg", title: "mice cartoon - telekomunikasi mengubah peradaban", author: " Muhammad mice misrad", price: 67500, discount: 25, slug: "telekomunikasi-mengubah-peradaban" },
    { img: "/books/book8.jpeg", title: "Pembunuhan di rumah decagon 1", author: " yukito ayatsuji/hiro kiyohara", price: 40000, discount: 20, slug: "pembunuhan-di-rumah-decagon-1" },
    { img: "/books/book9.jpeg", title: "Muros ", author: "Surya Putra", price: 63750, discount: 25, slug: "Muros" },
    { img: "/books/book10.jpeg", title: "Petualangan Kuro : Jurasik Aquatik", author: "Jester ", price: 49000, discount: 15, slug: "petualangan-kuro-jurasik-aquatik" },



  ];
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
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 mt-6">
        {books.map((book) => (
          <BookCard key={book.slug} book={book} />
        ))}
      </div>

    </div>
  );
}










