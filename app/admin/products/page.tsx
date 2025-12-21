"use client";
import { useState, useEffect } from "react"; // ✅ Tambahkan useEffect
import { useRouter } from "next/navigation";
import { HiOutlineSearch, HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";

// Definisi Interface untuk TypeScript agar tidak error
interface Product {
  id: number;
  title: string;
  author: string;
  price: number;
  stock: number;
  category?: { name: string }; // Relasi ke model Category di Laravel
}

export default function ManageProducts() {
  const router = useRouter();

  // ✅ Ubah data dummy menjadi array kosong untuk menampung data dari database
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Semua");
  const [loading, setLoading] = useState(true);

  // ✅ 1. FUNGSI AMBIL DATA DARI LARAVEL
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://127.0.0.1:8000/api/books"); // Sesuai route Laravel
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      console.error("Gagal mengambil data buku:", err);
      alert("Gagal terhubung ke server Laravel!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ✅ 2. LOGIKA HAPUS DATA DARI DATABASE
  const handleDelete = async (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/books/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          alert("Produk berhasil dihapus");
          fetchProducts(); // Refresh data setelah hapus
        }
      } catch (err) {
        alert("Gagal menghapus produk");
      }
    }
  };

  // Logika Filter & Search
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    // Ambil nama kategori dari relasi atau tampilkan "Lainnya"
    const catName = p.category?.name || "Semua";
    const matchesCategory = categoryFilter === "Semua" || catName === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-[#0f172a] p-10 pb-28">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-3xl font-bold text-white">Kelola Produk</h1>
          <button 
            onClick={() => router.push("/admin/products/add")}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-500/20"
          >
            <HiOutlinePlus className="text-xl" />
            Tambah Produk
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-10 -mt-16 pb-10">
        <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-8 min-h-[400px]">
          
          {/* SEARCH & FILTER */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
              <input 
                type="text"
                placeholder="Cari judul buku atau penulis..."
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-indigo-500 transition-all text-slate-800"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select 
              className="px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-indigo-500 text-slate-600 font-medium cursor-pointer"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="Semua">Semua Kategori</option>
              <option value="Novel">Novel</option>
              <option value="Komik">Komik</option>
              <option value="Pendidikan">Pendidikan</option>
            </select>
          </div>

          {/* TABEL PRODUK */}
          <div className="overflow-x-auto">
            {loading ? (
              <p className="text-center py-10 text-slate-400">Sedang mengambil data...</p>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="pb-4 font-bold text-slate-400 text-sm uppercase tracking-wider">Info Buku</th>
                    <th className="pb-4 font-bold text-slate-400 text-sm uppercase tracking-wider">Kategori</th>
                    <th className="pb-4 font-bold text-slate-400 text-sm uppercase tracking-wider">Harga</th>
                    <th className="pb-4 font-bold text-slate-400 text-sm uppercase tracking-wider">Stok</th>
                    <th className="pb-4 font-bold text-slate-400 text-sm uppercase tracking-wider text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="group hover:bg-slate-50/50 transition-all">
                      <td className="py-5">
                        <p className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{product.title}</p>
                        <p className="text-sm text-slate-500">{product.author}</p>
                      </td>
                      <td className="py-5">
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold">
                          {/* ✅ Menampilkan kategori dari relasi */}
                          {product.category?.name || "Umum"}
                        </span>
                      </td>
                      <td className="py-5 font-bold text-slate-800 text-lg">
                        Rp {Number(product.price).toLocaleString("id-ID")}
                      </td>
                      <td className="py-5">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${product.stock > 5 ? 'bg-green-500' : 'bg-orange-500'}`}></span>
                          <span className="text-slate-600 font-medium">{product.stock} pcs</span>
                        </div>
                      </td>
                      <td className="py-5">
                        <div className="flex justify-center gap-2">
                          <button 
                            onClick={() => router.push(`/admin/products/edit/${product.id}`)}
                            className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"
                          >
                            <HiOutlinePencil />
                          </button>
                          <button 
                            onClick={() => handleDelete(product.id)}
                            className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                          >
                            <HiOutlineTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}