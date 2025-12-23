// src/components/Navbar.jsx
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

  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  const books = [
    { title: "Mashle 12", author: "Hajime Komoto", slug: "mashle-12" },
    { title: "Seporsi Mie Ayam Sebelum Mati", author: "Brian Khrisna", slug: "mie-ayam-sebelum-mati" },
    { title: "UUD 1945", author: "Tim Miracle - M&C", slug: "uud-1945" },
  ];

  const categories = ["Semua", "Novel", "Komik/Buku", "Self Improvement", "Pendidikan", "Musik", "Komputer"];

  const filteredBooks = books.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenCategory(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ============================================================
     PERBAIKAN DI SINI:
     Menyembunyikan Navbar di Login, Register, dan SEMUA rute Admin
     ============================================================ */
  if (
    pathname === "/login" || 
    pathname === "/register" || 
    pathname.startsWith("/admin") // Menghapus navbar dari seluruh dashboard admin
  ) {
    return null;
  }

  function handleSearchEnter(e) {
    if (e.key === "Enter") {
      router.push(`/search?q=${encodeURIComponent(search)}`);
      setShowResults(false);
    }
  }

  function handleCategoryClick(item) {
    if (item === "Semua") {
      router.push("/");
    } else {
      router.push(`/kategori/${encodeURIComponent(item.toLowerCase())}`);
    }
    setOpenCategory(false);
  }

  return (
    <nav className="w-full bg-[#E8F0FF] shadow-sm border-b border-blue-200 px-6 py-3 flex items-center justify-between sticky top-0 z-[2000] backdrop-blur-md">
      {/* LEFT */}
      <div className="flex items-center gap-6 relative" ref={dropdownRef}>
        <h1
          className="text-xl font-bold text-blue-700 cursor-pointer select-none"
          onClick={() => router.push("/")}
        >
          BookStore
        </h1>

        <div
          onClick={() => setOpenCategory((s) => !s)}
          className="px-4 py-2 bg-[#DFEAFF] hover:bg-[#D3E2FF] text-blue-700 font-medium rounded-xl cursor-pointer flex items-center gap-2 shadow-sm border border-blue-200 transition"
        >
          <span className="text-sm">Kategori</span>
          {openCategory ? <IoChevronUp /> : <IoChevronDown />}
        </div>

        {openCategory && (
          <div className="absolute top-14 left-0 bg-[#F7FAFF] shadow-xl border border-blue-100 rounded-xl p-2 w-56 z-[3000]">
            {categories.map((item) => (
              <div
                key={item}
                onClick={() => handleCategoryClick(item)}
                className="px-3 py-2 rounded-lg hover:bg-blue-50 cursor-pointer transition text-sm text-blue-800"
              >
                {item}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SEARCH */}
      <div className="flex-1 mx-8 relative" ref={searchRef}>
        <div className="bg-[#DFEAFF] flex items-center px-4 py-2 rounded-full shadow-sm border border-blue-200">
          <HiOutlineSearch className="text-blue-600" />
          <input
            type="text"
            placeholder="Cari buku..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowResults(true);
            }}
            onKeyDown={handleSearchEnter}
            className="bg-transparent outline-none ml-3 w-full text-sm text-blue-900 placeholder-blue-500"
          />
          <button
            onClick={() => {
              router.push(`/search?q=${encodeURIComponent(search)}`);
              setShowResults(false);
            }}
            className="ml-3 px-4 py-1 bg-[#FFD966] hover:bg-[#F7C948] text-blue-900 font-semibold rounded-full transition shadow-sm"
          >
            Cari
          </button>
        </div>

        {showResults && search && (
          <div className="absolute bg-white border border-blue-200 shadow-xl rounded-xl mt-2 w-full max-h-64 overflow-auto z-[3000]">
            {filteredBooks.length > 0 ? (
              filteredBooks.map((b, i) => (
                <div
                  key={i}
                  className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b last:border-none border-blue-100"
                  onClick={() => {
                    router.push(`/buku/${b.slug}`);
                    setShowResults(false);
                    setSearch("");
                  }}
                >
                  <p className="font-semibold text-blue-900">{b.title}</p>
                  <p className="text-sm text-blue-600">{b.author}</p>
                </div>
              ))
            ) : (
              <div className="px-4 py-3 text-blue-600 text-sm">Tidak ada hasil</div>
            )}
          </div>
        )}
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        <div
          onClick={() => router.push("/cart")}
          className="relative p-2 hover:bg-blue-100 rounded-full cursor-pointer transition"
        >
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
            <button
              onClick={logout}
              className="px-4 py-2 rounded-full border border-red-300 text-red-600 hover:bg-red-50 transition text-sm font-medium"
            >
              Keluar
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={() => router.push("/login")}
              className="px-4 py-2 rounded-full border border-blue-300 text-blue-700 hover:bg-blue-50 transition font-medium text-sm"
            >
              Masuk
            </button>
            <button
              onClick={() => router.push("/register")}
              className="px-5 py-2 rounded-full bg-[#5EA3FF] text-white hover:bg-[#3B82F6] transition font-semibold shadow-sm text-sm"
            >
              Daftar
            </button>
          </>
        )}
      </div>
    </nav>
  );
}