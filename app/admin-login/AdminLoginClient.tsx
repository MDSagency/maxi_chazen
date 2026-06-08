"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AdminLoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const nextPath = searchParams.get("next") || "/dashboard";

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        setErrorMessage(payload.error || "Echec de connexion.");
        setLoading(false);
        return;
      }

      router.replace(nextPath);
      router.refresh();
    } catch {
      setErrorMessage("Erreur reseau. Veuillez reessayer.");
      setLoading(false);
    }
  };

  return (
    <section className="admin-dashboard admin-login-page">
      <div className="admin-header admin-login-header">
        <div>
          <p className="admin-eyebrow">Acces administrateur</p>
          <h1>Connexion a l'espace admin</h1>
          <p className="admin-subtitle">
            Entrez le mot de passe administrateur pour acceder a la gestion des
            produits et commandes.
          </p>
        </div>
      </div>

      <div className="admin-card admin-login-card">
        <form className="admin-form" onSubmit={handleSubmit}>
          <label>
            Mot de passe admin
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              required
            />
          </label>

          {errorMessage ? <p className="form-error">{errorMessage}</p> : null}

          <button className="btn-confirm" type="submit" disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </section>
  );
}
