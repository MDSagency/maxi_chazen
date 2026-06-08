"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { fetchProduct, fetchProducts } from "@/lib/api/client";
import type { Product } from "@/lib/types";
import { useCart } from "@/hooks/useCart";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import ProductCard from "@/components/commerce/ProductCard";
import CartToast from "@/components/commerce/CartToast";
import FadeIn from "@/components/motion/FadeIn";
import ProductGallery from "@/components/commerce/ProductGallery";
import { getProductGallery } from "@/lib/product-images";

const trustPoints = [
  "Testé dermatologiquement",
  "Sans parabènes",
  "Formule douce dès la naissance",
  "Livraison en Algérie",
];

export default function ProductDetailPage() {
  const params = useParams();
  const productId = String(params.id || "");
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, successMessage } = useCart();

  useEffect(() => {
    async function load() {
      if (!productId) {
        setLoading(false);
        return;
      }

      const mapped = await fetchProduct(productId);
      setProduct(mapped);

      if (mapped) {
        const all = await fetchProducts();
        setRelated(
          all
            .filter(
              (p) =>
                p.id !== mapped.id &&
                p.category.trim() === mapped.category.trim(),
            )
            .slice(0, 4),
        );
      }
      setLoading(false);
    }
    void load();
  }, [productId]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center pt-36">
        <div className="h-8 w-8 animate-spin border border-line border-t-ink" />
      </div>
    );
  }

  if (!product) {
    return (
      <Container className="flex min-h-[60vh] flex-col items-center justify-center gap-6 pt-36 text-center">
        <h1 className="font-display text-3xl text-ink">Produit introuvable</h1>
        <p className="font-light text-muted">
          Ce produit n&apos;existe pas ou n&apos;est plus disponible.
        </p>
        <Button href="/products" variant="primary">
          Retour à la boutique
        </Button>
      </Container>
    );
  }

  const galleryImages = getProductGallery(product);

  return (
    <>
      <section className="bg-surface pb-24 pt-36 md:pb-32 md:pt-48">
        <Container>
          <nav
            className="mb-12 text-[11px] uppercase tracking-[0.18em] text-muted-light"
            aria-label="Fil d'Ariane"
          >
            <Link href="/" className="transition-colors hover:text-ink">
              Accueil
            </Link>
            <span className="mx-3">/</span>
            <Link href="/products" className="transition-colors hover:text-ink">
              Produits
            </Link>
            <span className="mx-3">/</span>
            <span className="text-ink">{product.name}</span>
          </nav>

          <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
            <FadeIn>
              <ProductGallery
                images={galleryImages}
                productName={product.name}
              />
            </FadeIn>

            <div className="lg:sticky lg:top-36 lg:self-start">
              <FadeIn delay={0.1}>
                <p className="eyebrow mb-4 text-brand-blue">{product.category}</p>
                <h1 className="font-display text-4xl leading-[1.08] text-ink md:text-5xl lg:text-[3.25rem]">
                  {product.name}
                </h1>
                <p className="mt-6 font-display text-3xl text-ink">
                  {product.price.toLocaleString("fr-FR")} DA
                </p>

                <p className="mt-8 text-[15px] font-light leading-[1.85] text-muted">
                  {product.shortDescription ||
                    product.description ||
                    "Un soin premium formulé pour la peau délicate de bébé."}
                </p>

                <ul className="mt-10 space-y-4 border-y border-line py-8">
                  {trustPoints.map((point) => (
                    <li
                      key={point}
                      className="flex items-baseline gap-4 text-sm font-light text-charcoal"
                    >
                      <span className="text-[10px] uppercase tracking-[0.2em] text-brand-blue">
                        —
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>

                <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                  <Button
                    size="lg"
                    disabled={!product.in_stock}
                    onClick={() => addToCart(product.id)}
                    className="flex-1"
                  >
                    {product.in_stock ? "Ajouter au panier" : "Rupture de stock"}
                  </Button>
                  <Button
                    href="/panier"
                    variant="outline"
                    size="lg"
                    className="flex-1"
                  >
                    Voir le panier
                  </Button>
                </div>

                {!product.in_stock ? (
                  <p className="mt-4 text-[13px] font-light text-muted">
                    Ce produit est temporairement indisponible.
                  </p>
                ) : null}
              </FadeIn>
            </div>
          </div>
        </Container>
      </section>

      {related.length > 0 ? (
        <section className="border-t border-line bg-paper py-24 md:py-32">
          <Container>
            <h2 className="mb-14 font-display text-3xl text-ink md:text-4xl">
              Vous aimerez aussi
            </h2>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-10">
              {related.map((item, index) => (
                <ProductCard
                  key={item.id}
                  product={item}
                  index={index}
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      <CartToast message={successMessage} />
    </>
  );
}
