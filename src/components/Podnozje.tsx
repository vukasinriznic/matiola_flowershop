import Image from "next/image";
import Link from "next/link";
import { PozivDugme } from "@/components/PozivDugme";
import { grupisiRadnoVreme } from "@/lib/radnoVreme";
import { site } from "@/lib/site";

// Strane u tankom redu footera (bez „Početna" — do nje se ide klikom na logo).
const veze = [
  { href: "/buketi", naziv: "Buketi" },
  { href: "/o-nama", naziv: "O nama" },
  { href: "/kontakt", naziv: "Kontakt" },
];

export function Podnozje() {
  const radnoVreme = grupisiRadnoVreme();

  // „Pon–Sub 08:00–20:00 · Ned 08:00–14:00" — jedan red, iz istog izvora.
  const skracen = (naziv: string) =>
    naziv
      .replace("Ponedeljak", "Pon")
      .replace("Subota", "Sub")
      .replace("Nedelja", "Ned")
      .replace("Utorak", "Uto")
      .replace("Sreda", "Sre")
      .replace("Četvrtak", "Čet")
      .replace("Petak", "Pet");
  const radnoRed = radnoVreme
    .map((g) => `${skracen(g.naziv)} ${g.od}–${g.do}`)
    .join(" · ");

  return (
    <footer className="mt-auto">
      {/* Tanak red: logo + adresa/radno vreme/telefon levo, strane + Instagram
          desno. Akcent-traka poziva je UKLONJENA 21.07.2026 (Vukašin) — vodila
          je isti poziv kao CTA sekcija tik iznad, pa je footer „pobeđivao" nju.
          Telefon je zato vraćen OVDE (kao akcent-link) da kontakt ne nestane. */}
      <div className="bg-sekcija">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" aria-label="Matiola, početna" className="shrink-0">
              <Image
                src="/logo-matiola.png"
                alt="Matiola"
                width={149}
                height={180}
                className="h-12 w-auto"
              />
            </Link>
            <p className="text-sm leading-relaxed text-tiho-tekst">
              {site.adresa.ulica}, {site.adresa.grad}
              <br />
              <span className="text-ink">{radnoRed}</span>
              <br />
              <PozivDugme className="font-medium text-akcent transition-colors duration-200 hover:text-akcent-tamni">
                {site.telefonPrikaz}
              </PozivDugme>
            </p>
          </div>

          <nav
            aria-label="Navigacija u podnožju"
            className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm"
          >
            {veze.map((v) => (
              <Link
                key={v.href}
                href={v.href}
                className="text-ink transition-colors duration-200 hover:text-akcent"
              >
                {v.naziv}
              </Link>
            ))}
            <a
              href={site.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-ink transition-colors duration-200 hover:text-akcent"
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
                className="shrink-0 text-akcent"
              >
                <rect
                  x="3"
                  y="3"
                  width="18"
                  height="18"
                  rx="5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
                <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
              </svg>
              Instagram
            </a>
          </nav>
        </div>
      </div>

      {/* Donja linija — sitni pravni red. */}
      <div className="border-t border-granica bg-sekcija">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-4 text-xs text-tiho-tekst sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.naziv}, Kraljevo
          </p>
          {/* Coverr licenca za besplatno preuzimanje traži kredit. TODO: dodati ime autora videa. */}
          <a
            href="https://coverr.co"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-200 hover:text-akcent-tamni"
          >
            Video: Coverr
          </a>
        </div>
      </div>
    </footer>
  );
}
