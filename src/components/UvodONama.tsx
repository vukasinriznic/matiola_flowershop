"use client";

import { useCallback, useEffect, useRef, type CSSProperties } from "react";
import { useLenis } from "lenis/react";
import Image from "next/image";
import { site } from "@/lib/site";

/**
 * Uvodna sekvenca strane „O nama" — sve vezano za SKROL, u jednoj „stazi":
 *
 *  1. Fotografija lokala stoji fiksirana (sticky) na vrhu strane, na 2/3
 *     ekrana, i skrolom raste dok ne ispuni ceo viewport (ease-out mapiranje:
 *     brz start, meko sleganje). Ispod nje stoje potpis radnje i nagoveštaj
 *     skrola, koji nestaju čim slika krene da raste.
 *  2. Kad slika ispuni ekran, preko nje se navuče RADIJALNI veo (isti recept
 *     kao izmereni zastor u hero-u: jak centar gde stoji tekst, providne
 *     ivice da fotografija ostane živa). Slika iza vela nastavlja spor zum
 *     sa blagom paralaksom naviše (kadar „bеži" nagore dok tekst stoji) —
 *     fotografija ostaje vidljiva do samog kraja staze.
 *  3. Tekst „O nama" ulazi uz veo (blago izdizanje) i otkriva se karakter po
 *     karakter, vezano za skrol.
 *
 * Otkrivanje teksta je preneto sa referentnog sajta (patriot-winery.webflow.io,
 * druga sekcija) — iz njihovog GSAP koda pročitano doslovno:
 *   gsap.from('.info-heading .char', { opacity: 0.3, duration: 1,
 *     ease: 'circ.out', stagger: 0.1, scrollTrigger: { scrub: true } })
 * tj. karakteri tinjaju na 0.3 pa se pale redom kako skrol napreduje; skrol
 * naviše ih gasi. Ovde je ista matematika, bez GSAP-a (stagger + circOut).
 *
 * Izvedba slike: sloj je UVEK pune veličine viewporta (absolute inset-0), a
 * na početku je samo skaliran na 2/3 — slika se renderuje u punoj rezoluciji
 * pa je oštra u svakoj fazi, i nema reflow-a po kadru (samo transform).
 *
 * Sve vozimo iz `useLenis` petlje, u istom taktu kao Lenisovo peglanje
 * (vidi Hero.tsx — isti razlog: nijedan drugi rAF van takta).
 *
 * prefers-reduced-motion: staza se skrati na jedan ekran (motion-reduce
 * klasa), skrol se ne prati — odmah puna slika, veo i sav tekst vidljiv,
 * a potpis/nagoveštaj skrola su sakriveni (nemaju čemu da vode).
 *
 * Fotografija: public/o_nama.jpeg (buketi u radnji) je uspravan portret;
 * `object-cover` je kadrira u viewport. (Original je bio landscape sa EXIF
 * orientation 6 — rotacija je upečena u piksele pri optimizaciji, pa fajl
 * više ne zavisi od EXIF-a i lakši je ~6×.)
 */
const POCETNA_RAZMERA = 2 / 3;
/* Iza vela: spori zum + paralaksa naviše. Zum 1 → 1.08 daje 4vh „viška" slike
   sa svake strane, a paralaksa troši tačno taj donji višak (4vh) — ivica
   slike nikad ne uđe u ekran. Menjati samo u paru! */
const DODATNI_ZUM = 0.08;
const PARALAKSA_VH = 4;

/* Konstante otkrivanja teksta — imena prate GSAP parametre sa referenta. */
const KORAK = 0.1; // stagger između susednih karaktera
const TRAJANJE = 1; // "duration" paljenja jednog karaktera, u istoj skali
const TINJANJE = 0.3; // početna opacity karaktera

/* Granice faza duž staze (napredak 0..1). */
const KRAJ_POTPISA = 0.12; // potpis + nagoveštaj skrola nestanu odmah
const KRAJ_RASTA = 0.4; // do ovde slika naraste do punog viewporta
const POCETAK_VELA = 0.42; // veo + kontejner teksta ulaze posle rasta
const KRAJ_VELA = 0.57;
const POCETAK_TEKSTA = 0.55; // karakteri se pale do pred sam kraj staze
const KRAJ_TEKSTA = 0.97;

const IZDIZANJE_TEKSTA = 24; // px — tekst ulazi blago odozdo, uz veo

const stegni = (v: number) => Math.min(Math.max(v, 0), 1);
const circOut = (k: number) => Math.sqrt(1 - (1 - k) * (1 - k));
const kubniIzlaz = (k: number) => 1 - (1 - k) ** 3;

export function UvodONama({ uvod }: { uvod: string }) {
  const stazaRef = useRef<HTMLElement>(null);
  const slikaRef = useRef<HTMLDivElement>(null);
  const potpisRef = useRef<HTMLDivElement>(null);
  const veoRef = useRef<HTMLDivElement>(null);
  const tekstRef = useRef<HTMLDivElement>(null);
  const charoviRef = useRef<HTMLElement[]>([]);
  const smanjenPokretRef = useRef(false);

  const primeni = useCallback(() => {
    const staza = stazaRef.current;
    const slika = slikaRef.current;
    const potpis = potpisRef.current;
    const veo = veoRef.current;
    const tekst = tekstRef.current;
    if (!staza || !slika || !potpis || !veo || !tekst) return;

    // Napredak kroz stazu — ista mera kao scrub u Hero.tsx.
    const dohvat = staza.offsetHeight - window.innerHeight;
    const predjeno = Math.min(
      Math.max(-staza.getBoundingClientRect().top, 0),
      dohvat,
    );
    const napredak = dohvat > 0 ? predjeno / dohvat : 1;

    // Faza 1 — rast do punog viewporta (ease-out: meko sleganje u pun ekran),
    // pa iza vela spori zum + paralaksa naviše do kraja staze (kadar ne sme
    // da se zamrzne, a slika ostaje vidljiva do samog kraja).
    const rast = kubniIzlaz(stegni(napredak / KRAJ_RASTA));
    const dalje = stegni((napredak - KRAJ_RASTA) / (1 - KRAJ_RASTA));
    const razmera =
      POCETNA_RAZMERA + rast * (1 - POCETNA_RAZMERA) + dalje * DODATNI_ZUM;
    slika.style.transform = `translateY(${-dalje * PARALAKSA_VH}vh) scale(${razmera})`;

    // Potpis radnje + nagoveštaj skrola — nestaju čim rast krene.
    potpis.style.opacity = String(1 - stegni(napredak / KRAJ_POTPISA));

    // Faza 2 — radijalni veo preko slike; tekst ulazi zajedno s njim, blago
    // odozdo (bez vela bi karakteri na 0.3 „prosijavali" preko gole fotke).
    const veoP = stegni((napredak - POCETAK_VELA) / (KRAJ_VELA - POCETAK_VELA));
    veo.style.opacity = String(veoP);
    tekst.style.opacity = String(veoP);
    tekst.style.transform = `translateY(${(1 - veoP) * IZDIZANJE_TEKSTA}px)`;

    // Faza 3 — karakteri se pale redom (stagger + circOut, kao na referentu).
    const tekstP = stegni(
      (napredak - POCETAK_TEKSTA) / (KRAJ_TEKSTA - POCETAK_TEKSTA),
    );
    const charovi = charoviRef.current;
    const n = charovi.length;
    if (n > 0) {
      const ukupno = KORAK * (n - 1) + TRAJANJE;
      const t = tekstP * ukupno;
      for (let i = 0; i < n; i++) {
        const k = stegni((t - KORAK * i) / TRAJANJE);
        charovi[i].style.opacity = String(
          TINJANJE + (1 - TINJANJE) * circOut(k),
        );
      }
    }

  }, []);

  useEffect(() => {
    // Karaktere pokupimo jednom — spanovi su statični kroz život komponente.
    const tekst = tekstRef.current;
    charoviRef.current = tekst
      ? Array.from(tekst.querySelectorAll<HTMLElement>(".uvod-char"))
      : [];

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    smanjenPokretRef.current = reduced;

    if (reduced) {
      // Statični finale: puna slika, radijalni veo, sav tekst upaljen.
      slikaRef.current?.style.setProperty("transform", "none");
      if (veoRef.current) veoRef.current.style.opacity = "1";
      if (tekst) {
        tekst.style.opacity = "1";
        tekst.style.transform = "none";
      }
      for (const c of charoviRef.current) c.style.opacity = "1";
      return;
    }

    primeni(); // početno stanje pre prvog skrola
    window.addEventListener("resize", primeni);
    return () => window.removeEventListener("resize", primeni);
  }, [primeni]);

  // Isti takt kao Lenisovo peglanje — deps obavezni (vidi Hero.tsx).
  useLenis(() => {
    if (!smanjenPokretRef.current) primeni();
  }, [primeni]);

  // Reči su inline-block omotači (da se lome celе, ne po karakteru), a
  // karakteri unutra nose opacity. Čitačima ekrana ceo pasus daje aria-label,
  // spanovi su aria-hidden — isečen tekst bi se inače sricao slovo po slovo.
  const reci = uvod.split(" ");

  return (
    <section
      ref={stazaRef}
      className="relative h-[300vh] motion-reduce:h-dvh"
    >
      <div className="sticky top-0 h-dvh overflow-hidden">
        {/* Slika — pun viewport, na početku skalirana na 2/3 (i u SSR
            markup-u, da ne „skoči" pre hidracije). */}
        <div
          ref={slikaRef}
          className="absolute inset-0 will-change-transform"
          style={{ transform: `scale(${POCETNA_RAZMERA})` }}
        >
          <Image
            src="/o_nama.jpeg"
            alt={`Buketi u radnji: ruže i gerberi umotani u roze i zlatni papir. Cvećara Matiola, ${site.adresa.grad}.`}
            fill
            priority
            sizes="100vw"
            className="onama-uvod-slika rounded-nezno object-cover"
          />
        </div>

        {/* Radijalni veo — isti recept kao zastor u hero-u (jak centar gde
            stoji tekst, providne ivice); animira se samo opacity sloja. */}
        <div
          ref={veoRef}
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_72%_62%_at_50%_48%,rgba(251,250,249,0.88)_0%,rgba(251,250,249,0.62)_40%,rgba(251,250,249,0.18)_75%,rgba(251,250,249,0.05)_100%)]"
          style={{ opacity: 0 }}
        />

        {/* Tekst — ulazi tek kad veo legne, blago odozdo. */}
        <div
          ref={tekstRef}
          className="absolute inset-0 flex items-center will-change-transform"
          style={{ opacity: 0, transform: `translateY(${IZDIZANJE_TEKSTA}px)` }}
        >
          <div className="mx-auto w-full max-w-3xl px-6 text-center">
            <p className="nadnaslov">Naša priča</p>
            <h1 className="mt-2 font-naslov text-5xl leading-tight text-ink">
              O nama
            </h1>
            <p
              aria-label={uvod}
              className="mt-8 font-naslov text-2xl leading-relaxed text-ink sm:text-3xl"
            >
              {reci.map((rec, ri) => (
                <span key={ri}>
                  <span aria-hidden="true" className="inline-block">
                    {Array.from(rec).map((ch, ci) => (
                      <span
                        key={ci}
                        className="uvod-char inline-block"
                        style={{ opacity: TINJANJE }}
                      >
                        {ch}
                      </span>
                    ))}
                  </span>{" "}
                </span>
              ))}
            </p>
          </div>
        </div>

        {/* Potpis radnje + nagoveštaj skrola — žive u praznom pojasu ispod
            smanjene slike; nestaju čim slika krene da raste. Load-ulaz je na
            UNUTRAŠNJEM sloju (spoljni drži opacity vezan za skrol — ista
            podela kao „Skrolujte" u Hero.tsx, da se dve opacity kontrole ne
            gaze). */}
        <div
          ref={potpisRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-8 motion-reduce:hidden"
        >
          <div
            className="onama-uvod-potpis flex flex-col items-center gap-3"
            style={{ "--kasni": "750ms" } as CSSProperties}
          >
            <p className="nadnaslov">
              Naša radnja · {site.adresa.ulica}, {site.adresa.grad}
            </p>
            <span className="hero-strelica h-8 w-px bg-ink/30" />
          </div>
        </div>
      </div>
    </section>
  );
}
