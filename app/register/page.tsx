"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Konfirmasi kata sandi tidak cocok");
      return;
    }

    if (password.length < 8) {
      alert("Password minimal 8 karakter");
      return;
    }

    try {
      setLoading(true);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
          password_confirmation: confirmPassword, 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.errors ? Object.values(data.errors).flat().join(", ") : data.message;
        throw new Error(errorMsg || "Registrasi gagal");
      }

      await login(email, password);
      
      alert("Registrasi Berhasil!");
      router.push("/checkout"); 
    } catch (err: any) {
      alert(err.message || "Gagal menghubungi server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f0f2f5] p-4 font-sans">
      <div className="flex w-full max-w-[900px] bg-white rounded-[30px] shadow-2xl overflow-hidden min-h-[600px]">

        {/* ================= SISI KIRI: FORM REGISTER ================= */}
        <div className="flex-[1.2] p-10 md:p-14 flex flex-col justify-center">
          <h2 className="text-4xl font-extrabold mb-8 text-center text-slate-800">
            Daftar Akun
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Nama Lengkap"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-slate-200 p-4 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-800"
            />

            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-slate-200 p-4 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-800"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Kata Sandi"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-slate-200 p-4 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all pr-12 text-slate-800"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600"
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>

            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Konfirmasi Kata Sandi"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-slate-200 p-4 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all pr-12 text-slate-800"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600"
              >
                {showConfirm ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>

            {/* ✅ Bagian Note: Teks Lebih Tebal (font-semibold) & Kontras (text-slate-600) */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mt-1">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[12px] text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="text-indigo-600 font-black text-sm">✓</span>
                  <span className="font-semibold">Min. 8 karakter</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-indigo-600 font-black text-sm">✓</span>
                  <span className="font-semibold">Huruf besar & kecil</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-indigo-600 font-black text-sm">✓</span>
                  <span className="font-semibold">Angka & simbol</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-3 bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-xl font-bold shadow-lg shadow-indigo-100 transition-all active:scale-[0.98] disabled:opacity-70"
            >
              {loading ? "Sedang Mendaftar..." : "Daftar"}
            </button>
          </form>
        </div>

        {/* ================= SISI KANAN: PANEL LOGIN ================= */}
        <div className="hidden md:flex flex-1 bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 text-white flex-col justify-center items-center p-12 text-center">
          <h2 className="text-4xl font-bold mb-6">Sudah Punya Akun?</h2>
          <p className="text-indigo-50 leading-relaxed mb-10 text-lg">
            Masuk sekarang dan lanjutkan belanja favoritmu.
          </p>
          <button
            onClick={() => router.push("/login")}
            className="border-2 border-white/50 px-12 py-3 rounded-full font-semibold hover:bg-white hover:text-indigo-600 hover:border-white transition-all duration-300"
          >
            Masuk
          </button>
        </div>

      </div>
    </div>
  );
}