"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext"; 
import { useState, useMemo } from "react";

type SelectedState = {
  [key: number]: boolean;
};

export default function CartContent() {
  const { cart, removeFromCart, updateQty, setCheckoutItems } = useCart();
  const { user } = useAuth(); 
  const router = useRouter();
  const [selected, setSelected] = useState<SelectedState>({});

  const isAuthenticated = !!user; 

  /* ======================
      HELPER GAMBAR (FIXED)
  ====================== */
  const getImageUrl = (path: string) => {
    if (!path) return "/placeholder-book.jpg";
    if (path.startsWith('http')) return path;
    // Mengambil nama file saja untuk menghindari double folder 'books/books/'
    const fileName = path.split('/').pop(); 
    return `/books/${fileName}`;
  };

  const isAllSelected =
    cart.length > 0 && cart.every((item) => selected[item.id]);

  const toggleSelectAll = () => {
    const next: SelectedState = {};
    if (!isAllSelected) {
      cart.forEach((i) => (next[i.id] = true));
    }
    setSelected(next);
  };

  const selectedItems = useMemo(() => {
    return cart.filter((i) => selected[i.id]);
  }, [cart, selected]);

  const totalPrice = useMemo(() => {
    return selectedItems.reduce((t, i) => t + (i.price * (i.qty || 1)), 0);
  }, [selectedItems]);

  const discount = totalPrice * 0.05;
  const finalPrice = totalPrice - discount;

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      alert("Pilih minimal satu item terlebih dahulu!");
      return;
    }

    setCheckoutItems(selectedItems);

    if (!isAuthenticated) {
      alert("Silakan login terlebih dahulu untuk melanjutkan pembayaran.");
      router.push("/login?callbackUrl=/checkout");
    } else {
      router.push("/checkout");
    }
  };

  const handleDeleteSelected = () => {
    selectedItems.forEach((i) => removeFromCart(i.id));
    setSelected({});
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] p-6 text-slate-800 font-sans">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
        
        <div className="flex-[2] space-y-4">
          <button 
            onClick={() => router.push("/")}
            className="mb-2 flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition-all group"
          >
            <div className="p-2 bg-white rounded-lg shadow-sm group-hover:bg-indigo-50 border border-slate-100">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            Kembali ke Beranda
          </button>

          <div className="flex justify-between items-center bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                checked={isAllSelected}
                onChange={toggleSelectAll}
              />
              <span className="font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">
                Pilih Semua ({cart.length} Produk)
              </span>
            </label>

            {selectedItems.length > 0 && (
              <button
                onClick={handleDeleteSelected}
                className="text-red-500 text-sm font-bold hover:bg-red-50 px-4 py-2 rounded-lg transition-all"
              >
                Hapus Terpilih
              </button>
            )}
          </div>

          <div className="space-y-4">
            {cart.length === 0 ? (
              <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-slate-100">
                <p className="text-slate-400 font-medium">Keranjang kamu masih kosong.</p>
                <Link href="/" className="mt-4 inline-block text-indigo-600 font-bold hover:underline">Mulai Belanja</Link>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:border-indigo-200 transition-all group">
                  <div className="flex items-center gap-5">
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      checked={!!selected[item.id]}
                      onChange={() =>
                        setSelected({ ...selected, [item.id]: !selected[item.id] })
                      }
                    />
                    
                    {/* PERBAIKAN BAGIAN GAMBAR */}
                    <div className="w-24 h-32 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0 shadow-inner">
                      <img 
                        src={getImageUrl(item.img)} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                        alt={item.title} 
                        onError={(e) => { e.currentTarget.src = "/placeholder-book.jpg" }}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-800 text-lg truncate mb-1">{item.title}</h3>
                      <p className="text-indigo-600 font-extrabold text-xl mb-3">
                        Rp {(item.price * (item.qty || 1)).toLocaleString("id-ID")}
                      </p>

                      <div className="flex items-center gap-2 border border-slate-200 w-fit rounded-lg p-1">
                        <button 
                          onClick={() => updateQty(item.id, (item.qty || 1) - 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 rounded disabled:opacity-30 font-bold"
                          disabled={(item.qty || 1) <= 1}
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-bold text-slate-700">{item.qty || 1}</span>
                        <button 
                          onClick={() => updateQty(item.id, (item.qty || 1) + 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 rounded font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RINGKASAN BELANJA */}
        <div className="flex-1">
          <div className="bg-white p-8 rounded-[30px] shadow-sm sticky top-8 border border-slate-100">
            <h2 className="text-xl font-bold text-slate-800 mb-6 border-b pb-4">Ringkasan Belanja</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between text-slate-600">
                <span>Total Harga ({selectedItems.reduce((acc, curr) => acc + (curr.qty || 1), 0)} barang)</span>
                <span className="text-slate-800 font-semibold">Rp {totalPrice.toLocaleString("id-ID")}</span>
              </div>
              
              <div className="flex justify-between text-red-500 font-bold bg-red-50 px-3 py-2 rounded-xl text-sm">
                <span>Diskon Member (5%)</span>
                <span>- Rp {discount.toLocaleString("id-ID")}</span>
              </div>

              <div className="pt-4 border-t border-dashed border-slate-200 mt-4">
                <div className="flex justify-between items-end">
                  <span className="text-slate-800 font-bold">Total Bayar</span>
                  <span className="text-indigo-600 font-extrabold text-2xl">
                    Rp {finalPrice.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={selectedItems.length === 0}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white py-4 rounded-2xl mt-6 font-extrabold text-lg shadow-lg shadow-indigo-100 transition-all active:scale-[0.98]"
              >
                Checkout ({selectedItems.length})
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}