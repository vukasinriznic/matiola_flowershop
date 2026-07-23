import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Otkrij } from "@/components/Otkrij";
import { PozivDugme } from "@/components/PozivDugme";
import { SlikaBuketa } from "@/components/SlikaBuketa";
import { BuketKartica } from "@/components/BuketKartica";
import { RadnoStanje } from "@/components/RadnoStanje";
import { buketPoSlugu, sviBuketi, formatCena } from "@/lib/buketi";
import { kategorije, site } from "@/lib/site";

/**
 * Detalj buketa.
 *
 * `generateStaticParams` unapred izgeneriše stranu za svaki buket, pa sajt
 * ostaje potpuno statičan. Kad se buket doda u `buketi.ts`, nova strana nastane
 * sama pri sledećem build-u — ništa se ovde ne dira.
 */
export async function generateStaticParams() {
  const buketi = await sviBuketi();
  return buketi.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/buketi/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const buket = await buketPoSlugu(slug);
  if (!buket) return { title: "Buket nije pronađen" };

  return {
    title: buket.naziv,
    description: buket.opis,
    openGraph: {
      title: `${buket.naziv} · ${site.naziv}`,
      description: buket.opis,
      type: "article",
    },
  };
}

export default async function BuketStrana({
  params,
}: PageProps<"/buketi/[slug]">) {
  const { slug } = await params;
  const buket = await buketPoSlugu(slug);

  // Slug iz URL-a je proizvoljan tekst — nepostojeći vodi na 404, ne na pad.
  if (!buket) notFound();

  const kategorija = kategorije.find((k) => k.slug === buket.kategorija);

  // Srodni buketi — iz iste kategorije, bez ovog. Prazan niz je uredu:
  // sekcija se onda ne prikazuje.
  const svi = await sviBuketi();
  const srodni = svi
    .filter((b) => b.kategorija === buket.kategorija && b.id !== buket.id)
    .slice(0, 3);

  return (
    <main className="flex-1">
      <article className="mx-auto max-w-6xl px-6 pb-24 pt-32">
        <Otkrij>
          <Link
            href="/buketi"
            className="mb-8 inline-block text-sm text-akcent transition-colors duration-200 hover:text-akcent-tamni"
          >
            ← Svi buketi
          </Link>
        </Otkrij>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <Otkrij>
            <div className="relative aspect-[4/5] overflow-hidden rounded-nezno bg-sekcija">
              <SlikaBuketa
                slikaUrl={buket.slikaUrl}
                naziv={buket.naziv}
                slug={buket.slug}
                prioritet
              />
            </div>
          </Otkrij>

          <Otkrij fokus>
            <div className="lg:pt-6">
              {kategorija && (
                <Link
                  href={`/buketi?kategorija=${kategorija.slug}`}
                  className="nadnaslov text-akcent transition-colors duration-200 hover:text-akcent-tamni"
                >
                  {kategorija.naziv}
                </Link>
              )}
              <h1 className="mt-3 font-naslov text-5xl leading-tight text-ink">
                {buket.naziv}
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-tiho-tekst">
                {buket.opis}
              </p>

              {buket.sastav.length > 0 && (
                <div className="mt-8">
                  <p className="nadnaslov">U buketu</p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {buket.sastav.map((s) => (
                      <li
                        key={s}
                        className="rounded-full border border-granica px-3 py-1.5 text-sm text-ink"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <p className="mt-8 font-naslov text-2xl text-ink">
                {formatCena(buket.cenaOd)}
              </p>

              {/* Poziv je jedina konverzija sajta — nema korpe ni forme. */}
              <div className="mt-8 space-y-4 border-t border-granica pt-8">
                <PozivDugme className="dugme-tecno inline-block px-7 py-4 text-base font-medium">
                  <span className="dt-oznaka">
                    Pozovi {site.telefonPrikaz}
                  </span>
                </PozivDugme>
                <div>
                  <RadnoStanje />
                </div>
                <p className="max-w-md text-sm leading-relaxed text-tiho-tekst">
                  Pozovite i recite za koju je priliku. Buket radimo po vašoj
                  želji, u bojama i cveću koje izaberete.
                </p>
              </div>
            </div>
          </Otkrij>
        </div>

        {srodni.length > 0 && (
          <section className="mt-24 border-t border-granica pt-16">
            <Otkrij fokus>
              <h2 className="mb-10 font-naslov text-3xl text-ink">
                Slično iz iste prilike
              </h2>
            </Otkrij>
            <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {srodni.map((b, i) => (
                <Otkrij key={b.id} kasnjenje={i * 90}>
                  <BuketKartica buket={b} />
                </Otkrij>
              ))}
            </div>
          </section>
        )}
      </article>
    </main>
  );
}
