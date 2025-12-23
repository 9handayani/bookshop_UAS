"use client";
import Link from "next/link";

export default function BookCard({ book }: { book: any }) {
  const originalPrice = Number(book.price) || 0;
  const finalPrice = Math.floor(originalPrice - (originalPrice * (book.discount || 0)) / 100);

  return (
    <Link href={`/book/${book.slug}`} className="group h-full">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-full hover:shadow-md transition-all">
        
        <div className="relative aspect-square bg-slate-50 overflow-hidden">
          <img
            src={book.image || "/placeholder-book.jpg"}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder-book.jpg"; }}
          />
        </div>

        {/* Tambahkan flex-grow di sini agar area p-4 mengambil sisa ruang */}
        <div className="p-4 flex flex-col flex-grow">
          {/* Judul: Diberi min-h agar judul 1 baris punya tinggi sama dengan 2 baris */}
          <h3 className="font-bold text-slate-800 text-sm line-clamp-2 leading-snug min-h-[2.5rem]">
            {book.title}
          </h3>
          <p className="text-[11px] text-slate-400 mb-2">{book.author}</p>

          {/* mt-auto akan mendorong div harga ini ke posisi paling bawah kartu */}
          <div className="mt-auto">
            <p className="text-green-600 font-bold text-sm">
              Rp {finalPrice.toLocaleString("id-ID")}
            </p>
            
            {/* Beri tinggi tetap pada area diskon agar kartu tanpa diskon tetap sejajar */}
            <div className="min-h-[35px] flex flex-col justify-end">
              {book.discount > 0 && (
                <div className="flex flex-col gap-0.5 mt-1">
                  <span className="text-[10px] line-through text-slate-300 font-bold">
                    Rp {originalPrice.toLocaleString("id-ID")}
                  </span>
                  <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded shadow-sm w-fit">
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
}