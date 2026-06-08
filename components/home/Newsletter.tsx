"use client";

import { useState } from "react";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/motion/FadeIn";
import Button from "@/components/ui/Button";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    setEmail("");
    window.setTimeout(() => setSubmitted(false), 3000);
  }

  return (
    <section className="border-t border-line bg-ink section-editorial">
      <Container>
        <FadeIn className="mx-auto max-w-xl text-center">
          <p className="eyebrow mb-6 text-white/40">Newsletter</p>
          <h2 className="font-display text-4xl text-white md:text-5xl">
            Restez connectés
          </h2>
          <p className="mx-auto mt-6 max-w-md text-[15px] font-light leading-[1.8] text-white/55">
            Recevez nos nouveautés, conseils de soin et accès anticipé aux
            collections en avant-première.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-stretch"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre adresse e-mail"
              required
              aria-label="Adresse e-mail"
              className="h-12 flex-1 border border-white/15 bg-white/5 px-5 text-sm font-light text-white placeholder:text-white/30 outline-none transition-colors duration-500 focus:border-brand-blue/60 focus:bg-white/8"
            />
            <Button type="submit" variant="primary" size="md" className="shrink-0">
              S&apos;inscrire
            </Button>
          </form>

          {submitted ? (
            <p className="mt-6 text-[11px] uppercase tracking-[0.2em] text-brand-yellow" role="status">
              Merci — vous êtes inscrit(e).
            </p>
          ) : null}

          <p className="mt-10 text-[11px] font-light leading-relaxed text-white/30">
            En vous inscrivant, vous acceptez de recevoir nos communications.
            Désinscription possible à tout moment.
          </p>
        </FadeIn>
      </Container>
    </section>
  );
}
