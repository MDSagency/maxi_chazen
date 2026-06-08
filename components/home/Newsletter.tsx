"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/motion/FadeIn";
import RevealText from "@/components/motion/RevealText";
import LineReveal from "@/components/motion/LineReveal";
import Button from "@/components/ui/Button";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState(false);
  const reduced = usePrefersReducedMotion();

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
          <p className="eyebrow mb-5 text-white/40">Newsletter</p>
          <LineReveal align="center" className="bg-brand-blue" />
          <RevealText
            text="Restez connectés"
            as="h2"
            className="mt-6 justify-center font-display text-4xl text-white md:text-5xl"
          />
          <p className="mx-auto mt-6 max-w-md text-[15px] font-light leading-[1.8] text-white/55">
            Recevez nos nouveautés, conseils de soin et accès anticipé aux
            collections en avant-première.
          </p>

          <motion.form
            onSubmit={handleSubmit}
            className="mt-12 flex flex-col items-stretch gap-4 sm:flex-row sm:items-stretch"
            animate={
              focused && !reduced
                ? { scale: 1.01 }
                : { scale: 1 }
            }
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Votre adresse e-mail"
              required
              aria-label="Adresse e-mail"
              className="h-12 flex-1 border border-white/15 bg-white/5 px-5 text-center text-sm font-light text-white placeholder:text-white/30 outline-none transition-all duration-500 focus:border-brand-blue/60 focus:bg-white/8 sm:text-left"
            />
            <Button type="submit" variant="primary" size="md" className="w-full shrink-0 sm:w-auto">
              S&apos;inscrire
            </Button>
          </motion.form>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.p
                key="success"
                initial={reduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.45 }}
                className="mt-6 text-[11px] uppercase tracking-[0.2em] text-brand-yellow"
                role="status"
              >
                Merci — vous êtes inscrit(e).
              </motion.p>
            ) : null}
          </AnimatePresence>

          <p className="mx-auto mt-10 max-w-md text-[11px] font-light leading-relaxed text-white/30">
            En vous inscrivant, vous acceptez de recevoir nos communications.
            Désinscription possible à tout moment.
          </p>
        </FadeIn>
      </Container>
    </section>
  );
}
