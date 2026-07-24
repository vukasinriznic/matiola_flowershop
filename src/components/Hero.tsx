"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { useLenis } from "lenis/react";
import Link from "next/link";
import { PozivDugme } from "@/components/PozivDugme";
import { site } from "@/lib/site";
import { useMagnetniNagib } from "@/lib/useMagnetniNagib";

/**
 * Hero sa video pozadinom vezanom za SKROL (stakleni cvet koji se otvara).
 *
 * Umesto da se video pušta sam, premotavamo ga ručno prema tome koliko je
 * korisnik skrolovao kroz „stazu" (visoka sekcija). Skrol naniže = cvet se
 * otvara; naviše = zatvara. Nema petlje ni zamrznutog kraja — otvaranje je
 * vezano za pokret prsta/miša, ne za vreme.
 *
 * Staza je visoka `h-[200vh]` (vidi motion-reduce niže), a unutrašnji sloj je
 * `sticky` i visok jedan ekran, pa video „stoji" dok se kroz stazu skroluje.
 *
 * Sinhronizacija sa skrolom ide kroz `useLenis` — u ISTOM taktu kao Lenisovo
 * peglanje (nema drugog rAF-a koji bi radio van takta). Da se premotavanja ne
 * gomilaju brže nego što dekoder stiže (što secka), izdajemo novo tek kad
 * prethodno završi (`v.seeking`), a poslednji cilj pamtimo pa „doteramo" na
 * kraj kroz `seeked`.
 *
 * prefers-reduced-motion: staza se skrati na jedan ekran (Tailwind
 * `motion-reduce:h-dvh`), skrol se ne prati, i prikazuje se otvoren cvet.
 *
 * Video: Coverr.co — kredit stoji u podnožju (Podnozje.tsx).
 */
export function Hero() {
  const stazaRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const ciljRef = useRef(0); // poslednji željeni currentTime

  const [trajanje, setTrajanje] = useState(0);
  // „Statično" = bez scrub-a: dodir (telefon/tablet) ILI reduced-motion. Tada
  // se ne učitava ni video — prikazuje se slika otvorenog cveta (hero_open.jpg).
  // Kreće `false` (SSR/desktop podrazumevano), pa se na mount-u utvrdi.
  const [staticno, setStaticno] = useState(false);
  // Nagoveštaj skrola nestaje čim korisnik krene. Držimo i ref da ne bismo
  // zvali setState iz Lenisove petlje na svakom kadru.
  const [skrolovano, setSkrolovano] = useState(false);
  const skrolovanoRef = useRef(false);

  // Izračunaj ciljni currentTime iz trenutne (Lenisom ispeglane) pozicije
  // i premotaj — ali samo ako video baš sad ne premotava.
  const premotaj = useCallback(() => {
    const staza = stazaRef.current;
    const v = videoRef.current;
    if (!staza || !v || !trajanje) return;
    const dohvat = staza.offsetHeight - window.innerHeight;
    const predjeno = Math.min(
      Math.max(-staza.getBoundingClientRect().top, 0),
      dohvat,
    );
    const napredak = dohvat > 0 ? predjeno / dohvat : 0; // 0..1
    const krenuo = napredak > 0.02;
    if (krenuo !== skrolovanoRef.current) {
      skrolovanoRef.current = krenuo;
      setSkrolovano(krenuo);
    }
    ciljRef.current = napredak * trajanje;
    if (!v.seeking && Math.abs(ciljRef.current - v.currentTime) > 0.02) {
      v.currentTime = ciljRef.current;
    }
  }, [trajanje]);

  useEffect(() => {
    // Odredi statični režim NEZAVISNO od videa — na mobilnom video ni ne
    // postoji, pa detekcija mora da radi i kad je `videoRef` prazan.
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const dodir = window.matchMedia("(pointer: coarse)").matches;
    const jeStaticno = reduced || dodir;
    setStaticno(jeStaticno);

    // Statično (dodir/reduced) → CSS je već sakrio video i pokazao sliku;
    // scrub se ne postavlja, a video se NE učitava (preload ostaje „none").
    if (jeStaticno) return;

    const v = videoRef.current;
    if (!v) return;

    // Desktop: tek sada uključi učitavanje videa (SSR ga renderuje sa
    // preload="none" da mobilni ne povuče 2.2MB pre nego što CSS/JS odluče).
    v.preload = "auto";
    v.load();

    const spremiTrajanje = () => setTrajanje(v.duration || 0);
    if (v.readyState >= 1) spremiTrajanje();
    else v.addEventListener("loadedmetadata", spremiTrajanje, { once: true });

    // iOS/Safari ponekad ne dozvoli premotavanje dok se video jednom ne „otključa".
    v.play().then(() => v.pause()).catch(() => {});

    // Kad se premotavanje završi, doteraj na poslednji cilj (ako se u međuvremenu
    // pomerio) — da uvek slegnemo na tačan kadar, bez preskoka.
    const naSeeked = () => {
      if (Math.abs(ciljRef.current - v.currentTime) > 0.02) {
        v.currentTime = ciljRef.current;
      }
    };
    v.addEventListener("seeked", naSeeked);

    // Promena veličine menja „dohvat" — presinhronizuj.
    const naResize = () => premotaj();
    window.addEventListener("resize", naResize);

    return () => {
      v.removeEventListener("loadedmetadata", spremiTrajanje);
      v.removeEventListener("seeked", naSeeked);
      window.removeEventListener("resize", naResize);
    };
  }, [premotaj]);

  // Vozimo scrub iz Lenisove scroll petlje (isti takt kao peglanje).
  // deps su obavezni — bez njih useLenis drži stari closure (trajanje=0).
  useLenis(
    () => {
      if (!staticno) premotaj();
    },
    [premotaj, staticno],
  );

  const nagibPonuda = useMagnetniNagib<HTMLAnchorElement>();

  // Kašnjenje ulaza po elementu (CSS custom property `--kasni`).
  const kasni = (ms: number) => ({ "--kasni": `${ms}ms` }) as CSSProperties;

  return (
    <section ref={stazaRef} className="relative hero-staza">
      {/* Lepljivi sloj — ostaje na ekranu dok se kroz stazu skroluje */}
      <div className="hero-lepljivi sticky top-0 flex h-dvh items-center overflow-hidden">
        {/* Video pozadina.
            `isolate`: video je composited sloj, a dva zastora iznad njega nisu.
            Nav ima backdrop-filter, pa se pri svakoj promeni njegovog layer
            tree-a (npr. hover na link) iznova gradi backdrop root — i u tom
            koraku je video umeo da iskoči IZNAD zastora, tj. hero bi potamneo
            dok je kursor na navu. Zaseban stacking context spljošti video i
            zastore u jednu grupu, pa im se redosled ne može promeniti. */}
        <div className="absolute inset-0 -z-10 isolate">
          {/* Slika otvorenog cveta (dodir/reduced) i scrub video (desktop) su
              OBA u DOM-u; koji se vidi bira CSS media upit (.hero-slika /
              .hero-video) — bez JS swap-a, pa nema hidracionog treptaja/zuma.
              Video ide preload="none" da mobilni ne povuče 2.2MB; desktop ga
              uključi u efektu (v.load()). */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero_open.jpg"
            alt=""
            aria-hidden="true"
            className="hero-slika absolute inset-0 h-full w-full object-cover"
          />
          <video
            ref={videoRef}
            className="hero-video h-full w-full object-cover"
            muted
            playsInline
            preload="none"
            poster="/hero_start.jpg"
            aria-hidden="true"
          >
            {/* all-intra, skraćen na sam deo otvaranja — glatko premotavanje na skrol */}
            <source src="/hero_scrub.mp4" type="video/mp4" />
          </video>

          {/* Zastor — MERENO, ne procenjivano. U centralnoj zoni videa ima i
              vrlo tamnih piksela (luminansa 0.032), pa ink tekst bez zastora
              pada na 1.42:1. Sa >=30% canvas-a preko njih prelazi 6:1.
              Zato je zastor elipsa: jak u sredini (0.88 → 0.62) gde stoji
              tekst, slab ka ivicama (0.18 → 0.05) da stakleni cvet ostane
              izražen umesto da cela slika izbledi.
              (Belo na tamnom zastoru je probano računski i PADA — video ima
              svetle delove do 0.95, pa bi trebao neupotrebljivo gust zastor.) */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_72%_62%_at_50%_48%,rgba(251,250,249,0.88)_0%,rgba(251,250,249,0.62)_40%,rgba(251,250,249,0.18)_75%,rgba(251,250,249,0.05)_100%)]" />
          {/* Blago stapanje sa sekcijom ispod */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-canvas to-transparent" />
        </div>

        {/* Sadržaj — centriran, bez opisnog pasusa: u hero-u stoje samo mesto,
            naslov i dve akcije. Priča o cvećari je premeštena u sekciju ispod. */}
        <div className="mx-auto w-full max-w-3xl px-6 pt-16 text-center">
          <p className="nadnaslov hero-uvod-nadnaslov" style={kasni(80)}>
            Kraljevo · Žička 92
          </p>
          {/* leading 1.12 (ne 1.05): kvačice na č/ć/š/ž idu iznad visine
              verzala, pa se na tesnom proredu sudaraju sa redom iznad.
              Playfair traži bar 1.00 — vidi merenje u DIZAJN.md.
              Ulaz reč po reč: svaka reč je inline-block (.hero-rec) sa svojim
              kašnjenjem; razmaci `{" "}` drže reči razdvojene. */}
          <h1 className="mt-5 font-naslov text-6xl leading-[1.12] text-ink sm:text-7xl lg:text-8xl">
            <span className="hero-rec" style={kasni(220)}>
              Cveće
            </span>{" "}
            <span className="hero-rec" style={kasni(330)}>
              koje
            </span>
            <br />
            <span className="hero-rec" style={kasni(440)}>
              nešto
            </span>{" "}
            <span className="hero-rec" style={kasni(550)}>
              znači
            </span>
          </h1>
          <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-4">
            {/* „Pogledaj ponudu" = obris (belo + roze border), „Pozovi" = puna
                ruža. Poziv je jedina konverzija sajta, pa nosi jaču varijantu. */}
            <Link
              ref={nagibPonuda}
              href="/buketi"
              style={kasni(700)}
              className="dugme-tecno dugme-tecno--obris hero-uvod-dugme px-9 py-4.5 text-base font-medium"
            >
              <span className="dt-oznaka">Pogledaj ponudu</span>
            </Link>
            <PozivDugme
              nagib
              style={kasni(820)}
              className="dugme-tecno hero-uvod-dugme px-9 py-4.5 text-base font-medium"
            >
              <span className="dt-oznaka">Pozovi {site.telefonPrikaz}</span>
            </PozivDugme>
          </div>
        </div>

        {/* Nagoveštaj skrola — hero je staza od 200vh i cvet se otvara TEK na
            skrol, pa bez ovoga korisnik ne zna da ima šta da se otkrije.
            Nestaje kad se scrub završi (isti prag kao „oživljavanje" nava). */}
        <div
          aria-hidden="true"
          className={`hero-nagovestaj pointer-events-none absolute inset-x-0 bottom-8 transition-opacity duration-500 motion-reduce:hidden ${
            skrolovano ? "opacity-0" : "opacity-100"
          }`}
        >
          {/* Ulaz je na UNUTRAŠNJEM sloju: spoljni drži opacity vezan za skrol
              (skrolovano), unutrašnji radi load-ulaz — da se dve opacity
              kontrole ne bore (animacija bi fill-forwards zaključala spoljni,
              pa nagoveštaj ne bi nestao na skrol). */}
          <div
            className="hero-uvod-skrol flex flex-col items-center gap-2"
            style={kasni(1000)}
          >
            <span className="nadnaslov">Skrolujte</span>
            <span className="hero-strelica h-8 w-px bg-ink/30" />
          </div>
        </div>
      </div>
    </section>
  );
}
