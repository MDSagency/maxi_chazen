"use client";

import { useCallback, useEffect, useState } from "react";
import type { CartItem } from "@/lib/types";

const CART_KEY = "maxi-cart";

function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  const stored = window.localStorage.getItem(CART_KEY);
  if (!stored) return [];
  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function dispatchCartUpdate(totalQuantity: number) {
  window.dispatchEvent(
    new CustomEvent("maxi-cart-updated", { detail: { totalQuantity } }),
  );
}

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    setCart(readCart());
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    dispatchCartUpdate(totalQuantity);
  }, [cart]);

  const addToCart = useCallback((productId: string) => {
    setCart((current) => {
      const existing = current.find((item) => item.id === productId);
      const nextCart = existing
        ? current.map((item) =>
            item.id === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          )
        : [...current, { id: productId, quantity: 1 }];

      const total = nextCart.reduce((sum, item) => sum + item.quantity, 0);
      dispatchCartUpdate(total);
      setSuccessMessage("Produit ajouté avec succès !");
      window.setTimeout(() => setSuccessMessage(""), 1800);
      return nextCart;
    });
  }, []);

  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  return { cart, setCart, addToCart, successMessage, totalQuantity };
}
