"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [key, setKey] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulasi login admin sederhana
    if (key === "admin123") {
      localStorage.setItem("isAdmin", "true");
      router.push("/admin/dashboard");
    } else {
      alert("Admin Key Salah!");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
      <div className="bg-white p-10 rounded-[30px] shadow-2xl w-full max-w-md">
        <h1 className="text-2xl font-black text-slate-800 mb-2 text-center">Admin Panel</h1>
        <p className="text-slate-500 text-center mb-8 text-sm">Silakan masukkan kode akses admin</p>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            placeholder="Admin Security Key"
            className="w-full p-4 bg-slate-100 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none transition-all text-center font-bold tracking-widest"
            value={key}
            onChange={(e) => setKey(e.target.value)}
          />
          <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all">
            Masuk ke Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}