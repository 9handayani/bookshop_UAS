"use client";

import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t mt-10">
      <div
        className="
          max-w-7xl mx-auto px-6 py-12
          grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8
          text-sm text-gray-700
        "
      >
        {/* Logo & Deskripsi */}
        <div>
          <h2 className="text-lg font-semibold mb-3 text-indigo-600">
            BookStore
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Toko buku online sederhana dengan desain UI berbeda.
          </p>
        </div>

        {/* Produk */}
        <div>
          <h3 className="font-semibold mb-3">Produk</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-indigo-600 transition-colors">Buku Terbaru</a></li>
            <li><a href="#" className="hover:text-indigo-600 transition-colors">Buku Best Seller</a></li>
            <li><a href="#" className="hover:text-indigo-600 transition-colors">E-Book</a></li>
            <li><a href="#" className="hover:text-indigo-600 transition-colors">Promo</a></li>
          </ul>
        </div>

        {/* Informasi */}
        <div>
          <h3 className="font-semibold mb-3">Informasi</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-indigo-600 transition-colors">Tentang Kami</a></li>
            <li><a href="#" className="hover:text-indigo-600 transition-colors">Syarat & Ketentuan</a></li>
            <li><a href="#" className="hover:text-indigo-600 transition-colors">Kebijakan Privasi</a></li>
            <li><a href="#" className="hover:text-indigo-600 transition-colors">Hubungi Kami</a></li>
          </ul>
        </div>

        {/* Aplikasi - Perbaikan Bagian Ini */}
        <div>
          <h3 className="font-semibold mb-3">Aplikasi Seluler</h3>
          <div className="flex flex-col gap-3">
            {/* Google Play */}
            <a href="#" className="hover:opacity-80 transition-opacity">
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                alt="Google Play"
                width={135}
                height={40}
                className="object-contain"
              />
            </a>
            {/* App Store */}
            <a href="#" className="hover:opacity-80 transition-opacity">
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                alt="App Store"
                width={135}
                height={40}
                className="object-contain"
              />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t py-6 text-center text-xs text-gray-500">
        © 2025 Toko Buku Online. All rights reserved.
      </div>
    </footer>
  );
}