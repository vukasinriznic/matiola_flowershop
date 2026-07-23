import type { Metadata } from "next";
import { Lora, Inter } from "next/font/google";
import { site } from "@/lib/site";
import { GlatkiSkrol } from "@/components/GlatkiSkrol";
import { Zaglavlje } from "@/components/Zaglavlje";
import { Podnozje } from "@/components/Podnozje";
import "./globals.css";

// latin-ext je obavezan — bez njega se č, ć, š, ž i đ crtaju iz fallback fonta.
//
// Zamenio Cormorant Garamond (18.07.2026): Cormorant crta kvačice na č/ć/š/ž
// na 83% visine malog slova iznad njega — dvostruko dalje od svih poređenih
// fontova (44–56%; Georgia 55%). Na naslovima je izgledalo kao da dijakritici
// lebde odvojeno, a na srpskom su u skoro svakom naslovu. Merenje je u
// DIZAJN.md. Lora je 48% i pravljena je i za ćirilicu, pa su dijakritici
// crtani namerno, a ne naknadno dodati.
const lora = Lora({
  variable: "--font-naslov-font",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${site.naziv}, Kraljevo`,
    template: `%s · ${site.naziv}`,
  },
  description: site.opis,
  keywords: [
    "cvećara Kraljevo",
    "cveće Kraljevo",
    "buketi Kraljevo",
    "Matiola",
    "svadbeni buket Kraljevo",
  ],
  openGraph: {
    title: `${site.naziv}, Kraljevo`,
    description: site.opis,
    locale: "sr_RS",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="sr" className={`${lora.variable} ${inter.variable} h-full`}>
      {/* Zaglavlje i podnožje stoje OVDE, a ne po stranama: isti su svuda, a
          zaglavlje je `fixed` pa i ne sme da se remontira pri navigaciji —
          inače bi se load-ulaz nava vrteo iznova na svaki klik. Svaka strana
          donosi svoj `<main className="flex-1">`. */}
      <body className="min-h-full flex flex-col">
        <GlatkiSkrol>
          <Zaglavlje />
          {children}
          <Podnozje />
        </GlatkiSkrol>
      </body>
    </html>
  );
}
