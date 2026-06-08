"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { isHomeAnchor, parseAnchorHref, scrollToAnchor } from "@/lib/anchor";
import { cn } from "@/lib/cn";

type AnchorLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  onNavigate?: () => void;
};

export default function AnchorLink({
  href,
  children,
  className,
  onNavigate,
}: AnchorLinkProps) {
  const pathname = usePathname();
  const router = useRouter();
  const anchorId = parseAnchorHref(href);

  function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    if (!anchorId) return;

    onNavigate?.();

    if (!isHomeAnchor(href)) return;

    if (pathname === "/") {
      event.preventDefault();
      scrollToAnchor(anchorId);
      return;
    }

    event.preventDefault();
    router.push(`/#${anchorId}`);
  }

  return (
    <Link href={href} onClick={handleClick} className={cn(className)}>
      {children}
    </Link>
  );
}
