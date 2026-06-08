"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchProducts } from "@/lib/api/client";
import { resolveProductImage } from "@/lib/images";
import { useCart } from "@/hooks/useCart";
import type { Product } from "@/lib/types";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/cn";

function CartSummary({
  totalQuantity,
  cartTotal,
  onConfirm,
  className,
}: {
  totalQuantity: number;
  cartTotal: number;
  onConfirm: () => void;
  className?: string;
}) {
  return (
    <aside
      className={cn(
        "border border-line bg-paper p-8 lg:sticky lg:top-36",
        className,
      )}
    >
      <p className="eyebrow mb-6">Récapitulatif</p>

      <div className="space-y-4 border-b border-line pb-6">
        <div className="flex items-center justify-between text-sm font-light text-muted">
          <span>Articles</span>
          <span className="text-ink">{totalQuantity}</span>
        </div>
      </div>

      <div className="flex items-center justify-between border-b border-line py-6">
        <span className="text-[11px] uppercase tracking-[0.18em] text-ink">
          Total
        </span>
        <span className="font-display text-2xl text-ink">
          {cartTotal.toLocaleString("fr-FR")} DA
        </span>
      </div>

      <div className="mt-8 space-y-3">
        <Button size="lg" className="w-full" onClick={onConfirm}>
          Confirmer la commande
        </Button>
        <Button href="/products" variant="outline" size="lg" className="w-full">
          Continuer les achats
        </Button>
      </div>
    </aside>
  );
}

export default function PanierPage() {
  const router = useRouter();
  const { cart, setCart, isHydrated } = useCart();
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await fetchProducts();
        setProductsList(data);
        setProductsError(null);
      } catch {
        setProductsList([]);
        setProductsError("Impossible de charger les produits.");
      } finally {
        setLoading(false);
      }
    }

    void loadProducts();
  }, []);

  const increaseQuantity = (productId: string) => {
    setCart((current) =>
      current.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  };

  const decreaseQuantity = (productId: string) => {
    setCart((current) =>
      current
        .map((item) =>
          item.id === productId && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const deleteFromCart = (productId: string) => {
    setCart((current) => current.filter((item) => item.id !== productId));
  };

  const cartTotal = cart.reduce((sum, cartItem) => {
    const product = productsList.find((p) => p.id === cartItem.id);
    return sum + (product?.price || 0) * cartItem.quantity;
  }, 0);

  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleConfirmOrder = () => {
    if (cart.length === 0) {
      alert("Votre panier est vide");
      return;
    }
    router.push("/checkout");
  };

  if (!isHydrated || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center pt-36">
        <div className="h-8 w-8 animate-spin border border-line border-t-ink" />
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <section className="bg-surface pb-32 pt-36 md:pt-48">
        <Container className="flex min-h-[50vh] flex-col items-center justify-center text-center">
          <p className="eyebrow mb-5 text-brand-blue">Mon panier</p>
          <h1 className="font-display text-4xl text-ink md:text-5xl">
            Votre panier est vide
          </h1>
          <p className="mt-6 max-w-md text-[15px] font-light leading-[1.85] text-muted">
            Commencez vos achats pour ajouter des produits à votre sélection.
          </p>
          <Button href="/products" size="lg" className="mt-10">
            Découvrir la collection
          </Button>
        </Container>
      </section>
    );
  }

  const missingProductsCount = cart.filter(
    (item) => !productsList.some((product) => product.id === item.id),
  ).length;

  return (
    <section className="bg-surface pb-32 pt-36 md:pt-48">
      <Container>
        <div className="mb-14 flex flex-col gap-6 md:mb-20 md:flex-row md:items-end md:justify-between">
          <SectionHeader
            eyebrow="Mon panier"
            title={`Panier (${totalQuantity} article${totalQuantity > 1 ? "s" : ""})`}
            description="Vérifiez votre sélection avant de finaliser la commande."
            className="mb-0"
          />
          <Link
            href="/products"
            className="inline-flex h-11 items-center justify-center border border-ink/20 px-7 text-[10px] uppercase tracking-[0.2em] text-ink transition-colors duration-500 hover:border-ink/50"
          >
            Continuer les achats
          </Link>
        </div>

        {productsError ? (
          <p className="mb-6 text-sm text-rose-600">{productsError}</p>
        ) : null}
        {missingProductsCount > 0 ? (
          <p className="mb-6 text-sm text-rose-600">
            Certains produits du panier sont introuvables. Rechargez la page pour
            synchroniser.
          </p>
        ) : null}

        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-16">
          <div className="space-y-6">
            {cart.map((cartItem) => {
              const product = productsList.find((p) => p.id === cartItem.id);
              if (!product) return null;

              const subtotal = product.price * cartItem.quantity;
              const imageSrc = resolveProductImage(product);

              return (
                <article
                  key={product.id}
                  className="grid gap-6 border border-line bg-white p-6 md:grid-cols-[112px_minmax(0,1fr)_auto] md:items-center lg:grid-cols-[112px_minmax(0,1fr)_180px_140px]"
                >
                  <div className="relative aspect-square overflow-hidden bg-paper md:row-span-1">
                    <Image
                      src={imageSrc}
                      alt={product.name}
                      fill
                      sizes="112px"
                      className="object-cover object-center brightness-[1.03] contrast-[0.96] saturate-[0.88]"
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="eyebrow mb-2">{product.category}</p>
                    <h3 className="font-display text-xl text-ink md:text-2xl">
                      {product.name}
                    </h3>
                    <p className="mt-2 text-sm font-light text-muted">
                      {product.price.toLocaleString("fr-FR")} DA / unité
                    </p>
                    {!product.in_stock ? (
                      <p className="mt-2 text-[13px] text-rose-600">
                        Rupture de stock
                      </p>
                    ) : null}
                  </div>

                  <div className="flex flex-col gap-4 md:items-center">
                    <div className="inline-flex items-center border border-line">
                      <button
                        type="button"
                        className="flex h-10 w-10 items-center justify-center text-muted transition-colors duration-500 hover:text-ink"
                        onClick={() => decreaseQuantity(product.id)}
                        aria-label="Diminuer la quantité"
                      >
                        −
                      </button>
                      <span className="min-w-10 text-center text-sm text-ink">
                        {cartItem.quantity}
                      </span>
                      <button
                        type="button"
                        className="flex h-10 w-10 items-center justify-center text-muted transition-colors duration-500 hover:text-ink"
                        onClick={() => increaseQuantity(product.id)}
                        aria-label="Augmenter la quantité"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      className="text-[10px] uppercase tracking-[0.18em] text-muted transition-colors duration-500 hover:text-ink"
                      onClick={() => deleteFromCart(product.id)}
                    >
                      Supprimer
                    </button>
                  </div>

                  <div className="text-left md:text-right lg:col-start-4">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-muted-light">
                      Sous-total
                    </p>
                    <p className="mt-1 font-display text-xl text-ink">
                      {subtotal.toLocaleString("fr-FR")} DA
                    </p>
                  </div>
                </article>
              );
            })}
          </div>

          <CartSummary
            totalQuantity={totalQuantity}
            cartTotal={cartTotal}
            onConfirm={handleConfirmOrder}
            className="hidden lg:block"
          />
        </div>

        <div className="mt-10 space-y-3 border-t border-line pt-10 lg:hidden">
          <div className="mb-6 flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-[0.18em] text-ink">
              Total
            </span>
            <span className="font-display text-2xl text-ink">
              {cartTotal.toLocaleString("fr-FR")} DA
            </span>
          </div>
          <Button size="lg" className="w-full" onClick={handleConfirmOrder}>
            Confirmer la commande
          </Button>
          <Button href="/products" variant="outline" size="lg" className="w-full">
            Continuer les achats
          </Button>
        </div>
      </Container>
    </section>
  );
}
