"use client";

import { ReactLenis } from "lenis/react";
import { useEffect, useState } from "react";
import "lenis/dist/lenis.css";

/**
 * Glatki (inercijalni) skrol kroz ceo sajt — Lenis.
 *
 * Zaštite:
 *  - prefers-reduced-motion: bez peglanja (lerp 1 = trenutno), normalan skrol.
 *  - dodir (mobilni): `syncTouch: false` — ostaje native momentum, ne peglamo prst.
 *  - blaga inercija (lerp 0.1), da ne deluje razvučeno.
 *
 * `root` režim koristi pravi skrol prozora (ne transform-omotač), pa
 * `position: sticky` i scroll-scrub hero (koji sluša window scroll) rade normalno.
 */
export function GlatkiSkrol({ children }: { children: React.ReactNode }) {
  const [smanjenPokret, setSmanjenPokret] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setSmanjenPokret(mq.matches);
    const naPromenu = (e: MediaQueryListEvent) => setSmanjenPokret(e.matches);
    mq.addEventListener("change", naPromenu);
    return () => mq.removeEventListener("change", naPromenu);
  }, []);

  return (
    <ReactLenis
      root
      options={{
        lerp: smanjenPokret ? 1 : 0.1,
        smoothWheel: !smanjenPokret,
        syncTouch: false,
      }}
    >
      {children}
    </ReactLenis>
  );
}
