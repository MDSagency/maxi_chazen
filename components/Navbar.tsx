"use client";

import { useEffect, useState } from "react";

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    function updateCount(value?: number) {
      if (typeof value === "number") {
        setCartCount(value);
        return;
      }
      const stored = localStorage.getItem("maxi-cart");
      if (!stored) return setCartCount(0);
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const total = parsed.reduce(
            (sum, item) => sum + (item.quantity || 0),
            0,
          );
          setCartCount(total);
        }
      } catch {
        setCartCount(0);
      }
    }

    updateCount();

    const onStorage = (event: StorageEvent) => {
      if (event.key === "maxi-cart") {
        updateCount();
      }
    };

    const onCustom = (event: Event) => {
      const custom = event as CustomEvent<{ totalQuantity: number }>;
      if (custom?.detail?.totalQuantity !== undefined) {
        setTimeout(() => updateCount(custom.detail.totalQuantity), 0);
      }
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener("maxi-cart-updated", onCustom as EventListener);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(
        "maxi-cart-updated",
        onCustom as EventListener,
      );
    };
  }, []);

  return (
    <nav className="minimal-nav" aria-label="Navigation principale">
      <a href="/" className="minimal-nav-logo">
        <img
          src="https://res.cloudinary.com/drfntkkhe/image/upload/v1777151440/image-removebg-preview_uuol8c.png"
          alt="Maxi Chazen Logo"
          className="minimal-nav-logo-img"
        />
      </a>

      <div className="minimal-nav-links">
        <a href="/" className="minimal-nav-link">
          Accueil
        </a>
        <a href="/products" className="minimal-nav-link">
          Produits
        </a>

        <a href="/panier" className="minimal-nav-link">
          Le Panier ({cartCount})
        </a>
      </div>
    </nav>
  );
}
