"use client";

import { useState, useEffect, Suspense } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { FaGoogle, FaGithub, FaEye, FaEyeSlash } from "react-icons/fa";

function LoginContent() {
  const { login, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Redirect ke /checkout atau halaman tujuan sebelumnya
  const redirect = searchParams.get("redirect") || "/checkout";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Jika user sudah terdeteksi login, langsung pindahkan
  useEffect(() => {
    if (!authLoading && user) {
      router.replace(redirect);
    }
  }, [authLoading, user, redirect, router]);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-slate-500 font-medium animate-pulse">Memuat...</div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;

    try {
      setSubmitting(true);
      await login(email, password); // Memanggil API Laravel
    } catch (err: any) {
      // Menampilkan pesan error asli dari backend jika ada
      alert(err.message || "Email atau kata sandi salah");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f0f2f5] p-4">
      <div className="flex w-full max-w-[900px] bg-white rounded-[30px] shadow-2xl overflow-hidden min-h-[550px]">
        
        {/* SISI KIRI: FORM LOGIN */}
        <div className="flex-[1.2] p-12 flex flex-col justify-center">
          <h2 className="text-4xl font-extrabold mb-8 text-center text-slate-800">
            Masuk
          </h2>

          <div className="flex justify-center gap-4 mb-8">
            <button type="button" className="p-3 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors shadow-sm text-slate-600">
              <FaGoogle size={22} />
            </button>
            <button type="button" className="p-3 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors shadow-sm text-slate-600">
              <FaGithub size={22} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <input
              type="email"
              placeholder="Email"
              required
              spellCheck="false" 
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
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-xl font-bold shadow-lg shadow-indigo-100 transition-all active:scale-[0.95] disabled:opacity-70"
            >
              {submitting ? "Sedang Masuk..." : "Masuk"}
            </button>
          </form>
        </div>

        {/* SISI KANAN: PANEL REGISTER (PERBAIKAN CSS CONFLICT DI SINI) */}
        <div className="hidden md:flex flex-1 bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 text-white flex-col justify-center items-center p-12 text-center">
          <h2 className="text-4xl font-bold mb-6">Halo, Teman!</h2>
          <p className="text-indigo-50 leading-relaxed mb-10 text-lg">
            Daftarkan akun barumu dan mulai perjalananmu bersama kami!
          </p>
          <a
            href="/register"
            className="border-2 border-white/50 px-12 py-3 rounded-full font-semibold hover:bg-white hover:text-indigo-600 hover:border-white transition-all duration-300"
          >
            Daftar
          </a>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">Memuat...</div>
    }>
      <LoginContent />
    </Suspense>
  );
}