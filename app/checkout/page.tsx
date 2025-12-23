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
    if (!loading && !user) {
      router.replace("/");
    }
  }, [user, loading, router]);

  if (loading || !user) return null;

  /* ======================
      CALCULATIONS (FIXED)
  ====================== */
  const subtotal = checkoutItems.reduce((t, i) => t + i.price, 0);
  const shipping = subtotal > 0 ? 15000 : 0; // Ongkir 0 jika keranjang kosong
  const discount = subtotal * 0.05;
  const total = subtotal + shipping - discount;

  const banks = ["BCA", "Mandiri", "BNI", "BRI"];
  const wallets = ["Gopay", "OVO", "Dana", "ShopeePay"];

  // Validasi tombol: Harus isi form, pilih bayar, DAN keranjang tidak boleh kosong
  const isFormValid = 
    form.name && form.phone && form.email && form.address && 
    paymentMethod && (paymentMethod === "cod" || selectedSubMethod) &&
    checkoutItems.length > 0;

  /* ======================
      FUNGSI PEMBAYARAN (FULL REPAIRED)
  ===================== */
  const handlePayment = async () => {
    if (checkoutItems.length === 0) {
      alert("Keranjang anda kosong! Silakan pilih buku dulu.");
      return;
    }

    setIsProcessing(true);
    
    try {
      const payload = {
        user_id: user.id, 
        customer_name: form.name,
        phone_number: form.phone, // Pastikan sesuai nama kolom di migration Laravel
        address: form.address,
        // Menggabungkan semua judul buku menjadi satu string
        book_title: checkoutItems.map(item => item.title).join(", "),
        total_amount: Math.round(total), // Dibulatkan agar divalidasi sebagai 'numeric' oleh Laravel
        payment_method: paymentMethod === "cod" 
          ? "COD" 
          : `${paymentMethod.toUpperCase()} (${selectedSubMethod})`,
      };

      // URL diperbaiki menjadi /api/orders (Jamak)
      const response = await fetch("http://127.0.0.1:8000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Pembayaran Berhasil! Pesanan Anda telah tercatat.");
        if (clearCart) clearCart();
        router.push("/"); 
      } else {
        // Menampilkan pesan error spesifik jika validasi 422 gagal
        console.error("Validation Errors:", result.errors);
        alert(`Gagal: ${result.message || "Periksa kembali data anda"}`);
      }

    } catch (error) {
      console.error("Error Checkout:", error);
      alert("Gagal terhubung ke server Laravel.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] p-8 flex justify-center font-sans text-slate-800">
      <div className="w-full max-w-7xl">
        
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

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* LEFT: FORM */}
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
                <div className="mt-5 grid grid-cols-4 gap-3 p-5 bg-slate-50 rounded-2xl border border-slate-100">
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

          {/* RIGHT: SUMMARY */}
          <div className="flex-1">
            <div className="bg-white p-8 rounded-[30px] shadow-sm sticky top-8 border border-slate-100">
              <h2 className="text-xl font-bold mb-6 border-b pb-4">Ringkasan Pesanan</h2>
              
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
                {checkoutItems.length > 0 ? (
                  checkoutItems.map((item) => (
                    <div key={item.id} className="flex gap-4 items-center">
                      <img src={item.img} className="w-14 h-14 object-cover rounded-xl bg-slate-100" alt={item.title} />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm truncate">{item.title}</p>
                        <p className="text-indigo-600 font-bold text-xs">Rp {item.price.toLocaleString("id-ID")}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-slate-400 text-sm py-4">Keranjang Kosong</p>
                )}
              </div>

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

                <div className="flex justify-between font-extrabold text-2xl pt-4 border-t border-slate-100">
                  <span>Total Bayar</span>
                  <span className="text-indigo-600">Rp {total.toLocaleString("id-ID")}</span>
                </div>
              </div>

              <button 
                onClick={handlePayment}
                disabled={!isFormValid || isProcessing}
                className="mt-8 w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white py-4 rounded-2xl font-bold text-lg shadow-lg transition-all flex justify-center items-center gap-2"
              >
                {isProcessing ? "Memproses..." : "Bayar Sekarang"}
              </button>
              
              {!isFormValid && checkoutItems.length > 0 && (
                  <p className="text-center text-[10px] text-red-400 mt-3 italic">* Lengkapi data diri & pembayaran</p>
              )}
              {checkoutItems.length === 0 && (
                  <p className="text-center text-[10px] text-red-500 mt-3 font-bold">SILAKAN TAMBAH BUKU KE KERANJANG TERLEBIH DAHULU</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}