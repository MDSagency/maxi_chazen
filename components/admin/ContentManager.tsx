"use client";

import { useState, useTransition } from "react";
import { updateWebsiteContent } from "@/lib/actions/content";

const SECTIONS = [
  { key: "hero", label: "Hero" },
  { key: "banners", label: "Bannières" },
  { key: "histoire", label: "Notre Histoire" },
  { key: "testimonials", label: "Témoignages" },
  { key: "homepage_images", label: "Images accueil" },
  { key: "footer", label: "Pied de page" },
  { key: "contact", label: "Contact" },
] as const;

export default function ContentManager({
  initialContent,
}: {
  initialContent: Record<string, unknown>;
}) {
  const [activeSection, setActiveSection] =
    useState<(typeof SECTIONS)[number]["key"]>("hero");
  const [jsonText, setJsonText] = useState(
    JSON.stringify(initialContent.hero, null, 2),
  );
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function selectSection(key: (typeof SECTIONS)[number]["key"]) {
    setActiveSection(key);
    setJsonText(JSON.stringify(initialContent[key] ?? {}, null, 2));
    setMessage("");
    setError("");
  }

  function onSave() {
    setMessage("");
    setError("");

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(jsonText) as Record<string, unknown>;
    } catch {
      setError("JSON invalide.");
      return;
    }

    startTransition(async () => {
      try {
        await updateWebsiteContent({ section: activeSection, content: parsed });
        initialContent[activeSection] = parsed;
        setMessage("Contenu enregistré.");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erreur.");
      }
    });
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[10px] uppercase tracking-[0.28em] text-muted">CMS</p>
        <h2 className="mt-2 font-display text-4xl text-ink">Contenu du site</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Modifiez les sections sans toucher au code. Utilisez un JSON structuré
          pour chaque bloc.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {SECTIONS.map((section) => (
          <button
            key={section.key}
            type="button"
            onClick={() => selectSection(section.key)}
            className={`rounded-full px-4 py-2 text-xs uppercase tracking-[0.14em] ${
              activeSection === section.key
                ? "bg-ink text-white"
                : "border border-line bg-white text-charcoal"
            }`}
          >
            {section.label}
          </button>
        ))}
      </div>

      <section className="rounded-xl border border-line bg-white p-6">
        <textarea
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
          rows={22}
          className="w-full rounded-lg border border-line bg-paper p-4 font-mono text-xs"
        />
        {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}
        {message ? <p className="mt-3 text-sm text-emerald-700">{message}</p> : null}
        <button
          type="button"
          disabled={pending}
          onClick={onSave}
          className="mt-4 rounded-lg bg-ink px-4 py-2 text-sm text-white disabled:opacity-60"
        >
          {pending ? "Enregistrement..." : "Enregistrer la section"}
        </button>
      </section>
    </div>
  );
}
