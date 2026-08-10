"use client";

export default function InstagramSticky() {
  return (
    <a
      href="https://www.instagram.com/maxi.chazen/"
      target="_blank"
      rel="noopener noreferrer"
      className="md:hidden fixed bottom-6 right-4 z-50 inline-flex items-center gap-3 rounded-full px-4 py-3 bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#515BD4] text-white shadow-lg"
      aria-label="Suivez MaxiChazen sur Instagram"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <rect x="2" y="2" width="20" height="20" rx="5" stroke="white" strokeWidth="1.2" />
        <path d="M7.5 11.99a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0z" stroke="white" strokeWidth="1.2" />
        <circle cx="17.5" cy="6.5" r="0.8" fill="white" />
      </svg>
      <span className="text-sm font-medium">@MaxiChazen</span>
    </a>
  );
}
