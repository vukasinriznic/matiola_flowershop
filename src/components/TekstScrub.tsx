"use client";

import { useCallback, useEffect, useRef } from "react";
import { useLenis } from "lenis/react";

/**
 * Pasus koji se otkriva karakter po karakter, vezano za SKROL — isti recept
 * kao tekst u uvodnoj sekvenci (UvodONama.tsx), prenet sa referentnog sajta
 * (patriot-winery.webflow.io): karakteri tinjaju na 0.3 pa se pale redom
 * (stagger + circOut), scrub — skrol naviše ih gasi.
 *
 * Napredak je vezan za položaj samog pasusa (kao njihov ScrollTrigger
 * `start: 'top bottom', end: 'top center'`): 0 kad vrh pasusa uđe na dno
 * ekrana, 1 kad stigne do polovine. Više pasusa na strani se tako pali u
 * nizu, svaki kroz svoj prolaz.
 *
 * Vozi se iz `useLenis` petlje (isti takt kao peglanje — vidi Hero.tsx).
 * prefers-reduced-motion: bez scrub-a, sav tekst odmah upaljen.
 *
 * Čitačima ekrana ceo pasus daje aria-label, spanovi su aria-hidden —
 * isečen tekst bi se inače sricao slovo po slovo.
 */
const KORAK = 0.1; // stagger između susednih karaktera
const TRAJANJE = 1; // "duration" paljenja jednog karaktera, u istoj skali
const TINJANJE = 0.3; // početna opacity karaktera

const stegni = (v: number) => Math.min(Math.max(v, 0), 1);
const circOut = (k: number) => Math.sqrt(1 - (1 - k) * (1 - k));

export function TekstScrub({
  tekst,
  className = "",
}: {
  tekst: string;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const charoviRef = useRef<HTMLElement[]>([]);
  const smanjenPokretRef = useRef(false);

  const primeni = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    const vh = window.innerHeight;
    const vrh = el.getBoundingClientRect().top;
    // 'top bottom' → 'top center' sa referenta.
    const napredak = stegni((vh - vrh) / (vh / 2));

    const charovi = charoviRef.current;
    const n = charovi.length;
    if (n === 0) return;
    const ukupno = KORAK * (n - 1) + TRAJANJE;
    const t = napredak * ukupno;
    for (let i = 0; i < n; i++) {
      const k = stegni((t - KORAK * i) / TRAJANJE);
      charovi[i].style.opacity = String(TINJANJE + (1 - TINJANJE) * circOut(k));
    }
  }, []);

  useEffect(() => {
    const el = ref.current;
    charoviRef.current = el
      ? Array.from(el.querySelectorAll<HTMLElement>(".uvod-char"))
      : [];

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    smanjenPokretRef.current = reduced;

    if (reduced) {
      for (const c of charoviRef.current) c.style.opacity = "1";
      return;
    }

    primeni(); // početno stanje pre prvog skrola
    window.addEventListener("resize", primeni);
    return () => window.removeEventListener("resize", primeni);
  }, [primeni]);

  // Isti takt kao Lenisovo peglanje — deps obavezni (vidi Hero.tsx).
  useLenis(() => {
    if (!smanjenPokretRef.current) primeni();
  }, [primeni]);

  const reci = tekst.split(" ");

  return (
    <p ref={ref} aria-label={tekst} className={className}>
      {reci.map((rec, ri) => (
        <span key={ri}>
          <span aria-hidden="true" className="inline-block">
            {Array.from(rec).map((ch, ci) => (
              <span
                key={ci}
                className="uvod-char inline-block"
                style={{ opacity: TINJANJE }}
              >
                {ch}
              </span>
            ))}
          </span>{" "}
        </span>
      ))}
    </p>
  );
}
