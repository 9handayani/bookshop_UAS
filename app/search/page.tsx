"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { books } from "@/app/data/books";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = searchParams.get("q")?.trim() || "";

  const filteredBooks = q
    ? books.filter(
        (book) =>
          book.title.toLowerCase().includes(q.toLowerCase()) ||
          book.category?.toLowerCase().includes(q.toLowerCase())
      )
    : books;

  return (
    <div className="min-h-screen bg-[#F5F7FA] font-sans">
      <div className="max-w-6xl mx-auto p-6">

        {/* ================= NAVIGATION (Sesuai Desain Figma & Detail) ================= */}
        <nav className="mb-8 flex items-center gap-3">
          <button 
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition-all group"
          >
            {/* Kotak Ikon Rumah */}
            <div className="p-2 bg-white rounded-lg shadow-sm group-hover:bg-indigo-50 border border-slate-100 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <span className="text-sm">Kembali ke Beranda</span>
          </button>
          
          {/* Separator / Pembatas */}
          <span className="text-slate-300 font-medium">/</span>
          <span className="text-slate-800 font-bold text-sm">Pencarian</span>
        </nav>

        {/* ================= TITLE ================= */}
        <div className="mb-10">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            {q ? (
              <>
                Hasil pencarian:{" "}
                <span className="text-indigo-600">"{q}"</span>
              </>
            ) : (
              "Semua Koleksi"
            )}
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            Ditemukan {filteredBooks.length} buku yang cocok.
          </p>
        </div>

        {/* ================= RESULT ================= */}
        {filteredBooks.length === 0 ? (
          <div className="bg-white p-12 rounded-[30px] text-center shadow-sm border border-slate-100">
            <p className="text-slate-400 text-lg">
              Ups! Buku <b>"{q}"</b> tidak ditemukan di rak kami.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {filteredBooks.map((book) => (
              <Link
                key={book.slug}
                href={`/book/${book.slug}`}
                className="group bg-white rounded-[25px] p-4 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-slate-50"
              >
                <div className="overflow-hidden rounded-xl mb-4 h-52 bg-slate-100">
                  <img
                    src={book.img}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                <div className="space-y-1">
                  <p className="text-slate-800 font-bold leading-snug line-clamp-2 h-10">
                    {book.title}
                  </p>
                  <p className="text-indigo-600 font-black text-lg pt-2">
                    Rp {book.price.toLocaleString("id-ID")}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}