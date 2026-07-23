import type { KategorijaSlug } from "./site";

export type Buket = {
  id: string;
  slug: string;
  naziv: string;
  opis: string;
  sastav: string[];
  kategorija: KategorijaSlug;
  cenaOd: number | null; // null = "cena na upit"
  istaknut: boolean;
  slikaUrl: string | null; // null dok vlasnica ne postavi fotografiju
};

/**
 * Privremeni podaci dok se ne poveže Supabase.
 * Sve funkcije ispod su async namerno — kada baza dođe, menja se samo telo
 * funkcije, a stranice koje ih pozivaju ostaju netaknute.
 */
const seed: Buket[] = [
  {
    id: "1",
    slug: "sebojeva-tisina",
    naziv: "Šebojeva tišina",
    opis:
      "Buket po kome cvećara nosi ime. Šeboj u tonovima sleza, sa evkaliptusom " +
      "i belim frezijama. Miris ostaje u sobi danima.",
    sastav: ["Šeboj", "Frezija", "Evkaliptus", "Gipsofila"],
    kategorija: "sezonsko",
    cenaOd: 3500,
    istaknut: true,
    slikaUrl: null,
  },
  {
    id: "2",
    slug: "kraljevacko-jutro",
    naziv: "Kraljevačko jutro",
    opis:
      "Vedar rođendanski buket: ranunkulusi i tulipani u toplim tonovima, " +
      "vezani platnenom trakom.",
    sastav: ["Ranunkulus", "Tulipan", "Ruskus"],
    kategorija: "rodjendan",
    cenaOd: 2800,
    istaknut: true,
    slikaUrl: null,
  },
  {
    id: "3",
    slug: "beli-zavet",
    naziv: "Beli zavet",
    opis:
      "Svadbeni buket od belih ruža i lizijantusa, sa diskretnim zelenilom. " +
      "Radi se po meri mlade, uz probu pre venčanja.",
    sastav: ["Bela ruža", "Lizijantus", "Evkaliptus", "Čipkasti cvet"],
    kategorija: "vencanje",
    cenaOd: null,
    istaknut: true,
    slikaUrl: null,
  },
  {
    id: "4",
    slug: "tiho-saucesce",
    naziv: "Tiho saučešće",
    opis:
      "Uzdržan aranžman u belom i zelenom, za trenutke kada reči nisu dovoljne.",
    sastav: ["Bela hrizantema", "Ljiljan", "Ruskus"],
    kategorija: "sahrana",
    cenaOd: 4000,
    istaknut: false,
    slikaUrl: null,
  },
  {
    id: "5",
    slug: "prva-godisnjica",
    naziv: "Prva godišnjica",
    opis: "Crvene ruže bez klišea: zbijene, tamne, u mat papiru boje pepela.",
    sastav: ["Crvena ruža", "Evkaliptus"],
    kategorija: "ljubav",
    cenaOd: 3200,
    // Istaknut da „Buketi ovog meseca" ima pun donji red (1 veliki + 3).
    istaknut: true,
    slikaUrl: null,
  },
  {
    id: "6",
    slug: "zelena-soba",
    naziv: "Zelena soba",
    opis: "Monstera u keramičkoj saksiji, poklon koji traje duže od buketa.",
    sastav: ["Monstera", "Keramička saksija"],
    kategorija: "sobne-biljke",
    cenaOd: 2200,
    istaknut: false,
    slikaUrl: null,
  },
];

export async function sviBuketi(): Promise<Buket[]> {
  return seed;
}

export async function istaknutiBuketi(): Promise<Buket[]> {
  return seed.filter((b) => b.istaknut);
}

export async function buketPoSlugu(slug: string): Promise<Buket | null> {
  return seed.find((b) => b.slug === slug) ?? null;
}

export function formatCena(cenaOd: number | null): string {
  if (cenaOd === null) return "Cena na upit";
  return `od ${cenaOd.toLocaleString("sr-RS")} RSD`;
}
