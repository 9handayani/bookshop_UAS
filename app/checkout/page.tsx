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

  /* ======================
      AUTH PROTECTION
  ====================== */
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/");
    }
  }, [user, loading, router]);

  if (loading || !user) return null;

  /* ======================
      CALCULATIONS
  ====================== */
  const subtotal = checkoutItems.reduce((t, i) => t + i.price, 0);
  const shipping = 15000;
  const discount = subtotal * 0.05;
  const total = subtotal + shipping - discount;

  const banks = ["BCA", "Mandiri", "BNI", "BRI"];
  const wallets = ["Gopay", "OVO", "Dana", "ShopeePay"];

  const isFormValid = 
    form.name && form.phone && form.email && form.address && 
    paymentMethod && (paymentMethod === "cod" || selectedSubMethod);

  /* ======================
      FUNGSI PEMBAYARAN (FIXED)
  ====================== */
  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const newOrder = {
        id: `ORD-${Date.now()}`,
        namaLengkap: form.name,
        alamatEmail: form.email,
        totalBayar: total,
        status: "Perlu Dikirim",
        tanggal: new Date().toLocaleString("id-ID"),
      };

      // Ambil data lama agar tidak tertimpa
      const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]");
      const updatedOrders = [...existingOrders, newOrder];
      localStorage.setItem("orders", JSON.stringify(updatedOrders));

      alert("Pembayaran Berhasil! Terima kasih sudah berbelanja.");
      
      if (clearCart) clearCart();
      router.push("/"); 

    } catch (error) {
      alert("Terjadi kesalahan saat memproses pembayaran.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] p-8 flex justify-center font-sans text-slate-800">
      <div className="w-full max-w-7xl">
        
        {/* BUTTON BACK TO HOME */}
        <button 
          onClick={() => router.push("/")}
          className="mb-6 flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition-all group"
        >
          <div className="p-2 bg-white rounded-lg shadow-sm group-hover:bg-indigo-50">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>
          Kembali ke Beranda
        </button>

        {/* STRUKTUR FLEX UTAMA (Kembali ke md:flex-row) */}
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* LEFT: FORM PENGIRIMAN */}
          <div className="flex-[2] bg-white p-10 rounded-[30px] shadow-sm space-y-6 border border-slate-100">
            <h1 className="text-3xl font-extrabold mb-6">Detail Pengiriman</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Nama Lengkap</label>
                <input
                  type="text"
                  placeholder="Masukkan nama anda"
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Nomor HP</label>
                <input
                  type="text"
                  placeholder="0812xxxx"
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Alamat Email</label>
              <input
                type="email"
                placeholder="email@anda.com"
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Alamat Lengkap</label>
              <textarea
                placeholder="Jl. Nama Jalan, No. Rumah, Kecamatan, Kota"
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all min-h-[100px]"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>

            <div className="pt-8 border-t border-slate-100">
              <label className="text-xl font-bold mb-5 block">Metode Pembayaran</label>
              <div className="grid grid-cols-3 gap-4">
                {[{ id: 'transfer', label: 'Bank Transfer' }, { id: 'ewallet', label: 'E-Wallet' }, { id: 'cod', label: 'COD' }].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => { setPaymentMethod(m.id); setSelectedSubMethod(""); }}
                    className={`p-4 border-2 rounded-2xl font-bold transition-all ${
                      paymentMethod === m.id ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-slate-100 bg-slate-50 text-slate-400"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              {(paymentMethod === "transfer" || paymentMethod === "ewallet") && (
                <div className="mt-5 grid grid-cols-4 gap-3 p-5 bg-slate-50 rounded-2xl border border-slate-100 animate-in fade-in slide-in-from-top-2">
                  {(paymentMethod === "transfer" ? banks : wallets).map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setSelectedSubMethod(item)}
                      className={`p-3 border-2 rounded-xl text-sm font-bold transition-all ${
                        selectedSubMethod === item ? "border-indigo-600 bg-white text-indigo-600" : "border-transparent bg-white text-slate-400 shadow-sm"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

         {/* RIGHT: RINGKASAN */}
<div className="flex-1">
  <div className="bg-white p-8 rounded-[30px] shadow-sm sticky top-8 border border-slate-100">
    <h2 className="text-xl font-bold mb-6 border-b pb-4">Ringkasan Pesanan</h2>
    
    {/* LIST ITEM BUKU */}
    <div className="space-y-4 mb-6">
      {checkoutItems.map((item) => (
        <div key={item.id} className="flex gap-4 items-center">
          <img src={item.img} className="w-14 h-14 object-cover rounded-xl bg-slate-100" alt={item.title} />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm truncate">{item.title}</p>
            <p className="text-indigo-600 font-bold text-xs">Rp {item.price.toLocaleString("id-ID")}</p>
          </div>
        </div>
      ))}
    </div>

    {/* RINCIAN HARGA & METODE */}
    <div className="space-y-3 pt-4 border-t border-dashed">
      <div className="flex justify-between text-sm text-slate-500">
        <span>Subtotal</span>
        <span className="font-semibold text-slate-800">Rp {subtotal.toLocaleString("id-ID")}</span>
      </div>
      <div className="flex justify-between text-sm text-slate-500">
        <span>Ongkos Kirim</span>
        <span className="font-semibold text-slate-800">Rp {shipping.toLocaleString("id-ID")}</span>
      </div>
      <div className="flex justify-between text-red-500 font-bold bg-red-50 px-3 py-1 rounded-lg text-sm">
        <span>Diskon (5%)</span>
        <span>-Rp {discount.toLocaleString("id-ID")}</span>
      </div>

      {/* TAMPILAN METODE PEMBAYARAN DI RINGKASAN */}
      <div className="flex justify-between text-sm py-2 border-t border-slate-50 mt-2">
        <span className="text-slate-500">Metode Pembayaran</span>
        <span className="font-bold text-indigo-600">
          {paymentMethod ? (
            paymentMethod === "cod" 
              ? "COD (Bayar di Tempat)" 
              : `${paymentMethod.toUpperCase()} - ${selectedSubMethod || "..."}`
          ) : (
            <span className="text-slate-300 italic font-normal text-xs">Belum dipilih</span>
          )}
        </span>
      </div>

      <div className="flex justify-between font-extrabold text-2xl pt-4 border-t border-slate-100">
        <span>Total Bayar</span>
        <span className="text-indigo-600">Rp {total.toLocaleString("id-ID")}</span>
      </div>
    </div>

    <button 
      onClick={handlePayment}
      disabled={!isFormValid || isProcessing}
      className="mt-8 w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-indigo-100 transition-all active:scale-[0.98] flex justify-center items-center gap-2"
    >
      {isProcessing ? (
        <>
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          Memproses...
        </>
      ) : (
        "Bayar Sekarang"
      )}
    </button>
    
    {!isFormValid && (
       <p className="text-center text-[10px] text-red-400 mt-3 italic">* Mohon lengkapi data diri & pilih metode pembayaran</p>
    )}
  </div>
</div>

        </div>
      </div>
    </div>
  );
}