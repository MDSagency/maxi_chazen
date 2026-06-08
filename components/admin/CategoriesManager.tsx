"use client";

import { useState, useTransition } from "react";
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "@/lib/actions/categories";
import EmptyState from "@/components/admin/EmptyState";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sortOrder: number;
  _count: { products: number };
};

const empty = { name: "", slug: "", description: "", sortOrder: "0" };

export default function CategoriesManager({
  initialCategories,
}: {
  initialCategories: Category[];
}) {
  const [categories, setCategories] = useState(initialCategories);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit() {
    const payload = {
      name: form.name,
      slug: form.slug || undefined,
      description: form.description || undefined,
      sortOrder: Number(form.sortOrder),
    };

    startTransition(async () => {
      if (editingId) {
        const updated = await updateCategory(editingId, payload);
        setCategories((c) =>
          c.map((cat) =>
            cat.id === editingId
              ? { ...cat, ...updated, _count: cat._count }
              : cat,
          ),
        );
      } else {
        const created = await createCategory(payload);
        setCategories((c) => [...c, { ...created, _count: { products: 0 } }]);
      }
      setForm(empty);
      setEditingId(null);
    });
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[10px] uppercase tracking-[0.28em] text-muted">Catalogue</p>
        <h2 className="mt-2 font-display text-4xl text-ink">Catégories</h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <section className="rounded-xl border border-line bg-white p-6">
          <h3 className="font-display text-2xl">
            {editingId ? "Modifier" : "Nouvelle catégorie"}
          </h3>
          <div className="mt-4 space-y-3">
            <input
              placeholder="Nom"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full rounded-lg border border-line px-3 py-2 text-sm"
            />
            <input
              placeholder="Slug (optionnel)"
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              className="w-full rounded-lg border border-line px-3 py-2 text-sm"
            />
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              className="w-full rounded-lg border border-line px-3 py-2 text-sm"
              rows={3}
            />
            <input
              type="number"
              placeholder="Ordre"
              value={form.sortOrder}
              onChange={(e) =>
                setForm((f) => ({ ...f, sortOrder: e.target.value }))
              }
              className="w-full rounded-lg border border-line px-3 py-2 text-sm"
            />
          </div>
          <button
            type="button"
            disabled={pending}
            onClick={onSubmit}
            className="mt-4 rounded-lg bg-ink px-4 py-2 text-sm text-white"
          >
            {editingId ? "Sauvegarder" : "Créer"}
          </button>
        </section>

        <section className="rounded-xl border border-line bg-white p-6">
          {categories.length === 0 ? (
            <EmptyState title="Aucune catégorie" />
          ) : (
            <div className="space-y-3">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between rounded-lg border border-line px-4 py-3"
                >
                  <div>
                    <p className="font-medium">{category.name}</p>
                    <p className="text-xs text-muted">
                      {category.slug} · {category._count.products} produit(s)
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="text-xs underline"
                      onClick={() => {
                        setEditingId(category.id);
                        setForm({
                          name: category.name,
                          slug: category.slug,
                          description: category.description ?? "",
                          sortOrder: String(category.sortOrder),
                        });
                      }}
                    >
                      Modifier
                    </button>
                    <button
                      type="button"
                      className="text-xs text-rose-600"
                      onClick={() => {
                        if (!confirm(`Supprimer ${category.name} ?`)) return;
                        startTransition(async () => {
                          try {
                            await deleteCategory(category.id);
                            setCategories((c) =>
                              c.filter((cat) => cat.id !== category.id),
                            );
                          } catch (e) {
                            alert(e instanceof Error ? e.message : "Erreur");
                          }
                        });
                      }}
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
