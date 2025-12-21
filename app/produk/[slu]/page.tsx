"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function DetailProdukBaru() {
  const { slug } = useParams();
  const [book, setBook] = useState<any>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/books/${slug}`);
        const data = await response.json();
        
        // Memastikan data yang diambil adalah objek pertama
        if (Array.isArray(data)) {
          setBook(data[0]);
        } else {
          setBook(data);
        }
      } catch (err) {
        console.error("Error API:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  if (loading) return <div className="p-20 text-center font-bold">Menghubungkan ke Database...</div>;
  if (!book) return <div className="p-20 text-center text-red-500 font-bold">Produk tidak terdaftar.</div>;

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans">
      <div className="max-w-5xl mx-auto p-6">
        <Link href="/" className="text-sm text-indigo-600 font-bold hover:underline">
          ← Kembali ke Toko
        </Link>
      </div>

      <div className="max-w-5xl mx-auto bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 md:p-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <div className="flex justify-center bg-slate-50 rounded-[32px] p-10 border border-slate-100">
              <img 
                src={`http://127.0.0.1:8000/storage/${book.image}`} 
                className="w-full max-w-[280px] rounded-xl shadow-2xl object-cover hover:scale-105 transition-all duration-300" 
                alt={book.title}
              />
            </div>
            
            <div className="flex flex-col justify-center">
              <h1 className="text-4xl font-black text-slate-900 mb-2 leading-tight">{book.title}</h1>
              <p className="text-lg text-slate-500 mb-6">Penulis: <span className="text-indigo-600 font-bold">{book.author}</span></p>
              
              <div className="flex items-center gap-4 mb-10">
                <span className="text-4xl font-black text-indigo-600">
                  {/* Perbaikan Rp NaN */}
                  Rp {book.price ? Number(book.price).toLocaleString('id-ID') : '0'}
                </span>
              </div>

              <button className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold hover:bg-slate-800 shadow-xl active:scale-95 transition-all">
                Tambah ke Keranjang
              </button>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-12 mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 tracking-tight">Deskripsi</h2>
            <div className="relative">
              <p className={`text-slate-600 leading-relaxed text-lg whitespace-pre-line ${!isExpanded ? 'line-clamp-4' : ''}`}>
                {book.description || "Belum ada deskripsi."}
              </p>
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-indigo-600 font-black mt-4 hover:text-indigo-800 transition-colors"
              >
                {isExpanded ? "↑ Tutup" : "↓ Baca Selengkapnya"}
              </button>
            </div>
          </div>

          <div className="bg-slate-50 p-10 rounded-[40px] border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-8 tracking-tight">Informasi Detail</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-6">
              {book.details ? (
                book.details.split('|').map((item: string, index: number) => {                  
                  const [label, value] = item.split(':');
                  return (
                    <div key={index}>
                      <p className="text-slate-400 text-xs uppercase tracking-widest font-bold mb-2">{label?.trim()}</p>
                      <p className="text-slate-900 font-black text-sm">{value?.trim() || item.trim()}</p>
                    </div>
                  );
                })
              ) : (
                <p className="text-slate-400 italic">Data teknis kosong.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}