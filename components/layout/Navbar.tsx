"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";
import { BRAND_IMAGES } from "@/lib/images";
import Container from "@/components/ui/Container";

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/products", label: "Produits" },
  { href: "/#histoire", label: "Notre histoire" },
];

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
          setCartCount(
            parsed.reduce((sum, item) => sum + (item.quantity || 0), 0),
          );
        }
      } catch {
        setCartCount(0);
      }
    }

    updateCount();

    const onStorage = (event: StorageEvent) => {
      if (event.key === "maxi-cart") updateCount();
    };
    const onCustom = (event: Event) => {
      const custom = event as CustomEvent<{ totalQuantity: number }>;
      if (custom?.detail?.totalQuantity !== undefined) {
        setTimeout(() => updateCount(custom.detail.totalQuantity), 0);
      }
    };

    const onScroll = () => setScrolled(window.scrollY > 24);

    window.addEventListener("storage", onStorage);
    window.addEventListener("maxi-cart-updated", onCustom as EventListener);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(
        "maxi-cart-updated",
        onCustom as EventListener,
      );
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-700",
          scrolled
            ? "border-b border-line bg-white/95 backdrop-blur-md"
            : "bg-white/80 backdrop-blur-sm",
        )}
      >
        <Container className="flex h-[4.75rem] items-center justify-between gap-6 sm:h-20 md:h-[5.5rem]">
          <Link
            href="/"
            className="relative z-50 flex shrink-0 items-center py-1"
            aria-label="Maxi Chazen — Accueil"
          >
            <Image
              src={BRAND_IMAGES.logo}
              alt="Maxi Chazen"
              width={240}
              height={80}
              className="h-11 w-auto max-w-[11rem] object-contain object-left sm:h-12 sm:max-w-[12.5rem] md:h-14 md:max-w-[14rem] lg:h-[3.75rem] lg:max-w-[15.5rem]"
              priority
            />
          </Link>

          <nav
            className="hidden items-center gap-8 lg:gap-10 md:flex"
            aria-label="Navigation principale"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[11px] uppercase tracking-[0.2em] text-muted transition-colors duration-500 hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/panier"
              className="inline-flex h-10 items-center gap-3 border border-line px-5 text-[11px] uppercase tracking-[0.2em] text-ink transition-colors duration-500 hover:border-ink/30"
            >
              Panier
              {cartCount > 0 ? (
                <span className="min-w-[1.25rem] bg-brand-yellow px-1.5 py-0.5 text-center text-[9px] font-normal text-ink">
                  {cartCount}
                </span>
              ) : null}
            </Link>
          </nav>

          <button
            type="button"
            className="relative z-50 flex h-10 w-10 shrink-0 flex-col items-center justify-center gap-1.5 md:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={menuOpen}
          >
            <span
              className={cn(
                "h-px w-5 bg-ink transition-all duration-500",
                menuOpen && "translate-y-[5px] rotate-45",
              )}
            />
            <span
              className={cn(
                "h-px w-5 bg-ink transition-all duration-500",
                menuOpen && "opacity-0",
              )}
            />
            <span
              className={cn(
                "h-px w-5 bg-ink transition-all duration-500",
                menuOpen && "-translate-y-[5px] -rotate-45",
              )}
            />
          </button>
        </Container>
      </header>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-40 bg-white md:hidden"
          >
            <nav
              className="flex h-full flex-col items-center justify-center gap-10 px-6"
              aria-label="Navigation mobile"
            >
              <Link href="/" onClick={() => setMenuOpen(false)} className="mb-4">
                <Image
                  src={BRAND_IMAGES.logo}
                  alt="Maxi Chazen"
                  width={200}
                  height={64}
                  className="h-14 w-auto object-contain"
                />
              </Link>
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + index * 0.05, duration: 0.6 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="font-display text-3xl text-ink"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <Link
                  href="/panier"
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex items-center gap-3 border border-ink px-8 py-3 text-[10px] uppercase tracking-[0.22em] text-ink"
                >
                  Panier {cartCount > 0 ? `· ${cartCount}` : ""}
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
