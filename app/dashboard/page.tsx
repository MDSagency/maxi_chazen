"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type Product = {
  id: number;
  category: string;
  name: string;
  price: number;
  in_stock: boolean;
  image: string;
  created_at?: string;
};

type FormState = {
  name: string;
  category: string;
  price: string;
  inStock: boolean;
  existingImage: string;
  imageFile: File | null;
  imagePreview: string;
};

const sampleProducts: Product[] = [
  {
    id: 1,
    category: "PORTE CLE",
    name: "Produit 1",
    price: 1200,
    in_stock: true,
    image:
      "https://pwedidfwwixbwtsntvor.supabase.co/storage/v1/object/public/products/image1.jpg",
    created_at: "2026-03-24 16:19:26.795641",
  },
];

const emptyForm: FormState = {
  name: "",
  category: "",
  price: "",
  inStock: true,
  existingImage: "",
  imageFile: null,
  imagePreview: "",
};

export default function DashboardPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const categories = useMemo(
    () =>
      Array.from(
        new Set(
          products
            .map((item) => item.category.trim())
            .filter((item) => item.length > 0),
        ),
      ),
    [products],
  );

  async function loadProducts() {
    setLoading(true);
    setErrorMessage("");

    if (!supabase) {
      setProducts(sampleProducts);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("products")
      .select("id, category, name, price, in_stock, image, created_at")
      .order("created_at", { ascending: false });

    if (error || !Array.isArray(data)) {
      setErrorMessage(
        "Impossible de charger les produits depuis la base. Affichage des donnees locales.",
      );
      setProducts(sampleProducts);
      setLoading(false);
      return;
    }

    const mapped = data.map((item) => ({
      id: Number(item.id) || 0,
      category: String(item.category || ""),
      name: String(item.name || ""),
      price: Number(item.price) || 0,
      in_stock:
        item.in_stock === true ||
        item.in_stock === "true" ||
        item.in_stock === 1,
      image: String(item.image || ""),
      created_at: item.created_at ? String(item.created_at) : undefined,
    })) as Product[];

    setProducts(mapped);
    setLoading(false);
  }

  useEffect(() => {
    void loadProducts();
  }, []);

  useEffect(() => {
    if (!successMessage) return;
    const id = window.setTimeout(() => setSuccessMessage(""), 2200);
    return () => window.clearTimeout(id);
  }, [successMessage]);

  const onImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0] ?? null;
    if (!nextFile) {
      setForm((current) => ({
        ...current,
        imageFile: null,
        imagePreview: current.existingImage,
      }));
      return;
    }

    const localPreview = URL.createObjectURL(nextFile);
    setForm((current) => ({
      ...current,
      imageFile: nextFile,
      imagePreview: localPreview,
    }));
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setErrorMessage("");
  };

  const onEdit = (product: Product) => {
    setEditingId(product.id);
    setErrorMessage("");
    setForm({
      name: product.name,
      category: product.category,
      price: String(product.price),
      inStock: product.in_stock,
      existingImage: product.image,
      imageFile: null,
      imagePreview: product.image,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const uploadImageIfNeeded = async () => {
    if (!form.imageFile) {
      return form.existingImage;
    }

    if (!supabase) {
      return URL.createObjectURL(form.imageFile);
    }

    const safeFileName = form.imageFile.name.replace(/\s+/g, "-").toLowerCase();
    const filePath = `${Date.now()}-${safeFileName}`;
    const { error: uploadError } = await supabase.storage
      .from("products")
      .upload(filePath, form.imageFile, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`Upload image echoue: ${uploadError.message}`);
    }

    const { data: publicData } = supabase.storage
      .from("products")
      .getPublicUrl(filePath);

    return publicData.publicUrl;
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const parsedPrice = Number(form.price);
    if (
      !form.name.trim() ||
      !form.category.trim() ||
      Number.isNaN(parsedPrice) ||
      parsedPrice < 0
    ) {
      setErrorMessage("Merci de remplir nom, catégorie et prix valide.");
      return;
    }

    if (!editingId && !form.imageFile) {
      setErrorMessage(
        "Veuillez choisir une image depuis l'appareil pour un nouveau produit.",
      );
      return;
    }

    setSaving(true);

    try {
      const imageUrl = await uploadImageIfNeeded();

      if (!supabase) {
        if (editingId) {
          setProducts((current) =>
            current.map((item) =>
              item.id === editingId
                ? {
                    ...item,
                    name: form.name.trim(),
                    category: form.category.trim(),
                    price: parsedPrice,
                    in_stock: form.inStock,
                    image: imageUrl || item.image,
                  }
                : item,
            ),
          );
          setSuccessMessage("Produit mis a jour avec succes.");
        } else {
          const nextId =
            products.length > 0
              ? Math.max(...products.map((item) => item.id)) + 1
              : 1;
          setProducts((current) => [
            {
              id: nextId,
              name: form.name.trim(),
              category: form.category.trim(),
              price: parsedPrice,
              in_stock: form.inStock,
              image: imageUrl,
              created_at: new Date().toISOString(),
            },
            ...current,
          ]);
          setSuccessMessage("Produit ajoute avec succes.");
        }

        resetForm();
        setSaving(false);
        return;
      }

      if (editingId) {
        const { error } = await supabase
          .from("products")
          .update({
            name: form.name.trim(),
            category: form.category.trim(),
            price: parsedPrice,
            in_stock: form.inStock,
            image: imageUrl || form.existingImage,
          })
          .eq("id", editingId);

        if (error) {
          throw new Error(error.message);
        }

        setSuccessMessage("Produit mis a jour avec succes.");
      } else {
        const { error } = await supabase.from("products").insert({
          name: form.name.trim(),
          category: form.category.trim(),
          price: parsedPrice,
          in_stock: form.inStock,
          image: imageUrl,
        });

        if (error) {
          throw new Error(error.message);
        }

        setSuccessMessage("Produit ajoute avec succes.");
      }

      resetForm();
      await loadProducts();
    } catch (error) {
      const rawMessage =
        error instanceof Error ? error.message : "Une erreur est survenue.";
      const message = rawMessage.toLowerCase().includes("row-level security")
        ? "Upload bloque par policy Supabase. Executez le script supabase/orders_setup.sql dans SQL Editor puis reessayez."
        : rawMessage;
      setErrorMessage(message);
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (product: Product) => {
    const confirmation = window.prompt(
      `Pour supprimer ${product.name}, tapez SUPPRIMER pour confirmer.`,
    );

    if (confirmation !== "SUPPRIMER") {
      return;
    }

    setDeletingId(product.id);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      if (!supabase) {
        setProducts((current) =>
          current.filter((item) => item.id !== product.id),
        );
      } else {
        const { error } = await supabase
          .from("products")
          .delete()
          .eq("id", product.id);

        if (error) {
          throw new Error(error.message);
        }

        setProducts((current) =>
          current.filter((item) => item.id !== product.id),
        );
      }

      if (editingId === product.id) {
        resetForm();
      }

      setSuccessMessage("Produit supprime avec succes.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Suppression impossible.";
      setErrorMessage(message);
    } finally {
      setDeletingId(null);
    }
  };

  const onLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin-login");
    router.refresh();
  };

  return (
    <section className="admin-dashboard">
      <div className="admin-header">
        <div>
          <p className="admin-eyebrow">Espace administrateur</p>
          <h1>Gestion des Produits</h1>
          <p className="admin-subtitle">
            Ajout et mise a jour des produits avec upload image depuis votre
            appareil.
          </p>
        </div>
        <button type="button" className="admin-logout-btn" onClick={onLogout}>
          Deconnexion
        </button>
      </div>

      <div
        className="admin-jump-nav"
        aria-label="Navigation des sections admin"
      >
        <Link className="admin-jump-link" href="/dashboard">
          Produits
        </Link>
        <Link
          className="admin-jump-link admin-jump-link-primary"
          href="/dashboard/orders"
        >
          Voir les commandes
        </Link>
      </div>

      <div className="admin-grid">
        <div className="admin-card admin-form-card">
          <h2>
            {editingId ? "Modifier le produit" : "Ajouter un nouveau produit"}
          </h2>
          <p className="admin-card-note">
            Remplissez le formulaire puis enregistrez. L&apos;apercu image
            apparait automatiquement.
          </p>

          <form className="admin-form" onSubmit={onSubmit}>
            <div className="admin-form-grid">
              <label className="admin-field admin-field-full">
                Nom du produit
                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm((current) => ({ ...current, name: e.target.value }))
                  }
                  placeholder="Ex: Attache sucette premium"
                  required
                />
              </label>

              <label className="admin-field admin-field-full">
                Catégorie
                <input
                  list="admin-category-options"
                  value={form.category}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      category: e.target.value,
                    }))
                  }
                  placeholder="Choisir une catégorie existante ou en saisir une nouvelle"
                  required
                />
                <datalist id="admin-category-options">
                  {categories.map((category) => (
                    <option key={category} value={category} />
                  ))}
                </datalist>
              </label>

              <label className="admin-field">
                Prix (DA)
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={form.price}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      price: e.target.value,
                    }))
                  }
                  placeholder="1200"
                  required
                />
              </label>

              <label className="admin-checkbox admin-field">
                <input
                  type="checkbox"
                  checked={form.inStock}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      inStock: e.target.checked,
                    }))
                  }
                />
                En stock
              </label>

              <label className="admin-field admin-field-full">
                Image (depuis l'appareil)
                <input type="file" accept="image/*" onChange={onImageChange} />
              </label>
            </div>

            {form.imagePreview ? (
              <div className="admin-preview-wrap">
                <img
                  src={form.imagePreview}
                  alt="Apercu produit"
                  className="admin-preview"
                />
              </div>
            ) : null}

            {errorMessage ? <p className="form-error">{errorMessage}</p> : null}
            {successMessage ? (
              <p className="admin-success">{successMessage}</p>
            ) : null}

            <div className="admin-actions">
              <button className="btn-confirm" type="submit" disabled={saving}>
                {saving
                  ? "Enregistrement..."
                  : editingId
                    ? "Sauvegarder les modifications"
                    : "Ajouter le produit"}
              </button>
              {editingId ? (
                <button
                  type="button"
                  className="btn-continue"
                  onClick={resetForm}
                >
                  Annuler modification
                </button>
              ) : null}
            </div>
          </form>
        </div>

        <div className="admin-card admin-products-card">
          <h2>Produits ({products.length})</h2>

          {loading ? (
            <div className="page-loader" role="status" aria-live="polite">
              <span className="loader-dot" aria-hidden="true"></span>
              <p>Chargement des produits...</p>
            </div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Nom</th>
                    <th>Catégorie</th>
                    <th>Prix</th>
                    <th>Stock</th>
                    <th>Créé le</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <img
                          src={product.image}
                          alt={product.name}
                          className="admin-thumb"
                        />
                      </td>
                      <td>{product.name}</td>
                      <td>{product.category}</td>
                      <td>{product.price.toLocaleString("fr-FR")} DA</td>
                      <td>
                        <span
                          className={
                            product.in_stock
                              ? "admin-status admin-status-on"
                              : "admin-status admin-status-off"
                          }
                        >
                          {product.in_stock ? "En stock" : "Rupture"}
                        </span>
                      </td>
                      <td>
                        {product.created_at
                          ? product.created_at.slice(0, 16)
                          : "-"}
                      </td>
                      <td>
                        <button
                          type="button"
                          className="admin-edit-btn"
                          onClick={() => onEdit(product)}
                        >
                          Modifier
                        </button>
                        <button
                          type="button"
                          className="admin-delete-btn"
                          disabled={deletingId === product.id}
                          onClick={() => onDelete(product)}
                        >
                          {deletingId === product.id
                            ? "Suppression..."
                            : "Supprimer"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
