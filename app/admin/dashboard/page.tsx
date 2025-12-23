"use client";

import { useEffect, useState } from "react";
import { HiOutlineChartBar, HiOutlineCube, HiOutlineShoppingBag } from "react-icons/hi";

// 1. Interface disesuaikan (Menambahkan book_title)
interface Order {
  id: number;
  book_title: string; // Ditambahkan untuk menampilkan judul buku
  customer_name: string;
  email: string;
  total_amount: string | number;
  status: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/orders", {
          headers: { "Accept": "application/json" }
        });
        
        if (response.ok) {
          const data: Order[] = await response.json();
          setOrders(data);

          const revenue = data.reduce((sum, item) => sum + (Number(item.total_amount) || 0), 0);
          setTotalRevenue(revenue);
        }
      } catch (err) {
        console.error("Gagal mengambil data dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const stats = [
    { label: "Jumlah Produk", value: "12", unit: "", icon: <HiOutlineCube size={24} className="text-indigo-500" /> },
    { 
      label: "Total Pesanan", 
      value: loading ? "..." : orders.length.toString(), 
      unit: "", 
      icon: <HiOutlineShoppingBag size={24} className="text-emerald-500" /> 
    },
    { 
      label: "Pendapatan Bulanan", 
      value: loading ? "..." : totalRevenue.toLocaleString("id-ID"), 
      unit: "Rp ", 
      icon: <HiOutlineChartBar size={24} className="text-amber-500" /> 
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAF8]">
      <div className="bg-[#0f172a] p-10 pb-32">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 text-white">
            <h1 className="text-3xl font-bold">Dashboard Admin</h1>
            <p className="text-slate-400">Selamat datang di panel kendali BookStore.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-xl flex items-center justify-between border border-slate-100">
                <div>
                  <p className="text-slate-500 text-sm mb-2">{stat.label}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-slate-400 font-bold">{stat.unit}</span>
                    <p className="text-3xl font-black text-slate-800">{stat.value}</p>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl">{stat.icon}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-10 -mt-16 pb-10">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 min-h-[400px]">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-slate-800">
            <span className="w-1.5 h-6 bg-indigo-600 rounded-full"></span>
            Aktivitas Terkini
          </h2>
          
          {loading ? (
             <p className="text-center py-20 text-slate-400 italic">Sinkronisasi data...</p>
          ) : isClient && orders.length > 0 ? (
            <div className="space-y-4">
              {[...orders].reverse().slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold uppercase">
                      {/* Menampilkan inisial judul buku */}
                      {order.book_title?.charAt(0) || "B"}
                    </div>
                    <div>
                      {/* HANYA MENAMPILKAN JUDUL BUKU */}
                      <p className="font-bold text-slate-800">{order.book_title}</p>
                      <p className="text-xs text-slate-500">Oleh: {order.customer_name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-indigo-600">Rp {Number(order.total_amount).toLocaleString("id-ID")}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{new Date(order.created_at).toLocaleDateString("id-ID")}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/30">
              <p className="text-slate-400 italic">Belum ada aktivitas di database.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}