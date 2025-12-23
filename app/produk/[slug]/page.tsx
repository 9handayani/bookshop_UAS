"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Heart, Share2, Link as LinkIcon, Facebook, Star } from "lucide-react";

export default function DetailProdukBaru() {
  const { slug } = useParams();
  const router = useRouter();

  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showShare, setShowShare] = useState(false);
  
  // Fitur Favorit & Ulasan
  const [isFavorite, setIsFavorite] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/books/${slug}`);
        const data = await response.json();
        setBook(data);

        // Cek Status Favorit
        const savedFavs = JSON.parse(localStorage.getItem("favorites") || "[]");
        setIsFavorite(savedFavs.includes(data.slug));

        // Cek Status Ulasan (berdasarkan ID buku)
        const reviewedBooks = JSON.parse(localStorage.getItem("reviewed_books") || "[]");
        setHasReviewed(reviewedBooks.includes(data.id));

      } catch (err) {
        console.error("Error API:", err);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchData();
  }, [slug]);

  const toggleFavorite = () => {
    const savedFavs = JSON.parse(localStorage.getItem("favorites") || "[]");
    let updated;
    if (isFavorite) {
      updated = savedFavs.filter((s: string) => s !== book.slug);
    } else {
      updated = [...savedFavs, book.slug];
    }
    localStorage.setItem("favorites", JSON.stringify(updated));
    setIsFavorite(!isFavorite);
  };

  const handleSendReview = () => {
    // Logika simpan ulasan ke API Laravel kamu di sini
    // Setelah sukses, kunci tombol:
    const reviewedBooks = JSON.parse(localStorage.getItem("reviewed_books") || "[]");
    reviewedBooks.push(book.id);
    localStorage.setItem("reviewed_books", JSON.stringify(reviewedBooks));
    setHasReviewed(true);
    alert("Ulasan berhasil dikirim!");
  };

  if (loading) return <div className="p-20 text-center font-bold text-indigo-600">Menghubungkan ke Database...</div>;
  if (!book) return <div className="p-20 text-center text-red-500 font-bold">Produk tidak terdaftar.</div>;

  const price = Number(book.price) || 0;
  const finalPrice = Math.floor(price - (price * (book.discount || 0)) / 100);

  return (
    <div className="min-h-screen bg-white pb-20 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto p-6">
        <button onClick={() => router.push("/")} className="text-slate-500 hover:text-indigo-600 font-bold text-sm flex items-center gap-2">
          <span>← Kembali ke Beranda</span>
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          
          <div className="md:col-span-5">
            <div className="rounded-2xl border border-slate-100 p-4 shadow-sm sticky top-10">
              <img src={book.image || "/placeholder-book.jpg"} className="w-full rounded-xl" alt={book.title} />
            </div>
          </div>
          
          <div className="md:col-span-7 flex flex-col">
            <h1 className="text-3xl font-bold mb-1">{book.title}</h1>
            <p className="text-slate-500 mb-4 text-lg">oleh <span className="text-indigo-600 font-medium">{book.author}</span></p>
            
            <div className="flex items-center gap-1 mb-6 text-yellow-400">
              {"★".repeat(5)} <span className="text-slate-400 font-bold ml-2 text-sm">(5.7 / 5)</span>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-4xl font-black text-red-500">Rp{finalPrice.toLocaleString('id-ID')}</span>
              {book.discount > 0 && (
                <div className="flex items-center gap-2">
                  <span className="line-through text-slate-300 font-bold text-lg">Rp{price.toLocaleString('id-ID')}</span>
                  <span className="bg-red-100 text-red-500 text-xs px-2 py-1 rounded-lg font-bold">-{book.discount}%</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-6 mb-8 border-b border-slate-50 pb-6">
              <button 
                onClick={toggleFavorite}
                className={`flex items-center gap-2 font-bold transition-colors ${isFavorite ? 'text-red-500' : 'text-slate-600 hover:text-red-500'}`}
              >
                <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
                <span>{isFavorite ? "Favorit Saya" : "Tambah ke Favorit"}</span>
              </button>
              
              <div className="relative">
                <button onClick={() => setShowShare(!showShare)} className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold transition-colors">
                  <Share2 size={20} />
                  <span>Bagikan</span>
                </button>
                {showShare && (
                  <div className="absolute top-10 left-0 bg-white shadow-2xl border border-slate-100 rounded-2xl p-4 w-48 z-50 flex flex-col gap-3">
                    <button className="flex items-center gap-3 text-sm font-medium hover:text-indigo-600"><LinkIcon size={16} /> Salin Link</button>
                    <button className="flex items-center gap-3 text-sm font-medium hover:text-green-600"><span className="w-4 h-4 bg-green-500 rounded-full"></span> WhatsApp</button>
                    <button className="flex items-center gap-3 text-sm font-medium hover:text-blue-600"><Facebook size={16} fill="currentColor" /> Facebook</button>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-2xl mb-6 border border-green-100">
              <p className="text-green-700 font-bold flex items-center gap-2">Bebas Ongkir, Rp0.</p>
              <p className="text-green-600 text-xs mt-1">Pilih toko terdekat dan opsi pengiriman bebas ongkir saat checkout.</p>
            </div>

            <div className="mb-10">
              <h3 className="font-bold text-lg mb-4">Voucher</h3>
              <div className="border border-slate-100 rounded-2xl p-4 flex justify-between items-center group hover:border-indigo-200 transition-colors cursor-pointer">
                <div>
                  <p className="font-bold text-slate-800">Voucher Potongan Ongkir</p>
                  <p className="text-slate-500 text-sm">Diskon Rp10.000</p>
                </div>
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center">
                   <div className="w-8 h-8 border-2 border-indigo-200 rounded-md"></div>
                </div>
              </div>
            </div>

            <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 py-5 rounded-2xl font-black text-lg transition-all shadow-lg shadow-yellow-100 mb-12">
              + Keranjang
            </button>

            {/* Bagian Ulasan Pembeli */}
            <div className="border-t border-slate-100 pt-8 mb-10">
                <h2 className="text-xl font-bold mb-6">Ulasan Pembeli</h2>
                {hasReviewed ? (
                    <div className="bg-slate-50 p-6 rounded-2xl text-center border border-dashed border-slate-200">
                        <p className="text-slate-500 font-medium">Anda sudah memberikan ulasan untuk buku ini.</p>
                    </div>
                ) : (
                    <button 
                        onClick={handleSendReview}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all"
                    >
                        Tulis Ulasan
                    </button>
                )}
            </div>

            <div className="border-t border-slate-100 pt-8">
              <h2 className="text-xl font-bold mb-4">Deskripsi Buku</h2>
              <p className={`text-slate-600 leading-relaxed text-lg ${!isExpanded ? 'line-clamp-3' : ''}`}>
                {book.description || "Belum ada deskripsi."}
              </p>
              <button onClick={() => setIsExpanded(!isExpanded)} className="text-indigo-600 font-bold mt-2">
                {isExpanded ? "Tutup" : "Baca Selengkapnya"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}