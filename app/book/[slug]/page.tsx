"use client";

import { useEffect,  } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCart } from "@/app/context/CartContext";
import FavoriteSection from "@/app/components/FavoriteSection";
import Link from "next/link";
import { useState } from "react";





const books = [
  {
    id: 1,
    img: "/books/book1.jpg",
    title: "Mashle 12",
    author: "Hajime Komoto",
    price: 45000,
    discount: 30,
    slug: "mashle-12",
    rating: 4.8,
    description: "Innocent Zero dan Doom, putra sulung dari lima bersaudara, mendadak muncul di tengah babak terakhir ujian seleksi divine visionary!! Mash berhadapan dengan Doom yang memiliki kekuatan dahsyat, tapi mendadak tubuhnya mengalami perubahan aneh yang misterius!? ‘Tongkat permulaan’ direnggut sehingga babak terakhir ujian Divine Visionary harus dijeda untuk sementara waktu, dan sementara itu ancaman berakhirnya nasib dunia di tangan Innocent Zero semakin dekat!! Mash, Lance, Dot, dan lainnya menjalani latihan intensif yang keras dengan cara masing-masing untuk memperoleh kekuatan baru demi menyongsong pertempuran terakhir mereka!!Mashle yang dirilis dalam bahasa Inggris dengan judul Mashle: Magic and Muscles, adalah sebuah seri manga asal Jepang yang ditulis dan diilustrasikan oleh Hajime Kōmoto. Manga ini dimuat berseri dalam majalah Weekly Shōnen Jump terbitan Shueisha sejak bulan Januari 2020, dan telah diterbitkan menjadi tiga belas volume tankōbon per bulan Oktober 2022.Manga ini mulai dimuat berseri dalam edisi ke-9 dari majalah Weekly Shōnen Jump yang diterbitkan oleh Shueisha pada tanggal 27 Januari 2020. Per tanggal 4 Oktober 2022, bab-bab tunggalnya telah dibundel dan diterbitkan menjadi tiga belas volume tankōbon oleh Shueisha. Manga ini dirilis secara digital dalam bahasa Inggris oleh Viz Media pada situs web Shonen Jump milik mereka serta pada platform Manga Plus milik Shueisha.Di antara jenis buku lainnya, komik memang disukai oleh semua kalangan mulai dari anak kecil hingga orang dewasa. Alasan komik lebih disukai oleh banyak orang karena disajikan dengan penuh dengan gambar dan cerita yang mengasyikan sehingga mampu menghilangkan rasa bosan di kala waktu senggang.Komik seringkali dijadikan sebagai koleksi dan diburu oleh penggemarnya karena serinya yang cukup terkenal dan kepopulerannya terus berlanjut sampai saat ini. Dalam memilih jenis komik, ada baiknya perhatikan terlebih dahulu ringkasan cerita komik di sampul bagian belakang sehingga sesuai dengan preferensi pribadi pembaca.",

    details: {
      Penerbit: "Hajime Komoto",
      "Tanggal Terbit": "18 Agu 2025",
      ISBN: "9786230072277",
      Halaman: "192",
      Bahasa: "Indonesia",
      Panjang: "18.0 cm",
      Lebar: "12.0 cm",
      Berat: "0.14 kg",
    },

    reviews: [
      { user: "Anonim", rating: 5, comment: "Bukunya bagus banget!" },
      { user: "Pembeli", rating: 4, comment: "Sesuai deskripsi, recommended." },
    ],
  },

  {
    id: 2,
    img: "/books/book2.jpg",
    title: "UUD 1945 untuk Pelajar dan Umum",
    author: "Tim Miracle - M&C",
    price: 40000,
    discount: 30,
    slug: "uud-1945",
    rating: 4.6,
    description: "UUD 1945 yang dilengkapi dengan lembaga negara, profil presiden serta wakil presiden hingga yang terkini, dan pahlawan nasionalBuku UUD 1945 & Amandemennya untuk Pelajar dan Umum adalah sumber referensi komprehensif yang menyajikan informasi mendalam tentang Undang-Undang Dasar 1945 (UUD 1945) beserta amandemennya. Buku ini dirancang khusus untuk pelajar dan masyarakat umum yang ingin memahami dasar-dasar hukum dan ketatanegaraan Indonesia.Sejarah dan perkembangan UUD 1945: Menjelaskan latar belakang pembentukan UUD 1945, proses amandemen, serta perubahan-perubahan penting yang terjadi sepanjang sejarah Indonesia.Penjelasan pasal-pasal UUD 1945: Memberikan pemahaman yang jelas dan terperinci tentang setiap pasal dalam UUD 1945, termasuk hak dan kewajiban warga negara, struktur pemerintahan, serta pembagian kekuasaan negara.Pancasila sebagai dasar negara: Menguraikan nilai-nilai Pancasila sebagai ideologi bangsa Indonesia dan bagaimana penerapannya dalam kehidupan berbangsa dan bernegara.Lembaga-lembaga negara: Menjelaskan fungsi dan peran lembaga-lembaga negara seperti MPR, DPR, Presiden, MA, MK, KY, dan BPK.Hak dan kewajiban warga negara: Menjelaskan hak-hak dasar warga negara seperti hak atas pendidikan, kesehatan, pekerjaan, serta kewajiban-kewajiban seperti membayar pajak dan mematuhi hukum",



    details: {
      Penerbit: "M&C",
      "Tanggal Terbit": "15 Jul 2024",
      ISBN: "9786230314360",
      Halaman: "176",
      Bahasa: "Indonesia",
      Panjang: "18.0 cm",
      Lebar: "11.o cm",
      Berat: "0.14 kg",
    },

    reviews: [{ user: "Dewi", rating: 5, comment: "Buku wajib untuk pelajar." }],
  },

  {
    id: 3,
    img: "/books/book3.jpg",
    title: "Seporsi Mie Ayam Sebelum Mati",
    author: "Brian Khrisna",
    price: 78000,
    discount: 25,
    slug: "mie-ayam",
    rating: 4.7,
    description: "Ale, seorang pria berusia 37 tahun memiliki tinggi badan 189 cm dan berat 138 kg. Badannya bongsor, berkulit hitam, dan memiliki masalah dengan bau badan. Sejak kecil, Ale hidup di lingkungan keluarga yang tidak mendukungnya. Ia tak memiliki teman dekat dan menjadi korban perundungan di sekolahnya.Ale didiagnosis psikiaternya mengalami depresi akut. Bukannya Ale tidak peduli untuk memperbaiki dirinya sendiri, ia peduli. Ale telah berusaha mengatasi masalah-masalah yang timbul dari dirinya agar ia diterima di lingkungan pertemanan. Namun usahanya tidak pernah berhasil. Bahkan keluarganya pun tidak mendukungnya saat Ale membutuhkan sandaran dan dukungan.Atas itu semua, Ale memutuskan untuk mati. Ia mempersiapkan kematiannya dengan baik. Agar ketika mati pun, Ale tidak banyak merepotkan orang. Dua puluh empat jam dari sekarang, ia akan menelan obat antidepresan yang dia punya sekaligus. Sebelum waktu itu tiba, Ale membersihkan apartemennya yang berantakan, makan makanan mahal yang tak pernah ia beli, pergi berkaraoke dan menyanyi sepuasnya hingga mabuk.Saat 24 jam itu tiba, Ale telah bersiap dengan kemeja hitam dan celana hitam, bak baju melayat ke pemakamannya sendiri. Ia kenakan topi kecurut ulang tahun dan meletuskan konfeti yang ia beli untuk dirinya sendiri.“Selamat ulang tahun yang terakhir, Ale.”Ale siap menenggak seluruh obat antidepresan yang ia punya. Saat ia memain-mainkan botolnya, Ale terdiam saat membaca anjuran di kemasan botol itu, dikonsumsi sesudah makan. Seketika perutnya berbunyi. Dan Ale pun memutuskan untuk makan dulu sebelum mengakhiri hidupnya. Setidaknya, itu akan menjadi satu-satunya keputusan yang bisa dia ambil atas kehendaknya sendiri. Setelah selama hidupnya ia tak pernah mampu melakukan hal-hal yang ia inginkan.Ale akan makan seporsi mie ayam sebelum mati..",

    details: {
      Penerbit: "Brian Khrisna",
      "Tanggal Terbit": "20 jan 2025",
      ISBN: "9786020531328",
      Halaman: "216",
      Bahasa: "Indonesia",
      Panjang: "20.0 cm",
      Lebar: "13.5 cm",
      Berat: "0.30 kg",
    },

    reviews: [
      { user: "Cika", rating: 5, comment: "Sangat menyentuh!" },
      { user: "Anonim", rating: 4, comment: "Cerita yang dalam." },
    ],
  },

  {
    id: 4,
    img: "/books/book4.jpg",
    title: "Panduan Optimalisasi AI untuk digital marketing",
    author: "Henry Manampiring",
    price: 60000,
    discount: 15,
    slug: "ai-digital-marketing",
    rating: 4.7,
    description: "Teknologi AI berkembang dengan amat pesat, dan ini adalah kabar bagus bagi Digital Marketer. Dengan memanfaatkan teknologi AI, para digital marketer bisa menyelesaikan berbagai pekerjaan di bidang pemasaran menggunakan berbagai teknologi digital dengan lebih cepat.Buku ini membahas tentang rahasia pemanfaatan teknologi AI untuk optimalisasi kebutuhan digital marketing dan konten website. Ada tiga AI yang digunakan dalam buku ini, dan ketiganya bisa saling membantu untuk menyelesaikan pekerjaan sehari-hari, yaitu: ChatGPT, Google Gemini, dan Microsoft CoPilot. Panduan di dalam buku ini dikemas secara komprehensif, sehingga bisa memberikan pemahaman yang mendalam tentang trik untuk menggunakan AI bagi digital marketer dan pengembang web.Dalam buku ini pembaca akan mengetahui cara mengoptimalkan dan memaksimalkan AI untuk kebutuhan digital marketing dan konten website, di mana pembaca akan tahu cara menggunakan Prompt AI dan melakukan Engineering Prompt AI untuk mengoptimalkan hasil pekerjaan. Pembaca juga akan dapat mengembangkan dan memodifikasi Prompt tersebut untuk kebutuhan yang berbeda. Semua panduannya disajikan langkah demi langkah dalam bahasa sederhana ",


    details: {
      Penerbit: "Henry Manampiring",
      "Tanggal Terbit": "10 Jun 2024",
      ISBN: "9786230058721",
      Halaman: "216",
      Bahasa: "Indonesia",
      Panjang: "21.0 cm",
      Lebar: "14.0 cm",
      Berat: "0.20 kg",
    },

    reviews: [
      { user: "niko", rating: 5, comment: "bukunya sangat bagus dan cocok ontuk pemula!" },
      { user: "Anonim", rating: 4, comment: "bukunya bagus." },
    ],
  },

   {
    id: 5,
    img: "/books/book5.jpg",
    title: "Piano Dasar",
    author: "Rendra",
    price: 45000,
    discount: 15,
    slug: "piano-dasar",
    rating: 4.7,
    description: "Bagi yang ingin memulai belajar piano, buku ini cocok untuk dijadikan panduan. Penulis memberikan penjelasan mengenai bagian-bagian piano; teknik dasar bermain piano seperti posisi tubuh, posisi jari, teknik dasar pedal, dan mengenal not balok.Buku ini juga dilengkapi dengan penjelasan sederhana tentang notasi musik, ritme, dan simbol-simbol penting yang sering muncul dalam lembaran musik. Penulis memberikan panduan langkah demi langkah yang mudah diikuti sehingga pembaca dapat mempelajari dasar-dasar bermain piano dengan cepat dan efektif, bahkan tanpa pengalaman sebelumnya.Tahun Terbit : Cetakan Pertama, Oktober 2024Pernahkah Anda terpikir betapa menariknya dunia yang terbuka lebar lewat lembaran buku? Membaca bukan hanya kegiatan rutin, tetapi juga petualangan tak terbatas ke dalam imajinasi dan pengetahuan. Membaca mengasah pikiran, membuka wawasan, dan memperkaya kosakata. Ini adalah pintu menuju dunia di luar kita yang tak terbatas. Tetapkan waktu khusus untuk membaca setiap hari.Dari membaca sebelum tidur hingga menyempatkan waktu di pagi hari, kebiasaan membaca dapat dibentuk dengan konsistensi. Pilih buku sesuai minat dan level literasi. Mulailah dengan buku yang sesuai dengan keinginan dan kemampuan membaca. Temukan tempat yang tenang dan nyaman untuk membaca. Lampu yang cukup, kursi yang nyaman, dan sedikit musik pelataran bisa menciptakan pengalaman membaca yang lebih baik. Bergabunglah dalam kelompok membaca atau forum literasi. Diskusikan buku yang Anda baca dan dapatkan rekomendasi dari sesama pembaca. Buat catatan atau jurnal tentang buku yang telah Anda baca.Tuliskan pemikiran, kesan, dan pelajaran yang Anda dapatkan. Libatkan keluarga dalam kegiatan membaca. Bacakan cerita untuk anak-anak atau ajak mereka membaca bersama. Ini menciptakan ikatan keluarga yang erat melalui kegiatan positif. Jangan ragu untuk menjelajahi genre baru. Terkadang, kejutan terbaik datang dari buku yang tidak pernah Anda bayangkan akan Anda nikmati. Manfaatkan teknologi dengan membaca buku digital atau bergabung dalam komunitas literasi online. Ini membuka peluang untuk terhubung dengan pembaca dari seluruh dunia.",

    details: {
      Penerbit: "Rendra",
      "Tanggal Terbit": "30 Okt 2024",
      ISBN: "9790902191272",
      Halaman: "66",
      Bahasa: "Indonesia",
      Panjang: "27.0 cm",
      Lebar: "21.0 cm",
      Berat: "0.17 kg",
    },

    reviews: [
      { user: "niko", rating: 5, comment: "bukunya sangat bagus dan cocok ontuk pemula!" },
      { user: "Anonim", rating: 4, comment: "bukunya bagus." },
    ],
  },

  {
    id: 6,
    img: "/books/book6.jpeg",
    title: "Sandi nusantara 3",
    author: "hokky situngkir",
    price: 30000,
    discount: 15,
    slug: "sandi-nusantara",
    rating: 4.7,
    description: "Ekspedisi yang dilakukan oleh ayah Sandi (Gendra) dan teman-temannya kini merambah ke tempat lain yang tak kalah menakjubkan. Mereka mendatangi situs bersejarah yang ada di Indonesia untuk menemukan kode-kode di dalamnya. Serpihan ingatan Sandi semakin terkumpul di tengah ekspedisi. Bagaimana dengan Pak Santoso? Apakah di volume ini akan terjawab siapa itu Pak Santoso dan bagaimana keterlibatannya dalam ekspedisi tersebut?Keunggulan Buku: Pembaca sudah kenal dengan sekuel sebelumnya, Sandi Nusantara 1 & 2. Nah, Sandi Nusantara 3 ini ditunggu banget dan bakal lebih seru!Kamu diajak jelajahi kota-kota budaya Nusantara lewat cerita yang asyik dan bikin nagih.Bukan cuma petualangan, tapi juga cara baru nikmatin perjalanan dengan perspektif yang beda.Pas banget buat remaja yang mau kenalan sama budaya Nusantara secara fun dan cerdas.Pernahkah Anda terpikir betapa menariknya dunia yang terbuka lebar lewat lembaran buku? Membaca bukan hanya kegiatan rutin, tetapi juga petualangan tak terbatas ke dalam imajinasi dan pengetahuan. Membaca mengasah pikiran, membuka wawasan, dan memperkaya kosakata. Ini adalah pintu menuju dunia di luar kita yang tak terbatas.Tetapkan waktu khusus untuk membaca setiap hari. Dari membaca sebelum tidur hingga menyempatkan waktu di pagi hari, kebiasaan membaca dapat dibentuk dengan konsistensi. Pilih buku sesuai minat dan level literasi. Mulailah dengan buku yang sesuai dengan keinginan dan kemampuan membaca. Temukan tempat yang tenang dan nyaman untuk membaca. Lampu yang cukup, kursi yang nyaman, dan sedikit musik pelataran bisa menciptakan pengalaman membaca yang lebih baik. Bergabunglah dalam kelompok membaca atau forum literasi. Diskusikan buku yang Anda baca dan dapatkan rekomendasi dari sesama pembaca. Buat catatan atau jurnal tentang buku yang telah Anda baca. Tuliskan pemikiran, kesan, dan pelajaran yang Anda dapatkan.Libatkan keluarga dalam kegiatan membaca. Bacakan cerita untuk anak-anak atau ajak mereka membaca bersama. Ini menciptakan ikatan keluarga yang erat melalui kegiatan positif. Jangan ragu untuk menjelajahi genre baru. Terkadang, kejutan terbaik datang dari buku yang tidak pernah Anda bayangkan akan Anda nikmati. Manfaatkan teknologi dengan membaca buku digital atau bergabung dalam komunitas literasi online. Ini membuka peluang untuk terhubung dengan pembaca dari seluruh dunia.",

    details: {
      Penerbit: "hokky situngkir",
      "Tanggal Terbit": "23 jul 2025",
      ISBN: "99786027829862",
      Halaman: "206",
      Bahasa: "Indonesia",
      Panjang: "18.0 cm",
      Lebar: "12.0 cm",
      Berat: "0.20 kg",
    },

    reviews: [
      { user: "niko", rating: 5, comment: "bukunya sangat bagus dan cocok ontuk pemula!" },
      { user: "Anonim", rating: 4, comment: "bukunya bagus." },
    ],
  },
  
  {
    id: 7,
    img: "/books/book7.jpeg",
    title: "mice cartoon - telekomunikasi mengubah peradaban",
    author: " Muhammad mice misrad",
    price: 67500,
    discount: 25,
    slug: "telekomunikasi-mengubah-peradaban",
    rating: 5.7,
    description: "Jujur, awalnya enggak ada niatan untuk membuat komik yang khusus ngomongin telekomunikasi. Semua berawal dari kegabutan ‘ngoprek-ngoprek’ karya yang pernah saya buat selama ini. Ternyata, dengan sadar saya pernah membuat komik tentang perilaku masyarakat kita menggunakan alat telekomunikasi, dari telepon rumah, telepon koin, telepon kartu, pager, wartel, warnet, hingga handphone. Semoga kumpulan komik ini bisa menjadi catatan sejarah perjalanan telekomunikasi. Penginnya bisa menjadi bahan nostalgia bagi generasi tua, syukur-syukur juga bisa jadi pengetahuan dan informasi bagi generasi sekarang.” (Mice Cartoon)",

    details: {
      Penerbit: "Muhammad mice misrad",
      "Tanggal Terbit": "19 Mei 2025",
      ISBN: "9786231343857",
      Halaman: "152",
      Bahasa: "Indonesia",
      Panjang: "21.0 cm",
      Lebar: "14.0 cm",
      Berat: "0.20 kg",
    },

    reviews: [
      { user: "Bara", rating: 5, comment: "bukunya sangat bagus dan cocok ontuk pemula!" },
      { user: "ratih", rating: 4, comment: "bukunya bagus." },
    ],
  },

  {
    id: 8,
    img: "/books/book8.jpeg",
    title: "Pembunuhan di rumah decagon 1",
    author: " yukito ayatsuji/hiro kiyohara",
    price: 20000,
    discount: 20,
    slug: "pembunuhan-di-rumah-decagon-1",
    rating: 5.7,
    description: "Tujuh anggota klub novel misteri Universitas Kxx mengunjungi sebuah rumah unik berbentuk dekagon di sebuah pulau terpencil. Arsitek rumah ini, Seiji Nakamura, tewas terbakar secara misterius setengah tahun lalu. Di lain pihak, Kawaminami yang ada di pulau utama mendapat sepucuk surat dari Seiji Nakamura yang harusnya sudah mati. Di tengah penelusuran misteri tersebut, Kawaminami bertemu Shimada.Pernahkah Anda terpikir betapa menariknya dunia yang terbuka lebar lewat lembaran buku? Membaca bukan hanya kegiatan rutin, tetapi juga petualangan tak terbatas ke dalam imajinasi dan pengetahuan. Membaca mengasah pikiran, membuka wawasan, dan memperkaya kosakata. Ini adalah pintu menuju dunia di luar kita yang tak terbatas.Tetapkan waktu khusus untuk membaca setiap hari. Dari membaca sebelum tidur hingga menyempatkan waktu di pagi hari, kebiasaan membaca dapat dibentuk dengan konsistensi. Pilih buku sesuai minat dan level literasi. Mulailah dengan buku yang sesuai dengan keinginan dan kemampuan membaca. Temukan tempat yang tenang dan nyaman untuk membaca. Lampu yang cukup, kursi yang nyaman, dan sedikit musik pelataran bisa menciptakan pengalaman membaca yang lebih baik. Bergabunglah dalam kelompok membaca atau forum literasi. Diskusikan buku yang Anda baca dan dapatkan rekomendasi dari sesama pembaca. Buat catatan atau jurnal tentang buku yang telah Anda baca. Tuliskan pemikiran, kesan, dan pelajaran yang Anda dapatkan.Libatkan keluarga dalam kegiatan membaca. Bacakan cerita untuk anak-anak atau ajak mereka membaca bersama. Ini menciptakan ikatan keluarga yang erat melalui kegiatan positif. Jangan ragu untuk menjelajahi genre baru. Terkadang, kejutan terbaik datang dari buku yang tidak pernah Anda bayangkan akan Anda nikmati. Manfaatkan teknologi dengan membaca buku digital atau bergabung dalam komunitas literasi online. Ini membuka peluang untuk terhubung dengan pembaca dari seluruh dunia.",

    details: {
      Penerbit: "yukito ayatsuji/hiro kiyohara",
      "Tanggal Terbit": "18 Agu 2025",
      ISBN: "9786230071485",
      Halaman: "200",
      Bahasa: "Indonesia",
      Panjang: "18.0 cm",
      Lebar: "13.0 cm",
      Berat: "0.15 kg",
    },

    reviews: [
      { user: "Bara", rating: 5, comment: "bukunya sangat bagus dan cocok ontuk pemula!" },
      { user: "ratih", rating: 4, comment: "bukunya bagus." },
    ],
  },

  {
    id: 9,
    img: "/books/book9.jpeg",
    title: "Muros",
    author: "Surya Putra",
    price:  63750,
    discount: 25,
    slug: "Muros",
    rating: 5.7,
    description: "Ini kisah tentang cowok ganteng yang kegantengannya hanya bisa dilihat dengan mata batin. Muros selalu memiliki cara untuk menghadapi segala bentuk ejekan. Karena dia memiliki sahabat dan keluarga yang selalu membuatnya bahagia. Banyak yang mengira Muros bukan anak kandung, karena kedua orang tuanya memiliki paras yang tampan dan cantik. Padahal yang sebenarnya muka boros itu adalah fase alami dari gen Papah Muros. Jadi wajah tua Muros bisa berubah jika mengikuti ritual turun temurun keluarga Papahnya.Bagaimanakah ritual itu? Apakah Muros berhasil menjalankannya? Semua terjawab di komik iniPernahkah Anda terpikir betapa menariknya dunia yang terbuka lebar lewat lembaran buku? Membaca bukan hanya kegiatan rutin, tetapi juga petualangan tak terbatas ke dalam imajinasi dan pengetahuan. Membaca mengasah pikiran, membuka wawasan, dan memperkaya kosakata. Ini adalah pintu menuju dunia di luar kita yang tak terbatas. Tetapkan waktu khusus untuk membaca setiap hari. Dari membaca sebelum tidur hingga menyempatkan waktu di pagi hari, kebiasaan membaca dapat dibentuk dengan konsistensi. Pilih buku sesuai minat dan level literasi. Mulailah dengan buku yang sesuai dengan keinginan dan kemampuan membaca. Temukan tempat yang tenang dan nyaman untuk membaca. Lampu yang cukup, kursi yang nyaman, dan sedikit musik pelataran bisa menciptakan pengalaman membaca yang lebih baik. Buat catatan atau jurnal tentang buku yang telah Anda baca. Tuliskan pemikiran, kesan, dan pelajaran yang Anda dapatkan.",

    details: {
      Penerbit: "Surya Putra",
      "Tanggal Terbit": "28 Agu 2025",
      ISBN: "9786238956180",
      Halaman: "148",
      Bahasa: "Indonesia",
      Panjang: "20.5 cm",
      Lebar: "14.5 cm",
      Berat: "0.20 kg",
    },

    reviews: [
      { user: "Bara", rating: 5, comment: "bukunya sangat bagus dan cocok ontuk pemula!" },
      { user: "ratih", rating: 4, comment: "bukunya bagus." },
    ],
  },

  {
  id: 10,
  img: "/books/book10.jpeg",
  title: "Petualangan Kuro : Jurasik Aquatik",
  author: "Jester",
  price: 49000,
  discount: 15,
  slug: "petualangan-kuro-jurasik-aquatik",
  rating: 5.7,
  description:
    "Di laut nan jauh, hiduplah bajak laut bernama Kuro, bersama dengan krunya dan seorang nelayan bernama Sailor. Suatu hari saat kapal Kuro sedang berlabuh di pantar, Sailor ingin pergi memancing ikan di tengah laut, jadi dia meminta izin ke Kuro dan pergi saat petang. Tapi hingga keesokan harinya Sailor tidak kunjung pulang dan sekoci yang Sailor pakai ditemukan mengapung di tengah laut. Kuro dan teman-temannya memulai sebuah perjalanan seru ke dunia bawah laut yang penuh misteri.",
  
  details: {
    Penerbit: "Jester",
    "Tanggal Terbit": "12 Jan 2025",
    ISBN: "9781234567890",
    Halaman: "160",
    Bahasa: "Indonesia",
    Panjang: "20.0 cm",
    Lebar: "13.0 cm",
    Berat: "0.18 kg",
  },

  reviews: [
    { user: "Bara", rating: 5, comment: "Cerita anak-anak yang seru!" },
    { user: "Sinta", rating: 4, comment: "Bagus untuk dibaca bersama anak." },
  ],
},


];

export default function BookDetail() {
  const { slug } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [showShare, setShowShare] = useState(false);
   const [expanded, setExpanded] = useState(false);

  

  const book = books.find((b) => b.slug === slug);

  // new review form state
  const [newReview, setNewReview] = useState({
    user: "",
    rating: 5,
    comment: "",
  });

  // reviews state — initialize empty, then set in useEffect when book exists
  const [reviews, setReviews] = useState<any[]>([]);

  // load reviews from localStorage (if any) or from book.reviews when book becomes available
  useEffect(() => {
    if (!book) return;

    try {
      const key = `reviews-${book.id}`;
      const saved = typeof window !== "undefined" ? localStorage.getItem(key) : null;
      if (saved) {
        setReviews(JSON.parse(saved));
      } else if (book.reviews) {
        setReviews(book.reviews);
      } else {
        setReviews([]);
      }
    } catch (err) {
      // fallback to book.reviews
      setReviews(book.reviews || []);
    }
  }, [book]);

  if (!book) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-2xl font-bold">Buku tidak ditemukan</h1>
      </div>
    );
  }

  const finalPrice = book.price - (book.price * book.discount) / 100;

  const handleAddToCart = () => {
    addToCart({
      id: book.id,
      title: book.title,
      price: finalPrice,
      img: book.img,
    });
    router.push("/cart");
  };

  // add review and persist to localStorage
  const handleAddReview = () => {
    if (!newReview.user.trim() || !newReview.comment.trim()) {
      alert("Nama dan komentar wajib diisi.");
      return;
    }

    const updated = [newReview, ...reviews];
    setReviews(updated);

    try {
      localStorage.setItem(`reviews-${book.id}`, JSON.stringify(updated));
    } catch (err) {
      // ignore localStorage errors
    }

    setNewReview({ user: "", rating: 5, comment: "" });
  };

  return (
    <div className="min-h-screen bg-[#F6F7F9] px-6 py-10 text-gray-900">      
<div className="relative z-10 max-w-5xl mx-auto mb-6">
  <button 
    onClick={() => router.push("/")}
    className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition-all group text-sm"
  >
    {/* Ikon kotak putih yang konsisten dengan halaman lain */}
    <div className="p-2 bg-white rounded-lg shadow-sm group-hover:bg-indigo-50 border border-slate-100 transition-colors">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    </div>
    
    <span>Kembali ke Beranda</span>
    <span className="text-slate-300 mx-1">/</span>
    <span className="text-slate-800">Deskripsi</span>
  </button>
</div>


      {/* CARD UTAMA */}
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-lg flex gap-10">
        {/* GAMBAR */}
        <div className="min-w-[300px]">
          <img
            src={book.img}
            alt={book.title}
            className="w-[300px] h-[430px] object-cover rounded-xl shadow-md"
          />
        </div>

        {/* DETAIL */}
        <div className="flex-1 flex flex-col">
          <h1 className="text-3xl font-bold">{book.title}</h1>
          <p className="text-gray-600 text-lg mb-4">oleh {book.author}</p>

          {/* RATING */}
          <div className="flex items-center gap-2 mb-4">
            <div className="text-yellow-400 text-xl">
              {"★".repeat(Math.floor(book.rating))}
              {"☆".repeat(5 - Math.floor(book.rating))}
            </div>
            <p className="text-sm text-gray-700">({book.rating} / 5)</p>
          </div>

          {/* HARGA */}
          <div className="flex items-center gap-3 mb-6">
            <p className="text-4xl font-bold text-red-500">
              Rp{finalPrice.toLocaleString("id-ID")}
            </p>

            <div className="flex flex-col">
              <span className="line-through text-gray-400 text-lg">
                Rp{book.price.toLocaleString("id-ID")}
              </span>
              <span className="text-sm bg-red-500 text-white px-3 py-1 rounded-lg w-fit">
                -{book.discount}%
              </span>
            </div>
          </div>

       {/* FAVORIT + SHARE */}
<div className="flex items-center gap-6 mb-6">
  <FavoriteSection book={book} />

  <div className="relative flex items-center">
    <button
      onClick={() => setShowShare(!showShare)}
      className="flex items-center gap-1 text-gray-600 hover:text-black"
    >
      🔗 Bagikan
    </button>

    {showShare && (
      <div className="absolute top-full left-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
        <button
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            alert("Link berhasil disalin!");
            setShowShare(false);
          }}
          className="w-full text-left px-4 py-2 hover:bg-gray-100"
        >
          📋 Salin Link
        </button>

        <a
  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
    `Lihat buku ini:\n\n${window.location.href}`
  )}`}
  target="_blank"
  rel="noopener noreferrer"
  className="block px-4 py-2 hover:bg-gray-100"
>
  🟢 WhatsApp
</a>

        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            window.location.href
          )}`}
          target="_blank"
          className="block px-4 py-2 hover:bg-gray-100"
        >
          🔵 Facebook
        </a>
      </div>
    )}
  </div>
</div>


          {/* ONGKIR */}
          <div className="bg-[#F1F5F9] border border-gray-300 p-4 rounded-xl mb-6">
            <p className="font-semibold text-green-600 mb-1">Bebas Ongkir, Rp0.</p>
            <p className="text-sm text-gray-600">
              Pilih toko terdekat dan opsi pengiriman "Ambil di Toko" saat checkout.
            </p>
          </div>

          {/* VOUCHER */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-3">Voucher</h2>
            <div className="bg-white border rounded-xl shadow-sm p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">Voucher Potongan Ongkir</p>
                <p className="text-gray-700">Diskon Rp10.000</p>
              </div>

             <img src="/banner/book4.jpeg" className="w-20 h-20 object-contain" />

            </div>
          </div>

          {/* ADD TO CART */}
          <button
            onClick={handleAddToCart}
            className="w-full mt-auto bg-[#FFD12F] text-black font-bold py-3 rounded-xl hover:bg-yellow-400"
          >
            + Keranjang
          </button>
        </div>
      </div>

      {/* DESKRIPSI */}
<div className="max-w-5xl mx-auto mt-10 bg-white p-6 rounded-xl shadow-sm border">
  <h2 className="text-xl font-bold mb-3">Deskripsi</h2>

  {/* STATE DAN LOGIKA */}
  {(() => {
    const [expanded, setExpanded] = useState(false);
    const maxLength = 300; // jumlah karakter awal

    const text = book.description;
    const isLong = text.length > maxLength;

    return (
      <div>
        <p
          className="text-gray-800 leading-relaxed"
          style={{ textAlign: "justify" }}
        >
          {expanded ? text : text.substring(0, maxLength) + (isLong ? "..." : "")}
        </p>

        {/* TOMBOL TOGGLE */}
        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-3 text-blue-600 font-semibold hover:underline"
          >
            {expanded ? "Sembunyikan" : "Baca Selengkapnya"}
          </button>
        )}
      </div>
    );
  })()}
</div>


      {/* DETAIL BUKU */}
      <div className="max-w-5xl mx-auto mt-8 bg-white p-6 rounded-xl shadow-sm border">
        <h2 className="text-xl font-bold mb-5">Detail Buku</h2>

        <div className="grid grid-cols-2 gap-y-6 text-gray-900">
          {Object.entries(book.details).map(([label, value]) => (
            <div key={label}>
              <p className="text-sm text-gray-500">{label}</p>
              <p className="font-medium">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ULASAN */}
      <div className="max-w-5xl mx-auto mt-8 bg-white p-6 rounded-xl shadow-sm border mb-10">
        <h2 className="text-xl font-bold mb-4">Ulasan Pembeli</h2>

        {/* LIST ULASAN */}
        <div className="space-y-4">
          {reviews.length === 0 && <p className="text-gray-500">Belum ada ulasan.</p>}

          {reviews.map((rev, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-xl border">
              <p className="font-semibold">{rev.user}</p>
              <p className="text-yellow-400 text-sm">
                {"★".repeat(rev.rating)}{"☆".repeat(5 - rev.rating)}
              </p>
              <p className="text-gray-700 mt-1">{rev.comment}</p>
            </div>
          ))}
        </div>

        {/* FORM TAMBAH ULASAN */}
        <div className="mt-8 pt-6 border-t">
          <h3 className="text-lg font-bold mb-3">Tulis Ulasan</h3>

          <input
            type="text"
            placeholder="Nama Anda"
            className="w-full border rounded-lg p-3 mb-3"
            value={newReview.user}
            onChange={(e) => setNewReview({ ...newReview, user: e.target.value })}
          />

          <select
            className="w-full border rounded-lg p-3 mb-3"
            value={newReview.rating}
            onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
          >
            <option value={5}>⭐ 5 - Sangat Bagus</option>
            <option value={4}>⭐ 4 - Bagus</option>
            <option value={3}>⭐ 3 - Biasa</option>
            <option value={2}>⭐ 2 - Kurang</option>
            <option value={1}>⭐ 1 - Buruk</option>
          </select>

          <textarea
            placeholder="Tulis komentar..."
            className="w-full border rounded-lg p-3 mb-3 h-28"
            value={newReview.comment}
            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
          />

          <button
            onClick={handleAddReview}
            className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800"
          >
            Kirim Ulasan
          </button>
        </div>
      </div>
    </div>
  );
}
