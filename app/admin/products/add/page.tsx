"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AddProductPage() {
  const router = useRouter();
  const [categoriesList, setCategoriesList] = useState<{id: number, name: string}[]>([]);

  const [form, setForm] = useState({
    title: "",
    author: "",
    category_id: "", // Diubah ke string kosong untuk handling awal select
    price: "",
    discount: "0", 
    rating: "0",   
    stock: "",
    image: "", 
    description: "",
    details: JSON.stringify({ "Penerbit": "Gramedia", "Tahun": "2024" }, null, 2) 
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
        const data = await res.json();
        setCategoriesList(data);
        // Default kategori ke item pertama jika ada
        if (data.length > 0) {
          setForm(prev => ({ ...prev, category_id: data[0].id.toString() }));
        }
      } catch (err) {
        console.error("Gagal mengambil kategori:", err);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.category_id || form.category_id === "0") {
      alert("Silakan pilih kategori terlebih dahulu!");
      return;
    }

    try {
      let parsedDetails;
      try {
        parsedDetails = JSON.parse(form.details);
      } catch (err) {
        alert("Format JSON pada Detail Tambahan tidak valid!");
        return;
      }

      // Pastikan data numerik dikonversi dengan benar
      const payload = {
        ...form,
        category_id: Number(form.category_id),
        price: Number(form.price) || 0,
        discount: form.discount === "" ? 0 : Number(form.discount),
        rating: form.rating === "" ? 0 : Number(form.rating),
        stock: Number(form.stock) || 0,
        details: parsedDetails
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json" 
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Produk Berhasil Ditambahkan!");
        router.push("/admin/products");
      } else {
        const errorMsg = data.errors ? Object.values(data.errors).flat().join("\n") : data.message;
        alert("Gagal menyimpan:\n" + errorMsg);
      }
    } catch (err) {
      alert("Gagal terhubung ke server!");
    }
  };

  const inputClass = "block w-full p-4 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 bg-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium";

  return (
    <div className="p-10 bg-slate-50 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white p-10 rounded-[32px] shadow-sm border border-slate-100">
        <h1 className="text-2xl font-bold mb-8 text-slate-800">Tambah Buku Baru</h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Judul Buku</label>
            <input type="text" placeholder="Contoh: Atomic Habits" className={inputClass} 
              value={form.title}
              onChange={(e) => setForm({...form, title: e.target.value})} required />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Penulis</label>
            <input type="text" placeholder="Nama penulis..." className={inputClass} 
              value={form.author}
              onChange={(e) => setForm({...form, author: e.target.value})} required />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Pilih Kategori</label>
            <select 
              className={inputClass} 
              value={form.category_id} 
              onChange={(e) => setForm({...form, category_id: e.target.value})}
              required
            >
              <option value="">-- Pilih Kategori --</option>
              {categoriesList.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Harga (Normal)</label>
            <input type="number" placeholder="105000" className={inputClass} 
              value={form.price}
              onChange={(e) => setForm({...form, price: e.target.value})} required />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Diskon (%)</label>
            <input type="number" placeholder="0" className={inputClass} 
              value={form.discount}
              onChange={(e) => setForm({...form, discount: e.target.value})} />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Rating (0 - 5)</label>
            <input type="number" step="0.1" placeholder="0" className={inputClass} 
              value={form.rating}
              onChange={(e) => setForm({...form, rating: e.target.value})} />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Stok</label>
            <input type="number" placeholder="10" className={inputClass} 
              value={form.stock}
              onChange={(e) => setForm({...form, stock: e.target.value})} required />
          </div>
          
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Path Gambar</label>
            <input type="text" placeholder="/books/image.jpg" className={inputClass} 
              value={form.image}
              onChange={(e) => setForm({...form, image: e.target.value})} required />
          </div>

          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Deskripsi Singkat</label>
            <textarea className={inputClass} rows={3} placeholder="Tulis sinopsis..." 
              value={form.description}
              onChange={(e) => setForm({...form, description: e.target.value})} />
          </div>

          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Detail Tambahan (JSON)</label>
            <textarea 
              className="p-4 border border-slate-200 rounded-xl text-slate-800 font-mono text-xs bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-500" 
              rows={4}
              value={form.details}
              onChange={(e) => setForm({...form, details: e.target.value})}
            />
          </div>

          <div className="flex gap-4 pt-4 md:col-span-2">
            <button type="button" onClick={() => router.back()} className="flex-1 p-4 bg-slate-100 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-all">Batal</button>
            <button type="submit" className="flex-1 p-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all">Simpan Produk</button>
          </div>
        </form>
      </div>
    </div>
  );
}