"use client";

import Image from "next/image";
import { useMemo, useState, useTransition } from "react";
import {
  createProduct,
  deleteProduct,
  toggleProductPublished,
  updateProduct,
  deleteProductImage,
  reorderProductImages,
} from "@/lib/actions/products";
import EmptyState from "@/components/admin/EmptyState";

type Category = { id: string; name: string };
type ProductImage = {
  id: string;
  url: string;
  sortOrder: number;
  isPrimary: boolean;
};
type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string | null;
  price: { toString(): string } | number;
  stockQuantity: number;
  featured: boolean;
  published: boolean;
  categoryId: string | null;
  category: { name: string } | null;
  images: ProductImage[];
};

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  shortDescription: "",
  price: "",
  stockQuantity: "0",
  categoryId: "",
  featured: false,
  published: false,
};

export default function ProductsManager({
  initialProducts,
  categories,
}: {
  initialProducts: Product[];
  categories: Category[];
}) {
  const [products, setProducts] = useState(initialProducts);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        !search.trim() ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.slug.toLowerCase().includes(search.toLowerCase());
      const matchesFilter =
        filter === "all" ||
        (filter === "published" && p.published) ||
        (filter === "draft" && !p.published);
      return matchesSearch && matchesFilter;
    });
  }, [products, search, filter]);

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  }

  function startEdit(product: Product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      slug: product.slug,
      description: product.description,
      shortDescription: product.shortDescription ?? "",
      price: String(Number(product.price)),
      stockQuantity: String(product.stockQuantity),
      categoryId: product.categoryId ?? "",
      featured: product.featured,
      published: product.published,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function uploadImage(productId: string, file: File) {
    const body = new FormData();
    body.append("file", file);
    body.append("folder", "products");
    body.append("productId", productId);

    const response = await fetch("/api/upload", { method: "POST", body });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error ?? "Upload échoué.");
    return data;
  }

  function onSubmit() {
    setError("");
    setMessage("");

    const payload = {
      name: form.name,
      slug: form.slug || undefined,
      description: form.description,
      shortDescription: form.shortDescription || undefined,
      price: Number(form.price),
      stockQuantity: Number(form.stockQuantity),
      categoryId: form.categoryId || null,
      featured: form.featured,
      published: form.published,
    };

    startTransition(async () => {
      try {
        if (editingId) {
          const updated = await updateProduct(editingId, payload);
          setProducts((current) =>
            current.map((p) =>
              p.id === editingId
                ? { ...p, ...updated, category: categories.find((c) => c.id === updated.categoryId) ? { name: categories.find((c) => c.id === updated.categoryId)!.name } : null }
                : p,
            ),
          );
          setMessage("Produit mis à jour.");
        } else {
          const created = await createProduct(payload);
          setProducts((current) => [
            { ...created, category: categories.find((c) => c.id === created.categoryId) ? { name: categories.find((c) => c.id === created.categoryId)!.name } : null, images: [] },
            ...current,
          ]);
          setEditingId(created.id);
          setForm({
            name: created.name,
            slug: created.slug,
            description: created.description,
            shortDescription: created.shortDescription ?? "",
            price: String(Number(created.price)),
            stockQuantity: String(created.stockQuantity),
            categoryId: created.categoryId ?? "",
            featured: created.featured,
            published: created.published,
          });
          setMessage("Produit créé. Ajoutez des images ci-dessous.");
          return;
        }
        resetForm();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erreur.");
      }
    });
  }

  const activeProduct = editingId
    ? products.find((p) => p.id === editingId)
    : null;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[10px] uppercase tracking-[0.28em] text-muted">Catalogue</p>
        <h2 className="mt-2 font-display text-4xl text-ink">Produits</h2>
      </div>

      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <section className="rounded-xl border border-line bg-white p-6">
          <h3 className="font-display text-2xl">
            {editingId ? "Modifier" : "Nouveau produit"}
          </h3>
          <div className="mt-4 space-y-3">
            {Object.entries({
              name: "Nom",
              slug: "Slug (optionnel)",
              shortDescription: "Description courte",
              price: "Prix (DA)",
              stockQuantity: "Stock",
            }).map(([key, label]) => (
              <label key={key} className="block text-sm">
                <span className="mb-1 block text-muted">{label}</span>
                <input
                  value={form[key as keyof typeof form] as string}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, [key]: e.target.value }))
                  }
                  className="w-full rounded-lg border border-line px-3 py-2"
                />
              </label>
            ))}
            <label className="block text-sm">
              <span className="mb-1 block text-muted">Catégorie</span>
              <select
                value={form.categoryId}
                onChange={(e) =>
                  setForm((f) => ({ ...f, categoryId: e.target.value }))
                }
                className="w-full rounded-lg border border-line px-3 py-2"
              >
                <option value="">— Aucune —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-muted">Description</span>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                rows={5}
                className="w-full rounded-lg border border-line px-3 py-2"
              />
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) =>
                  setForm((f) => ({ ...f, featured: e.target.checked }))
                }
              />
              Produit vedette
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) =>
                  setForm((f) => ({ ...f, published: e.target.checked }))
                }
              />
              Publié
            </label>
          </div>
          {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}
          {message ? <p className="mt-3 text-sm text-emerald-700">{message}</p> : null}
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              disabled={pending}
              onClick={onSubmit}
              className="rounded-lg bg-ink px-4 py-2 text-sm text-white disabled:opacity-60"
            >
              {pending ? "Enregistrement..." : editingId ? "Sauvegarder" : "Créer"}
            </button>
            {editingId ? (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-line px-4 py-2 text-sm"
              >
                Annuler
              </button>
            ) : null}
          </div>

          {activeProduct ? (
            <div className="mt-6 border-t border-line pt-6">
              <p className="text-sm font-medium">Galerie images</p>
              <input
                type="file"
                accept="image/*"
                className="mt-2 w-full text-sm"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file || !editingId) return;
                  try {
                    await uploadImage(editingId, file);
                    window.location.reload();
                  } catch (err) {
                    setError(err instanceof Error ? err.message : "Upload échoué.");
                  }
                }}
              />
              <div className="mt-3 space-y-2">
                {activeProduct.images.map((image, index) => (
                  <div
                    key={image.id}
                    className="flex items-center gap-3 rounded-lg border border-line p-2"
                  >
                    <div className="relative h-12 w-12 overflow-hidden rounded">
                      <Image src={image.url} alt="" fill className="object-cover" unoptimized />
                    </div>
                    <span className="flex-1 text-xs text-muted">#{index + 1}</span>
                    <button
                      type="button"
                      className="text-xs text-muted hover:text-ink"
                      onClick={() => {
                        if (!editingId) return;
                        startTransition(async () => {
                          const ids = [...activeProduct.images]
                            .sort((a, b) => a.sortOrder - b.sortOrder)
                            .map((i) => i.id);
                          const currentIndex = ids.indexOf(image.id);
                          if (currentIndex > 0) {
                            [ids[currentIndex - 1], ids[currentIndex]] = [
                              ids[currentIndex],
                              ids[currentIndex - 1],
                            ];
                            await reorderProductImages(editingId, ids);
                            window.location.reload();
                          }
                        });
                      }}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className="text-xs text-rose-600"
                      onClick={() =>
                        startTransition(async () => {
                          await deleteProductImage(image.id);
                          window.location.reload();
                        })
                      }
                    >
                      Suppr.
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </section>

        <section className="rounded-xl border border-line bg-white p-6">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher..."
              className="flex-1 rounded-lg border border-line px-3 py-2 text-sm"
            />
            <select
              value={filter}
              onChange={(e) =>
                setFilter(e.target.value as "all" | "published" | "draft")
              }
              className="rounded-lg border border-line px-3 py-2 text-sm"
            >
              <option value="all">Tous</option>
              <option value="published">Publiés</option>
              <option value="draft">Brouillons</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              title="Aucun produit"
              description="Créez votre premier produit avec le formulaire."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b border-line text-xs uppercase tracking-wide text-muted">
                    <th className="py-3 pr-3">Produit</th>
                    <th className="py-3 pr-3">Catégorie</th>
                    <th className="py-3 pr-3">Prix</th>
                    <th className="py-3 pr-3">Stock</th>
                    <th className="py-3 pr-3">Statut</th>
                    <th className="py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((product) => (
                    <tr key={product.id} className="border-b border-line/70">
                      <td className="py-3 pr-3">
                        <p className="font-medium">{product.name}</p>
                        <p className="text-xs text-muted">{product.slug}</p>
                      </td>
                      <td className="py-3 pr-3">{product.category?.name ?? "—"}</td>
                      <td className="py-3 pr-3">
                        {Number(product.price).toLocaleString("fr-FR")} DA
                      </td>
                      <td className="py-3 pr-3">{product.stockQuantity}</td>
                      <td className="py-3 pr-3">
                        {product.published ? "Publié" : "Brouillon"}
                      </td>
                      <td className="py-3">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            className="text-xs underline"
                            onClick={() => startEdit(product)}
                          >
                            Modifier
                          </button>
                          <button
                            type="button"
                            className="text-xs underline"
                            onClick={() =>
                              startTransition(async () => {
                                const updated = await toggleProductPublished(product.id);
                                setProducts((current) =>
                                  current.map((p) =>
                                    p.id === product.id
                                      ? { ...p, published: updated.published }
                                      : p,
                                  ),
                                );
                              })
                            }
                          >
                            {product.published ? "Dépublier" : "Publier"}
                          </button>
                          <button
                            type="button"
                            className="text-xs text-rose-600"
                            onClick={() => {
                              if (!confirm(`Supprimer ${product.name} ?`)) return;
                              startTransition(async () => {
                                await deleteProduct(product.id);
                                setProducts((c) => c.filter((p) => p.id !== product.id));
                              });
                            }}
                          >
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
