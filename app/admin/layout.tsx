"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Jangan tampilkan sidebar jika di halaman login admin
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    const adminAuth = localStorage.getItem("isAdmin");
    if (!adminAuth && !isLoginPage) {
      router.replace("/admin/login");
    } else {
      setIsAuthorized(true);
    }
  }, [isLoginPage, router]);

  // Jika halaman login, tampilkan kontennya saja tanpa sidebar
  if (isLoginPage) return <>{children}</>;

  // Jika belum authorized, tampilkan loading/null agar tidak flash
  if (!isAuthorized) return <div className="bg-[#0f172a] min-h-screen" />;

  return (
    <div className="flex min-h-screen bg-white">
      {/* SIDEBAR */}
      <aside className="w-72 bg-[#0f172a] text-white hidden md:flex flex-col sticky top-0 h-screen">
        <div className="p-8">
          <h2 className="text-2xl font-black tracking-tighter italic">ADMIN PANEL</h2>
          <div className="h-1 w-12 bg-indigo-500 mt-1 rounded-full"></div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <AdminNavLink href="/admin/dashboard" active={pathname === "/admin/dashboard"}>
            Dashboard
          </AdminNavLink>
          <AdminNavLink href="/admin/products" active={pathname === "/admin/products"}>
            Kelola Produk
          </AdminNavLink>
          <AdminNavLink href="/admin/orders" active={pathname === "/admin/orders"}>
            Data Pembelian
          </AdminNavLink>
        </nav>

        <div className="p-6 border-t border-slate-800">
          <button 
            onClick={() => {
              localStorage.removeItem("isAdmin");
              router.push("/");
            }}
            className="w-full p-4 bg-red-500/10 text-red-400 rounded-2xl font-bold hover:bg-red-500 hover:text-white transition-all text-sm"
          >
            Kembali Ke User
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 min-h-screen overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}

// Komponen Helper untuk Navigasi Sidebar
function AdminNavLink({ href, children, active }: { href: string; children: React.ReactNode; active: boolean }) {
  return (
    <a 
      href={href}
      className={`flex items-center gap-3 p-4 rounded-2xl font-bold transition-all ${
        active 
        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
        : "text-slate-400 hover:bg-slate-800 hover:text-white"
      }`}
    >
      {children}
    </a>
  );
}