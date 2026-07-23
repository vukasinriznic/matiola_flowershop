"use client";

import { useCallback, useRef } from "react";

interface Opcije {
  /** Maksimalna rotacija u stepenima na ivici dugmeta. Podrazumevano 10. */
  jacina?: number;
}

/**
 * "Magnetni" 3D nagib + sjaj koji prati kurzor — dugme se blago nagne ka
 * mišu (rotateX/rotateY preko CSS custom properties koje čita `.dugme-tecno`
 * u globals.css) i unutrašnji sjaj (::before) se pomera na istu poziciju,
 * pa je efekat "shine sweep" + "magnetic tilt" iz jedne mehanike.
 *
 * Samo za uređaje sa mišem (`hover: hover) and (pointer: fine)`) — na dodir
 * (mobilni, primaran uređaj posetilaca) se ništa ne kači, dugme ostaje
 * statično uz običan :active "squish" iz CSS-a. Poštuje i
 * prefers-reduced-motion (bez efekta ako je uključeno).
 *
 * Callback-ref (ne useRef+useEffect) — isti razlog kao kod ostalih dugmića:
 * mobilni-meni verzija dugmeta se montira/demontira uslovno.
 */
export function useMagnetniNagib<T extends HTMLElement>({ jacina = 10 }: Opcije = {}) {
  const skiniRef = useRef<() => void>(undefined);

  return useCallback(
    (el: T | null) => {
      skiniRef.current?.();
      skiniRef.current = undefined;
      if (!el) return;

      const mozeHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      const smanjenPokret = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!mozeHover || smanjenPokret) return;

      const naPomeraj = (e: MouseEvent) => {
        const r = el.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5;
        const ny = (e.clientY - r.top) / r.height - 0.5;
        el.style.setProperty("--dt-ry", `${nx * jacina}deg`);
        el.style.setProperty("--dt-rx", `${-ny * jacina}deg`);
        el.style.setProperty("--dt-mx", `${(nx + 0.5) * 100}%`);
        el.style.setProperty("--dt-my", `${(ny + 0.5) * 100}%`);
        el.style.setProperty("--dt-scale", "1.02");
      };
      const naOdlazak = () => {
        el.style.removeProperty("--dt-rx");
        el.style.removeProperty("--dt-ry");
        el.style.removeProperty("--dt-mx");
        el.style.removeProperty("--dt-my");
        el.style.removeProperty("--dt-scale");
      };

      el.addEventListener("mousemove", naPomeraj);
      el.addEventListener("mouseleave", naOdlazak);
      skiniRef.current = () => {
        el.removeEventListener("mousemove", naPomeraj);
        el.removeEventListener("mouseleave", naOdlazak);
      };
    },
    [jacina],
  );
}
