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

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      const payload = {
        user_id: user.id, 
        customer_name: form.name,
        phone_number: form.phone,
        address: form.address,
        book_title: checkoutItems.map(item => `${item.title} (${item.qty}x)`).join(", "),
        total_amount: Math.round(total),
        payment_method: paymentMethod === "cod" 
          ? "COD" 
          : `${paymentMethod.toUpperCase()} (${selectedSubMethod})`,
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Pesanan Berhasil Dibuat!");
        clearCart(); 
        router.push("/"); 
      } else {
        const result = await response.json();
        alert(`Gagal: ${result.message || "Terjadi kesalahan"}`);
      }
    } catch (error) {
      alert("Gagal terhubung ke server Laravel.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] p-8 flex justify-center font-sans text-slate-800">
      <div className="w-full max-w-7xl">
        
        {/* Tombol Kembali dengan Ikon Sesuai Desain Kamu */}
        <button 
          onClick={() => router.push("/cart")}
          className="mb-6 flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition-all group"
        >
          <div className="p-2 bg-white rounded-lg shadow-sm group-hover:bg-indigo-50 border border-slate-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </div>
          Kembali ke Keranjang
        </button>

        <div className="flex flex-col md:flex-row gap-8">
          {/* FORM DATA PENGIRIMAN */}
          <div className="flex-[2] bg-white p-10 rounded-[30px] shadow-sm space-y-6 border border-slate-100">
            <h1 className="text-3xl font-extrabold mb-6">Detail Pengiriman</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Nama Lengkap</label>
                <input type="text" placeholder="Nama Lengkap" className="w-full p-4 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Nomor HP</label>
                <input type="text" placeholder="Nomor HP" className="w-full p-4 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Alamat Email</label>
              <input type="email" placeholder="Email" className="w-full p-4 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Alamat Lengkap</label>
              <textarea placeholder="Alamat Lengkap" className="w-full p-4 bg-slate-50 border rounded-xl min-h-[100px] outline-none focus:ring-2 focus:ring-indigo-500" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>

            <div className="pt-8 border-t border-slate-100">
              <p className="font-bold mb-4">Metode Pembayaran</p>
              <div className="grid grid-cols-3 gap-4">
                {['transfer', 'ewallet', 'cod'].map((m) => (
                  <button key={m} onClick={() => { setPaymentMethod(m); setSelectedSubMethod(""); }} className={`p-4 border-2 rounded-2xl font-bold transition-all ${paymentMethod === m ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-slate-100 text-slate-400"}`}>
                    {m === 'transfer' ? 'Transfer' : m === 'ewallet' ? 'E-Wallet' : 'COD'}
                  </button>
                ))}
              </div>

              {(paymentMethod === "transfer" || paymentMethod === "ewallet") && (
                <div className="mt-5 grid grid-cols-4 gap-3 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                  {(paymentMethod === "transfer" ? banks : wallets).map((bank) => (
                    <button key={bank} onClick={() => setSelectedSubMethod(bank)} className={`p-3 border-2 rounded-xl text-sm font-bold ${selectedSubMethod === bank ? "border-indigo-600 bg-white text-indigo-600" : "bg-white text-slate-400"}`}>
                      {bank}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RINGKASAN PESANAN */}
          <div className="flex-1">
            <div className="bg-white p-8 rounded-[30px] shadow-sm sticky top-8 border border-slate-100">
              <h2 className="text-xl font-bold mb-6 border-b pb-4">Pesanan Anda</h2>
              
              <div className="space-y-4 mb-6">
                {checkoutItems.map((item) => {
                  const fileName = item.img ? item.img.split('/').pop() : "";
                  const imageUrl = fileName ? `/books/${fileName}` : "/placeholder-book.jpg";

                  return (
                    <div key={item.id} className="flex gap-4 items-center">
                      <img 
                        src={imageUrl} 
                        className="w-14 h-14 object-cover rounded-xl bg-slate-100 border" 
                        alt={item.title} 
                        onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder-book.jpg"; }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm truncate">{item.title}</p>
                        <p className="text-indigo-600 font-bold text-xs">{item.qty}x - Rp {item.price.toLocaleString("id-ID")}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-3 pt-4 border-t border-dashed text-sm">
                <div className="flex justify-between"><span>Subtotal</span><span className="font-bold">Rp {subtotal.toLocaleString("id-ID")}</span></div>
                <div className="flex justify-between"><span>Ongkir</span><span className="font-bold">Rp {shipping.toLocaleString("id-ID")}</span></div>
                <div className="flex justify-between text-red-500 font-bold bg-red-50 px-2 py-1 rounded-md"><span>Diskon (5%)</span><span>-Rp {discount.toLocaleString("id-ID")}</span></div>
                <div className="flex justify-between font-extrabold text-2xl pt-4 border-t border-slate-100 text-indigo-600">
                  <span>Total</span>
                  <span>Rp {total.toLocaleString("id-ID")}</span>
                </div>
              </div>

              <button 
                onClick={handlePayment}
                disabled={!isFormValid || isProcessing}
                className="mt-8 w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white py-4 rounded-2xl font-bold text-lg shadow-lg transition-all"
              >
                {isProcessing ? "Memproses..." : "Bayar Sekarang"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}