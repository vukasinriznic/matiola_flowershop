import Link from "next/link";
import { PozivDugme } from "@/components/PozivDugme";
import { site } from "@/lib/site";

/**
 * 404. Ne ostavlja korisnika u ćorsokaku — vodi ka ponudi ili pozivu, koji je
 * i inače cilj sajta. Zaglavlje i podnožje dolaze iz layout-a.
 */
export default function NijePronadjeno() {
  return (
    <main className="flex-1">
      <section className="mx-auto max-w-2xl px-6 pb-24 pt-40 text-center">
        <svg
          viewBox="0 0 64 64"
          aria-hidden="true"
          className="mx-auto mb-8 h-14 w-14 text-zelen"
        >
          <g
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Opalo cveće — stabljika bez cveta, latica pored */}
            <path d="M32 58 V26" />
            <path d="M32 44 C24 41 20 34 21 27 C28 28 31 35 32 44 Z" />
            <path d="M44 52 C48 48 48 43 45 40 C41 44 41 49 44 52 Z" />
          </g>
        </svg>

        <h1 className="font-naslov text-4xl leading-tight text-ink sm:text-5xl">
          Ove strane nema
        </h1>
        <p className="mx-auto mt-5 max-w-md text-lg leading-relaxed text-tiho-tekst">
          Možda je buket koji ste tražili skinut sa ponude. Pogledajte šta
          trenutno radimo, ili nas pozovite pa složimo baš ono što vam treba.
        </p>

        <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-4">
          <Link
            href="/buketi"
            className="dugme-tecno dugme-tecno--obris px-7 py-4 text-base font-medium"
          >
            <span className="dt-oznaka">Pogledaj ponudu</span>
          </Link>
          <PozivDugme className="dugme-tecno px-7 py-4 text-base font-medium">
            <span className="dt-oznaka">Pozovi {site.telefonPrikaz}</span>
          </PozivDugme>
        </div>
      </section>
    </main>
  );
}
