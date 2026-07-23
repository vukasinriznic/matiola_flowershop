import Link from "next/link";
import { formatCena, type Buket } from "@/lib/buketi";
import { kategorije } from "@/lib/site";
import { SlikaBuketa } from "./SlikaBuketa";

/**
 * Veliki „feature" buket — asimetričan blok: velika slika + naziv, opis i poziv
 * na akciju pored nje. Razbija ravnomerni grid i daje fotografiji prostor da
 * diše (uređivački stil vođen slikom). Na telefonu se slaže vertikalno.
 */
export function BuketIzdvojen({ buket }: { buket: Buket }) {
  const kategorija = kategorije.find((k) => k.slug === buket.kategorija);

  return (
    <Link
      href={`/buketi/${buket.slug}`}
      className="group grid items-center gap-8 sm:grid-cols-2 sm:gap-12"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-nezno bg-sekcija">
        <SlikaBuketa
          slikaUrl={buket.slikaUrl}
          naziv={buket.naziv}
          slug={buket.slug}
          prioritet
          klasa="transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
      </div>

      <div className="space-y-4">
        {kategorija && <p className="nadnaslov">{kategorija.naziv}</p>}
        <h3 className="font-naslov text-3xl leading-tight text-ink transition-colors duration-200 group-hover:text-akcent sm:text-4xl">
          {buket.naziv}
        </h3>
        <p className="max-w-md leading-relaxed text-tiho-tekst">{buket.opis}</p>
        <p className="text-sm text-tiho-tekst">{formatCena(buket.cenaOd)}</p>
        <span className="inline-flex items-center gap-2 pt-1 text-sm text-akcent transition-colors duration-200 group-hover:text-akcent-tamni">
          Pogledaj buket
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
            className="transition-transform duration-200 group-hover:translate-x-1"
          >
            <path
              d="M3 8h10M9 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </Link>
  );
}
