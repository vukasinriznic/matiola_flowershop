import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { KategorijaSlug } from "@/lib/site";

/**
 * Pločica kategorije — zamenjuje ravan red tekstualnih pilula.
 *
 * Dva stanja, po tome da li kategorija ima `slika` (vidi site.ts):
 *  - SA FOTOGRAFIJOM: slika preko cele pločice + svetli zastor pri dnu.
 *  - BEZ NJE (fallback): tanak linijski botanički motiv u uglu, kao i do sada.
 *
 * Zastor je SVETAO (canvas), a tekst ostaje ink — isto rešenje kao u herou, gde
 * je mereno da belo na tamnom zastoru pada na fotografijama sa svetlim delovima.
 * Ide samo preko donje trećine, da fotografija ostane izražena.
 *
 * Motivi se rotiraju preko `indeks`-a — nekoliko različitih crteža je dovoljno da
 * pločice ne izgledaju kao kopija jedna druge.
 */
const motivi: ReactNode[] = [
  // Cvet u punom cvatu — latice oko sredine
  <>
    <circle cx="32" cy="32" r="5" />
    <circle cx="44" cy="32" r="4" />
    <circle cx="38" cy="42.4" r="4" />
    <circle cx="26" cy="42.4" r="4" />
    <circle cx="20" cy="32" r="4" />
    <circle cx="26" cy="21.6" r="4" />
    <circle cx="38" cy="21.6" r="4" />
  </>,
  // Grančica sa listovima
  <>
    <path d="M32 58 V10" />
    <path d="M32 46 C24 44 20 38 21 32 C28 33 31 39 32 46 Z" />
    <path d="M32 38 C40 36 44 30 43 24 C36 25 33 31 32 38 Z" />
    <path d="M32 30 C24 28 20 22 21 16 C28 17 31 23 32 30 Z" />
  </>,
  // Jedan stabljikasti cvet
  <>
    <path d="M32 58 V20" />
    <path d="M32 40 C24 37 20 30 21 23 C28 24 31 31 32 40 Z" />
    <path d="M32 34 C40 31 44 24 43 18 C36 19 33 25 32 34 Z" />
    <circle cx="32" cy="15" r="4" />
    <circle cx="32" cy="15" r="1.6" />
  </>,
  // Venac — prsten sa dva lista
  <>
    <circle cx="32" cy="34" r="15" />
    <path d="M24 20 C20 16 20 11 23 8 C27 12 27 17 24 20 Z" />
    <path d="M40 20 C44 16 44 11 41 8 C37 12 37 17 40 20 Z" />
  </>,
];

export function KategorijaPlocica({
  slug,
  naziv,
  indeks,
  slika,
  fokus,
}: {
  slug: KategorijaSlug;
  naziv: string;
  indeks: number;
  slika?: string | null;
  fokus?: string;
}) {
  return (
    <Link
      href={`/buketi?kategorija=${slug}`}
      className="kat-plocica group relative flex aspect-[5/3] flex-col justify-end overflow-hidden rounded-nezno border border-granica bg-card p-5 transition-colors duration-200 hover:border-akcent"
    >
      {slika ? (
        <>
          {/* Paralaks sloj — viši od pločice za 10% na svaku stranu, pa slika
              ima kroz šta da kliza dok pločica prolazi kroz vidno polje
              (`.kat-paralaks` u globals.css). Zaliha je i razlog što je sloj
              zaseban: `fill` slici zakucava `inset: 0`, tj. tačno pločicu. */}
          <div
            aria-hidden="true"
            className="kat-paralaks pointer-events-none absolute inset-x-0 -inset-y-[10%]"
          >
            {/* `sizes`: pločice su 2 u redu na mobilnom, 3 od `sm` naviše, u
                mreži od najviše 1152px — bez ovoga Next šalje sliku za pun ekran. */}
            <Image
              src={slika}
              alt=""
              fill
              sizes="(min-width: 1024px) 368px, (min-width: 640px) 33vw, 50vw"
              style={{ objectPosition: fokus }}
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
          </div>
          {/* Zastor preko donjih 60% — naziv sedi na ~0.86 canvas-a, pa ink
              tekst drži kontrast i preko tamnih fotografija (rođendan ima crnu
              pozadinu). Gornji deo pločice ostaje čist, zato fokus u site.ts
              gura cveće naviše. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-canvas via-canvas/70 to-transparent"
          />
        </>
      ) : (
        <svg
          viewBox="0 0 64 64"
          aria-hidden="true"
          className="pointer-events-none absolute -right-3 -top-3 h-24 w-24 text-zelen opacity-[0.16] transition-opacity duration-300 group-hover:opacity-30"
        >
          <g
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {motivi[indeks % motivi.length]}
          </g>
        </svg>
      )}

      <span className="relative flex items-center justify-between gap-2 text-sm text-ink transition-colors duration-200 group-hover:text-akcent">
        {naziv}
        <svg
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
          className="shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
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
    </Link>
  );
}
