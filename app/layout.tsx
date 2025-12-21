import "./globals.css";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/footer"; // ✅ TAMBAHAN

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="flex flex-col min-h-screen">
        <AuthProvider>   {/* ✅ PALING LUAR */}
          <CartProvider>
            <Navbar />   {/* ✅ Navbar di atas */}
            
            {/* Konten halaman */}
            <main className="flex-grow">
              {children}
            </main>

            {/* Footer */}
            <Footer />   {/* ✅ Footer di bawah */}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
