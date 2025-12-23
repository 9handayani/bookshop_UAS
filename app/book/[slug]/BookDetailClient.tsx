"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Heart, Share2, Star, ChevronDown, ChevronUp, Home, User, Truck } from "lucide-react";
import { useCart } from "../../context/CartContext";

export default function BookDetailClient() {
  const { slug } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();

  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const [reviews, setReviews] = useState([
    { name: "Andi Pratama", rating: 5, comment: "Bukunya original dan sangat menginspirasi!" },
  ]);
  const [formData, setFormData] = useState({ name: "", rating: 5, comment: "" });
  const [hasReviewed, setHasReviewed] = useState(false);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.comment) return alert("Nama dan komentar harus diisi!");
    setReviews([formData, ...reviews]);
    setHasReviewed(true);
    setFormData({ name: "", rating: 5, comment: "" });
    alert("Terima kasih atas ulasannya!");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/books/details/${slug}`);
        const data = await res.json();
        const bookData = data.data || data;
        setBook(bookData);

        const savedFavs = JSON.parse(localStorage.getItem("favorites") || "[]");
        setIsFavorite(savedFavs.includes(bookData.slug));
      } catch (err) {
        console.error("Error API:", err);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchData();
  }, [slug]);

  const price = Number(book?.price) || 0;
  const finalPrice = Math.floor(price - (price * (book?.discount || 0)) / 100);

  const toggleFavorite = () => {
    if (!book) return;
    const savedFavs = JSON.parse(localStorage.getItem("favorites") || "[]");
    const currentSlug = String(book.slug);
    let updated;

    if (isFavorite) {
      updated = savedFavs.filter((s: string) => s !== currentSlug);
    } else {
      updated = savedFavs.includes(currentSlug) ? savedFavs : [...savedFavs, currentSlug];
    }

    localStorage.setItem("favorites", JSON.stringify(updated));
    setIsFavorite(!isFavorite);
    window.dispatchEvent(new Event("storage"));
    router.push("/favorites");
  };

  const handleAddToCart = () => {
    if (!book) return;
    addToCart({
      id: book.id,
      slug: String(book.slug),
      title: book.title,
      price: finalPrice,
      img: book.image || "/placeholder-book.jpg",
    });
    alert("Berhasil ditambahkan ke keranjang!");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: book.title, url: window.location.href });
      } catch (err) { console.log(err); }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link berhasil disalin!");
    }
  };

  if (loading) return <div className="p-20 text-center font-bold text-indigo-600">Menghubungkan ke Database...</div>;
  if (!book) return <div className="p-20 text-center text-red-500 font-bold">Produk tidak terdaftar.</div>;

  // --- DATA SEO (JSON-LD) ---
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Book",
    "name": book.title,
    "image": book.image,
    "description": book.description,
    "author": {
      "@type": "Person",
      "name": book.author
    },
    "offers": {
      "@type": "Offer",
      "price": finalPrice,
      "priceCurrency": "IDR",
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5.0",
      "reviewCount": reviews.length.toString()
    }
  };

  return (
    <>
      {/* Script SEO agar muncul harga & rating di Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-white pb-20 font-sans text-slate-900">
        <div className="max-w-6xl mx-auto p-6">
          <button onClick={() => router.push("/")} className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 rounded-full transition-all group">
            <Home size={18} className="group-hover:scale-110 transition-transform" />
            <span className="font-bold text-sm">Kembali ke Beranda</span>
          </button>
        </div>

        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="md:col-span-5">
              <div className="rounded-2xl border border-slate-100 p-4 shadow-sm sticky top-10 bg-white">
                <img 
                  src={book.image || "/placeholder-book.jpg"} 
                  className="w-full rounded-xl shadow-md" 
                  alt={`Buku ${book.title} karya ${book.author}`} 
                />
              </div>
            </div>
            
            <div className="md:col-span-7 flex flex-col">
              <h1 className="text-3xl font-bold mb-1">{book.title}</h1>
              <p className="text-slate-500 mb-4 text-lg">oleh <span className="text-indigo-600 font-medium">{book.author}</span></p>
              
              <div className="flex items-center gap-1 mb-6 text-yellow-400">
                {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
                <span className="text-slate-400 font-bold ml-2 text-sm">(5.0 / 5) berdasarkan {reviews.length} ulasan</span>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl font-black text-green-600">Rp{finalPrice.toLocaleString('id-ID')}</span>
                {book.discount > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="line-through text-slate-300 font-bold text-lg">Rp{price.toLocaleString('id-ID')}</span>
                    <span className="bg-red-100 text-red-500 text-xs px-2 py-1 rounded-lg font-bold">-{book.discount}%</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-6 mb-8 pb-6 border-b border-slate-50">
                <button onClick={toggleFavorite} className={`flex items-center gap-2 font-bold transition-colors ${isFavorite ? 'text-red-500' : 'text-slate-400 hover:text-red-500'}`}>
                  <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
                  <span>{isFavorite ? "Favorit Saya" : "Tambah Favorit"}</span>
                </button>
                <button onClick={handleShare} className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold transition-colors">
                  <Share2 size={20} />
                  <span>Bagikan</span>
                </button>
              </div>

              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-4">
                <div className="bg-white p-2 rounded-xl shadow-sm"><Truck className="text-emerald-500" size={24} /></div>
                <div>
                  <h4 className="font-bold text-emerald-700 text-sm">Bebas Ongkir</h4>
                  <p className="text-slate-500 text-xs">Gratis ongkir tanpa minimum belanja ke seluruh Indonesia.</p>
                </div>
              </div>

              <button onClick={handleAddToCart} className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 py-5 rounded-2xl font-black text-lg transition-all shadow-lg mb-10 active:scale-95">
                + Keranjang
              </button>

              <div className="mb-10">
                <h2 className="text-xl font-bold mb-4">Deskripsi Buku</h2>
                <div className="relative">
                  <p className={`text-slate-600 leading-relaxed text-lg text-justify transition-all ${!isExpanded ? 'line-clamp-3' : ''}`}>
                    {book.description || "Belum ada deskripsi untuk buku ini."}
                  </p>
                  {book.description && book.description.length > 150 && (
                    <button onClick={() => setIsExpanded(!isExpanded)} className="text-indigo-600 font-bold mt-2 flex items-center gap-1 hover:underline">
                      {isExpanded ? <>Tutup <ChevronUp size={16} /></> : <>Baca Selengkapnya <ChevronDown size={16} /></>}
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 mb-10 shadow-sm">
                <h2 className="text-xl font-bold mb-6">Detail Buku</h2>
                <div className="grid grid-cols-2 gap-y-6 gap-x-12">
                  <div><p className="text-slate-400 text-sm mb-1">Penerbit</p><p className="font-semibold text-slate-800">{book.details?.Penerbit || "-"}</p></div>
                  <div><p className="text-slate-400 text-sm mb-1">Tanggal Terbit</p><p className="font-semibold text-slate-800">{book.details?.["Tanggal Terbit"] || "-"}</p></div>
                  <div><p className="text-slate-400 text-sm mb-1">ISBN</p><p className="font-semibold text-slate-800">{book.details?.ISBN || "-"}</p></div>
                  <div><p className="text-slate-400 text-sm mb-1">Halaman</p><p className="font-semibold text-slate-800">{book.details?.Halaman || "-"}</p></div>
                  <div><p className="text-slate-400 text-sm mb-1">Bahasa</p><p className="font-semibold text-slate-800">{book.details?.Bahasa || "Indonesia"}</p></div>
                  <div><p className="text-slate-400 text-sm mb-1">Berat</p><p className="font-semibold text-slate-800">{book.details?.Berat || "-"}</p></div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-8">
                  <h2 className="text-xl font-bold text-slate-800 mb-8">Ulasan Pembeli</h2>
                  <div className="space-y-4 mb-10">
                      {reviews.map((rev, index) => (
                          <div key={index} className="flex gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm">
                              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 font-bold"><User size={20} /></div>
                              <div className="flex-1">
                                  <p className="font-bold text-slate-800 text-sm">{rev.name}</p>
                                  <div className="flex text-yellow-400 my-1">
                                      {[...Array(5)].map((_, i) => <Star key={i} size={12} fill={i < rev.rating ? "currentColor" : "none"} />)}
                                  </div>
                                  <p className="text-slate-600 text-sm italic">"{rev.comment}"</p>
                              </div>
                          </div>
                      ))}
                  </div>
                  {!hasReviewed && (
                      <div className="bg-white p-6 rounded-3xl border-2 border-slate-100 shadow-sm">
                          <h3 className="text-lg font-bold mb-4">Berikan Penilaian</h3>
                          <form onSubmit={handleReviewSubmit} className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <input type="text" placeholder="Nama lengkap" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                                  <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" value={formData.rating} onChange={(e) => setFormData({...formData, rating: Number(e.target.value)})}>
                                      <option value="5">⭐⭐⭐⭐⭐ Sangat Puas</option>
                                      <option value="4">⭐⭐⭐⭐ Puas</option>
                                      <option value="3">⭐⭐⭐ Cukup</option>
                                  </select>
                              </div>
                              <textarea placeholder="Tulis pengalaman Anda..." className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" rows={3} value={formData.comment} onChange={(e) => setFormData({...formData, comment: e.target.value})} required></textarea>
                              <button type="submit" className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-700 transition-colors">Kirim Ulasan</button>
                          </form>
                      </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}