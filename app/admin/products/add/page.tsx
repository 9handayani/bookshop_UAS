"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { HiOutlineArrowLeft, HiOutlineCloudUpload } from "react-icons/hi";

export default function AddProductPage() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category_id: "1", 
    price: "",
    stock: "",
    description: "",
    image: null as File | null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, image: file }));
    if (file) setPreview(URL.createObjectURL(file)); 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) data.append(key, value);
    });

    try {
      // Menggunakan 127.0.0.1 untuk menghindari isu CORS localhost pada beberapa browser
      const response = await fetch("http://127.0.0.1:8000/api/books", {
        method: "POST",
        body: data,
        headers: { "Accept": "application/json" },
      });

      if (response.ok) {
        alert("Produk Berhasil Disimpan!");
        router.push("/admin/products");
      } else {
        const result = await response.json();
        alert("Gagal: " + (result.message || "Periksa kembali inputan Anda"));
      }
    } catch (error) {
      alert("Koneksi ke server Laravel gagal! Pastikan php artisan serve jalan.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      <div className="bg-[#0f172a] p-10 pb-32 text-white">
        <button onClick={() => router.push("/admin/products")} className="flex items-center gap-2 text-slate-400 hover:text-white mb-4 transition-colors">
          <HiOutlineArrowLeft /> Kembali ke Kelola Produk
        </button>
        <h1 className="text-4xl font-black">Tambah Koleksi Buku</h1>
      </div>

      <div className="max-w-4xl mx-auto px-10 -mt-20">
        <form onSubmit={handleSubmit} className="bg-white rounded-[40px] shadow-2xl p-10 space-y-8">
          
          {/* UPLOAD GAMBAR */}
          <div className="space-y-3 text-center">
             <label className="w-full h-52 border-2 border-dashed border-slate-200 rounded-[30px] flex items-center justify-center cursor-pointer bg-slate-50 hover:bg-indigo-50 relative overflow-hidden transition-all">
                {preview ? (
                   <img src={preview} className="absolute inset-0 w-full h-full object-contain p-4" alt="Preview" />
                ) : (
                   <div className="flex flex-col items-center text-slate-400">
                      <HiOutlineCloudUpload className="text-3xl mb-2" />
                      <p className="text-sm font-bold">Pilih Cover Buku</p>
                   </div>
                )}
                <input type="file" className="hidden" accept="image/*" required onChange={handleImage} />
             </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <input name="title" type="text" placeholder="Judul Buku" required 
              className="p-4 bg-slate-100 border-none rounded-2xl text-slate-900 placeholder:text-slate-500 outline-indigo-500" 
              onChange={handleInputChange} />
            <input name="author" type="text" placeholder="Penulis" required 
              className="p-4 bg-slate-100 border-none rounded-2xl text-slate-900 placeholder:text-slate-500 outline-indigo-500" 
              onChange={handleInputChange} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* PERBAIKAN DROPDOWN KATEGORI */}
            <select 
              name="category_id"
              className="p-4 bg-slate-100 border-none rounded-2xl font-bold text-slate-700 cursor-pointer outline-indigo-500 appearance-none" 
              value={formData.category_id} 
              onChange={handleInputChange}
            >
              <option value="1" className="text-slate-900">Novel</option>
              <option value="2" className="text-slate-900">Komik</option>
              <option value="3" className="text-slate-900">Pendidikan</option>
            </select>

            <input name="price" type="number" placeholder="Harga" required 
              className="p-4 bg-slate-100 border-none rounded-2xl text-slate-900 outline-indigo-500" 
              onChange={handleInputChange} />
            <input name="stock" type="number" placeholder="Stok" required 
              className="p-4 bg-slate-100 border-none rounded-2xl text-slate-900 outline-indigo-500" 
              onChange={handleInputChange} />
          </div>

          <textarea name="description" placeholder="Deskripsi..." required 
            className="w-full p-6 bg-slate-100 border-none rounded-[30px] text-slate-900 outline-indigo-500" 
            rows={4}
            onChange={handleInputChange} />

          <button type="submit" disabled={isUploading} 
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-5 rounded-2xl font-black text-xl transition-all active:scale-95 disabled:opacity-50">
            {isUploading ? "Memproses..." : "Simpan Produk"}
          </button>
        </form>
      </div>
    </div>
  );
}