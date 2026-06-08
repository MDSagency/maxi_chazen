"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/cn";

const NAV = [
  { href: "/admin", label: "Vue d'ensemble", icon: "◈" },
  { href: "/admin/products", label: "Produits", icon: "◇" },
  { href: "/admin/orders", label: "Commandes", icon: "◎" },
  { href: "/admin/categories", label: "Catégories", icon: "▣" },
  { href: "/admin/content", label: "Contenu", icon: "✎" },
];

export default function AdminShell({
  children,
  userName,
}: {
  children: React.ReactNode;
  userName: string;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#f7f7f5] text-ink">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 flex-col border-r border-line bg-white lg:flex">
          <div className="border-b border-line px-6 py-8">
            <p className="text-[10px] uppercase tracking-[0.28em] text-muted">
              Maxi Chazen
            </p>
            <h1 className="mt-2 font-display text-2xl">Administration</h1>
          </div>
          <nav className="flex-1 space-y-1 p-4">
            {NAV.map((item) => {
              const active =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition-colors",
                    active
                      ? "bg-ink text-white"
                      : "text-charcoal hover:bg-paper",
                  )}
                >
                  <span aria-hidden>{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-line p-4">
            <p className="truncate px-2 text-xs text-muted">{userName}</p>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className="mt-3 w-full rounded-lg border border-line px-4 py-2 text-left text-sm text-charcoal transition-colors hover:bg-paper"
            >
              Déconnexion
            </button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-line bg-white px-4 py-4 lg:px-8">
            <div className="lg:hidden">
              <p className="font-display text-xl">Administration</p>
            </div>
            <div className="flex gap-2 overflow-x-auto lg:hidden">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "whitespace-nowrap rounded-full px-3 py-1.5 text-xs",
                    pathname === item.href ||
                      (item.href !== "/admin" && pathname.startsWith(item.href))
                      ? "bg-ink text-white"
                      : "bg-paper text-charcoal",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <Link
              href="/"
              className="hidden text-xs uppercase tracking-[0.18em] text-muted hover:text-ink lg:inline"
            >
              Voir le site →
            </Link>
          </header>
          <main className="flex-1 p-4 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
