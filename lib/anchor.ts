/** Sticky navbar height — keep in sync with layout Navbar */
export const NAV_SCROLL_OFFSET = 92;

type LenisInstance = {
  scrollTo: (
    target: number | string | HTMLElement,
    options?: { offset?: number; duration?: number },
  ) => void;
};

declare global {
  interface Window {
    __lenis?: LenisInstance;
  }
}

export function scrollToAnchor(id: string): boolean {
  const el = document.getElementById(id);
  if (!el) return false;

  const lenis = window.__lenis;
  if (lenis) {
    lenis.scrollTo(el, {
      offset: -NAV_SCROLL_OFFSET,
      duration: 1.4,
    });
  } else {
    const top =
      el.getBoundingClientRect().top +
      window.scrollY -
      NAV_SCROLL_OFFSET;
    window.scrollTo({ top, behavior: "smooth" });
  }

  window.history.pushState(null, "", `#${id}`);
  return true;
}

export function parseAnchorHref(href: string): string | null {
  const hashIndex = href.indexOf("#");
  if (hashIndex === -1) return null;
  return href.slice(hashIndex + 1) || null;
}

export function isHomeAnchor(href: string): boolean {
  const hashIndex = href.indexOf("#");
  if (hashIndex === -1) return false;
  const path = href.slice(0, hashIndex) || "/";
  return path === "/" || path === "";
}

/** @deprecated use isHomeAnchor */
export const isSamePageAnchor = isHomeAnchor;
