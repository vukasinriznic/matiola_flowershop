import type { Metadata } from "next";
import { Suspense, type CSSProperties } from "react";
import { BuketiPregled } from "@/components/BuketiPregled";
import { sviBuketi } from "@/lib/buketi";

// Kašnjenje load-ulaza po elementu (isti obrazac kao hero).
const kasni = (ms: number) => ({ "--kasni": `${ms}ms` }) as CSSProperties;

export const metadata: Metadata = {
  title: "Buketi",
  description:
    "Ponuda buketa Cvećare Matiola iz Kraljeva: za rođendane, venčanja, " +
    "godišnjice i sve prilike između. Pozovite i složićemo buket po vašoj želji.",
};

export default async function BuketiStrana() {
  const buketi = await sviBuketi();

  return (
    <main className="flex-1">
      {/* pt-32: zaglavlje je `fixed`, pa strane bez hero-a moraju same da
          ostave mesto ispod njega. */}
      <section className="mx-auto max-w-6xl px-6 pb-24 pt-32">
        {/* Load-ulaz umesto skrol-otkrivanja: zaglavlje strane je uvek u
            prvom ekranu, pa ulazi odmah, kaskadno (nadnaslov → naslov → opis). */}
        <div className="mb-10 space-y-2">
          <p className="strana-uvod-nadnaslov nadnaslov" style={kasni(80)}>
            Ponuda
          </p>
          <h1
            className="strana-uvod-naslov font-naslov text-5xl leading-tight text-ink"
            style={kasni(180)}
          >
            Buketi
          </h1>
          <p
            className="strana-uvod-blok max-w-xl pt-3 text-lg leading-relaxed text-tiho-tekst"
            style={kasni(320)}
          >
            Svaki buket se pravi po porudžbini. Ono što vidite su primeri, a
            boje, cveće i veličinu dogovaramo telefonom.
          </p>
        </div>

        {/* Suspense je OBAVEZAN: `BuketiPregled` čita `useSearchParams`, a bez
            granice bi cela strana ispala iz statičkog renderovanja. */}
        <Suspense fallback={<div className="min-h-[60vh]" />}>
          <BuketiPregled buketi={buketi} />
        </Suspense>
      </section>
    </main>
  );
}
