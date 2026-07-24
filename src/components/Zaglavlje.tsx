"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type CSSProperties } from "react";
import { PozivDugme } from "@/components/PozivDugme";
import { site } from "@/lib/site";

const veze = [
  { href: "/buketi", naziv: "Buketi" },
  { href: "/o-nama", naziv: "O nama" },
  { href: "/kontakt", naziv: "Kontakt" },
];

export function Zaglavlje() {
  const [otvoren, setOtvoren] = useState(false);
  const putanja = usePathname();
  const naPocetnoj = putanja === "/";

  // Sadržaj nava (logo/linkovi/„Pozovi" dugme) je vidljiv OD POČETKA (load-ulaz)
  // i pluta nad heroom. Ono što se NE vidi dok traje scrub je OBLIK nava:
  // stakleni kontejner (pozadina/ivica/senka/blur) je providan nad heroom i
  // MATERIJALIZUJE se u floating pill tek kad se otvaranje cveta završi
  // (scrollY >= innerHeight), pa takav ostaje kroz ostatak sajta — rounded-full,
  // VELIKI blur, meka senka, staklena ivica, zaljulja se malo naniže.
  //
  // Čitljivost nad heroom: NEMA belog scrim-a (izgledao je kao bela pozadina
  // nava). Umesto njega, ink tekst (logo/linkovi) dobija suptilan svetli halo
  // (text-shadow) SAMO nad heroom — pomaže na tamnijim delovima videa (mereno:
  // min luminansa 0.175 u nav-traci) bez ikakvog vidljivog oblika. „Pozovi" je
  // rozo dugme, čitljivo na svemu. Kad se pill sklopi, iza nava je svetli
  // sadržaj strane pa halo više nije potreban (i tada nije primenjen).
  //
  // Boja pilule NIJE bela — backdrop-blur + saturate (pojača boje cveta iza) +
  // pastelni iridescentni gradijent (roze→lila→plavo→mint), hroma po ugledu na
  // cvet. Sa prefers-reduced-motion nema scrub-a → odmah pill.
  // PAŽNJA: load-ulaz (`hero-uvod-nav`) stoji na SAMOM navu i animira mu decu,
  // a ne na headeru. Predak sa opacity-animacijom je „backdrop root", pa bi
  // backdrop-filter pilule uzimao prazan backdrop → pilula bez blura.
  const [providno, setProvidno] = useState(naPocetnoj);

  useEffect(() => {
    if (!naPocetnoj) {
      setProvidno(false);
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setProvidno(false);
      return;
    }
    let zakazano = false;
    const proveri = () => {
      zakazano = false;
      setProvidno(window.scrollY < window.innerHeight);
    };
    proveri();
    const naSkrol = () => {
      if (!zakazano) {
        zakazano = true;
        requestAnimationFrame(proveri);
      }
    };
    window.addEventListener("scroll", naSkrol, { passive: true });
    window.addEventListener("resize", proveri);
    return () => {
      window.removeEventListener("scroll", naSkrol);
      window.removeEventListener("resize", proveri);
    };
  }, [naPocetnoj]);

  // Svetli halo za ink tekst (logo/linkovi) SAMO nad heroom — čitljivost bez
  // belog scrim-a. Nad svetlom podlogom (kad je pill sklopljen) nije potreban.
  const halo = providno
    ? " [text-shadow:0_0_16px_rgba(255,252,253,0.7)]"
    : "";

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <nav
          aria-label="Glavna navigacija"
          style={{ "--kasni": "150ms" } as CSSProperties}
          className={`hero-uvod-nav flex items-center justify-between gap-4 rounded-full border px-4 py-3 transition-[translate,background-color,border-color,box-shadow,backdrop-filter] duration-[850ms] ease-out sm:px-5 ${
            providno
              ? "translate-y-0 border-transparent bg-transparent backdrop-blur-0 backdrop-saturate-100"
              : "translate-y-4 border-white/50 bg-[linear-gradient(120deg,rgba(246,176,194,0.72)_0%,rgba(203,184,236,0.66)_40%,rgba(178,212,236,0.7)_72%,rgba(194,236,222,0.64)_100%)] shadow-[0_18px_46px_-12px_rgba(43,19,24,0.45)] backdrop-blur-[80px] backdrop-saturate-[2]"
          }`}
        >
          {/* Hover na logo: blago UVEĆANJE, ne zatamnjenje — poziv na klik
              (zatamnjenje je delovalo kao da logo nije link). */}
          <Link
            href="/"
            aria-label="Matiola, početna strana"
            className="flex items-center pl-1 transition-transform duration-200 ease-out hover:scale-110"
          >
            <Image
              src="/logo-matiola.png"
              alt="Matiola"
              width={149}
              height={180}
              priority
              className={`h-9 w-auto sm:h-10${
                providno
                  ? " [filter:drop-shadow(0_0_9px_rgba(255,252,253,0.9))]"
                  : ""
              }`}
            />
          </Link>

          <div className="hidden items-center gap-7 md:flex">
            {veze.map((v) => {
              const aktivna = putanja === v.href || putanja.startsWith(`${v.href}/`);
              return (
                <Link
                  key={v.href}
                  href={v.href}
                  aria-current={aktivna ? "page" : undefined}
                  className={`nav-veza text-sm transition-colors duration-200 ${
                    aktivna ? "text-akcent" : "text-ink hover:text-akcent"
                  }${halo}`}
                >
                  <span className="nav-roll">
                    <span className="nav-roll-inner">
                      <span className="nav-roll-line">{v.naziv}</span>
                      <span className="nav-roll-line" aria-hidden="true">
                        {v.naziv}
                      </span>
                    </span>
                  </span>
                </Link>
              );
            })}
            {/* „Pozovi" dugme je tu i nad heroom (samo bez staklenog kontejnera
                oko nava). Uvek isti element → kad se pilula sklopi, menja se
                SAMO koža kontejnera, dugme ne skače (glatko). */}
            <PozivDugme nagib className="dugme-tecno px-4 py-2 text-sm font-medium">
              <span className="dt-oznaka">Pozovi</span>
            </PozivDugme>
          </div>

          <button
            type="button"
            onClick={() => setOtvoren((o) => !o)}
            aria-expanded={otvoren}
            aria-controls="mobilni-meni"
            aria-label={otvoren ? "Zatvori meni" : "Otvori meni"}
            className={`-mr-1 cursor-pointer p-2 text-ink transition-colors duration-200 md:hidden${halo}`}
          >
            {/* Tri crtice koje se glatko presavijaju u „X": gornja i donja se
                spuste u centar i zarotiraju (±45°), srednja izbledi. Flex-column
                drži razmak, pa transform (translate+rotate) ostaje slobodan za
                animaciju — nema sukoba sa centriranjem. */}
            <span
              aria-hidden="true"
              className="flex h-3.5 w-6 flex-col justify-between"
            >
              <span
                className={`h-[1.5px] w-full origin-center rounded-full bg-current transition-transform duration-300 ease-out [will-change:transform] ${
                  otvoren ? "translate-y-[6px] rotate-45" : ""
                }`}
              />
              <span
                className={`h-[1.5px] w-full rounded-full bg-current transition-opacity duration-200 ${
                  otvoren ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`h-[1.5px] w-full origin-center rounded-full bg-current transition-transform duration-300 ease-out [will-change:transform] ${
                  otvoren ? "-translate-y-[6px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </nav>

        {/* Mobilni meni — plutajući stakleni panel ispod pilule. Čvršće staklo
            (čitljivost stavki je bitnija od tinta), zaobljen, sa akcent-ivicom. */}
        {otvoren && (
          <div
            id="mobilni-meni"
            className="mt-2 rounded-3xl border border-akcent/15 bg-canvas/90 p-3 shadow-[0_12px_34px_-12px_rgba(43,19,24,0.35)] backdrop-blur-2xl md:hidden"
          >
            <ul className="flex flex-col gap-1">
              {/* „Početna" postoji SAMO u mobilnom meniju — na desktopu se do
                  nje ide klikom na logo, pa je nema u `veze` (deljeno sa nav-om). */}
              <li>
                <Link
                  href="/"
                  onClick={() => setOtvoren(false)}
                  className="block rounded-2xl px-4 py-3 text-base text-ink transition-colors duration-200 hover:bg-sekcija hover:text-akcent"
                >
                  Početna
                </Link>
              </li>
              {veze.map((v) => (
                <li key={v.href}>
                  <Link
                    href={v.href}
                    onClick={() => setOtvoren(false)}
                    className="block rounded-2xl px-4 py-3 text-base text-ink transition-colors duration-200 hover:bg-sekcija hover:text-akcent"
                  >
                    {v.naziv}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <PozivDugme className="dugme-tecno block px-4 py-3 text-center text-base font-medium">
                  <span className="dt-oznaka">Pozovi {site.telefonPrikaz}</span>
                </PozivDugme>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
