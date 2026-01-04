"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Heart, Share2, Star, ChevronDown, ChevronUp, Home, Send, User } from "lucide-react";
import { useCart } from "../../context/CartContext";

export default function BookDetailClient() {
  const { slug } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();

  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // State Review
  const [reviews, setReviews] = useState([
    { name: "Surya Putra", rating: 5, comment: "Ceritanya sangat seru dan menghibur!" },
  ]);
  const [formData, setFormData] = useState({ name: "", rating: 5, comment: "" });

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        // PERBAIKAN 1: Tambahkan Header Accept agar tidak error HTML
        const res = await fetch(`process.env.NEXT_PUBLIC_API_URL/api/books/details/${slug}`, {
          headers: {
            "Accept": "application/json",
          },
        });

        const result = await res.json();

        if (res.ok && result.success) {
          const bookData = result.data;
          setBook(bookData);

          // PERBAIKAN 2: Cek status favorit
          const savedFavs = JSON.parse(localStorage.getItem("favorites") || "[]");
          setIsFavorite(savedFavs.includes(String(bookData.slug)));
        } else {
          setBook(null);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        setBook(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  // Kalkulasi Harga
  const price = Number(book?.price) || 0;
  const finalPrice = Math.floor(price - (price * (book?.discount || 0)) / 100);

  // FUNGSI FAVORIT (Langsung ke halaman /favorites)
  const toggleFavorite = () => {
    if (!book) return;
    const savedFavs = JSON.parse(localStorage.getItem("favorites") || "[]");
    const currentSlug = String(book.slug);
    let updated;

    if (isFavorite) {
      updated = savedFavs.filter((s: string) => s !== currentSlug);
    } else {
      updated = [...new Set([...savedFavs, currentSlug])];
    }

    localStorage.setItem("favorites", JSON.stringify(updated));
    setIsFavorite(!isFavorite);
    window.dispatchEvent(new Event("storage"));
    
    // Ke halaman favorit sesuai permintaan Anda
    router.push("/favorites");
  };

  const handleAddToCart = () => {
    if (!book) return;
    addToCart({
      id: book.id,
      slug: String(book.slug),
      title: book.title,
      price: finalPrice,
      img: `/books/${book.image}`,
    });
    alert("Berhasil ditambahkan ke keranjang!");
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.comment) return alert("Isi nama dan komentar!");
    setReviews([formData, ...reviews]);
    setFormData({ name: "", rating: 5, comment: "" });
  };

  if (loading) return <div className="p-20 text-center font-bold text-indigo-600">Memuat detail buku...</div>;
  
  // Tampilan jika produk tidak ketemu (Slug salah atau database belum diupdate)
  if (!book) return (
    <div className="p-20 text-center flex flex-col items-center gap-4">
      <div className="text-red-500 font-bold text-xl">Produk tidak ditemukan.</div>
      <p className="text-slate-500 italic text-sm">Cek apakah slug "{slug}" sudah sesuai dengan database Laravel Anda.</p>
      <button onClick={() => router.push("/")} className="bg-indigo-600 text-white px-6 py-2 rounded-full">Kembali</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-white pb-20 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto p-6">
        <button onClick={() => router.push("/")} className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 rounded-full transition-all group mb-4">
          <Home size={18} />
          <span className="font-bold text-sm">Kembali ke Beranda</span>
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* BAGIAN GAMBAR */}
          <div className="md:col-span-5">
            <div className="rounded-2xl border border-slate-100 p-6 shadow-sm sticky top-10 bg-white flex justify-center">
              <img 
                src={`/books/${book.image}`} 
                className="w-full max-w-[320px] rounded-xl shadow-lg hover:scale-105 transition-transform duration-300" 
                alt={book.title}
                onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder-book.jpg"; }}
              />
            </div>
          </div>
          
          {/* BAGIAN INFO */}
          <div className="md:col-span-7 flex flex-col">
            <h1 className="text-4xl font-bold mb-1 text-slate-800">{book.title}</h1>
            <p className="text-lg text-slate-500 mb-4">oleh <span className="text-indigo-600 font-semibold">{book.author}</span></p>
            
            <div className="flex items-center gap-1 mb-6 text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} fill={i < 5 ? "currentColor" : "none"} />
              ))}
              <span className="text-slate-400 font-bold ml-2 text-sm">(5.0 / 5)</span>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-4xl font-black text-emerald-600">Rp{finalPrice.toLocaleString('id-ID')}</span>
              {book.discount > 0 && (
                <div className="flex items-center gap-2">
                  <span className="line-through text-slate-300 font-bold text-lg">Rp{price.toLocaleString('id-ID')}</span>
                  <span className="bg-red-100 text-red-500 text-xs px-2 py-1 rounded-lg font-bold">-{book.discount}%</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-6 mb-8 pb-6 border-b border-slate-100">
              <button onClick={toggleFavorite} className={`flex items-center gap-2 font-bold transition-all ${isFavorite ? 'text-red-500 scale-110' : 'text-slate-400 hover:text-red-500'}`}>
                <Heart size={24} fill={isFavorite ? "currentColor" : "none"} />
                <span>{isFavorite ? "Favorit Saya" : "Tambah Favorit"}</span>
              </button>
              <button onClick={() => {navigator.clipboard.writeText(window.location.href); alert("Link disalin!");}} className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold transition-colors">
                <Share2 size={24} />
                <span>Bagikan</span>
              </button>
            </div>

            <button onClick={handleAddToCart} className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 py-5 rounded-2xl font-black text-xl transition-all shadow-md mb-10">
              + Keranjang
            </button>

            <div className="mb-10">
              <h2 className="text-xl font-bold mb-4 border-l-4 border-indigo-600 pl-3">Deskripsi Buku</h2>
              <div className="relative">
                <p className={`text-slate-600 leading-relaxed text-lg text-justify ${!isExpanded ? 'line-clamp-3' : ''}`}>
                  {book.description || "Deskripsi belum tersedia."}
                </p>
                <button onClick={() => setIsExpanded(!isExpanded)} className="text-indigo-600 font-bold mt-2 flex items-center gap-1 hover:underline text-sm">
                  {isExpanded ? "Tutup" : "Baca Selengkapnya"}
                </button>
              </div>
            </div>

            {/* SPESIFIKASI */}
            <div className="bg-slate-50 rounded-2xl p-6 mb-10 border border-slate-100">
              <h2 className="text-xl font-bold mb-6 text-slate-800">Detail Spesifikasi</h2>
              <div className="grid grid-cols-2 gap-y-6">
                <div><p className="text-slate-400 text-xs uppercase mb-1 font-bold">Penerbit</p><p className="font-semibold">{book.details?.penerbit || "Gramedia"}</p></div>
                <div><p className="text-slate-400 text-xs uppercase mb-1 font-bold">ISBN</p><p className="font-semibold">{book.details?.isbn || "-"}</p></div>
                <div><p className="text-slate-400 text-xs uppercase mb-1 font-bold">Bahasa</p><p className="font-semibold">{book.details?.bahasa || "Indonesia"}</p></div>
                <div><p className="text-slate-400 text-xs uppercase mb-1 font-bold">Halaman</p><p className="font-semibold">{book.details?.halaman || "0"}</p></div>
              </div>
            </div>

            {/* ULASAN DENGAN FORM TAMBAH */}
            <div className="border-t border-slate-100 pt-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Ulasan Pembeli ({reviews.length})</h2>
              
              {/* Form Input Ulasan */}
              <div className="bg-indigo-50/50 p-6 rounded-3xl mb-10 border border-indigo-100">
                <h3 className="font-bold text-indigo-900 mb-4 flex items-center gap-2">
                  <User size={18} /> Berikan Ulasan
                </h3>
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input 
                      type="text" 
                      placeholder="Nama Lengkap" 
                      className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-400 transition-all bg-white"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                    <select 
                      className="w-full p-3 rounded-xl border border-slate-200 bg-white"
                      value={formData.rating}
                      onChange={(e) => setFormData({...formData, rating: Number(e.target.value)})}
                    >
                      <option value="5">⭐⭐⭐⭐⭐ (Sempurna)</option>
                      <option value="4">⭐⭐⭐⭐ (Bagus)</option>
                      <option value="3">⭐⭐⭐ (Cukup)</option>
                    </select>
                  </div>
                  <textarea 
                    placeholder="Tulis ulasan Anda di sini..." 
                    className="w-full p-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-400 bg-white resize-none"
                    rows={3}
                    value={formData.comment}
                    onChange={(e) => setFormData({...formData, comment: e.target.value})}
                    required
                  ></textarea>
                  <button type="submit" className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all">
                    <Send size={18} /> Kirim Ulasan
                  </button>
                </form>
              </div>

              {/* Daftar Ulasan */}
              <div className="space-y-4">
                {reviews.map((rev, index) => (
                  <div key={index} className="flex gap-4 p-5 rounded-2xl bg-white border border-slate-100 shadow-sm">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold uppercase">
                      {rev.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-slate-800">{rev.name}</p>
                      <div className="flex text-yellow-400 my-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} fill={i < rev.rating ? "currentColor" : "none"} />
                        ))}
                      </div>
                      <p className="text-slate-600 text-sm italic">"{rev.comment}"</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}