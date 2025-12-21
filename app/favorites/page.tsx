"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { books, Book } from "../data/books";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Book[]>([]);

  useEffect(() => {
    const saved: string[] = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );

    const favBooks = books.filter((b) => saved.includes(b.slug));
    setFavorites(favBooks);
  }, []);

  return (
    <div className="relative max-w-5xl mx-auto p-6 pt-20">

      {/* Home > Favorit */}
      <nav className="fixed top-[84px] left-6 z-40 text-sm text-gray-600">
        <Link href="/" className="hover:text-blue-600">
          Home
        </Link>
        <span className="mx-2">{">"}</span>
        <span className="font-medium text-gray-900">Favorit</span>
      </nav>

      <h1 className="text-3xl font-bold mb-6">
        Daftar Favorit
      </h1>

      {favorites.length === 0 ? (
        <p className="text-gray-500">Belum ada buku favorit.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {favorites.map((book) => (
            <Link
              key={book.slug}
              href={`/book/${book.slug}`}
              className="bg-white rounded-xl shadow hover:shadow-lg p-3 border transition"
            >
              <img
                src={book.img}
                alt={book.title}
                className="w-full h-40 object-cover rounded-lg"
              />
              <p className="font-semibold text-sm mt-2 line-clamp-2">
                {book.title}
              </p>
              <p className="text-orange-600 font-bold mt-1">
                Rp {book.price.toLocaleString("id-ID")}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
