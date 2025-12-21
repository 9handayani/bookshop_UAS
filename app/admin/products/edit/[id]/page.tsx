"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { HiOutlineArrowLeft, HiOutlineCheckCircle, HiOutlineCloudUpload } from "react-icons/hi";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id;

  const [isLoading, setIsLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState<string | null>(null); // State untuk menampilkan gambar
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "Novel",
    price: "",
    stock: "",
    description: "",
    image: null as File | null,
  });

  // 1. Ambil data asli dari Laravel
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/books/${productId}`);
        const data = await response.json();
        
        if (response.ok) {
          setFormData({
            title: data.title,
            author: data.author,
            category: data.category,
            price: data.price.toString(),
            stock: data.stock.toString(),
            description: data.description || "",
            image: null,
          });
          
          // SET PREVIEW GAMBAR: Pastikan path sesuai dengan storage Laravel kamu
          if (data.image) {
            setPreviewImage(`http://localhost:8000/storage/${data.image}`);
          }
        }
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append("_method", "PUT"); 
    data.append("title", formData.title);
    data.append("author", formData.author);
    data.append("category", formData.category);
    data.append("price", formData.price);
    data.append("stock", formData.stock);
    data.append("description", formData.description);
    if (formData.image) data.append("image", formData.image);

    try {
      const response = await fetch(`http://localhost:8000/api/books/${productId}`, {
        method: "POST", 
        body: data,
      });

      if (response.ok) {
        alert("Produk Berhasil Diperbarui!");
        router.push("/admin/products");
      }
    } catch (error) {
      alert("Gagal memperbarui data!");
    }
  };

  if (isLoading) return <div className="p-10 text-center font-bold text-indigo-600">Memuat Data Produk...</div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="bg-[#0f172a] p-10 pb-40">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-4 transition font-bold"
        >
          <HiOutlineArrowLeft /> Batal dan Kembali
        </button>
        <h1 className="text-4xl font-black text-white tracking-tight">Edit Produk</h1>
        <p className="text-slate-400 mt-2 font-medium">
          ID Produk: <span className="text-indigo-400 font-mono bg-slate-800 px-2 py-1 rounded">#{productId}</span>
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-10 -mt-24 mb-20">
        <form onSubmit={handleUpdate} className="bg-white rounded-[40px] shadow-2xl p-12 border border-slate-100 space-y-8">
          
          {/* ================= BAGIAN GAMBAR BUKU ================= */}
          <div className="flex flex-col md:flex-row gap-8 items-center bg-slate-50 p-8 rounded-[35px] border-2 border-dashed border-slate-200">
            <div className="w-44 h-60 bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-100 flex-shrink-0 flex items-center justify-center">
              {previewImage ? (
                <img src={previewImage} alt="Cover Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-slate-300 flex flex-col items-center">
                  <HiOutlineCloudUpload size={48} />
                  <p className="text-xs font-bold mt-2">No Image</p>
                </div>
              )}
            </div>
            
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-lg font-black text-slate-800">Cover Buku</h3>
                <p className="text-sm text-slate-500 font-medium">Unggah file baru jika ingin mengganti cover saat ini.</p>
              </div>
              <input 
                type="file" 
                accept="image/*"
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-black file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 transition-all cursor-pointer"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setFormData({ ...formData, image: file });
                    setPreviewImage(URL.createObjectURL(file)); // Preview instan
                  }
                }}
              />
            </div>
          </div>

          {/* ================= INPUT DATA LAINNYA ================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-black text-slate-700 ml-1">Judul Buku</label>
              <input 
                type="text" required
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-bold"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-black text-slate-700 ml-1">Penulis</label>
              <input 
                type="text" required
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-bold"
                value={formData.author}
                onChange={(e) => setFormData({...formData, author: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-black text-slate-700 ml-1">Kategori</label>
              <select 
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option>Novel</option>
                <option>Komik</option>
                <option>Pendidikan</option>
                <option>Self Improvement</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-black text-slate-700 ml-1">Harga (Rp)</label>
              <input 
                type="number" required
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-black text-slate-700 ml-1">Stok</label>
              <input 
                type="number" required
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-black text-slate-700 ml-1">Deskripsi Lengkap Buku</label>
            <textarea 
              required rows={8}
              className="w-full p-6 bg-slate-50 border border-slate-200 rounded-[30px] outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all resize-none font-medium text-slate-600"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-5 rounded-2xl font-black text-xl transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3"
          >
            <HiOutlineCheckCircle className="text-2xl" />
            Simpan Perubahan Data
          </button>
        </form>
      </div>
    </div>
  );
}