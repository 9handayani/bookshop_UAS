"use client";
import { useState, useEffect } from "react";

// 1. Interface tetap sama
interface Order {
  id: number;
  book_title: string;
  customer_name: string;
  phone_number: string;
  address: string;
  total_amount: number;
  payment_method: string;
  status: 'pending' | 'paid' | 'shipped' | 'completed';
}

export default function DataPembelian() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // 2. FUNGSI AMBIL DATA (URL diperbaiki menjadi /api/orders)
  const fetchOrders = async () => {
    try {
      setLoading(true);
      // Menggunakan /api/orders sesuai hasil tes browser
      const response = await fetch("http://127.0.0.1:8000/api/orders", {
        headers: {
          "Accept": "application/json", // Memaksa Laravel mengirim JSON bukan HTML
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setOrders(Array.isArray(data) ? data : []); // Pastikan data adalah array
    } catch (err) {
      console.error("Gagal mengambil data pesanan:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 3. FUNGSI UPDATE STATUS (URL diperbaiki menjadi /api/orders)
  const handleToggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "pending" ? "paid" : "pending";

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/orders/${id}/status`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json" 
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchOrders(); 
      } else {
        const errorData = await response.json();
        alert(`Gagal: ${errorData.message || "Gagal update status"}`);
      }
    } catch (err) {
      alert("Gagal memperbarui status. Periksa koneksi ke server.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="bg-[#0f172a] p-10 pb-28">
        <h1 className="text-3xl font-bold text-white">Data Pembelian</h1>
        <p className="text-slate-400 mt-2">Manajemen pesanan pelanggan secara real-time.</p>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-16 mb-10">
        <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-8 overflow-hidden min-h-[400px]">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4"></div>
                <p className="text-slate-400 italic">Memuat data pesanan...</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="p-4 font-bold text-slate-600 text-xs uppercase">No</th>
                    <th className="p-4 font-bold text-slate-600 text-xs uppercase">Produk</th>
                    <th className="p-4 font-bold text-slate-600 text-xs uppercase">Pemesan</th>
                    <th className="p-4 font-bold text-slate-600 text-xs uppercase">Kontak & Alamat</th>
                    <th className="p-4 font-bold text-slate-600 text-xs uppercase">Total</th>
                    <th className="p-4 font-bold text-slate-600 text-xs uppercase">Metode</th>
                    <th className="p-4 font-bold text-slate-600 text-xs uppercase text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-20">
                        <p className="text-slate-400 text-lg">Belum ada pesanan masuk.</p>
                        <p className="text-slate-300 text-sm">Pastikan database terhubung.</p>
                      </td>
                    </tr>
                  ) : (
                    orders.map((order, index) => (
                      <tr key={order.id} className="hover:bg-slate-50 transition-all text-sm text-slate-700">
                        <td className="p-4 text-slate-400 font-medium">{index + 1}</td>
                        <td className="p-4 font-semibold text-slate-900">{order.book_title}</td>
                        <td className="p-4 font-medium text-slate-800">{order.customer_name}</td>
                        <td className="p-4">
                          <p className="text-xs text-slate-500 font-mono mb-1">{order.phone_number}</p>
                          <p className="text-xs text-slate-400 max-w-[200px] truncate">{order.address}</p>
                        </td>
                        <td className="p-4 font-bold text-indigo-600">
                          Rp {Number(order.total_amount).toLocaleString("id-ID")}
                        </td>
                        <td className="p-4">
                          <span className="bg-slate-100 px-2 py-1 rounded text-[10px] text-slate-600 font-bold uppercase tracking-wider">
                            {order.payment_method}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleToggleStatus(order.id, order.status)}
                            className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest transition-all active:scale-95 shadow-sm border ${
                              order.status === 'paid' 
                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                                : 'bg-rose-50 text-rose-600 border-rose-100'
                            }`}
                          >
                            {order.status === 'paid' ? 'LUNAS' : 'BELUM'}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}