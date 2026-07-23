"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/site";

/**
 * Uživo indikator „otvoreno / zatvoreno" — računa se iz `site.radnoVreme` po
 * beogradskom vremenu (cvećara je u Kraljevu, pa je to tačno bez obzira gde je
 * posetilac). Cilj je da gurne na poziv: kad je otvoreno, „do 20h" ohrabruje
 * da se zove odmah.
 *
 * Računa se tek na klijentu (useEffect) da nema hidracijske neusklađenosti —
 * server ne zna vreme posetioca.
 */
type Stanje = { otvoreno: boolean; poruka: string };

function uMinute(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

const KRATKI_DAN = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

function izracunaj(): Stanje {
  const delovi = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Belgrade",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());

  const wd = delovi.find((d) => d.type === "weekday")?.value ?? "Mon";
  const h = Number(delovi.find((d) => d.type === "hour")?.value ?? "0");
  const min = Number(delovi.find((d) => d.type === "minute")?.value ?? "0");

  const idx = KRATKI_DAN.indexOf(wd as (typeof KRATKI_DAN)[number]); // 0=Pon .. 6=Ned
  const danas = site.radnoVreme[idx];
  const sada = h * 60 + min;
  const od = uMinute(danas.od);
  const doo = uMinute(danas.do);

  if (sada >= od && sada < doo) {
    return { otvoreno: true, poruka: `do ${danas.do}` };
  }
  if (sada < od) {
    return { otvoreno: false, poruka: `Otvara danas u ${danas.od}` };
  }
  const sutra = site.radnoVreme[(idx + 1) % 7];
  return { otvoreno: false, poruka: `Otvara sutra u ${sutra.od}` };
}

export function RadnoStanje({ className = "" }: { className?: string }) {
  const [stanje, setStanje] = useState<Stanje | null>(null);

  useEffect(() => {
    setStanje(izracunaj());
  }, []);

  // Rezerviši prostor dok se ne izračuna (bez skoka layout-a).
  if (!stanje) {
    return <span className={`inline-block h-6 ${className}`} aria-hidden="true" />;
  }

  return (
    <span
      className={`inline-flex items-center gap-2 text-sm text-tiho-tekst ${className}`}
    >
      <span
        className={`h-2 w-2 shrink-0 rounded-full ${
          stanje.otvoreno ? "bg-zelen" : "bg-granica-jaka"
        }`}
        aria-hidden="true"
      />
      <span>
        <span className="font-medium text-ink">
          {stanje.otvoreno ? "Sada otvoreno" : "Trenutno zatvoreno"}
        </span>
        {" · "}
        {stanje.poruka}
      </span>
    </span>
  );
}
