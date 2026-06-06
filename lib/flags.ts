// Mapeo de nombre de equipo (selección) → archivo de bandera en /public/flags.
//
// Los nombres de equipo pueden venir en inglés (API football-data.org) o en
// español (carga manual por CSV / admin). Esta tabla resuelve ambos idiomas,
// ignorando mayúsculas y acentos. Si no hay coincidencia se devuelve null y la
// UI cae al ícono genérico.

/** Slugs disponibles en /public/flags (sin la extensión .svg). */
export const FLAG_SLUGS = [
  "algeria", "argentina", "australia", "austria", "belgium", "bosnia",
  "brazil", "canada", "cape-verde", "colombia", "croatia", "curacao",
  "czechia", "dr-congo", "ecuador", "egypt", "england", "france", "germany",
  "ghana", "haiti", "iran", "iraq", "ireland", "ivory-coast", "japan", "jordan", "mexico",
  "morocco", "netherlands", "new-zealand", "norway", "panama", "paraguay",
  "portugal", "qatar", "saudi-arabia", "scotland", "senegal", "south-africa",
  "south-korea", "spain", "sweden", "switzerland", "tunisia", "turkey",
  "united-states", "uruguay", "uzbekistan",
] as const;

export type FlagSlug = (typeof FLAG_SLUGS)[number];

/** Quita acentos, pasa a minúsculas y colapsa espacios. */
function normalize(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

// Alias normalizados → slug. Incluye variantes en inglés y español, además de
// las formas que devuelve football-data.org (ej. "Korea Republic", "IR Iran").
const ALIASES: Record<string, FlagSlug> = {
  // Sudamérica
  "argentina": "argentina",
  "brasil": "brazil", "brazil": "brazil",
  "colombia": "colombia",
  "ecuador": "ecuador",
  "paraguay": "paraguay",
  "uruguay": "uruguay",

  // Norte / Centroamérica y Caribe
  "canada": "canada",
  "estados unidos": "united-states", "united states": "united-states", "usa": "united-states", "ee uu": "united-states",
  "mexico": "mexico",
  "panama": "panama",
  "haiti": "haiti",
  "curazao": "curacao", "curacao": "curacao",
  "cabo verde": "cape-verde", "cape verde": "cape-verde",
  "cabo verde islands": "cape-verde", "cape verde islands": "cape-verde",

  // Europa
  "alemania": "germany", "germany": "germany",
  "austria": "austria",
  "belgica": "belgium", "belgium": "belgium",
  "bosnia": "bosnia", "bosnia y herzegovina": "bosnia", "bosnia and herzegovina": "bosnia", "bosnia herzegovina": "bosnia",
  "croacia": "croatia", "croatia": "croatia",
  "escocia": "scotland", "scotland": "scotland",
  "espana": "spain", "spain": "spain",
  "francia": "france", "france": "france",
  "inglaterra": "england", "england": "england",
  "irlanda": "ireland", "ireland": "ireland", "republic of ireland": "ireland",
  "noruega": "norway", "norway": "norway",
  "paises bajos": "netherlands", "holanda": "netherlands", "netherlands": "netherlands",
  "portugal": "portugal",
  "republica checa": "czechia", "chequia": "czechia", "czechia": "czechia", "czech republic": "czechia",
  "suecia": "sweden", "sweden": "sweden",
  "suiza": "switzerland", "switzerland": "switzerland",

  // África
  "argelia": "algeria", "algeria": "algeria",
  "egipto": "egypt", "egypt": "egypt",
  "ghana": "ghana",
  "costa de marfil": "ivory-coast", "ivory coast": "ivory-coast", "cote d ivoire": "ivory-coast", "cote divoire": "ivory-coast",
  "marruecos": "morocco", "morocco": "morocco",
  "rd congo": "dr-congo", "republica democratica del congo": "dr-congo", "dr congo": "dr-congo", "congo dr": "dr-congo",
  "senegal": "senegal",
  "sudafrica": "south-africa", "south africa": "south-africa",
  "tunez": "tunisia", "tunisia": "tunisia",

  // Asia / Oceanía / Medio Oriente
  "arabia saudita": "saudi-arabia", "arabia saudi": "saudi-arabia", "saudi arabia": "saudi-arabia",
  "australia": "australia",
  "iran": "iran", "ir iran": "iran",
  "irak": "iraq", "iraq": "iraq",
  "japon": "japan", "japan": "japan",
  "jordania": "jordan", "jordan": "jordan",
  "corea del sur": "south-korea", "corea": "south-korea", "south korea": "south-korea", "korea republic": "south-korea", "republic of korea": "south-korea",
  "nueva zelanda": "new-zealand", "nueva zelandia": "new-zealand", "new zealand": "new-zealand",
  "qatar": "qatar",
  "turquia": "turkey", "turkey": "turkey", "turkiye": "turkey",
  "uzbekistan": "uzbekistan",
};

/** Resuelve el slug del país a partir de un nombre de equipo, o null. */
function resolveSlug(teamName: string | null | undefined): FlagSlug | null {
  if (!teamName) return null;
  const key = normalize(teamName);
  if (!key) return null;

  const direct = key.replace(/\s+/g, "-");
  const resolved: FlagSlug | undefined =
    ALIASES[key] ??
    SPANISH_TO_SLUG[key] ??
    ((FLAG_SLUGS as readonly string[]).includes(direct)
      ? (direct as FlagSlug)
      : undefined);

  return resolved ?? null;
}

/**
 * Devuelve la ruta pública de la bandera para un nombre de equipo, o null si
 * no se encuentra una coincidencia (ej. "Por definir", "Ganador A").
 */
export function flagSrc(teamName: string | null | undefined): string | null {
  const slug = resolveSlug(teamName);
  return slug ? `/flags/${slug}.svg` : null;
}

// Nombre de la selección en español por slug.
const SPANISH: Record<FlagSlug, string> = {
  algeria: "Argelia",
  argentina: "Argentina",
  australia: "Australia",
  austria: "Austria",
  belgium: "Bélgica",
  bosnia: "Bosnia y Herzegovina",
  brazil: "Brasil",
  canada: "Canadá",
  "cape-verde": "Cabo Verde",
  colombia: "Colombia",
  croatia: "Croacia",
  curacao: "Curazao",
  czechia: "República Checa",
  "dr-congo": "R.D. del Congo",
  ecuador: "Ecuador",
  egypt: "Egipto",
  england: "Inglaterra",
  france: "Francia",
  germany: "Alemania",
  ghana: "Ghana",
  haiti: "Haití",
  iran: "Irán",
  iraq: "Irak",
  ireland: "Irlanda",
  "ivory-coast": "Costa de Marfil",
  japan: "Japón",
  jordan: "Jordania",
  mexico: "México",
  morocco: "Marruecos",
  netherlands: "Países Bajos",
  "new-zealand": "Nueva Zelanda",
  norway: "Noruega",
  panama: "Panamá",
  paraguay: "Paraguay",
  portugal: "Portugal",
  qatar: "Catar",
  "saudi-arabia": "Arabia Saudita",
  scotland: "Escocia",
  senegal: "Senegal",
  "south-africa": "Sudáfrica",
  "south-korea": "Corea del Sur",
  spain: "España",
  sweden: "Suecia",
  switzerland: "Suiza",
  tunisia: "Túnez",
  turkey: "Turquía",
  "united-states": "Estados Unidos",
  uruguay: "Uruguay",
  uzbekistan: "Uzbekistán",
};

// Mapa inverso (nombre español normalizado → slug) para que la bandera
// resuelva también cuando se parte del nombre ya traducido (ej. "Catar").
const SPANISH_TO_SLUG: Record<string, FlagSlug> = Object.fromEntries(
  (Object.entries(SPANISH) as [FlagSlug, string][]).map(([slug, es]) => [
    normalize(es),
    slug,
  ]),
);

/**
 * Devuelve el nombre del equipo en español. Si no se reconoce (ej.
 * "Por definir", "Ganador A") devuelve el nombre original sin cambios.
 */
export function teamNameEs(teamName: string | null | undefined): string {
  const slug = resolveSlug(teamName);
  return slug ? SPANISH[slug] : teamName ?? "";
}

/**
 * Versión abreviada para nombres largos: abrevia la primera palabra a su
 * inicial. Ej. "Países Bajos" → "P. Bajos", "Corea del Sur" → "C. del Sur".
 * Los nombres cortos o ya abreviados (ej. "R.D. del Congo") quedan igual.
 */
export function teamNameShort(name: string): string {
  if (name.length <= 11) return name;
  const parts = name.split(" ");
  if (parts.length < 2) return name;
  if (parts[0].endsWith(".")) return name; // ya abreviado
  return `${parts[0].charAt(0).toUpperCase()}. ${parts.slice(1).join(" ")}`;
}
