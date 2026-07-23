"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import QRCode from "qrcode";
import { site } from "@/lib/site";
import { useMagnetniNagib } from "@/lib/useMagnetniNagib";

/**
 * „Pozovi" akcija, svesna uređaja:
 *
 *  - DODIR (mobilni; primaran uređaj posetilaca): običan `tel:` link — otvori
 *    se birač sa ukucanim brojem, korisniku ostane samo dugme poziva.
 *  - MIŠ (desktop): `tel:` tamo ili ne radi ništa ili iskoči sistemski
 *    „izaberite aplikaciju" dijalog. Zato klik NE pokušava poziv, nego otvori
 *    panel: broj krupno, „Kopiraj broj" i QR kod (`tel:` URI) — telefon ga
 *    skenira kamerom i poziv je spreman.
 *
 * Grananje je po `(hover: hover) and (pointer: fine)` — ista mera kojom se
 * uključuje magnetni nagib (useMagnetniNagib.ts), pa se sajt svuda isto pita
 * „ima li miša". Proverava se TEK NA KLIK, ne pri renderu: nema hidration
 * grananja, SSR uvek renderuje čist `tel:` link (radi i bez JS-a).
 *
 * Panel ide kroz portal na <body>: dugme u navu živi ispod `backdrop-filter`
 * pilule, a filter pravi containing block za `position: fixed` — bez portala
 * bi se panel „zaključao" unutar pilule umesto preko celog ekrana.
 *
 * `nagib`: uključuje magnetni 3D nagib (hero i nav ga imaju, ostala dugmad
 * ne) — hook se svakako zove (pravila hook-ova), kači se uslovno.
 */
export function PozivDugme({
  className = "",
  style,
  nagib = false,
  children,
}: {
  className?: string;
  style?: CSSProperties;
  /** Magnetni 3D nagib dugmeta (kao hero/nav „Pozovi"). */
  nagib?: boolean;
  children: ReactNode;
}) {
  const [otvoren, setOtvoren] = useState(false);
  const [kopirano, setKopirano] = useState(false);
  const [qr, setQr] = useState<string | null>(null);
  const zatvoriRef = useRef<HTMLButtonElement>(null);
  const nagibRef = useMagnetniNagib<HTMLAnchorElement>();

  const telHref = `tel:${site.telefon.replace(/\s/g, "")}`;

  const naKlik = useCallback((e: MouseEvent<HTMLAnchorElement>) => {
    // Dodir/olovka → pusti tel: da radi svoje. Miš → panel.
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      e.preventDefault();
      setOtvoren(true);
    }
  }, []);

  const zatvori = useCallback(() => {
    setOtvoren(false);
    setKopirano(false);
  }, []);

  // QR se pravi jednom, pri prvom otvaranju (data URL ostaje za sledeća).
  useEffect(() => {
    if (!otvoren || qr) return;
    QRCode.toDataURL(telHref, {
      width: 480,
      margin: 1,
      color: { dark: "#2b1318", light: "#fbfaf9" }, // ink na canvas boji
    })
      .then(setQr)
      .catch(() => setQr(null)); // bez QR-a panel i dalje vredi (broj + kopiranje)
  }, [otvoren, qr, telHref]);

  // Escape zatvara; fokus na „Zatvori" da tastatura ne ostane iza panela.
  useEffect(() => {
    if (!otvoren) return;
    zatvoriRef.current?.focus();
    const naTaster = (e: KeyboardEvent) => {
      if (e.key === "Escape") zatvori();
    };
    document.addEventListener("keydown", naTaster);
    return () => document.removeEventListener("keydown", naTaster);
  }, [otvoren, zatvori]);

  const kopiraj = useCallback(() => {
    navigator.clipboard
      .writeText(site.telefonPrikaz)
      .then(() => setKopirano(true))
      .catch(() => {}); // bez dozvole za clipboard: broj i dalje stoji krupno
  }, []);

  return (
    <>
      <a
        ref={nagib ? nagibRef : undefined}
        href={telHref}
        onClick={naKlik}
        className={className}
        style={style}
      >
        {children}
      </a>

      {otvoren &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Pozovite ${site.naziv}`}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          >
            {/* Zastor — klik van panela zatvara. */}
            <button
              type="button"
              aria-label="Zatvori"
              onClick={zatvori}
              className="absolute inset-0 cursor-default bg-ink/25 backdrop-blur-sm"
            />
            <div className="relative w-full max-w-sm rounded-3xl border border-akcent/15 bg-canvas p-8 text-center shadow-[0_24px_60px_-20px_rgba(43,19,24,0.45)]">
              <button
                ref={zatvoriRef}
                type="button"
                onClick={zatvori}
                aria-label="Zatvori"
                className="absolute right-4 top-4 cursor-pointer p-2 text-tiho-tekst transition-colors duration-200 hover:text-ink"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </button>

              <p className="nadnaslov">Pozovite nas</p>
              <p className="mt-3 font-naslov text-4xl tabular-nums text-ink">
                {site.telefonPrikaz}
              </p>

              <button
                type="button"
                onClick={kopiraj}
                className="dugme-tecno mt-6 inline-block cursor-pointer px-7 py-3.5 text-sm font-medium"
              >
                <span className="dt-oznaka" aria-live="polite">
                  {kopirano ? "Kopirano" : "Kopiraj broj"}
                </span>
              </button>

              {qr && (
                <div className="mt-7 flex flex-col items-center gap-3">
                  {/* Običan <img>: QR je lokalni data URL, optimizer nema šta
                      da optimizuje. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={qr}
                    alt={`QR kod za poziv broja ${site.telefonPrikaz}`}
                    width={152}
                    height={152}
                    className="rounded-nezno border border-granica"
                  />
                  <p className="max-w-[220px] text-xs leading-relaxed text-tiho-tekst">
                    Skenirajte kamerom telefona i poziv je spreman
                  </p>
                </div>
              )}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
