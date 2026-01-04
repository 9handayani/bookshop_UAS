"use client";

import { useState } from "react";
import { Star, ShoppingCart, Heart, Share2 } from "lucide-react";

export default function DetailProdukClient({ initialBook }: { initialBook: any }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const book = initialBook;

  // API Anda mengirim 'details' sebagai objek: {"penerbit": "...", "isbn": "..."}
  // Jadi kita langsung ambil tanpa JSON.parse
  const specs = book.details || {};

  const price = Number(book.price) || 0;
  const discount = Number(book.discount) || 0;
  const finalPrice = Math.floor(price - (price * discount) / 100);

  return (
    <div className="min-h-screen bg-white pb-20 text-slate-900">
      <div className="max-w-6xl mx-auto px-6 pt-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          
          {/* SISI KIRI: GAMBAR */}
          <div className="md:col-span-5">
            <div className="rounded-3xl border border-slate-100 p-6 shadow-xl sticky top-10 bg-white">
              <img 
                src={book.image ? `http://127.0.0.1:8000/storage/books/${book.image}` : "/placeholder-book.jpg"} 
                className="w-full rounded-2xl object-contain" 
                alt={book.title}
                onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/400x600?text=No+Image")}
              />
            </div>
          </div>

          {/* SISI KANAN: INFO */}
          <div className="md:col-span-7">
            <h1 className="text-4xl font-black text-slate-900 leading-tight mb-2">{book.title}</h1>
            <p className="text-xl text-indigo-600 font-bold mb-6">oleh {book.author}</p>

            <div className="flex items-center gap-6 mb-8">
              <div className="flex flex-col">
                <span className="text-4xl font-black text-red-500">
                  Rp{finalPrice.toLocaleString('id-ID')}
                </span>
                {discount > 0 && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-slate-300 line-through font-bold">Rp{price.toLocaleString('id-ID')}</span>
                    <span className="bg-red-500 text-white px-2 py-0.5 rounded text-xs font-black">-{discount}%</span>
                  </div>
                )}
              </div>
              <div className="h-12 w-[1px] bg-slate-100"></div>
              <div className="flex flex-col">
                <div className="flex items-center text-yellow-400">
                  <Star fill="currentColor" size={20} />
                  <span className="ml-1 text-slate-900 font-black text-lg">{book.rating || "5.0"}</span>
                </div>
                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Rating</span>
              </div>
            </div>

            <button className="w-full bg-[#FFD700] hover:bg-yellow-500 text-slate-900 py-5 rounded-2xl font-black text-xl shadow-lg mb-10 transition-transform active:scale-95">
              + Keranjang Belanja
            </button>

            {/* DESKRIPSI */}
            <div className="border-t border-slate-100 pt-8 mb-10">
              <h2 className="text-2xl font-black mb-4">Deskripsi Buku</h2>
              <p className={`text-slate-600 text-lg leading-relaxed ${!isExpanded ? 'line-clamp-3' : ''}`}>
                {book.description}
              </p>
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-indigo-600 font-black mt-3 hover:text-indigo-800 transition-colors"
              >
                {isExpanded ? "TUTUP DESKRIPSI" : "BACA SELENGKAPNYA"}
              </button>
            </div>

            {/* DETAIL SPESIFIKASI - INI YANG ANDA CARI */}
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
              <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Detail Spesifikasi</h2>
              <div className="grid grid-cols-2 gap-y-10 gap-x-6">
                <div>
                  <p className="text-[11px] font-black text-slate-400 uppercase mb-2">Penerbit</p>
                  <p className="text-slate-900 font-bold text-lg">{specs.penerbit || "-"}</p>
                </div>
                <div>
                  <p className="text-[11px] font-black text-slate-400 uppercase mb-2">Nomor ISBN</p>
                  <p className="text-slate-900 font-bold text-lg">{specs.isbn || "-"}</p>
                </div>
                <div>
                  <p className="text-[11px] font-black text-slate-400 uppercase mb-2">Bahasa</p>
                  <p className="text-slate-900 font-bold text-lg">{specs.bahasa || "Indonesia"}</p>
                </div>
                <div>
                  <p className="text-[11px] font-black text-slate-400 uppercase mb-2">Jumlah Halaman</p>
                  <p className="text-slate-900 font-bold text-lg">{specs.halaman || "0"} Halaman</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}