import Link from "next/link";
import { Hero } from "@/components/Hero";
import { Otkrij } from "@/components/Otkrij";
import { BuketKartica } from "@/components/BuketKartica";
import { BuketIzdvojen } from "@/components/BuketIzdvojen";
import { KategorijaPlocica } from "@/components/KategorijaPlocica";
import { PozivDugme } from "@/components/PozivDugme";
import { RadnoStanje } from "@/components/RadnoStanje";
import { istaknutiBuketi } from "@/lib/buketi";
import { kategorije, site } from "@/lib/site";

export default async function Pocetna() {
  const istaknuti = await istaknutiBuketi();
  const [prviIstaknut, ...ostaliIstaknuti] = istaknuti;

  return (
    <main className="flex-1">
      <Hero />

      {/* Istaknuti buketi */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <Otkrij fokus>
          <div className="mb-10 flex items-end justify-between gap-6">
            <div className="space-y-2">
              <p className="nadnaslov">Izdvojeno</p>
              <h2 className="font-naslov text-4xl text-ink">
                Buketi ovog meseca
              </h2>
            </div>
            <Link
              href="/buketi"
              className="hidden shrink-0 text-sm text-akcent transition-colors duration-200 hover:text-akcent-tamni sm:block"
            >
              Svi buketi →
            </Link>
          </div>
        </Otkrij>

        {prviIstaknut && (
          <Otkrij>
            <BuketIzdvojen buket={prviIstaknut} />
          </Otkrij>
        )}

        {ostaliIstaknuti.length > 0 && (
          <div className="mt-16 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {ostaliIstaknuti.map((b, i) => (
              <Otkrij key={b.id} kasnjenje={i * 90}>
                <BuketKartica buket={b} />
              </Otkrij>
            ))}
          </div>
        )}

        <Link
          href="/buketi"
          className="mt-10 block text-sm text-akcent transition-colors duration-200 hover:text-akcent-tamni sm:hidden"
        >
          Svi buketi →
        </Link>
      </section>

      {/* Kategorije */}
      <section className="border-y border-granica bg-sekcija">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <Otkrij fokus>
            <div className="mb-10 space-y-2">
              <p className="nadnaslov">Za svaku priliku</p>
              <h2 className="font-naslov text-4xl text-ink">Šta vam treba?</h2>
            </div>
          </Otkrij>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {kategorije.map((k, i) => (
              <Otkrij key={k.slug} kasnjenje={(i % 3) * 80}>
                <KategorijaPlocica
                  slug={k.slug}
                  naziv={k.naziv}
                  indeks={i}
                  slika={k.slika}
                  fokus={k.fokus}
                />
              </Otkrij>
            ))}
          </div>
        </div>
      </section>

      {/* Poziv na akciju — premium kroz MATERIJAL i tipografiju, bez ijednog
          crteža. Dublja roze podloga (sekcija-jaka) sa mekim unutrašnjim sjajem
          i papirnatim zrnom (.cta-materijal / .cta-zrno u globals.css); veliki
          serif, mnogo vazduha, i jedan diskretan detalj — tanke crtice oko
          nadnaslova. Presudan blok pred footerom, uliva se u njega. */}
      <section className="cta-materijal relative overflow-hidden">
        <div
          aria-hidden="true"
          className="cta-zrno pointer-events-none absolute inset-0"
        />

        <div className="relative mx-auto max-w-3xl px-6 py-28 text-center sm:py-32">
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
          </Otkrij>
        </div>
      </section>
    </main>
  );
}
