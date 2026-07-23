import Image from "next/image";

/**
 * Prikaz fotografije buketa. Dok vlasnica ne postavi pravu sliku, crta se
 * mirna botanička zamena iz palete — deterministična po slugu, da se ne menja
 * pri svakom renderu.
 */
const zamene = [
  "from-zelen/15 via-sekcija to-sekcija",
  "from-akcent/12 via-sekcija to-sekcija",
  "from-sekcija via-sekcija to-zelen/12",
  "from-akcent/10 via-sekcija to-zelen/12",
];

function izaberiZamenu(slug: string) {
  const zbir = [...slug].reduce((a, c) => a + c.charCodeAt(0), 0);
  return zamene[zbir % zamene.length];
}

export function SlikaBuketa({
  slikaUrl,
  naziv,
  slug,
  prioritet = false,
  klasa = "",
}: {
  slikaUrl: string | null;
  naziv: string;
  slug: string;
  prioritet?: boolean;
  klasa?: string;
}) {
  if (slikaUrl) {
    return (
      <Image
        src={slikaUrl}
        alt={`Buket „${naziv}" — Cvećara Matiola, Kraljevo`}
        fill
        priority={prioritet}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className={`object-cover ${klasa}`}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 bg-gradient-to-br ${izaberiZamenu(slug)} ${klasa}`}
    >
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 h-full w-full opacity-[0.18]"
        preserveAspectRatio="xMidYMid slice"
      >
        <g stroke="currentColor" className="text-zelen" fill="none" strokeWidth="0.6">
          <path d="M50 88 C50 66 50 48 50 30" />
          <path d="M50 62 C38 58 32 48 33 38 C43 40 49 50 50 62 Z" />
          <path d="M50 52 C62 48 68 38 67 28 C57 30 51 40 50 52 Z" />
          <circle cx="50" cy="24" r="6" />
          <circle cx="50" cy="24" r="2.5" />
        </g>
      </svg>
    </div>
  );
}
