"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { use } from "react";

interface Book {
  img: string;
  title: string;
  author: string;
  price: number;
  discount: number;
  category: string;
  slug: string;
}

const books: Book[] = [
  {
    img: "/books/book1.jpg",
    title: "Mashle 12",
    author: "Hajime Komoto",
    price: 45000,
    discount: 30,
    category: "Komik",
    slug: "mashle-12",
  },
  {
    img: "/books/book2.jpg",
    title: "UUD 1945 untuk Pelajar dan Umum",
    author: "Tim Miracle - M&C",
    price: 40000,
    discount: 30,
    category: "Pendidikan",
    slug: "uud-1945",
  },
  {
    img: "/books/book3.jpg",
    title: "Seporsi Mie Ayam Sebelum Mati",
    author: "Brian Khrisna",
    price: 78000,
    discount: 25,
    category: "Novel",
    slug: "mie-ayam",
  },
  {
    img: "/books/book4.jpg",
    title: "Panduan Optimalisasi AI untuk digital marketing",
    author: "Henry Manampiring",
    price: 60000,
    discount: 15,
    category: "Komputer",
    slug: "ai-digital-marketing",
  },
  {
    img: "/books/book5.jpg",
    title: "Piano Dasar",
    author: "Rendra",
    price: 45000,
    discount: 15,
    category: "Musik",
    slug: "piano-dasar",
  },
  {
    img: "/books/book6.jpeg",
    title: "Sandi nusantara 3",
    author: "hokky situngkir",
    price: 30000,
    discount: 15,
    category: "KOMIK",
    slug: "sandi-nusantara",
  },
  {
    img: "/books/book7.jpeg",
    title: "mice cartoon - telekomunikasi mengubah peradaban",
    author: " Muhammad mice misrad",
    price: 67500,
    discount: 25,
    category: "KOMIK",
    slug: "telekomunikasi-mengubah-peradaban",
  },
  {
    img: "/books/book8.jpeg",
    title: "Pembunuhan di rumah decagon 1",
    author: "yukito ayatsuji/hiro kiyohara",
    price: 20000,
    discount: 20,
    category: "KOMIK",
    slug: "pembunuhan-di-rumah-decagon-1",
  },
  {
    img: "/books/book9.jpeg",
    title: "Muros",
    author: "Surya Putra",
    price: 63750,
    discount: 25,
    category: "KOMIK",
    slug: "Muros",
  },
  {
    img: "/books/book10.jpeg",
    title: "Petualangan Kuro : Jurasik Aquatik",
    author: "Jester",
    price: 49000,
    discount: 15,
    category: "NOVEL",
    slug: "Petualangan-Kuro",
  },
];

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function KategoriPage({ params }: PageProps) {
  const { slug } = use(params);
  const router = useRouter();

  const filteredBooks = books.filter(
    (book) => book.category.toLowerCase() === slug.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-[#f5f7fa] px-6 py-10 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* ================= NAVIGATION (Sesuai Desain Figma) ================= */}
        <nav className="mb-8 flex items-center gap-3">
          <button 
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition-all group"
          >
            <div className="p-2 bg-white rounded-lg shadow-sm group-hover:bg-indigo-50 border border-slate-100">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <span className="text-sm">Kembali ke Beranda</span>
          </button>
          <span className="text-slate-300">/</span>
          <span className="text-slate-800 font-bold text-sm capitalize">{slug}</span>
        </nav>

        {/* ================= TITLE ================= */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl font-black text-slate-800 capitalize tracking-tight">
            Kategori: <span className="text-indigo-600">{slug}</span>
          </h1>
          <p className="text-slate-500 mt-1 font-medium italic">
            Menampilkan {filteredBooks.length} koleksi buku terbaik
          </p>
        </div>

        {/* ================= RESULT ================= */}
        {filteredBooks.length === 0 ? (
          <div className="bg-white p-12 rounded-[30px] text-center shadow-sm border border-slate-100">
            <p className="text-slate-400 text-lg">Tidak ada buku di kategori ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {filteredBooks.map((book, index) => {
              const finalPrice = book.price - (book.price * book.discount) / 100;

              return (
                <Link href={`/book/${book.slug}`} key={index}>
                  <div className="group bg-white rounded-[25px] p-4 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-slate-50 h-full">
                    
                    {/* Gambar Buku */}
                    <div className="w-full h-64 overflow-hidden rounded-xl bg-slate-100">
                      <img
                        src={book.img}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>

                    {/* Konten */}
                    <div className="mt-4 space-y-1">
                      <p className="font-bold text-slate-800 leading-snug line-clamp-2 h-10">
                        {book.title}
                      </p>
                      <p className="text-xs text-slate-400 font-medium">{book.author}</p>

                      <div className="pt-2">
                        <p className="text-lg font-black text-orange-600">
                          Rp {finalPrice.toLocaleString("id-ID")}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-[10px] line-through text-slate-300 font-bold">
                            Rp {book.price.toLocaleString("id-ID")}
                          </p>
                          <span className="text-[10px] bg-red-100 text-red-500 px-1.5 py-0.5 rounded font-black">
                            -{book.discount}%
                          </span>
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