import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { PozivDugme } from "@/components/PozivDugme";
import { RadnoStanje } from "@/components/RadnoStanje";
import { grupisiRadnoVreme } from "@/lib/radnoVreme";
import { site } from "@/lib/site";

// Kašnjenje load-ulaza po elementu (isti obrazac kao hero).
const kasni = (ms: number) => ({ "--kasni": `${ms}ms` }) as CSSProperties;

/**
 * Srpski nazivi dana → schema.org `DayOfWeek`.
 *
 * Obavezno: schema.org priznaje isključivo engleske vrednosti. Sa „Ponedeljak"
 * blok radnog vremena je sintaksno ispravan JSON, ali ga Google odbacuje kao
 * nepoznat dan — dakle tiho ne radi ništa. Otkriveno proverom izlaza, ne bi se
 * videlo na stranici.
 */
const DAN_U_SEMI: Record<(typeof site.radnoVreme)[number]["dan"], string> = {
  Ponedeljak: "Monday",
  Utorak: "Tuesday",
  Sreda: "Wednesday",
  Četvrtak: "Thursday",
  Petak: "Friday",
  Subota: "Saturday",
  Nedelja: "Sunday",
};

export const metadata: Metadata = {
  title: "Kontakt",
  description: `Cvećara Matiola, ${site.adresa.ulica}, ${site.adresa.grad}. Pozovite nas ili svratite; buket radimo po vašoj želji.`,
};

/**
 * Kontakt.
 *
 * NEMA forme za poruku, namerno: sajt je bez backend-a (varijanta bez baze),
 * pa forma ne bi imala gde da šalje, a kupci ionako zovu telefonom — to je
 * jedina konverzija sajta. Sve ovde vodi ka pozivu ili dolasku u radnju.
 */
export default function KontaktStrana() {
  const { ulica, grad, postanski, drzava } = site.adresa;
  const punaAdresa = `${ulica}, ${postanski} ${grad}`;
  const mapaUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${site.naziv}, ${punaAdresa}`,
  )}`;
  // Embed bez API ključa (`output=embed`) — upit po nazivu + adresi, ne po
  // koordinatama, da Google zakači SVOJ listing radnje (pin sa imenom,
  // ocenama i dugmetom „Uputstva"), a ne goli pin na koordinatama.
  const mapaEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(
    `${site.naziv}, ${punaAdresa}`,
  )}&output=embed&hl=sr`;
  const radnoVreme = grupisiRadnoVreme();

  return (
    <main className="flex-1">
      <section className="mx-auto max-w-6xl px-6 pb-24 pt-32">
        {/* Load-ulaz umesto skrol-otkrivanja: cela strana staje u ekran-dva,
            pa sve ulazi odmah, kaskadno (zaglavlje → informacije → mapa). */}
        <div className="mb-12 space-y-2">
          <p className="strana-uvod-nadnaslov nadnaslov" style={kasni(80)}>
            Javite se
          </p>
          <h1
            className="strana-uvod-naslov font-naslov text-5xl leading-tight text-ink"
            style={kasni(180)}
          >
            Kontakt
          </h1>
          <p
            className="strana-uvod-blok max-w-xl pt-3 text-lg leading-relaxed text-tiho-tekst"
            style={kasni(320)}
          >
            Najbrže je telefonom: recite za koju je priliku i kad vam treba,
            pa se dogovorimo oko cveća i boja. Možete i svratiti u radnju.
          </p>
        </div>

        {/* Dve ravnopravne kolone: levo sve informacije u urednim grupama,
            desno mapa u okviru visine cele kolone. Radno vreme je SAŽETO
            (grupisiRadnoVreme — isti izvor kao footer), ne tabela od 7 redova
            koja je ranije vizuelno prevagnula stranu. */}
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div className="strana-uvod-blok" style={kasni(440)}>
            <div className="flex h-full flex-col gap-9">
              <div className="space-y-4">
                <p className="nadnaslov">Telefon</p>
                <PozivDugme className="dugme-tecno inline-block px-7 py-4 text-base font-medium">
                  <span className="dt-oznaka">
                    Pozovi {site.telefonPrikaz}
                  </span>
                </PozivDugme>
                <div>
                  <RadnoStanje />
                </div>
              </div>

              <div className="space-y-3">
                <p className="nadnaslov">Adresa</p>
                <address className="not-italic leading-relaxed text-ink">
                  {ulica}, {postanski} {grad}, {drzava}
                </address>
                <a
                  href={mapaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-sm text-akcent transition-colors duration-200 hover:text-akcent-tamni"
                >
                  Otvori u Google mapama →
                </a>
              </div>

              <div className="space-y-3">
                <p className="nadnaslov">Radno vreme</p>
                <ul className="max-w-xs space-y-1.5">
                  {radnoVreme.map((g) => (
                    <li
                      key={g.naziv}
                      className="flex justify-between gap-6 text-ink"
                    >
                      <span className="text-tiho-tekst">{g.naziv}</span>
                      <span className="tabular-nums">
                        {g.od}–{g.do}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <p className="nadnaslov">Instagram</p>
                <a
                  href={site.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-ink transition-colors duration-200 hover:text-akcent"
                >
                  Pogledajte skorašnje bukete →
                </a>
              </div>

              <p className="mt-auto max-w-sm border-t border-granica pt-6 text-sm leading-relaxed text-tiho-tekst">
                Za venčanja i veće aranžmane javite se ranije, jer se takvi
                buketi dogovaraju unapred.
              </p>
            </div>
          </div>

          <div className="strana-uvod-blok h-full" style={kasni(560)}>
            {/* Mapa raste sa levom kolonom (h-full), a min-visina čuva format
                na telefonu gde je kolona ispod informacija. */}
            <div className="relative h-full min-h-[380px] overflow-hidden rounded-nezno border border-granica bg-sekcija lg:min-h-[480px]">
              <iframe
                src={mapaEmbedUrl}
                title={`Mapa: ${site.naziv}, ${punaAdresa}`}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full border-0"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Strukturirani podaci — bez njih se mala radnja teško nalazi u lokalnoj
          pretrazi. Koordinate stoje u site.ts baš zbog ovoga.
          `openingHoursSpecification` se generiše iz istog izvora kao i tabela
          gore, pa ne mogu da se raziđu. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Florist",
            name: site.naziv,
            description: site.opis,
            telephone: site.telefon,
            address: {
              "@type": "PostalAddress",
              streetAddress: ulica,
              addressLocality: grad,
              postalCode: postanski,
              addressCountry: "RS",
            },
            geo: {
              "@type": "GeoCoordinates",
              latitude: site.koordinate.lat,
              longitude: site.koordinate.lng,
            },
            openingHoursSpecification: site.radnoVreme.map((d) => ({
              "@type": "OpeningHoursSpecification",
              dayOfWeek: DAN_U_SEMI[d.dan],
              opens: d.od,
              closes: d.do,
            })),
            sameAs: [site.instagram],
          }),
        }}
      />
    </main>
  );
}
