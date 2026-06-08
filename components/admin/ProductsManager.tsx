"use client";

import Image from "next/image";
import { useEffect, useMemo, useState, useTransition } from "react";
import {
  createProduct,
  deleteProduct,
  toggleProductPublished,
  updateProduct,
  deleteProductImage,
  reorderProductImages,
  getAdminProduct,
} from "@/lib/actions/products";
import EmptyState from "@/components/admin/EmptyState";
import ProductImageUploader, {
  type ProductImageItem,
} from "@/components/admin/ProductImageUploader";

type Category = { id: string; name: string };
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
  images: ProductImageItem[];
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
  const [pendingImages, setPendingImages] = useState<
    { id: string; url: string; file: File }[]
  >([]);
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

  const activeProduct = editingId
    ? products.find((p) => p.id === editingId)
    : null;

  useEffect(() => {
    return () => {
      pendingImages.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [pendingImages]);

  function clearPending() {
    pendingImages.forEach((p) => URL.revokeObjectURL(p.url));
    setPendingImages([]);
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setMessage("");
    clearPending();
  }

  function startEdit(product: Product) {
    clearPending();
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
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function uploadImageFile(
    productId: string,
    file: File,
  ): Promise<ProductImageItem | null> {
    const body = new FormData();
    body.append("file", file);
    body.append("folder", "products");
    body.append("productId", productId);

    const response = await fetch("/api/upload", { method: "POST", body });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error ?? "Upload échoué.");
    return data.image as ProductImageItem | null;
  }

  async function uploadPendingToProduct(productId: string) {
    if (pendingImages.length === 0) return;

    const uploaded: ProductImageItem[] = [];
    for (const item of pendingImages) {
      const image = await uploadImageFile(productId, item.file);
      if (image) uploaded.push(image);
    }

    clearPending();

    if (uploaded.length > 0) {
      setProducts((current) =>
        current.map((p) =>
          p.id === productId
            ? { ...p, images: [...p.images, ...uploaded] }
            : p,
        ),
      );
    }

    const refreshed = await getAdminProduct(productId);
    if (refreshed) {
      setProducts((current) =>
        current.map((p) =>
          p.id === productId
            ? {
                ...p,
                images: refreshed.images.map((img) => ({
                  id: img.id,
                  url: img.url,
                  sortOrder: img.sortOrder,
                  isPrimary: img.isPrimary,
                })),
              }
            : p,
        ),
      );
    }
  }

  async function handleImageUpload(files: File[]) {
    if (!editingId) {
      setPendingImages((current) => [
        ...current,
        ...files.map((file) => ({
          id: `pending-${crypto.randomUUID()}`,
          url: URL.createObjectURL(file),
          file,
        })),
      ]);
      setMessage(
        `${files.length} image(s) prête(s). Cliquez « Créer le produit » pour les envoyer sur R2.`,
      );
      return;
    }

    for (const file of files) {
      const image = await uploadImageFile(editingId, file);
      if (image) {
        setProducts((current) =>
          current.map((p) =>
            p.id === editingId
              ? { ...p, images: [...p.images, image] }
              : p,
          ),
        );
      }
    }

    const refreshed = await getAdminProduct(editingId);
    if (refreshed) {
      setProducts((current) =>
        current.map((p) =>
          p.id === editingId
            ? {
                ...p,
                images: refreshed.images.map((img) => ({
                  id: img.id,
                  url: img.url,
                  sortOrder: img.sortOrder,
                  isPrimary: img.isPrimary,
                })),
              }
            : p,
        ),
      );
    }

    setMessage("Image(s) ajoutée(s) avec succès.");
  }

  async function handleImageDelete(imageId: string) {
    if (imageId.startsWith("pending-")) {
      setPendingImages((current) => {
        const item = current.find((p) => p.id === imageId);
        if (item) URL.revokeObjectURL(item.url);
        return current.filter((p) => p.id !== imageId);
      });
      return;
    }

    if (!editingId) return;
    await deleteProductImage(imageId);
    setProducts((current) =>
      current.map((p) =>
        p.id === editingId
          ? { ...p, images: p.images.filter((img) => img.id !== imageId) }
          : p,
      ),
    );
    setMessage("Image supprimée.");
  }

  async function handleImageReorder(imageIds: string[]) {
    if (!editingId) return;
    const realIds = imageIds.filter((id) => !id.startsWith("pending-"));
    if (realIds.length === 0) return;
    await reorderProductImages(editingId, realIds);
    setProducts((current) =>
      current.map((p) => {
        if (p.id !== editingId) return p;
        const map = new Map(p.images.map((img) => [img.id, img]));
        return {
          ...p,
          images: realIds
            .map((id, index) => {
              const img = map.get(id);
              return img
                ? { ...img, sortOrder: index, isPrimary: index === 0 }
                : null;
            })
            .filter((img): img is ProductImageItem => img !== null),
        };
      }),
    );
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
          await uploadPendingToProduct(editingId);
          setProducts((current) =>
            current.map((p) =>
              p.id === editingId
                ? {
                    ...p,
                    ...updated,
                    category: categories.find((c) => c.id === updated.categoryId)
                      ? {
                          name: categories.find(
                            (c) => c.id === updated.categoryId,
                          )!.name,
                        }
                      : null,
                  }
                : p,
            ),
          );
          setMessage("Produit mis à jour.");
        } else {
          const created = await createProduct(payload);
          const newProduct: Product = {
            ...created,
            category: categories.find((c) => c.id === created.categoryId)
              ? {
                  name: categories.find((c) => c.id === created.categoryId)!
                    .name,
                }
              : null,
            images: [],
          };

          setProducts((current) => [newProduct, ...current]);
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

          if (pendingImages.length > 0) {
            await uploadPendingToProduct(created.id);
            setMessage("Produit créé et images envoyées.");
          } else {
            setMessage(
              "Produit créé. Ajoutez des images dans la zone ci-dessus.",
            );
          }
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erreur.");
      }
    });
  }

  const displayImages = [
    ...(activeProduct?.images ?? []),
    ...pendingImages.map((p, index) => ({
      id: p.id,
      url: p.url,
      sortOrder: 1000 + index,
      isPrimary: false,
    })),
  ];

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[10px] uppercase tracking-[0.28em] text-muted">
          Catalogue
        </p>
        <h2 className="mt-2 font-display text-4xl text-ink">Produits</h2>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,480px)_1fr]">
        <section className="space-y-6 rounded-xl border border-line bg-white p-6">
          <h3 className="font-display text-2xl">
            {editingId ? "Modifier le produit" : "Nouveau produit"}
          </h3>

          <ProductImageUploader
            productId={editingId}
            images={displayImages}
            onUpload={handleImageUpload}
            onDelete={handleImageDelete}
            onReorder={handleImageReorder}
            hint={
              editingId
                ? "Glissez-déposez ou cliquez pour ajouter des images. Stockées sur Cloudflare R2."
                : "Vous pouvez sélectionner des images maintenant — elles seront envoyées à la création."
            }
          />

          {pendingImages.length > 0 ? (
            <p className="text-xs text-brand-blue">
              {pendingImages.length} image(s) en attente d&apos;envoi
            </p>
          ) : null}

          <div className="space-y-3 border-t border-line pt-6">
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

          {error ? (
            <p className="text-sm text-rose-600">{error}</p>
          ) : null}
          {message ? (
            <p className="text-sm text-emerald-700">{message}</p>
          ) : null}

          <div className="flex gap-2">
            <button
              type="button"
              disabled={pending}
              onClick={onSubmit}
              className="rounded-lg bg-ink px-4 py-2 text-sm text-white disabled:opacity-60"
            >
              {pending
                ? "Enregistrement..."
                : editingId
                  ? "Sauvegarder"
                  : "Créer le produit"}
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
              <table className="w-full min-w-[800px] text-left text-sm">
                <thead>
                  <tr className="border-b border-line text-xs uppercase tracking-wide text-muted">
                    <th className="py-3 pr-3">Image</th>
                    <th className="py-3 pr-3">Produit</th>
                    <th className="py-3 pr-3">Catégorie</th>
                    <th className="py-3 pr-3">Prix</th>
                    <th className="py-3 pr-3">Stock</th>
                    <th className="py-3 pr-3">Statut</th>
                    <th className="py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((product) => {
                    const primary =
                      product.images.find((i) => i.isPrimary) ??
                      product.images[0];
                    return (
                      <tr key={product.id} className="border-b border-line/70">
                        <td className="py-3 pr-3">
                          <div className="relative h-12 w-12 overflow-hidden rounded-lg border border-line bg-paper">
                            {primary ? (
                              <Image
                                src={primary.url}
                                alt=""
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            ) : (
                              <span className="flex h-full items-center justify-center text-[10px] text-muted">
                                —
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 pr-3">
                          <p className="font-medium">{product.name}</p>
                          <p className="text-xs text-muted">{product.slug}</p>
                          <p className="text-xs text-muted">
                            {product.images.length} image(s)
                          </p>
                        </td>
                        <td className="py-3 pr-3">
                          {product.category?.name ?? "—"}
                        </td>
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
                                  const updated = await toggleProductPublished(
                                    product.id,
                                  );
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
                                if (!confirm(`Supprimer ${product.name} ?`))
                                  return;
                                startTransition(async () => {
                                  await deleteProduct(product.id);
                                  setProducts((c) =>
                                    c.filter((p) => p.id !== product.id),
                                  );
                                  if (editingId === product.id) resetForm();
                                });
                              }}
                            >
                              Supprimer
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
