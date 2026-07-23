"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Otkrij } from "@/components/Otkrij";
import { BuketKartica } from "@/components/BuketKartica";
import { kategorije } from "@/lib/site";
import type { Buket } from "@/lib/buketi";

/**
 * Spisak buketa sa filterom po kategoriji.
 *
 * Filtriranje ide na KLIJENTU, iako bi `searchParams` u server komponenti bilo
 * kraće. Razlog: `searchParams` je request-time API i prebacio bi stranu u
 * dinamičko renderovanje, pa bi sajtu trebao Node server. Ovako `/buketi`
 * ostaje statična strana koja može na najjeftiniji hosting — a filter nad
 * šačicom buketa je posao za par milisekundi u pregledaču.
 *
 * URL se i dalje menja (`?kategorija=...`), pa se link može podeliti i osvežiti.
 * Pločice kategorija sa početne vode baš ovde.
 */
export function BuketiPregled({ buketi }: { buketi: Buket[] }) {
  const aktivna = useSearchParams().get("kategorija");

  // Nepoznata kategorija u URL-u (npr. ručno otkucana) ne sme da da prazan
  // ekran bez objašnjenja — tretiramo je kao „sve".
  const vazeca = kategorije.some((k) => k.slug === aktivna) ? aktivna : null;
  const prikazani = vazeca
    ? buketi.filter((b) => b.kategorija === vazeca)
    : buketi;

  return (
    <>
      {/* Filter — linkovi, ne dugmad: menjaju URL, rade sa nazad/napred
          dugmetom i mogu se podeliti. `scroll={false}` da klik na filter ne
          skoči na vrh strane. */}
      <nav
        aria-label="Filter po kategoriji"
        className="strana-uvod-blok mb-10"
        style={{ "--kasni": "440ms" } as React.CSSProperties}
      >
        <ul className="flex flex-wrap gap-2">
          <li>
            <Pilula href="/buketi" aktivna={vazeca === null}>
              Sve
            </Pilula>
          </li>
          {kategorije.map((k) => (
            <li key={k.slug}>
              <Pilula
                href={`/buketi?kategorija=${k.slug}`}
                aktivna={vazeca === k.slug}
              >
                {k.naziv}
              </Pilula>
            </li>
          ))}
        </ul>
      </nav>

      {prikazani.length > 0 ? (
        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {prikazani.map((b, i) => (
            <Otkrij key={b.id} kasnjenje={(i % 3) * 90}>
              <BuketKartica buket={b} prioritet={i < 3} />
            </Otkrij>
          ))}
        </div>
      ) : (
        /* Prazna kategorija je očekivano stanje dok se ponuda ne popuni — ne
           ostavljati prazninu, nego voditi ka pozivu, koji je i inače cilj. */
        <p className="py-10 text-tiho-tekst">
          U ovoj kategoriji trenutno nema izloženih buketa.{" "}
          <Link href="/kontakt" className="text-akcent hover:text-akcent-tamni">
            Pozovite nas
          </Link>{" "}
          i složićemo buket po vašoj želji.
        </p>
      )}
    </>
  );
}

function Pilula({
  href,
  aktivna,
  children,
}: {
  href: string;
  aktivna: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={aktivna ? "true" : undefined}
      className={`inline-block rounded-full border px-4 py-2 text-sm transition-colors duration-200 ${
        aktivna
          ? "border-akcent bg-akcent text-white"
          : "border-granica text-ink hover:border-akcent hover:text-akcent"
      }`}
    >
      {children}
    </Link>
  );
}
