"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  HiOutlineSearch, 
  HiOutlinePlus, 
  HiOutlinePencil, 
  HiOutlineTrash, 
  HiOutlineStar,
  HiChevronLeft,
  HiChevronRight 
} from "react-icons/hi";

interface Product {
  id: number;
  title: string;
  author: string;
  price: number;
  discount: number;
  rating: number;
  stock: number;
  image: string;
  category?: { id: number; name: string };
}

interface Category {
  id: number;
  name: string;
}

export default function ManageProducts() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Semua");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const API_BASE_URL = "http://127.0.0.1:8000";

  // --- HELPER GAMBAR (DIUBAH KE FOLDER PUBLIC LOKAL) ---
  const getImageUrl = (path: string) => {
    if (!path) return "https://via.placeholder.com/150?text=No+Image";
    
    // Jika path sudah berupa URL internet (http), gunakan langsung
    if (path.startsWith('http')) return path;
    
    // Ambil nama filenya saja (misal dari "books/book1.jpg" menjadi "book1.jpg")
    const fileName = path.split('/').pop(); 
    
    // Karena gambar ada di folder public/books milik Next.js (frontend), 
    // kita gunakan path relatif "/" yang otomatis membaca folder public.
    return `/books/${fileName}`;
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const prodRes = await fetch(`${API_BASE_URL}/api/books`);
      const prodData = await prodRes.json();
      
      const cleanProdData = Array.isArray(prodData) ? prodData : (prodData.data || []);
      setProducts(cleanProdData);

      const catRes = await fetch(`${API_BASE_URL}/api/categories`);
      const catData = await catRes.json();
      setCategories(Array.isArray(catData) ? catData : (catData.data || []));
    } catch (err) {
      console.error("Gagal mengambil data:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/books/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          alert("Produk berhasil dihapus");
          fetchData();
        }
      } catch (err) {
        alert("Gagal menghapus produk");
      }
    }
  };

  const filteredProducts = (products || []).filter((p) => {
    const matchesSearch = 
      p.title?.toLowerCase().includes(search.toLowerCase()) || 
      p.author?.toLowerCase().includes(search.toLowerCase());
    
    const catName = p.category?.name || "Umum";
    const matchesCategory = categoryFilter === "Semua" || catName === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, categoryFilter]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Section */}
      <div className="bg-[#0f172a] p-10 pb-28">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold text-white uppercase tracking-wider">Admin Panel</h1>
          <button 
            onClick={() => router.push("/admin/products/add")}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg"
          >
            <HiOutlinePlus className="text-xl" /> Tambah Produk
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-10 -mt-16 pb-10">
        <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-8 min-h-[400px]">
          
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
              <input 
                type="text"
                placeholder="Cari judul buku atau penulis..."
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-indigo-500 text-slate-800"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select 
              className="px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-600 font-medium outline-none focus:ring-2 focus:ring-indigo-500"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="Semua">Semua Kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <>
                <table className="w-full text-left border-separate border-spacing-y-2">
                  <thead>
                    <tr className="text-slate-400 text-[10px] uppercase tracking-widest">
                      <th className="pb-4 px-4 text-center font-bold">Rating</th>
                      <th className="pb-4 px-4 font-bold">Buku</th>
                      <th className="pb-4 px-4 text-center font-bold">Kategori</th>
                      <th className="pb-4 px-4 font-bold">Harga & Diskon</th>
                      <th className="pb-4 px-4 text-center font-bold">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((product) => (
                      <tr key={product.id} className="bg-white group hover:bg-slate-50/80 transition-all border border-slate-100 shadow-sm">
                        <td className="py-4 px-4 text-center">
                          <div className="flex items-center justify-center gap-1 text-orange-500 font-bold text-sm">
                            <HiOutlineStar /> {product.rating || 0}
                          </div>
                        </td>
                        <td className="py-4 px-4 border-l border-slate-50">
                          <div className="flex items-center gap-4">
                            <img 
                              src={getImageUrl(product.image)} 
                              alt={product.title}
                              className="w-12 h-16 object-cover rounded-lg shadow-sm bg-slate-100 flex-shrink-0"
                              onError={(e) => {
                                e.currentTarget.onerror = null; 
                                e.currentTarget.src = "https://via.placeholder.com/150?text=Error";
                              }}
                            />
                            <div className="overflow-hidden">
                              <p className="font-bold text-slate-800 truncate max-w-[250px] leading-tight mb-1">{product.title}</p>
                              <p className="text-[11px] text-slate-400 font-medium">{product.author}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center border-l border-slate-50">
                          <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[9px] font-black uppercase">
                            {product.category?.name || "Umum"}
                          </span>
                        </td>
                        <td className="py-4 px-4 border-l border-slate-50">
                          <p className="font-bold text-slate-800 text-sm">Rp {Number(product.price).toLocaleString("id-ID")}</p>
                          {product.discount > 0 && (
                            <span className="inline-block mt-1 text-[9px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">
                              Diskon {product.discount}%
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-center border-l border-slate-50">
                          <div className="flex justify-center gap-2">
                            <button onClick={() => router.push(`/admin/products/edit/${product.id}`)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                              <HiOutlinePencil size={18} />
                            </button>
                            <button onClick={() => handleDelete(product.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all">
                              <HiOutlineTrash size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* --- FOOTER PAGINATION --- */}
                <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-slate-100">
                  <p className="text-xs text-slate-400 font-medium">
                    Menampilkan <span className="text-slate-900 font-bold">{filteredProducts.length > 0 ? indexOfFirstItem + 1 : 0}</span> - <span className="text-slate-900 font-bold">{Math.min(indexOfLastItem, filteredProducts.length)}</span> dari <span className="text-slate-900 font-bold">{filteredProducts.length}</span> buku
                  </p>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-20 transition-all"
                    >
                      <HiChevronLeft size={20} />
                    </button>

                    <div className="flex gap-1">
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentPage(i + 1)}
                          className={`w-9 h-9 rounded-xl font-bold text-xs transition-all ${
                            currentPage === i + 1 
                            ? "bg-indigo-600 text-white shadow-md shadow-indigo-100" 
                            : "text-slate-400 hover:bg-slate-50"
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>

                    <button 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages || totalPages === 0}
                      className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-20 transition-all"
                    >
                      <HiChevronRight size={20} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}