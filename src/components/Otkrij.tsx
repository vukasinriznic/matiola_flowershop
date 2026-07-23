"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Scroll-reveal omotač — sadržaj se otkrije kad uđe u vidno polje.
 *
 * Nasleđuje potpis hero-a: `fokus` varijanta koristi isto „izoštravanje"
 * (blur → fokus) kao naslov u hero-u, dok osnovna varijanta radi samo
 * podizanje + fade (jeftino na telefonu — blur se ne animira po mnogo kartica).
 *
 * `prefers-reduced-motion`: posmatrač se ne kači, sadržaj je odmah vidljiv.
 */
export function Otkrij({
  children,
  kasnjenje = 0,
  fokus = false,
  className = "",
}: {
  children: ReactNode;
  /** Stagger — kašnjenje otkrivanja u ms (za kaskadu kartica). */
  kasnjenje?: number;
  /** Blur → fokus (kao hero naslov). Koristiti samo za malo elemenata. */
  fokus?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [vidljivo, setVidljivo] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reduced-motion: preskoči animaciju, odmah prikaži.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVidljivo(true);
      return;
    }

    const io = new IntersectionObserver(
      (unosi) => {
        if (unosi[0]?.isIntersecting) {
          setVidljivo(true);
          io.disconnect(); // otkrij jednom, pa se skloni
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`otkrij${fokus ? " otkrij-fokus" : ""}${
        vidljivo ? " otkrij--vidljivo" : ""
      }${className ? ` ${className}` : ""}`}
      style={kasnjenje ? { transitionDelay: `${kasnjenje}ms` } : undefined}
    >
      {children}
    </div>
  );
}
