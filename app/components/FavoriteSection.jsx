"use client";

import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";

export default function FavoriteSection({ book }) {
  const router = useRouter();

  const handleFavorite = () => {
    const saved = JSON.parse(localStorage.getItem("favorites") || "[]");

    let updated;
    if (saved.includes(book.slug)) {
      updated = saved.filter((item) => item !== book.slug);
    } else {
      updated = [...saved, book.slug];
    }

    localStorage.setItem("favorites", JSON.stringify(updated));
    router.push("/favorites");
  };

  return (
    <button
      onClick={handleFavorite}
      className="flex items-center gap-1 text-gray-600 hover:text-black"
    >
      <Heart size={18} />
      <span>Favorit</span>
    </button>
  );
}
