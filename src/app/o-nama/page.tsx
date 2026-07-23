import type { Metadata } from "next";
import Link from "next/link";
import { Otkrij } from "@/components/Otkrij";
import { PozivDugme } from "@/components/PozivDugme";
import { TekstScrub } from "@/components/TekstScrub";
import { UvodONama } from "@/components/UvodONama";
import { RadnoStanje } from "@/components/RadnoStanje";
import { site } from "@/lib/site";

/**
 * ⚠️ SVE U OVOM BLOKU JE IZMIŠLJENO I NE SME U PRODUKCIJU.
 *
 * Vukašin je 21.07.2026. tražio popunjen tekst da vidi kako strana izgleda,
 * dok vlasnica ne pošalje pravu priču. Ovo su tvrdnje o STVARNOJ firmi —
 * godina osnivanja, ime vlasnice i način rada nisu provereni ni sa kim.
 *
 * Sve nepotvrđeno je namerno skupljeno OVDE, a ne razasuto po JSX-u, da se
 * vidi tačno šta treba zameniti i da ništa ne ostane previđeno.
 *
 * TODO(vlasnica): potvrditi svaku stavku, pa obrisati ovaj komentar.
 */
const TEKST_ZA_POTVRDU = {
  godinaOsnivanja: "2011",
  imeVlasnice: "Snežana",
  // Rečenice ispod su napisane da zvuče kao mala porodična cvećara — nisu
  // ničije reči i verovatno ih treba prepisati vlasničinim jezikom.
  uvod:
    "Matiola je mala cvećara u Kraljevu. Ne pravimo bukete unapred da stoje " +
    "u izlogu - svaki se slaže onda kada ga neko naruči, od cveća koje je te " +
    "nedelje stiglo.",
  prica:
    "Počelo je iz ljubavi prema cveću i jedne male tezge na pijaci. Danas je " +
    "to radnja u Žičkoj, ali se ništa bitno nije promenilo: i dalje sami " +
    "biramo svaki cvet i sami vezujemo svaki buket.",
  odnosPremaKupcima:
    "Volimo kad nam se javite i ispričate za koga je buket. Iz toga se " +
    "najbolje vidi šta treba: da li nešto tiho i belo, ili nešto što će " +
    "nasmejati čim se ugleda.",
} as const;

export const metadata: Metadata = {
  title: "O nama",
  description: `${site.naziv} je mala cvećara u Kraljevu (${site.adresa.ulica}). Buketi se rade ručno, po porudžbini.`,
};

export default function ONamaStrana() {
  return (
    <main className="flex-1">
      {/* Uvodna sekvenca — fotografija lokala fiksirana na vrhu raste skrolom
          do punog ekrana, pa se preko nje otkriva tekst (vidi UvodONama.tsx). */}
      <UvodONama uvod={TEKST_ZA_POTVRDU.uvod} />

      {/* Priča u roze sekciji — pasusi se otkrivaju karakter po karakter na
          skrol (TekstScrub), istim potpisom kao tekst u uvodnoj sekvenci;
          zato i isti serif stil, da se dve celine čitaju kao jedna priča. */}
      <section className="border-y border-granica bg-sekcija">
        <div className="mx-auto max-w-3xl space-y-10 px-6 py-24">
          <TekstScrub
            tekst={TEKST_ZA_POTVRDU.prica}
            className="font-naslov text-2xl leading-relaxed text-ink sm:text-3xl"
          />
          <TekstScrub
            tekst={TEKST_ZA_POTVRDU.odnosPremaKupcima}
            className="font-naslov text-2xl leading-relaxed text-ink sm:text-3xl"
          />
          <Otkrij>
            <p className="text-sm text-tiho-tekst">
              — {TEKST_ZA_POTVRDU.imeVlasnice}, Cvećara Matiola, od{" "}
              {TEKST_ZA_POTVRDU.godinaOsnivanja}.
            </p>
          </Otkrij>
        </div>
      </section>

      {/* Poziv na akciju — ista postavka kao CTA na početnoj (page.tsx), po
          dogovoru: bez roze materijala i zrna (pozadina ostaje canvas) i sa
          zadržanim linkom ka ponudi buketa na dnu. */}
      <section>
        <div className="mx-auto max-w-3xl px-6 py-28 text-center sm:py-32">
          <Otkrij fokus>
            {/* Diskretan detalj — nadnaslov uokviren tankim crticama. */}
            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-akcent/30" aria-hidden="true" />
              <p className="nadnaslov">Po vašoj želji</p>
              <span className="h-px w-8 bg-akcent/30" aria-hidden="true" />
            </div>
            <h2 className="mx-auto mt-5 max-w-xl font-naslov text-[2.5rem] leading-[1.08] text-ink sm:text-6xl">
              Da složimo nešto samo za vas?
            </h2>
            <p className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-tiho-tekst">
              Recite nam povod i koga darujete. Cveće, boje i veličinu biramo
              zajedno, telefonom ili u radnji.
            </p>
            <PozivDugme className="dugme-tecno mt-10 inline-block px-9 py-4.5 text-base font-medium">
              <span className="dt-oznaka">Pozovi {site.telefonPrikaz}</span>
            </PozivDugme>
            <div className="mt-6 flex justify-center">
              <RadnoStanje />
            </div>
            <p className="mt-8 text-sm">
              <Link
                href="/buketi"
                className="text-akcent transition-colors duration-200 hover:text-akcent-tamni"
              >
                Pogledajte ponudu buketa →
              </Link>
            </p>
          </Otkrij>
        </div>
      </section>
    </main>
  );
}
