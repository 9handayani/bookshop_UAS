"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: any | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ AMBIL DATA LOGIN SAAT REFRESH
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") { // Tambahan validasi undefined
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Gagal parse data user:", e);
        localStorage.removeItem("user"); // Hapus jika data korup
      }
    }
    setLoading(false);
  }, []);

  // ✅ LOGIN (TERHUBUNG KE LARAVEL)
  const login = async (email: string, password: string) => {
    if (!email || !password) {
      throw new Error("Email dan password wajib diisi");
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Ini akan menangkap error 401 dari Laravel
        throw new Error(data.message || "Email atau password salah");
      }

      // Pastikan struktur data sesuai dengan return dari AuthController Laravel
      const userData = data.user;
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
    } catch (error: any) {
      // Menangani error jaringan (Connection Refused) atau error throw di atas
      throw new Error(error.message || "Gagal menghubungi server");
    }
  };

  // ✅ LOGOUT
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth harus digunakan di dalam AuthProvider");
  }
  return context;
}