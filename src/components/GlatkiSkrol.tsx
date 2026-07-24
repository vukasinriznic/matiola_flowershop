"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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
      <ResetSkrolNaNavigaciju />
      {children}
    </ReactLenis>
  );
}

/**
 * Vrati skrol na vrh pri promeni rute.
 *
 * Next-ov App Router inače sam skroluje na vrh pri navigaciji, ali Lenis u
 * `root` režimu upravlja skrolom prozora pa taj reset ne stigne — nova strana
 * ostane na staroj poziciji („baci u sredinu"). Zato na promenu `pathname`
 * ručno vraćamo Lenis na 0, `immediate` (bez animacije — ne želimo da vidimo
 * kako strana kliza sa dna na vrh).
 *
 * Prvi render se preskače (`prvi` ref): tada je strana ionako na vrhu, a i
 * čuva `#hash` skrol kad neko dođe na duboki link.
 */
function ResetSkrolNaNavigaciju() {
  const lenis = useLenis();
  const pathname = usePathname();
  const prvi = useRef(true);

  useEffect(() => {
    if (prvi.current) {
      prvi.current = false;
      return;
    }
    lenis?.scrollTo(0, { immediate: true });
  }, [pathname, lenis]);

  return null;
}
