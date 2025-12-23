"use client";
import { useState, useEffect } from "react";
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

  // --- LOGIKA PAGINATION ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Menampilkan 10 buku per halaman

  const fetchData = async () => {
    try {
      setLoading(true);
      const prodRes = await fetch("http://127.0.0.1:8000/api/books");
      const prodData = await prodRes.json();
      setProducts(prodData);

      const catRes = await fetch("http://127.0.0.1:8000/api/categories");
      const catData = await catRes.json();
      setCategories(catData);
    } catch (err) {
      console.error("Gagal mengambil data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/books/${id}`, {
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

  // Filter Produk
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                          p.author.toLowerCase().includes(search.toLowerCase());
    const catName = p.category?.name || "Umum";
    const matchesCategory = categoryFilter === "Semua" || catName === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // --- PERHITUNGAN DATA PER HALAMAN ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Reset ke halaman 1 jika user mencari sesuatu
  useEffect(() => {
    setCurrentPage(1);
  }, [search, categoryFilter]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-[#0f172a] p-10 pb-28">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold text-white">Kelola Produk</h1>
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
              <p className="text-center py-10 text-slate-400 italic">Mengambil data dari database...</p>
            ) : (
              <>
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="pb-4 font-bold text-slate-400 text-xs uppercase text-center">Info</th>
                      <th className="pb-4 font-bold text-slate-400 text-xs uppercase">Buku</th>
                      <th className="pb-4 font-bold text-slate-400 text-xs uppercase text-center">Kategori</th>
                      <th className="pb-4 font-bold text-slate-400 text-xs uppercase">Harga & Diskon</th>
                      <th className="pb-4 font-bold text-slate-400 text-xs uppercase text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {currentItems.map((product) => (
                      <tr key={product.id} className="group hover:bg-slate-50/50 transition-all">
                        <td className="py-5 text-center">
                          <div className="flex items-center justify-center gap-1 text-orange-500 font-bold text-sm">
                             <HiOutlineStar /> {product.rating || 0}
                          </div>
                        </td>
                        <td className="py-5">
                          <div className="flex items-center gap-4">
                            <img 
                              src={product.image} 
                              alt={product.title}
                              className="w-10 h-14 object-cover rounded shadow-sm bg-slate-100"
                              onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/150")}
                            />
                            <div>
                              <p className="font-bold text-slate-800">{product.title}</p>
                              <p className="text-xs text-slate-500">{product.author}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-5 text-center">
                          <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-bold uppercase">
                            {product.category?.name || "Umum"}
                          </span>
                        </td>
                        <td className="py-5">
                           <p className="font-bold text-slate-800">Rp {Number(product.price).toLocaleString("id-ID")}</p>
                           {product.discount > 0 && (
                             <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">
                               Diskon {product.discount}%
                             </span>
                           )}
                        </td>
                        <td className="py-5">
                          <div className="flex justify-center gap-2">
                            <button onClick={() => router.push(`/admin/products/edit/${product.id}`)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              <HiOutlinePencil />
                            </button>
                            <button onClick={() => handleDelete(product.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                              <HiOutlineTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* --- FOOTER PAGINATION --- */}
                <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-slate-100 pt-6">
                  <p className="text-sm text-slate-500 font-medium">
                    Menampilkan <span className="text-slate-900 font-bold">{indexOfFirstItem + 1}</span> - <span className="text-slate-900 font-bold">{Math.min(indexOfLastItem, filteredProducts.length)}</span> dari <span className="text-slate-900 font-bold">{filteredProducts.length}</span> produk
                  </p>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-white transition-all"
                    >
                      <HiChevronLeft className="text-xl" />
                    </button>

                    <div className="flex gap-1">
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentPage(i + 1)}
                          className={`w-10 h-10 rounded-xl font-bold transition-all ${
                            currentPage === i + 1 
                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" 
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
                      className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-white transition-all"
                    >
                      <HiChevronRight className="text-xl" />
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