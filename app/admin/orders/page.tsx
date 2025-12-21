"use client";
import { useState } from "react";

export default function DataPembelian() {
  // Data dummy sesuai desain Figma kamu
  const [orders, setOrders] = useState([
    {
      id: 1,
      image: "https://via.placeholder.com/50",
      productName: "Mashle 12",
      customerName: "Budi Santoso",
      address: "Jl. Merdeka No. 10, Jakarta",
      totalPrice: 58500,
      paymentMethod: "COD",
      status: "Belum",
    },
    {
      id: 2,
      image: "https://via.placeholder.com/50",
      productName: "Seporsi Mie Ayam",
      customerName: "Siti Aminah",
      address: "Gg. Kelinci No. 5, Bandung",
      totalPrice: 65000,
      paymentMethod: "Transfer",
      status: "Lunas",
    },
  ]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HEADER GELAP (Konsisten dengan Admin Panel kamu) */}
      <div className="bg-[#0f172a] p-10 pb-28">
        <h1 className="text-3xl font-bold text-white">Data Pembelian</h1>
        <p className="text-slate-400 mt-2">Pantau dan kelola semua pesanan masuk di sini.</p>
      </div>

      {/* TABEL DATA PEMBELIAN */}
      <div className="max-w-7xl mx-auto px-10 -mt-16 mb-10">
        <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-8 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-4 font-bold text-slate-600 text-sm">No</th>
                  <th className="p-4 font-bold text-slate-600 text-sm">Gambar</th>
                  <th className="p-4 font-bold text-slate-600 text-sm">Nama Produk</th>
                  <th className="p-4 font-bold text-slate-600 text-sm">Nama Pemesan</th>
                  <th className="p-4 font-bold text-slate-600 text-sm">Alamat</th>
                  <th className="p-4 font-bold text-slate-600 text-sm">Harga Total</th>
                  <th className="p-4 font-bold text-slate-600 text-sm">Metode</th>
                  <th className="p-4 font-bold text-slate-600 text-sm">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order, index) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-all text-sm text-slate-700">
                    <td className="p-4">{index + 1}</td>
                    <td className="p-4">
                      <img src={order.image} alt="produk" className="w-12 h-16 object-cover rounded-md shadow-sm" />
                    </td>
                    <td className="p-4 font-semibold text-slate-900">{order.productName}</td>
                    <td className="p-4">{order.customerName}</td>
                    <td className="p-4 max-w-[200px] truncate">{order.address}</td>
                    <td className="p-4 font-bold">Rp {order.totalPrice.toLocaleString()}</td>
                    <td className="p-4">
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase">
                        {order.paymentMethod}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`font-bold ${order.status === 'Lunas' ? 'text-blue-500' : 'text-red-500'}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}