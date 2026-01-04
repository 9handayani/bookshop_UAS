import { Metadata } from "next";
import DetailProdukClient from "./DetailProdukClient";
import { notFound } from "next/navigation";

async function getBookData(slug: string) {
  try {
    const res = await fetch(`process.env.NEXT_PUBLIC_API_URL/api/books/${slug}`, {
      cache: 'no-store', // Mematikan cache agar data sinkron dengan DB
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!res.ok) return null;
    const result = await res.json();
    return result.data; 
  } catch (error) {
    console.error("Gagal mengambil data:", error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const book = await getBookData(params.slug);
  if (!book) return { title: "Produk Tidak Ditemukan" };
  return {
    title: `${book.title} - ${book.author} | BookStore.id`,
  };
}

export default async function Page({ params }: { params: { slug: string } }) {
  const book = await getBookData(params.slug);

  if (!book) {
    notFound();
  }

  return <DetailProdukClient initialBook={book} />;
}