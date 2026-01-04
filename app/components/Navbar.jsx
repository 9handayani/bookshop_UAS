"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { HiOutlineSearch, HiOutlineShoppingCart } from "react-icons/hi";
import { IoChevronUp, IoChevronDown } from "react-icons/io5";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { cart } = useCart();
  const { user, logout } = useAuth();

  const [openCategory, setOpenCategory] = useState(false);
  const [search, setSearch] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [suggestions, setSuggestions] = useState([]); // State untuk hasil pencarian real-time

  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  const categories = ["Semua", "Novel", "Komik", "Self Improvement", "Pendidikan", "Musik", "Komputer"];

  // 1. Fetch data pencarian real-time dari API (bukan data statis)
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (search.length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books?q=${search}`);
        const result = await res.json();
        const data = result.data?.data || result.data || result;
        setSuggestions(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Gagal fetch suggestions:", err);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300); // Debounce agar tidak spam API
    return () => clearTimeout(timeoutId);
  }, [search]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpenCategory(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowResults(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (pathname === "/login" || pathname === "/register" || pathname.startsWith("/admin")) return null;

  function handleSearchEnter(e) {
    if (e.key === "Enter" && search) {
      router.push(`/search?q=${encodeURIComponent(search)}`);
      setShowResults(false);
    }
  }

  // 2. PERBAIKAN: Arahkan kategori ke query param di Page Utama
  function handleCategoryClick(item) {
    if (item === "Semua") {
      router.push("/");
    } else {
      // Sesuai dengan page.tsx yang mengambil searchParams.get("category")
      router.push(`/?category=${encodeURIComponent(item.toLowerCase())}`);
    }
    setOpenCategory(false);
  }

  return (
    <nav className="w-full bg-[#E8F0FF] shadow-sm border-b border-blue-200 px-6 py-3 flex items-center justify-between sticky top-0 z-[2000] backdrop-blur-md">
      {/* LEFT */}
      <div className="flex items-center gap-6 relative" ref={dropdownRef}>
        <h1 className="text-xl font-bold text-blue-700 cursor-pointer select-none" onClick={() => router.push("/")}>
          BookStore.id
        </h1>
        <div onClick={() => setOpenCategory((s) => !s)} className="px-4 py-2 bg-[#DFEAFF] hover:bg-[#D3E2FF] text-blue-700 font-medium rounded-xl cursor-pointer flex items-center gap-2 border border-blue-200 transition shadow-sm">
          <span className="text-sm">Kategori</span>
          {openCategory ? <IoChevronUp /> : <IoChevronDown />}
        </div>

        {openCategory && (
          <div className="absolute top-14 left-0 bg-[#F7FAFF] shadow-xl border border-blue-100 rounded-xl p-2 w-56 z-[3000]">
            {categories.map((item) => (
              <div key={item} onClick={() => handleCategoryClick(item)} className="px-3 py-2 rounded-lg hover:bg-blue-50 cursor-pointer transition text-sm text-blue-800">
                {item}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SEARCH */}
      <div className="flex-1 mx-8 relative" ref={searchRef}>
        <div className="bg-[#DFEAFF] flex items-center px-4 py-2 rounded-full border border-blue-200 shadow-sm">
          <HiOutlineSearch className="text-blue-600" />
          <input
            type="text"
            placeholder="Cari judul buku atau penulis..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowResults(true);
            }}
            onKeyDown={handleSearchEnter}
            className="bg-transparent outline-none ml-3 w-full text-sm text-blue-900 placeholder-blue-500"
          />
          <button onClick={() => router.push(`/search?q=${search}`)} className="ml-3 px-4 py-1 bg-[#FFD966] hover:bg-[#F7C948] text-blue-900 font-semibold rounded-full transition shadow-sm">
            Cari
          </button>
        </div>

        {showResults && search && (
          <div className="absolute bg-white border border-blue-200 shadow-xl rounded-xl mt-2 w-full max-h-80 overflow-auto z-[3000]">
            {suggestions.length > 0 ? (
              suggestions.map((b, i) => (
                <div
                  key={i}
                  className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b last:border-none border-blue-100"
                  onClick={() => {
                    // 3. PERBAIKAN: Arahkan ke /produk/ bukan /buku/
                    router.push(`/produk/${b.slug}`);
                    setShowResults(false);
                    setSearch("");
                  }}
                >
                  <p className="font-semibold text-blue-900">{b.title}</p>
                  <p className="text-xs text-blue-600">{b.author}</p>
                </div>
              ))
            ) : (
              <div className="px-4 py-3 text-blue-600 text-sm">Buku tidak ditemukan...</div>
            )}
          </div>
        )}
      </div>

      {/* RIGHT (Keranjang & User) */}
      <div className="flex items-center gap-4">
        <div onClick={() => router.push("/cart")} className="relative p-2 hover:bg-blue-100 rounded-full cursor-pointer transition">
          <HiOutlineShoppingCart className="text-2xl text-blue-700" />
          {cart?.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
              {cart.length}
            </span>
          )}
        </div>

        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-blue-700">Halo, {user.name}</span>
            <button onClick={logout} className="px-4 py-2 rounded-full border border-red-300 text-red-600 hover:bg-red-50 transition text-sm font-medium">Keluar</button>
          </div>
        ) : (
          <div className="flex gap-2">
            <button onClick={() => router.push("/login")} className="px-4 py-2 rounded-full border border-blue-300 text-blue-700 hover:bg-blue-50 transition font-medium text-sm">Masuk</button>
            <button onClick={() => router.push("/register")} className="px-5 py-2 rounded-full bg-[#5EA3FF] text-white hover:bg-[#3B82F6] transition font-semibold shadow-sm text-sm">Daftar</button>
          </div>
        )}
      </div>
    </nav>
  );
}