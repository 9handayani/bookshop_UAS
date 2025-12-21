"use client";

import { useEffect, useState } from "react";
import { HiOutlineChartBar, HiOutlineCube, HiOutlineShoppingBag } from "react-icons/hi";

// 1. Definisikan struktur data pesanan agar TypeScript tidak bingung
interface Order {
  id: string;
  namaLengkap: string;
  alamatEmail: string;
  totalBayar: number;
  status: string;
  tanggal: string;
}

export default function AdminDashboard() {
  // 2. Beri tahu useState bahwa ini adalah array dari Order
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const savedOrders = localStorage.getItem("orders");
    if (savedOrders) {
      try {
        const parsedOrders: Order[] = JSON.parse(savedOrders);
        setOrders(parsedOrders);

        // Hitung total dengan memastikan tipe data number
        const revenue = parsedOrders.reduce((sum, item) => sum + (Number(item.totalBayar) || 0), 0);
        setTotalRevenue(revenue);
      } catch (err) {
        console.error("Gagal membaca data:", err);
      }
    }
  }, []);

  const stats = [
    { label: "Jumlah Produk", value: "12", unit: "", icon: <HiOutlineCube size={24} className="text-indigo-500" /> },
    { 
      label: "Total Pesanan", 
      value: isClient ? orders.length.toString() : "0", 
      unit: "", 
      icon: <HiOutlineShoppingBag size={24} className="text-emerald-500" /> 
    },
    { 
      label: "Pendapatan Bulanan", 
      value: isClient ? totalRevenue.toLocaleString("id-ID") : "0", 
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
          
          {isClient && orders.length > 0 ? (
            <div className="space-y-4">
              {[...orders].reverse().slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold uppercase">
                      {order.namaLengkap.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{order.namaLengkap} baru saja membeli buku</p>
                      <p className="text-sm text-slate-500">{order.alamatEmail}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-indigo-600">Rp {Number(order.totalBayar).toLocaleString("id-ID")}</p>
                    <p className="text-xs text-slate-400 mt-1">{order.tanggal}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/30">
              <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-slate-400 italic">Belum ada aktivitas terbaru hari ini.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}