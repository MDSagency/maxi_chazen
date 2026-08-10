"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";
import { BRAND_IMAGES } from "@/lib/images";
import Container from "@/components/ui/Container";
import AnchorLink from "@/components/ui/AnchorLink";
import { isHomeAnchor, parseAnchorHref } from "@/lib/anchor";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/products", label: "Produits" },
  { href: "/#histoire", label: "Notre histoire" },
];

const linkClass =
  "relative text-[11px] uppercase tracking-[0.2em] text-muted transition-colors duration-500 hover:text-ink after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-brand-blue after:transition-all after:duration-500 hover:after:w-full";

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const reduced = usePrefersReducedMotion();

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

  function NavItem({
    href,
    label,
    className,
    onNavigate,
  }: {
    href: string;
    label: string;
    className: string;
    onNavigate?: () => void;
  }) {
    const isAnchor = parseAnchorHref(href) !== null && isHomeAnchor(href);

    if (isAnchor) {
      return (
        <AnchorLink href={href} className={className} onNavigate={onNavigate}>
          {label}
        </AnchorLink>
      );
    }

    return (
      <Link href={href} className={className} onClick={onNavigate}>
        {label}
      </Link>
    );
  }

  return (
    <>
      <motion.header
        initial={false}
        animate={{
          paddingTop: scrolled ? 0 : 0,
          boxShadow: scrolled
            ? "0 1px 0 rgba(17,17,17,0.06)"
            : "0 0 0 rgba(0,0,0,0)",
        }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-colors duration-700",
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
              width={320}
              height={120}
              className="h-14 w-auto max-w-[14rem] object-contain object-left sm:h-16 sm:max-w-[15rem] md:h-16 md:max-w-[16rem] lg:h-[4.5rem] lg:max-w-[18rem]"
              priority
              unoptimized
            />
          </Link>

          <nav
            className="hidden items-center gap-8 md:flex lg:gap-10"
            aria-label="Navigation principale"
          >
            {navLinks.map((link) => (
              <NavItem
                key={link.href}
                href={link.href}
                label={link.label}
                className={linkClass}
              />
            ))}
              <motion.div whileHover={reduced ? undefined : { scale: 1.02 }}>
              <a
                href="https://www.instagram.com/maxi.chazen/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center gap-3 px-4 text-[11px] uppercase tracking-[0.2em] bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#515BD4] text-white rounded-md shadow-sm transition-opacity duration-200 hover:opacity-95"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <rect x="2" y="2" width="20" height="20" rx="5" stroke="white" strokeWidth="1.2" />
                  <path d="M7.5 11.99a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0z" stroke="white" strokeWidth="1.2" />
                  <circle cx="17.5" cy="6.5" r="0.8" fill="white" />
                </svg>
                <span>Suivez @MaxiChazen</span>
              </a>
            </motion.div>
            <motion.div whileHover={reduced ? undefined : { scale: 1.02 }}>
              <Link
                href="/panier"
                className="inline-flex h-10 items-center gap-3 border border-line px-5 text-[11px] uppercase tracking-[0.2em] text-ink transition-colors duration-500 hover:border-brand-blue/40 hover:bg-paper"
              >
                Panier
                <AnimatePresence>
                  {cartCount > 0 ? (
                    <motion.span
                      key={cartCount}
                      initial={reduced ? false : { scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="min-w-[1.25rem] bg-brand-yellow px-1.5 py-0.5 text-center text-[9px] font-normal text-ink"
                    >
                      {cartCount}
                    </motion.span>
                  ) : null}
                </AnimatePresence>
              </Link>
            </motion.div>
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
      </motion.header>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            className="fixed inset-0 z-40 bg-white/98 backdrop-blur-md md:hidden"
          >
            <motion.nav
              initial={reduced ? false : { clipPath: "inset(0 0 100% 0)" }}
              animate={{ clipPath: "inset(0 0 0 0)" }}
              exit={{ clipPath: "inset(0 0 100% 0)" }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="flex h-full flex-col items-center justify-center gap-8 px-6"
              aria-label="Navigation mobile"
            >
              <motion.div
                initial={reduced ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                <Link href="/" onClick={() => setMenuOpen(false)} className="mb-2 block">
                  <Image
                    src={BRAND_IMAGES.logo}
                    alt="Maxi Chazen"
                    width={260}
                    height={84}
                    className="mx-auto h-16 w-auto object-contain"
                    unoptimized
                  />
                </Link>
              </motion.div>
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={reduced ? false : { opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.14 + index * 0.07,
                    duration: 0.55,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <NavItem
                    href={link.href}
                    label={link.label}
                    className="font-display text-3xl text-ink"
                    onNavigate={() => setMenuOpen(false)}
                  />
                </motion.div>
              ))}
              <motion.div
                initial={reduced ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.38, duration: 0.55 }}
              >
                <Link
                  href="/panier"
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex items-center gap-3 border border-ink px-8 py-3 text-[10px] uppercase tracking-[0.22em] text-ink transition-colors duration-500 hover:bg-paper"
                >
                  Panier {cartCount > 0 ? `· ${cartCount}` : ""}
                </Link>
              </motion.div>
            </motion.nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
