"use client";
import { useState, useEffect, use } from "react"; 
import { useRouter } from "next/navigation";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  
  // SOLUSI UTAMA: Unwrap params agar ID terbaca dengan benar
  const resolvedParams = use(params);
  const id = resolvedParams.id; 
  
  const [categoriesList, setCategoriesList] = useState<{id: number, name: string}[]>([]);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    author: "",
    category_id: 0,
    price: "",
    discount: "0", 
    rating: "0",   
    stock: "",
    image: "",
    description: "",
    details: "" 
  });
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = "process.env.NEXT_PUBLIC_API_URL";

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Ambil Kategori
        const catRes = await fetch(`${API_BASE_URL}/api/categories`);
        const categories = await catRes.json();
        setCategoriesList(Array.isArray(categories) ? categories : (categories.data || []));

        // 2. Ambil Data Buku menggunakan ID
        const res = await fetch(`${API_BASE_URL}/api/books/${id}`, {
          headers: { "Accept": "application/json" }
        });

        if (!res.ok) throw new Error("Buku tidak ditemukan!");
        
        const responseJson = await res.json();
        const data = responseJson.data || responseJson; 
        
        setForm({
          title: data.title || "",
          slug: data.slug || "",
          author: data.author || "",
          category_id: data.category_id || 0,
          price: data.price?.toString() || "",
          discount: (data.discount ?? 0).toString(), 
          rating: (data.rating ?? 0).toString(),     
          stock: data.stock?.toString() || "",
          image: data.image || "",
          description: data.description || "",
          details: typeof data.details === 'object' 
            ? JSON.stringify(data.details, null, 2) 
            : (data.details || "{}")
        });
      } catch (err) {
        console.error(err);
        alert("Buku tidak ditemukan di database!");
        router.push("/admin/products");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let parsedDetails;
      try {
        parsedDetails = JSON.parse(form.details);
      } catch (err) {
        alert("Format Detail JSON tidak valid!");
        return;
      }

      const res = await fetch(`${API_BASE_URL}/api/books/${id}`, {
        method: "PUT", 
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json" 
        },
        body: JSON.stringify({
          title: form.title,
          author: form.author,
          category_id: Number(form.category_id),
          price: Number(form.price),
          discount: Math.floor(Number(form.discount)) || 0, 
          rating: parseFloat(form.rating) || 0,     
          stock: Number(form.stock),
          image: form.image,
          description: form.description,
          details: parsedDetails
        }),
      });

      if (res.ok) {
        alert("Produk Berhasil Diperbarui!");
        router.push("/admin/products");
      } else {
        const result = await res.json();
        const errorMsg = result.errors ? Object.values(result.errors).flat().join("\n") : result.message;
        alert("Gagal update:\n" + errorMsg);
      }
    } catch (err) {
      alert("Kesalahan koneksi server.");
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
    </div>
  );

  const inputClass = "w-full p-4 border border-slate-300 rounded-xl text-slate-900 bg-white outline-none focus:ring-2 focus:ring-blue-500 transition-all font-semibold";

  return (
    <div className="p-10 bg-slate-50 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white p-10 rounded-[32px] shadow-md border border-slate-100">
        <h1 className="text-2xl font-extrabold mb-8 text-slate-800">
          Edit Produk: <span className="text-blue-600">{form.title || "Memuat..."}</span>
        </h1>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Judul Buku</label>
            <input type="text" value={form.title} className={inputClass} 
              onChange={(e) => setForm({...form, title: e.target.value})} required />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Kategori</label>
            <select 
              className={inputClass} 
              value={form.category_id} 
              onChange={(e) => setForm({...form, category_id: Number(e.target.value)})}
              required
            >
              <option value="">Pilih Kategori</option>
              {categoriesList.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Penulis</label>
            <input type="text" value={form.author} className={inputClass} 
              onChange={(e) => setForm({...form, author: e.target.value})} required />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Harga (Rp)</label>
            <input type="number" value={form.price} className={inputClass} 
              onChange={(e) => setForm({...form, price: e.target.value})} required />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Diskon (%)</label>
            <input type="number" value={form.discount} className={inputClass} 
              onChange={(e) => setForm({...form, discount: e.target.value})} />
          </div>

          {/* INPUT RATING DITAMBAHKAN DISINI */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Rating (0 - 5)</label>
            <input 
              type="number" 
              step="0.1" 
              min="0" 
              max="5" 
              value={form.rating} 
              className={inputClass} 
              onChange={(e) => setForm({...form, rating: e.target.value})} 
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Stok (Pcs)</label>
            <input type="number" value={form.stock} className={inputClass} 
              onChange={(e) => setForm({...form, stock: e.target.value})} required />
          </div>

          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Path Gambar</label>
            <input type="text" value={form.image} className={`${inputClass} font-mono text-sm text-blue-600`} 
              onChange={(e) => setForm({...form, image: e.target.value})} required />
          </div>

          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Detail Buku (JSON)</label>
            <textarea 
              value={form.details} 
              className="w-full p-4 border border-slate-300 rounded-xl text-indigo-700 bg-slate-50 font-mono text-xs outline-none focus:ring-2 focus:ring-blue-500" 
              rows={5}
              onChange={(e) => setForm({...form, details: e.target.value})} 
            />
          </div>

          <div className="flex gap-4 pt-4 md:col-span-2">
            <button type="button" onClick={() => router.back()} className="flex-1 p-4 bg-slate-100 rounded-xl font-bold text-slate-600">Batal</button>
            <button type="submit" className="flex-1 p-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg">Simpan Perubahan</button>
          </div>
        </form>
      </div>
    </div>
  );
}