export type Book = {
  id: number;
  img: string;
  title: string;
  price: number;
  slug: string;
  category: string;
};

export const books: Book[] = [
  {
    id: 1,
    img: "/books/book1.jpg",
    title: "Mashle 12",
    price: 31500,
    slug: "mashle-12",
    category: "komik",
  },
  {
    id: 2,
    img: "/books/book2.jpg",
    title: "UUD 1945 untuk Pelajar dan Umum",
    price: 28000,
    slug: "uud-1945",
    category: "pendidikan",
  },
  {
    id: 3,
    img: "/books/book3.jpg",
    title: "Seporsi Mie Ayam Sebelum Mati",
    price: 58500,
    slug: "mie-ayam",
    category: "novel",
  },
  {
    id: 4,
    img: "/books/book4.jpg",
    title: "Panduan Optimalisasi AI untuk digital marketing",
    price: 51000,
    slug: "ai-digital-marketing",
    category: "komputer",
  },
  {
    id: 5,
    img: "/books/book5.jpg",
    title: "Piano Dasar",
    price: 38250,
    slug: "piano-dasar",
    category: "musik",
  },
  {
    id: 6,
    img: "/books/book6.jpeg",
    title: "Sandi nusantara 3",
    price: 25500,
    slug: "sandi-nusantara",
    category: "teknologi",
  },
  {
    id: 7,
    img: "/books/book7.jpeg",
    title: "mice cartoon - telekomunikasi mengubah peradaban",
    price: 50625,
    slug: "telekomunikasi-mengubah-peradaban",
    category: "komik",
  },
  {
    id: 8,
    img: "/books/book8.jpeg",
    title: "Pembunuhan di rumah decagon 1",
    price: 32000,
    slug: "pembunuhan-di-rumah-decagon-1",
    category: "novel",
  },
  {
    id: 9,
    img: "/books/book9.jpeg",
    title: "Muros",
    price: 47812,
    slug: "muros",
    category: "komik",
  },
  {
    id: 10,
    img: "/books/book10.jpeg",
    title: "Petualangan Kuro : Jurasik Aquatik",
    price: 416050,
    slug: "petualangan-kuro",
    category: "anak",
  },
];
