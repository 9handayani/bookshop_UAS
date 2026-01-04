"use client";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CheckoutPage() {
  const { checkoutItems, clearCart } = useCart();
  const { user, loading } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("");
  const [selectedSubMethod, setSelectedSubMethod] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/login?callbackUrl=/checkout");
      } else if (!checkoutItems || checkoutItems.length === 0) {
        router.replace("/cart");
      }
    }
  }, [user, loading, checkoutItems, router]);

  if (loading || !user || !checkoutItems) return null;

  const subtotal = checkoutItems.reduce((t, i) => t + (i.price * (i.qty || 1)), 0);
  const shipping = subtotal > 0 ? 15000 : 0; 
  const discount = subtotal * 0.05;
  const total = subtotal + shipping - discount;

  const banks = ["BCA", "Mandiri", "BNI", "BRI"];
  const wallets = ["Gopay", "OVO", "Dana", "ShopeePay"];

  const isFormValid = 
    form.name && form.phone && form.email && form.address && 
    paymentMethod && (paymentMethod === "cod" || selectedSubMethod);

  return (
    <div className="min-h-screen bg-[#f0f2f5] p-8 flex justify-center font-sans text-slate-800">
      <div className="w-full max-w-7xl">
        
        {/* 1. PERBAIKAN IKON KEMBALI (SESUAI GAMBAR) */}
        <button 
          onClick={() => router.push("/cart")}
          className="mb-6 flex items-center gap-3 text-slate-500 hover:text-indigo-600 font-bold transition-all group"
        >
          <div className="p-2 bg-white rounded-xl shadow-sm group-hover:bg-indigo-50 border border-slate-100">
            {/* Ikon Panah Sesuai Request */}
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </div>
          <span className="text-lg">Kembali ke Keranjang</span>
        </button>

        <div className="flex flex-col md:flex-row gap-8">
          {/* BAGIAN KIRI: DETAIL PENGIRIMAN */}
          <div className="flex-[2] bg-white p-10 rounded-[35px] shadow-sm space-y-8 border border-slate-50">
            <h1 className="text-3xl font-extrabold text-slate-800">Detail Pengiriman</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600 ml-1">Nama Lengkap</label>
                <input type="text" placeholder="Masukkan nama anda" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600 ml-1">Nomor HP</label>
                <input type="text" placeholder="0812xxxx" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600 ml-1">Alamat Email</label>
              <input type="email" placeholder="email@anda.com" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600 ml-1">Alamat Lengkap</label>
              <textarea placeholder="Jl. Nama Jalan, No. Rumah, Kecamatan, Kota" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all min-h-[120px]" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>

            {/* Metode Pembayaran (Pastikan dipilih agar tombol bayar aktif) */}
            <div className="pt-6">
               <label className="text-lg font-bold text-slate-800 mb-4 block">Metode Pembayaran</label>
               <div className="grid grid-cols-3 gap-4">
                  {['transfer', 'ewallet', 'cod'].map((m) => (
                    <button key={m} onClick={() => { setPaymentMethod(m); setSelectedSubMethod(""); }} className={`p-4 border-2 rounded-2xl font-bold transition-all ${paymentMethod === m ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-slate-100 bg-slate-50 text-slate-400"}`}>
                      {m === 'transfer' ? 'Transfer' : m === 'ewallet' ? 'E-Wallet' : 'COD'}
                    </button>
                  ))}
               </div>
            </div>
          </div>

          {/* BAGIAN KANAN: RINGKASAN PESANAN (SESUAI GAMBAR) */}
          <div className="flex-1">
            <div className="bg-white p-8 rounded-[35px] shadow-sm sticky top-8 border border-slate-50">
              <h2 className="text-2xl font-bold mb-8 text-slate-800">Ringkasan Pesanan</h2>
              
              <div className="space-y-6 mb-8">
                {checkoutItems.map((item) => {
                  {/* 2. PERBAIKAN LOGIKA GAMBAR (Error 404 Fix) */}
                  const fileName = item.img ? item.img.split('/').pop() : "";
                  const imageUrl = fileName ? `/books/${fileName}` : "/placeholder-book.jpg";

                  return (
                    <div key={item.id} className="flex gap-4 items-center">
                      <div className="w-20 h-20 bg-slate-100 rounded-2xl overflow-hidden border border-slate-100 flex-shrink-0">
                        <img 
                          src={imageUrl} 
                          className="w-full h-full object-cover" 
                          alt={item.title} 
                          onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder-book.jpg"; }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-800 text-base leading-tight mb-1">{item.title}</p>
                        <p className="text-indigo-600 font-bold text-sm">Rp {item.price.toLocaleString("id-ID")}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-4 pt-6 border-t border-dashed border-slate-200">
                <div className="flex justify-between text-slate-500 font-medium">
                  <span>Subtotal</span>
                  <span className="text-slate-800 font-bold">Rp {subtotal.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between text-slate-500 font-medium">
                  <span>Ongkos Kirim</span>
                  <span className="text-slate-800 font-bold">Rp {shipping.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between items-center bg-red-50 p-3 rounded-2xl">
                  <span className="text-red-500 font-bold text-sm">Diskon (5%)</span>
                  <span className="text-red-500 font-bold">-Rp {discount.toLocaleString("id-ID")}</span>
                </div>

                <div className="flex flex-col gap-1 pt-4 border-t border-slate-100 mt-2">
                  <span className="text-slate-800 font-black text-3xl">Total</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-indigo-600 font-black text-4xl">Bayar</span>
                    <span className="text-indigo-600 font-black text-4xl">Rp {total.toLocaleString("id-ID")}</span>
                  </div>
                </div>
              </div>

              <button 
                disabled={!isFormValid}
                className="mt-10 w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white py-5 rounded-[25px] font-black text-xl shadow-lg shadow-indigo-100 transition-all active:scale-[0.98]"
              >
                Bayar Sekarang
              </button>
              
              {!isFormValid && (
                <p className="text-center text-[11px] text-red-400 mt-4 font-medium italic">
                  * Lengkapi data diri & metode pembayaran
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}