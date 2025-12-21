"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface CartItem {
  id: number;
  title: string;
  price: number;
  img: string;
  qty: number; // ➜ DITAMBAHKAN
}

interface Book extends CartItem {}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "qty">) => void;
  removeFromCart: (id: number) => void;
  updateQty: (id: number, qty: number) => void;
  clearCart: () => void;

  checkoutItems: Book[];
  setCheckoutItems: (items: Book[]) => void;

  totalPrice: number; // ➜ DITAMBAHKAN
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [checkoutItems, setCheckoutItems] = useState<Book[]>([]);

  // ============================
  //  LOAD CART DARI LOCALSTORAGE
  // ============================
  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  // ============================
  //  SIMPAN CART KE LOCALSTORAGE
  // ============================
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // ============================
  //  ADD TO CART
  // ============================
  const addToCart = (item: Omit<CartItem, "qty">) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === item.id);

      if (existing) {
        // update qty kalau produk sudah ada
        return prev.map((p) =>
          p.id === item.id ? { ...p, qty: p.qty + 1 } : p
        );
      }

      // produk baru
      return [...prev, { ...item, qty: 1 }];
    });
  };

  // ============================
  //  REMOVE ITEM
  // ============================
  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // ============================
  //  UPDATE QTY
  // ============================
  const updateQty = (id: number, qty: number) => {
    if (qty <= 0) return; // tidak boleh minus

    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty } : item
      )
    );
  };

  // ============================
  //  CLEAR CART
  // ============================
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  // ============================
  //  HITUNG TOTAL HARGA
  // ============================
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        checkoutItems,
        setCheckoutItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
}
