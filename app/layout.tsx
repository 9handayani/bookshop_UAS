import "./globals.css";
import { Metadata } from "next"; // ✅ Tambahkan import Metadata
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/footer";

// ✅ CONFIG SEO GLOBAL
export const metadata: Metadata = {
  title: {
    default: "Bookstore - Toko Buku Online Terlengkap",
    template: "%s | Bookstore" // Ini akan membuat judul halaman otomatis seperti "Login | Bookstore"
  },
  description: "Beli buku online lebih mudah, murah, dan lengkap. Temukan koleksi komik, buku pendidikan, hingga musik terbaru.",
  keywords: ["toko buku", "beli buku online", "buku murah", "komik", "pendidikan", "toko buku indonesia"],
  authors: [{ name: "Bookstore Team" }],
  metadataBase: new URL("http://localhost:3000"), // Ganti dengan domain asli saat online nanti
  openGraph: {
    title: "Bookstore - Toko Buku Online Terlengkap",
    description: "Koleksi buku terbaik dengan harga terjangkau dan pengiriman cepat.",
    url: "http://localhost:3000",
    siteName: "Bookstore",
    images: [
      {
        url: "/og-image.jpg", // Pastikan file ini ada di folder public untuk preview link
        width: 1200,
        height: 630,
        alt: "Bookstore Banner",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bookstore - Toko Buku Online",
    description: "Temukan buku impianmu di sini.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: "/favicon.ico", // Pastikan favicon ada di folder public
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="flex flex-col min-h-screen">
        <AuthProvider>
          <CartProvider>
            <Navbar />
            
            <main className="flex-grow">
              {children}
            </main>

            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}