import { site } from "./site";

/**
 * Grupiše uzastopne dane sa istim radnim vremenom u opseg
 * (npr. „Ponedeljak–Subota 08:00–20:00", pa „Nedelja 08:00–14:00").
 * Data-driven: ako vlasnica kasnije promeni neki dan, grupisanje se samo
 * prelomi. Koriste ga footer (Podnozje.tsx, skraćeno u jedan red) i kontakt
 * strana — jedan izvor, ne mogu da se raziđu.
 */
export function grupisiRadnoVreme() {
  const grupe: { dani: string[]; od: string; do: string }[] = [];
  for (const d of site.radnoVreme) {
    const zadnja = grupe[grupe.length - 1];
    if (zadnja && zadnja.od === d.od && zadnja.do === d.do) {
      zadnja.dani.push(d.dan);
    } else {
      grupe.push({ dani: [d.dan], od: d.od, do: d.do });
    }
  }
  return grupe.map((g) => ({
    naziv:
      g.dani.length === 1
        ? g.dani[0]
        : `${g.dani[0]}–${g.dani[g.dani.length - 1]}`,
    od: g.od,
    do: g.do,
  }));
}
