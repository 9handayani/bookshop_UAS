import { Metadata } from "next";
import BookDetailClient from "./BookDetailClient";

type Props = {
  params: { slug: string };
};

// 1. FUNGSI SEO (SERVER SIDE)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Gunakan cache default atau revalidate jika perlu
  const response = await fetch(`http://127.0.0.1:8000/api/books/details/${params.slug}`);
  const data = await response.json();
  const book = data.data || data;

  if (!book) {
    return { title: "Buku Tidak Ditemukan | Bookstore" };
  }

  const description = book.description?.substring(0, 160) || `Beli buku ${book.title} karya ${book.author} hanya di Bookstore.`;

  return {
    title: `${book.title} - ${book.author} | Bookstore`,
    description: description,
    openGraph: {
      title: book.title,
      description: description,
      url: `http://localhost:3000/book/${params.slug}`,
      siteName: "Bookstore",
      images: [{ url: book.image || "/placeholder-book.jpg" }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: book.title,
      description: description,
      images: [book.image || "/placeholder-book.jpg"],
    },
  };
}

// 2. RENDER HALAMAN + JSON-LD
export default async function Page({ params }: Props) {
  const response = await fetch(`http://127.0.0.1:8000/api/books/details/${params.slug}`);
  const data = await response.json();
  const book = data.data || data;

  if (!book) return <div className="p-20 text-center">Buku tidak ditemukan.</div>;

  // Hitung harga diskon untuk JSON-LD (agar Google menampilkan harga yang benar)
  const finalPrice = Math.floor(book.price - (book.price * (book.discount || 0)) / 100);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Book",
    "name": book.title,
    "image": book.image,
    "description": book.description,
    "author": {
      "@type": "Person",
      "name": book.author
    },
    "offers": {
      "@type": "Offer",
      "price": finalPrice, // Gunakan harga diskon
      "priceCurrency": "IDR",
      "availability": "https://schema.org/InStock",
      "url": `http://localhost:3000/book/${params.slug}`
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* TIPS: Jika ingin lebih cepat, kirim data 'book' sebagai props ke BookDetailClient
          Contoh: <BookDetailClient initialData={book} />
          Namun jika BookDetailClient sudah punya fetch sendiri, biarkan seperti ini.
      */}
      <BookDetailClient />
    </>
  );
}