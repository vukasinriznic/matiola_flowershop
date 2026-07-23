# Stanje projekta — Cvećara Matiola

Predajni dokument za nastavak rada u novoj sesiji. Datum: 16.07.2026.
Poslednja izmena: 18.07.2026.

---

## ⭐ STANJE OD 18.07.2026 (dan sa tri zaokreta)

Redosled događaja tog dana, da se ne ponavlja isti krug:

1. Implementirana **crvena/roze** paleta (`#CC313D` / `#F7C5CC`) + dve varijante
   CTA dugmadi. → Vukašinu se **ne sviđa**, odbačeno istog dana.
2. **Hero video se NE menja** — Vukašin: „hero video je dobar i njegova
   animacija na scroll". Ranija ideja (cvet na crnoj pozadini) je **otkazana**.
   Hero ostaje svetao, zastori `from-canvas` ostaju.
3. Uklonjena **linija na dnu hero-a** (`border-b border-granica` na sekciji).
4. Izmeren hero video (12 kadrova, histogram po nijansi) → tri predloga palete
   → Vukašin izabrao **„B — bezbojno + jedan akcent"**, uz: *„ako nam se ne
   svidi idemo C"* (**C = burgundija `#7D2B3A`**, vrednosti su u `DIZAJN.md`).
5. Implementirana paleta B + dugmad sa **belim tekstom u svim stanjima** i
   popunom na hover u `akcent-tamni #8E3A4C`.

**Stanje koda:** paleta B je živa, build i typecheck čisti, provereno merenjem
iz DOM-a na pokrenutom dev serveru (tokeni, gradijenti dugmadi, boja popune,
boja teksta, uklonjena hero linija). Tokeni se sada zovu
`canvas`/`ink`/`card`/`sekcija`/`akcent`/`akcent-tamni`/`tiho-tekst`/`granica`/
`granica-jaka`/`zelen` — grep za starim imenima (`ametist`, `koral`, `tirkiz`,
`modra`, `primary`, `secondary`, `tiho`) mora biti prazan.

⚠️ **Naučeno:** `sed` preimenovanje tokena **preskočilo je `Hero.tsx`**, pa je
`text-ametist` tamo preživeo ceo jedan krug. Build to **ne prijavljuje** —
nepoznata Tailwind klasa je prosto bez efekta. Posle svakog preimenovanja
obavezno pustiti grep preko **celog** `src/`.

Ispod je originalni (sada istorijski) opis crvene/roze palete, radi konteksta.

### 1. Nova paleta — crvena/roze (ODBAČENO)

Zamenjuje trenutnu „iridescentni ametist" paletu (hladnu, izvedenu iz staklenog
cveta). Vukašin je ovo izabrao svesno, pošto su mu iznete tri primedbe (vidi
„Razmotreno" dole) — **ne pokretati raspravu ponovo, samo implementirati.**

- **Primary `#CC313D`** (cherry red) — dugmad, naslovi, i sve što treba da se
  istakne.
- **Secondary `#F7C5CC`** (bubblegum roze) — podloga sekcija koje su **sada
  bele** (tj. zamenjuje `card`/bele sekcije, ne celu podlogu).

**Izračunati kontrasti — OBAVEZNO poštovati (WCAG AA):**

| Kombinacija | Odnos | Status |
| --- | --- | --- |
| Belo na `#CC313D` | 5.15:1 | ✅ dugmad rade |
| `#CC313D` na belom | 5.15:1 | ✅ naslovi/linkovi na belom |
| Near-black `#1A1416` na belom | 18.17:1 | ✅ |
| Near-black `#1A1416` na roze `#F7C5CC` | 11.95:1 | ✅ tekst na roze sekcijama |
| Tamnija crvena `#A8262F` na roze | 4.63:1 | ✅ crveni tekst na roze — koristiti OVU |
| Muted `#5C5154` na roze | 5.00:1 | ✅ sporedni tekst na roze |
| **`#CC313D` na roze `#F7C5CC`** | **3.39:1** | ❌ **pada za tekst** — samo grafika/veliki display |
| **Belo na roze `#F7C5CC`** | **1.52:1** | ❌ **neupotrebljivo, nikad** |

Zaključak: na roze sekcijama tekst je near-black (ili `#5C5154` za sporedni);
ako baš treba crveni tekst na roze — koristi tamniju `#A8262F`, ne `#CC313D`.

**Tehnička napomena:** tokeni se sada zovu `ametist`/`modra`/`koral`/`tirkiz`
(vidi `DIZAJN.md`). Sa ovom paletom ta imena opet lažu — preimenovati ih
(npr. `primary`/`secondary` ili `crvena`/`roze`) i proći kroz sve komponente,
isto kao pri prošlom zaokretu. Grep: `ametist|modra|koral|tirkiz`.

### 2. Novi hero video

- Zameniti sadašnji scroll-scrub video (stakleni cvet) videom **cveta na CRNOJ
  pozadini**, gde je cvet u boji koja **kontrastira primary crvenoj**.
- Postupak zamene videa je netrivijalan (all-intra prekodiranje) — vidi
  „Hero mehanika" niže u ovom dokumentu, komanda je tamo.

### 3. Hero CTA dugmad (dve varijante)

- **Dugme A:** belo, sa **crvenim border-om**; na hover **ista animacija kao
  sada** (popuna odozdo + sheen + žele).
- **Dugme B:** puno **crveno (primary)**; na hover **bela** animacija (tj. popuna
  koja se diže je bela umesto unakrsne boje).

Mehanika već postoji u `.dugme-tecno` (`globals.css`) — boja popune ide preko
`--dt-fill`, osnovne boje preko `--dt-a`/`--dt-b`. Za dugme A treba varijanta sa
belom pozadinom + crvenim tekstom/borderom i `--dt-fill` crvena (tekst mora da
pređe u belo dok se popuna diže — proveriti kontrast u oba stanja).

### Razmotreno pre odluke (da se ne ponavlja)

Iznete su tri primedbe, Vukašin ih je čuo i svejedno izabrao ovaj pravac:
1. Ako je crvena i na naslovima i svuda, „Pozovi" dugme gubi na isticanju
   (poziv je jedina konverzija sajta).
2. Topla crvena vs. hladan hero — rešava se time što se **hero video menja** u
   crno+kontrastna boja, pa sudara nema.
3. Ton: cvećara prodaje i „Tiho saučešće" (sahrane), a paleta je beauty-brend
   energije.

---

## Šta je ovo

Sajt za cvećaru **Matiola**, Žička 92, Kraljevo. Katalog buketa + poziv telefonom
za narudžbinu + admin panel gde vlasnica sama dodaje/briše bukete. Kupci **ne**
poručuju online — vide buket i **zovu**. Poziv telefonom je glavna konverzija.

Detaljan kontekst klijenta i odluka je u auto-memoriji (`matiola-projekat.md`,
`matiola-dizajn-odluke.md`) — učita se sama na početku sesije.

## Stack

- **Next.js 16** (App Router, `src/`, Turbopack), **React 19**, **TypeScript**
- **Tailwind v4** (CSS-based, tokeni u `globals.css` pod `@theme`)
- **Lenis** — glatki skrol
- **@ffmpeg-installer/ffmpeg** (dev) — za prekodiranje hero videa
- **Supabase** — planiran za bazu/auth/slike, **još nije povezan** (buketi su
  privremeno u fajlu)

⚠️ `AGENTS.md` upozorava: ovaj Next.js ima breaking-change API-je; čitati
`node_modules/next/dist/docs/` pre pisanja koda, ne oslanjati se na pamćenje.

## Pokretanje

```
npm run dev        # http://localhost:3000
npm run build      # provera pre commit-a
npx tsc --noEmit   # typecheck
```
Napomena: korisnik često već ima `npm run dev` pokrenut na portu 3000.

## Mapa fajlova

**Stranice / layout**
- `src/app/layout.tsx` — fontovi (Cormorant Garamond + Inter, oba sa `latin-ext`
  za č/ć/š/ž/đ), SR metapodaci/SEO, obmotava sadržaj u `<GlatkiSkrol>`.
- `src/app/page.tsx` — početna: `<Hero/>` + istaknuti buketi + kategorije + CTA.
- `src/app/globals.css` — design tokeni (paleta), `font-naslov`/`font-telo`,
  fokus-stil, globalni `prefers-reduced-motion`, `.nadnaslov` util.

**Podaci**
- `src/lib/site.ts` — svi podaci o cvećari na jednom mestu. **TODO**: pravi
  telefon, Instagram link, potvrda radnog vremena (sad su placeholderi).
- `src/lib/buketi.ts` — tip `Buket` + privremeni seed podaci + **async** funkcije
  (`sviBuketi`, `istaknutiBuketi`, `buketPoSlugu`, `formatCena`). Async namerno:
  kad dođe Supabase, menja se samo telo funkcija, stranice ostaju iste.

**Komponente** (`src/components/`)
- `Zaglavlje.tsx` — navigacija, **`fixed`** (da hero kreće od vrha), mobilni meni.
- `Podnozje.tsx` — kontakt, radno vreme, kredit za video, link ka `/admin`.
- `Hero.tsx` — **scroll-scrub video** (vidi dole).
- `GlatkiSkrol.tsx` — Lenis wrapper (`root`, reduced-motion off, native touch).
- `BuketKartica.tsx` — kartica buketa za mreže.
- `SlikaBuketa.tsx` — slika buketa ili botanička SVG-zamena dok nema fotografije.

**Mediji**
- `public/hero_scrub.mp4` — all-intra hero video (~5.4 MB), gleda ga `Hero.tsx`.
- `public/hero_start.jpg` — poster (prvi/zatvoreni kadar).
- `assets-source/` — originalni videi (van `public/`, ne serviraju se).

**Dizajn**
- `DIZAJN.md` — paleta (izvedena iz cveta šeboja), tipografija, pravila, i zašto
  je predlog `ui-ux-pro-max` skilla odbijen. Sve boje WCAG AA proverene računski.

## Hero mehanika (najsloženiji deo)

Cvet se **otvara dok korisnik skroluje** (ne autoplay, ne petlja). Kako:
- Sekcija je visoka staza (`h-[200vh]`) sa `sticky` unutrašnjim slojem (jedan
  ekran) — video „stoji" dok se kroz stazu skroluje.
- Napredak skrola 0→1 mapira na `video.currentTime` 0→trajanje.
- Sinhronizacija ide kroz **`useLenis`** (isti takt kao Lenis), sa **`v.seeking`
  čuvarom** (ne gomilaj premotavanja) i **`seeked` doterivanjem** (slegni na tačan
  kadar). Ovo je rešilo seckanje koje se javilo kad je dodat Lenis.
- `prefers-reduced-motion`: staza se skrati (`motion-reduce:h-dvh`), bez scrub-a,
  prikaže se otvoren cvet.

**Zamena hero videa** (netrivijalno — stok video se ne pušta direktno, mora
all-intra da bi premotavanje bilo glatko):
```
FF=$(node -e 'process.stdout.write(require("@ffmpeg-installer/ffmpeg").path)')
"$FF" -y -i public/NOVI.mp4 -an -c:v libx264 -g 1 -keyint_min 1 -sc_threshold 0 \
  -crf 23 -preset slow -pix_fmt yuv420p -movflags +faststart public/hero_scrub.mp4
```
Zatim regeneriši `public/hero_start.jpg` iz prvog kadra i original skloni u
`assets-source/`. (Poster se vadi canvas-om u brauzeru — vidi istoriju sesije.)

## Urađeno ✅

- Scaffolding, design system (paleta+fontovi), SR lokalizacija i SEO.
- Početna strana kompletna: hero (scroll-scrub video staklenog cveta), istaknuti
  buketi, kategorije, CTA, podnožje.
- Glatki skrol (Lenis) kroz ceo sajt, sa zaštitama; seckanje hero-a rešeno.
- Build i typecheck prolaze čisto.

## Sledeći koraci / otvoreno

1. ~~**Boje ka cvetu**~~ ✅ URAĐENO (07/2026). Paleta zaokrenuta ka staklenom
   cvetu iz hero-a — pravac „Iridescentni ametist" (ametist + periwinkle +
   biserna podloga, koral-roza samo za „Pozovi"). Tokeni preimenovani
   (slez→ametist, rumen→modra, terakota→koral, zalfija→tirkiz), sve WCAG AA
   provereno. Dugmad = `.dugme-tecno` (squircle, iridescentna rotirajuća ivica,
   sjaj koji prati kurzor + magnetni nagib; `useMagnetniNagib.ts`, JS samo na
   mišu). Nav preko hero-a providan, „oživi" (blur+pozadina) kad se scrub završi.
   Detalji u `DIZAJN.md`.
2. **Lakša mobilna verzija videa** — trenutni all-intra je ~5.4 MB; napraviti
   ~1280px varijantu za mobilni (korisnik treba da odobri).
3. **Kredit za hero video** — podnožje kaže „Coverr", ali korisnik je ubacio novi
   klip (`hero_flower`) nepoznatog izvora. Pitati odakle je, srediti kredit.
4. **Preostale stranice** (nisu napravljene): `/buketi` (katalog + filteri po
   kategoriji), `/buketi/[slug]` (detalj + „Pozovi"), `/o-nama`, `/kontakt`
   (mapa, radno vreme), `/admin` (zaštićen CRUD).
   ⚠️ Nove stranice bez hero videa treba da dobiju gornji razmak visine zaglavlja
   (npr. `pt-20`) jer je `Zaglavlje` sada `fixed`.
5. **Supabase** — povezati bazu, auth za vlasnicu, upload slika. Zameniti seed u
   `buketi.ts`. Treba nalog od korisnika.

## Čeka se od klijenta (Vukašin)

Pravi telefon · fotografije buketa · Instagram link · potvrda radnog vremena
(zna se samo da zatvara u 20:00) · Supabase nalog. Sve placeholder vrednosti su
u `src/lib/site.ts` pod `TODO`.

## Napomene o okruženju (za asistenta)

- Browser pane u ovoj postavci **ne da screenshot** (timeout) i tab je često u
  pozadini (`visibility: hidden`), pa su `requestAnimationFrame` i Lenis tada
  **zamrznuti** — scroll animacije se ne mogu videti/testirati uživo. Sve je
  verifikovano **merenjem iz DOM-a** (piksel-diff kadrova, `getAnimations`,
  računanje kontrasta), a osećaj skrola/animacije potvrđuje korisnik na svom
  ekranu (uz Ctrl+F5 zbog keša videa).
- ⚠️ **Dev server na portu 3000 ume da se zaglavi na starom CSS-u**: HTML se
  osvežava (nove klase su tu), ali `globals.css` chunk ostaje zamrznut na
  ranijem stanju — pa izmene paleta/dugmadi izgledaju kao da „ne rade".
  Reload i Ctrl+F5 ne pomažu; treba **restartovati `npm run dev`**. Provera bez
  dev servera: `npm run build`, pa pregledati emitovani
  `.next/static/chunks/*.css` (tamo se vidi tačno šta Tailwind generiše).
- `.claude/launch.json` ima `"autoPort": true` — asistent može da digne svoj
  preview na slobodnom portu bez sudara sa korisnikovim serverom na 3000.
  (Napomena: novi port traži „policy check" u browser pane-u, koji ume da visi.)
- Rad nije commit-ovan (samo početni commit na `master`). Sve je na disku.
