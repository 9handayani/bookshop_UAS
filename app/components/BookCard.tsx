import Link from "next/link";

interface Book {
  img: string;
  title: string;
  author: string;
  price: number;
  discount: number;
  slug: string;
}

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  const finalPrice = book.price - (book.price * book.discount) / 100;

  return (
    <Link href={`/book/${book.slug}`} className="block">
      <div className="bg-white rounded-xl shadow-md p-4 flex flex-col h-full hover:shadow-lg hover:-translate-y-1 transition">
        
        {/* GAMBAR */}
        <img
          src={book.img}
          alt={book.title}
          className="w-full h-48 object-cover rounded-lg"
        />

        {/* JUDUL */}
        <p className="mt-3 font-semibold text-gray-900 text-sm leading-snug line-clamp-2">
          {book.title}
        </p>

        {/* AUTHOR */}
        <p className="text-xs text-gray-500 mt-1 line-clamp-1">
          {book.author}
        </p>

        {/* HARGA (selalu di bawah) */}
        <div className="mt-auto">
          <p className="text-base font-bold text-green-600">
            Rp {finalPrice.toLocaleString("id-ID")}
          </p>

          <p className="text-xs line-through text-gray-400">
            Rp {book.price.toLocaleString("id-ID")}
          </p>

          <span className="text-[11px] bg-red-500 text-white px-2 py-0.5 rounded inline-block mt-1">
            -{book.discount}%
          </span>
        </div>
      </div>
    </Link>
  );
}
