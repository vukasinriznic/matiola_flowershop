import Link from "next/link";
import { formatCena, type Buket } from "@/lib/buketi";
import { kategorije } from "@/lib/site";
import { SlikaBuketa } from "./SlikaBuketa";

export function BuketKartica({
  buket,
  prioritet = false,
}: {
  buket: Buket;
  prioritet?: boolean;
}) {
  const kategorija = kategorije.find((k) => k.slug === buket.kategorija);

  return (
    <Link href={`/buketi/${buket.slug}`} className="group block">
      <article className="space-y-3">
        <div className="relative aspect-[4/5] overflow-hidden rounded-nezno bg-sekcija">
          <SlikaBuketa
            slikaUrl={buket.slikaUrl}
            naziv={buket.naziv}
            slug={buket.slug}
            prioritet={prioritet}
            klasa="transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        </div>

        <div className="space-y-1">
          {kategorija && <p className="nadnaslov">{kategorija.naziv}</p>}
          <h3 className="font-naslov text-xl text-ink transition-colors duration-200 group-hover:text-akcent">
            {buket.naziv}
          </h3>
          <p className="text-sm text-tiho-tekst">{formatCena(buket.cenaOd)}</p>
        </div>
      </article>
    </Link>
  );
}
