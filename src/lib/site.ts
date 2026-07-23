/**
 * Podaci o cvećari na jednom mestu — menjaju se samo ovde.
 */
export const site = {
  naziv: "Cvećara Matiola",
  slogan: "Buketi rađeni rukom, u Kraljevu",
  opis:
    "Cvećara Matiola iz Kraljeva: buketi za rođendane, venčanja i sve prilike " +
    "između. Pogledajte ponudu i pozovite da vam napravimo vaš.",

  telefon: "+381 62 756 113",
  telefonPrikaz: "062 756 113",

  adresa: {
    ulica: "Žička 92",
    grad: "Kraljevo",
    postanski: "36000",
    drzava: "Srbija",
  },

  // Kraljevo, Žička 92 — koordinate za mapu i strukturirane podatke
  koordinate: { lat: 43.7167, lng: 20.6892 },

  instagram: "https://www.instagram.com/cvecara_matiola/",

  /**
   * Radno vreme. Poznato je samo da se zatvara u 20:00 —
   * TODO(vlasnica): potvrditi otvaranje i vikend.
   */
  radnoVreme: [
    { dan: "Ponedeljak", od: "08:00", do: "20:00" },
    { dan: "Utorak", od: "08:00", do: "20:00" },
    { dan: "Sreda", od: "08:00", do: "20:00" },
    { dan: "Četvrtak", od: "08:00", do: "20:00" },
    { dan: "Petak", od: "08:00", do: "20:00" },
    { dan: "Subota", od: "08:00", do: "20:00" },
    { dan: "Nedelja", od: "08:00", do: "14:00" },
  ],
} as const;

/**
 * Kategorije („Šta vam treba?" na početnoj).
 *
 * `slika`: fotografija pločice; `null` → pločica pada nazad na linijski
 * botanički crtež (KategorijaPlocica.tsx), pa se slike mogu menjati jedna po
 * jedna bez praznih polja.
 *
 * `fokus`: `object-position` crop-a. Pločica je 5:3 (široka), a fotografije su
 * uglavnom portretne — centralni crop bi odsekao baš ono što treba da se vidi
 * (kod venčanja bi ostale samo ruke, buket bi ispao van kadra). Vrednost je
 * mereno postavljena po slici, da cveće padne u GORNJU polovinu pločice, jer
 * donju prekriva svetli zastor ispod kog stoji naziv. Ako zameniš fotografiju,
 * ponovi proveru — stara vrednost skoro sigurno ne odgovara novom kadru.
 *
 * Fajlovi su .jpg i to je u redu: next/image ih u letu prevodi u WebP/AVIF i
 * skalira na veličinu pločice, pa ručna konverzija ništa ne bi dobila.
 *
 * Izvor: Unsplash / Pexels / Pixabay — licence dozvoljavaju komercijalnu
 * upotrebu bez atribucije. Pri zameni izbegavaj prepoznatljiva lica: licenca
 * pokriva fotografa, ali ne i osobu na slici (za to treba model release).
 *
 * PAŽNJA: stock je u redu SAMO ovde (dekoracija kategorije). Za pojedinačne
 * buketa iz ponude (`slikaUrl` u buketi.ts) ide isključivo fotografija pravog
 * buketa — tuđa slika bi predstavljala tuđi proizvod kao naš.
 */
export const kategorije = [
  {
    slug: "rodjendan",
    naziv: "Rođendan",
    slika: "/kategorije/rodjendan.jpg",
    // 85%, ne 70%: na 70% u kadar upada pola čestitke sa engleskim „Beautiful".
    fokus: "center 85%",
  },
  {
    slug: "vencanje",
    naziv: "Venčanje",
    slika: "/kategorije/vencanje.jpg",
    fokus: "center 80%", // buket je pri samom dnu, iznad njega su samo ruke
  },
  {
    slug: "ljubav",
    naziv: "Ljubav i godišnjice",
    slika: "/kategorije/ljubav_i_godisnjica.jpg",
    fokus: "center 50%", // jedina već skoro pejzažna (1280x853), centar valja
  },
  {
    slug: "sahrana",
    naziv: "Saučešće",
    slika: "/kategorije/saucesce.jpg",
    fokus: "center 40%", // najpuniji cvetovi su u gornjem delu
  },
  {
    slug: "sezonsko",
    naziv: "Sezonsko",
    slika: "/kategorije/sezonsko.jpg",
    fokus: "center 55%", // gornja četvrtina je izvan fokusa (bokeh)
  },
  {
    slug: "sobne-biljke",
    naziv: "Sobne biljke",
    slika: "/kategorije/sobne_biljke.jpg",
    // Jedina slika ŠIRA od paralaks sloja (1280x848, odnos 1.51 > 1.39), pa je
    // `object-cover` skalira po visini i seče bočno — vertikalne zalihe nema i
    // pomeraj po Y ne bi radio ništa. Zato samo `center`, da vrednost ne glumi
    // meru koje nema. Paralaks radi normalno (sloj se pomera, ne kadar unutar
    // njega): hod je 141px. Ako se slika opet menja, prvo proveriti odnos.
    fokus: "center",
  },
] as const;

export type KategorijaSlug = (typeof kategorije)[number]["slug"];
