# Design system — Cvećara Matiola

Izvor istine je `src/app/globals.css` (`@theme` blok). Ovaj dokument objašnjava
**zašto**, da bi izmene ostale dosledne.

## Polazna ideja

**Meka roze, šema „1 Pudrasta"** (izabrao Vukašin, 18.07.2026). Podloga je
skoro-bela sa dahom roze, sekcije su meka pudrasta roze, tekst near-black, a
kartice ostaju **čisto bele** da fotografije buketa ne dobiju roze nadev.
Akcent `#B04A5F` (dublja ruža) nosi poziv telefonom, linkove i hover stanja.

Roze radi na **dva nivoa** i to nije stilski hir nego posledica merenja: meka
roze ne može da nosi beo tekst (vidi ogradu kod dugmadi), pa meka ide na
podloge, a dublja na dugmad, border i tekst.

> Nastalo iz međukoraka „B — bezbojno + jedan akcent" (iste boje, ali tople
> sive sekcije `#F1EFEC`). Kad je zatražena roze za sam sajt, akcent je ostao
> isti — promenile su se samo podloge. Odbijene šeme: „2 Roze kvarc"
> (`#F9E4E8` + `#B24E62`) i „3 Breskva" (`#FBEAE6` + `#B4544F`) — kod obe roze
> link na roze sekciji pada (4,16 / 4,17); šema 1 prolazi sve.

### Kako su boje izabrane (metod, ponovljiv)

Boje nisu birane okom — **izmeren je hero video**: 12 kadrova, histogram po
nijansi (skript u istoriji sesije; ffmpeg → sirovi RGB → HSL kante po 10°).
Rezultat:

- **42,7% piksela je neutralno** (desaturisano), prosečna svetlina kadra 62,5%;
- boje koje postoje: plava **180–210°** (~25% piksela) i roze **330–350°** (~18%);
- ali sve na **samo 21–34% zasićenja**.

Odatle pravila koja važe za svaku buduću izmenu:

1. **Uzmi boje iz najveće vizuelne stvari na stranici** (ovde: hero video).
2. **Što je površina veća, zasićenje mora biti niže.** Jako zasićenje ide samo na
   sitne elemente (dugme, ikona), nikad na celu sekciju.
3. **Odluči odnos prema hero-u:** ili ga pratiš, ili biraš boju koje u njemu nema
   pa namerno iskače. Ono što ne radi je „ista nijansa, drugi intenzitet" — to
   izgleda kao greška.
4. **Kontrast se računa, pa se gleda na stranici u punoj veličini.** Uzorci uvek
   izgledaju bolje od cele obojene sekcije.

> Istorijat (tri odbačena pravca — da se ne vrti u krug):
> 1. Do 07/2026: paleta iz **imena** cveta (_Matthiola/šeboj_) — topla mauve +
>    terakota. Odbačena: Vukašin je tražio moderniji izgled.
> 2. 07/2026: „Iridescentni ametist" iz staklenog cveta u hero videu (ametist,
>    periwinkle, koral za „Pozovi"). Odbačena 18.07.2026.
> 3. 18.07.2026: trešnja-crvena `#CC313D` + bubblegum roze `#F7C5CC`.
>    Implementirana pa odbačena **istog dana**. Merenje je posle pokazalo zašto:
>    nijansa nije bila problem (roze 330–350° postoji u videu), nego
>    **zasićenje** — 62% i 74% naspram 21–34% u videu, tj. 2–3× jače od svega
>    na ekranu.
>
> Hero video se **ne menja** — Vukašin je potvrdio da su video i scroll
> animacija dobri. Ranija ideja o cvetu na crnoj pozadini je otkazana.
>
> Sledeći kandidat ako B ne zadovolji: **C — burgundija** (`canvas #FDFBFA`,
> `sekcija #F3E4E7`, `primary/CTA #7D2B3A`, `hover #5E1F2B`, `ink #1B1416`,
> `sporedno #5C5154`). Svi parovi su već provereni i prolaze AA.

## Paleta

| Token           | Hex       | Uloga                                        |
| --------------- | --------- | -------------------------------------------- |
| `canvas`        | `#FFFCFD` | skoro-bela sa dahom roze                     |
| `ink`           | `#2B1318` | osnovni tekst — topla crno-ruža (nagnuta ka akcentu), isti ton kao hero naslov — 17.0:1 canvas, 15.5:1 sekcija |
| `card`          | `#FFFFFF` | kartice — čisto bele, zbog fotografija       |
| `sekcija`       | `#FBEFF1` | meka pudrasta roze — podloga sekcija         |
| `akcent`        | `#B04A5F` | CTA, linkovi, border — 5.16:1 canvas, 4.69:1 sekcija |
| `akcent-tamni`  | `#8E3A4C` | tamnija ruža — 7.34:1 na belom               |
| `tiho-tekst`    | `#5F5A57` | sporedni tekst — 6.7:1 canvas, 6.1:1 sekcija |
| `granica`       | `#F0DCE0` | dekorativne linije (roze)                    |
| `granica-jaka`  | `#726B65` | granice kontrola — 5.1:1 canvas, 4.7:1 sekcija |
| `zelen`         | `#4A6B54` | botanička grafika — 5.9:1 canvas, 5.3:1 sekcija |

**Svi parovi teksta i podloge provereni su računski na WCAG AA** (≥4.5:1 za tekst,
≥3:1 za granice kontrola i botaničku grafiku). Za razliku od ranije crveno/roze
palete, ovde **nema kombinacije koja pada** — najniža je akcent na sekciji, 4,69:1.

> Ako menjaš bilo koju boju, ponovo izračunaj kontraste. Ne procenjuj okom —
> više puta su boje koje su vizuelno izgledale dobro pale na proveri.

Pošto je UI bezbojan, akcent **sam po sebi** izdvaja poziv telefonom — nema
sudara sa naslovima kao u crvenoj paleti, jer su naslovi `ink`.

## Tipografija

- **Naslovi:** Lora 400–600
- **Telo i UI:** Inter

Naslovni font nosi eleganciju oblikom slova, ne debljinom — zato su naslovi na
`font-weight: 400`, ne bold. Inter drži sve funkcionalno čitljivim.

### Zašto NIJE Cormorant Garamond (mereno, 18.07.2026)

Cormorant je bio prvi izbor i **odbačen je zbog srpskih dijakritika**. Mereno
canvas-om na 100px, ključni broj je **zazor** — koliko je kvačica na `č` udaljena
od vrha slova `c`, u procentu visine samog slova. Manji broj = kvačica bliže
slovu, izgleda kao deo slova, a ne kao da lebdi.

| Font | x-visina | kvačica do | zazor | **odnos** | iznad verzala |
| --- | --- | --- | --- | --- | --- |
| Libre Baskerville | 54 | 78 | 24 | **44%** | ne |
| Fraunces | 48 | 69 | 21 | **44%** | ne |
| Lora | 52 | 77 | 25 | **48%** | da |
| Source Serif 4 | 51 | 76 | 25 | **49%** | da |
| Literata | 52 | 78 | 26 | **50%** | da |
| **Playfair Display** | 53 | 81 | 28 | **53%** | da |
| Spectral | 46 | 71 | 25 | **54%** | da |
| EB Garamond | 42 | 65 | 23 | **55%** | ne |
| _Georgia (referenca)_ | 49 | 76 | 27 | _55%_ | da |
| Crimson Pro | 43 | 67 | 24 | **56%** | da |
| **Cormorant Garamond** | 40 | 73 | 33 | **83%** ❌ | da |

Cormorant je izraziti autlajer — **83%**, dok su svi ostali u uskom opsegu
44–56%. Ima najmanju x-visinu (40) i kvačicu podignutu do visine uzlaznih
slova, iznad verzala. Na srpskom, gde č/ć/š/ž ima u skoro svakom naslovu
(„Cveće koje nešto znači" ima tri), to je izgledalo kao greška u renderovanju.

> Font se **učitavao ispravno** — `latin-ext` subset je bio uključen i
> provereno je da je aktivan. Nije bio bag u kodu nego osobina samog pisma.

**Prored:** kvačice se na tesnom proredu sudaraju sa silaznim slovima reda
iznad. Sa Cormorantom na `leading-1.05` zazor je bio **1,8px** (dodirivali su
se). Minimalni prored pre sudara: Playfair **1.00**, Lora/Libre Baskerville
1.04, Cormorant 1.02. Hero naslov koristi `leading-[1.12]` → zazor 11,5px.

**Ako se menja naslovni font:** ostati u opsegu do ~56% i ponovo izmeriti.
Zamena je na jednom mestu — `src/app/layout.tsx` (import + `variable`) i token
`--font-naslov` u `globals.css`. Sledeći kandidati po meri: Fraunces (44%, više
karaktera, display font) i Lora (48%, toplija, pravljena i za ćirilicu).

**Oba fonta moraju da uključe `latin-ext` subset** (`src/app/layout.tsx`), inače
se č, ć, š, ž i đ crtaju iz fallback fonta i vidno odskaču.

## Dugmad (CTA)

Klasa `.dugme-tecno` u `globals.css` — moderno dugme-pilula, čist CSS + malo
JS-a, bez runtime zavisnosti:

- **Oblik: puna pilula** (`border-radius: 9999px`). Oblik je u `.dugme-tecno`
  (components sloj), pa `rounded-full` u markup-u nije potreban (i ne bi ni
  smetao — ista vrednost). ⚠️ `::after` ring nasleđuje radijus (`inherit`).
  (Istorijat: „radijus 2–4px" → squircle → pilula → zaobljeni pravougaonik
  18px → squircle 26px → **vraćeno na punu pilulu** 18.07.2026 na zahtev.
  Zaobljeni pravougaonik i squircle su probani i odbačeni.)
- **Dve varijante, ogledalo jedna drugoj** (postavljeno 18.07.2026):
  - **Podrazumevana (puna ruža)** — gradijent `#BC5569`→`#9C4054`, beo tekst.
    Popuna na hover je **bela**, pa tekst prelazi u ruža. Ovo je „Pozovi".
    Gornji stop je **najživlji koji drži belo na WCAG AA (4,52:1)**.
  - **`.dugme-tecno--obris`** — bela podloga, ruža border (`inset` senka
    1.5px, ne `border`, da ne pomera dimenzije) i ruža tekst. Popuna na hover
    je **ruža**, tekst prelazi u belo. Ovo je „Pogledaj ponudu".
- **Hover je IDENTIČAN kod obe varijante** — razlikuje se samo boja popune
  (`--dt-fill`): kod obrisa roze, kod pune bela. Popuna se digne odozdo,
  **stoji dok je kursor na dugmetu**, i **vrati se nadole** kad kursor izađe.
  Tekst pređe u drugu boju sa kašnjenjem **190ms** (bez toga bi kontrast pao u
  međukoraku — npr. belo na beloj popuni).
- **Popuna je KRUG** (`border-radius: 50%`). Oblik latice
  (`50% 0 50% 0` + `rotate(-45deg)`) je probavan 18.07.2026 i **vraćen na krug
  na zahtev** — ne uvoditi ponovo bez traženja.
- ⚠️ **Veličina popune (140%) nije proizvoljna — mora da prekrije dugme 100%.**
  U trenutku kad je popuna gore, tekst menja boju; gde popuna ne stigne, tekst
  nestaje (ruža na ruža gradijentu). Provereno računski i empirijski u brauzeru
  (`elementFromPoint` po mreži) na sve četiri veličine dugmeta — hero 239 i
  201px, mobilni 327px, nav 96px.
  **Uzgred nađen i ispravljen stariji propust:** raniji krug na **120%** je
  padao na mobilnom (97,9%) — uglovi dugmeta pune širine nisu bili pokriveni.
  Zato 140%. Pri svakoj promeni oblika ili veličine popune, ponoviti proveru.
- ⚠️ **Mora da bude `transition`, ne keyframe animacija.** Animacija se odvrti
  do kraja bez obzira na kursor; tranzicija se prirodno vraća unazad na
  izlazak. Probano 18.07.2026 sa keyframe-ovima (belo je prolazilo preko i
  izlazilo naviše) — **odbačeno**, popuna mora da stoji i čeka. Time su otpali
  i `dt-preko` i `dt-oznaka-preko`.
- **Pozadina dugmeta se na hover NE menja** — ruža ostaje ispod bele popune, pa
  se ukaže čim se popuna spusti. Raniji trik sa zamenom pozadine
  (`background 0s 430ms`, protiv tanke linije po obodu) je uklonjen jer je
  dugme trajno ostajalo belo.
- **`::after` je BORDER kod obe varijante** — isti ring `inset 0 0 0 1.5px`
  u `akcent` boji, ista geometrija. Zašto ne `inset` senka na samom dugmetu:
  ona se slika uz pozadinu, dakle ispod `::before` popune, pa je popuna
  prekrije i border nestane čim krene hover. `::after` se slika posle
  `::before`, pa ring ostaje vidljiv i preko popune.
  **Sheen sweep je zbog ovoga uklonjen** (`::after` je bio njegov).
  Ring usput pokriva i tanku liniju od antialiasinga po obodu popune.
  Na punom dugmetu je u mirovanju jedva vidljiv (ruža na ruža gradijentu),
  ali se jasno vidi kad bela popuna pokrije dugme.
- ⚠️ **Ograničenje koje se stalno vraća:** meka roze NE može da nosi beo tekst.
  Mereno: `#BF5B70` → 4,25:1, `#C76B7E` → 3,60:1, `#D98B9B` → 2,59:1 — sve pada.
  Granica je oko `#B04A5F` (5,26:1). Zato roze radi na **dva nivoa**: meka za
  podloge sekcija, dublja (`akcent`) za dugmad, border i tekst.
- **Žele „squish" (`dt-zele`) je UKLONJEN** 18.07.2026 na Vukašinov zahtev —
  ne vraćati ga. Ostalo je samo kratko stiskanje na `:active` (`scale: 0.96`).
  Na hover sada rade: popuna odozdo, sheen i magnetni nagib.
- **Veličina u hero-u:** `px-9 py-4.5 text-base` → 60px visine. Na telefonu
  dugmad idu jedno ispod drugog preko cele širine.
- **Samo aura, bez ivice:** obojena „aura" senka u tonu dugmeta (`--dt-glow`).
  Bela „staklena" ivica (`inset 0 0 0 1px`) i gornji odsjaj **uklonjeni su
  18.07.2026** — čitali su se kao čudan svetli border oko dugmeta. Ne vraćati.
  Ranije je uklonjena i rotirajuća iridescentna ivica (nije se svidela).
- **Sjaj + magnetni nagib:** `::before` je specular sjaj koji **prati kurzor**, a
  dugme se blago nagne ka mišu (3D `rotateX/Y` u `transform`). Postavlja
  `useMagnetniNagib.ts` (JS) — **samo na uređajima sa mišem** (`hover: hover`),
  na dodiru (mobilni, primaran uređaj) se ništa ne kači.
- Sve poštuje `prefers-reduced-motion` (globalno zamrzava animacije).

## Zaglavlje — floating pill koji se materijalizuje

`Zaglavlje.tsx`. Nav je `fixed`, sa dva stanja vezana za `providno`
(`scrollY < innerHeight` na početnoj, dok traje hero scrub):

**Nad heroom (`providno`):** vidi se **samo sadržaj** — logo, linkovi, „Pozovi"
dugme — koji pluta preko cveta. **Oblik (kontejner) se NE vidi:** pozadina,
ivica, senka i blur su nula. Sadržaj ulazi load-animacijom (`hero-uvod-nav`,
opacity fade). Tekst je `ink` (tamni), a boju na stranicu daje cvet.

**Kad se scrub završi** (`scrollY >= innerHeight`, korisnik može naniže): nav se
**materijalizuje u floating pill** kroz **850ms `ease-out`** (transition na
`translate, background, border, box-shadow, backdrop-filter`) i takav ostaje
kroz ostatak sajta. Pilula: `rounded-full`, `max-w-5xl` sa marginama,
`translate-y-4` (blago pluta), **`backdrop-blur-[80px]` + `saturate-[2]`**,
pastelni **iridescentni gradijent** (roze→lila→plavo→mint, alfe 0,64–0,72),
`border-white/50`, meka topla senka. Boja je **namerno iridescentna, ne bela** —
uska „glass" primena koju sankcioniše sekcija „Stil" (staklo samo na hero-navu i
CTA), po ugledu na stakleni cvet.

### Mereno (ne procenjivano)

- **Čitljivost nad heroom bez scrim-a.** Gornja (nav) traka videa: min luminansa
  **0,175**, **14% tamnih piksela** → ink pada na **3,73:1** (ispod AA) na
  najtamnijim tačkama. Zato ink tekst (logo/linkovi) dobija **svetli halo**
  (`text-shadow: 0 0 16px rgba(255,252,253,0.7)`) **samo nad heroom** — odvaja
  tekst bez vidljivog oblika. „Pozovi" je rozo dugme, čitljivo na svemu.
- **Jačina stakla (aktivna pilula).** Poluprovidno staklo preko sadržaja strane
  (sekcije, fotografije buketa) je puštalo pozadinu da „probija" pa je ink
  treperio. Na alfi 0,72 + blur 80px ink linkovi su **≥7,5:1 čak preko najtamnije
  fotografije** i ~11:1 preko svetlog. Ne spuštati alfe bez ponovne provere.

> Istorijat (da se ne vrti u krug): probani i odbačeni — (1) pun-širina **tamni
> nav + beli scrim** (scrim je izgledao kao bela pozadina nava); (2) floating
> pill koji je **stalno** vidljiv; (3) **frosted pun-širina** traka (Ancora-stil).
> Usvojeno: **floating pill koji se materijalizuje tek posle scrub-a**. Beli
> scrim je uklonjen (zamenjen halo-om); ne vraćati ga.

Sa `prefers-reduced-motion` nema scrub-a (cvet je odmah otvoren) → nav je odmah
u pill stanju.

## Stil

Uređivački, vođen fotografijom. Slike buketa su sadržaj — sve ostalo se sklanja:
mirna podloga, tanke linije, dosta praznog prostora. Modernost dolazi iz hero-a i
iridescentnih akcenata, ne iz zatrpavanja efektima.

> Napomena o „Liquid Glass": ranije je predlog tog stila za **ceo sajt** odbijen
> (slabe performanse, loš kontrast na mobilnom). Sada je usvojena **uska,
> namenska** verzija — glass/iridescentni tretman samo na hero-navu i CTA
> dugmadima, gde tematski prati stakleni cvet. To nije isti zahvat kao „ceo sajt
> u staklu"; ostatak ostaje miran i čitljiv.

## Pravila

- Ikone su SVG, nikad emoji.
- `cursor-pointer` na svemu klikabilnom.
- Prelazi 150–300ms; poštuj `prefers-reduced-motion` (već globalno u `globals.css`).
- Fokus za tastaturu mora da ostane vidljiv.
- Provera na 375px, 768px, 1024px i 1440px.
- Teški vizuelni efekti (backdrop-filter, JS na pokret) ostaju rezervisani za
  hero i CTA — ne širiti ih po celom sajtu; mobilni je primaran uređaj.
