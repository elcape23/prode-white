// Lista curada de jugadores destacados que se muestra por defecto en los
// comboboxes de la página Bonus (Mejor jugador, Goleador, Mejor jugador joven).
// Al escribir en el buscador, las sugerencias filtran el pool completo de
// jugadores (esta lista + los planteles importados desde la API).
//
// El país se usa solo para resolver la bandera (flagSrc acepta nombres en
// inglés o español).

export type FeaturedPlayer = { name: string; country: string };

// Players born on or after 2005-01-01 — eligible for the FIFA Best Young Player
// award at the 2026 World Cup (21 or younger at tournament start).
export const FEATURED_YOUNG_PLAYERS: FeaturedPlayer[] = [
  { name: "Lamine Yamal", country: "Spain" },
  { name: "Endrick", country: "Brazil" },
  { name: "Estevão", country: "Brazil" },
  { name: "Pau Cubarsí", country: "Spain" },
  { name: "Warren Zaïre-Emery", country: "France" },
  { name: "Archie Gray", country: "England" },
  { name: "Kobbie Mainoo", country: "England" },
  { name: "Leny Yoro", country: "France" },
  { name: "Mathys Tel", country: "France" },
  { name: "Désiré Doué", country: "France" },
  { name: "Geovany Quenda", country: "Portugal" },
];

export const FEATURED_PLAYERS: FeaturedPlayer[] = [
  { name: "Cristiano Ronaldo", country: "Portugal" },
  { name: "Lionel Messi", country: "Argentina" },
  { name: "Kylian Mbappé", country: "France" },
  { name: "Neymar", country: "Brazil" },
  { name: "Vinícius Júnior", country: "Brazil" },
  { name: "Erling Haaland", country: "Norway" },
  { name: "Lamine Yamal", country: "Spain" },
  { name: "Mohamed Salah", country: "Egypt" },
  { name: "Jude Bellingham", country: "England" },
  { name: "Harry Kane", country: "England" },
  { name: "Pedri", country: "Spain" },
  { name: "Rodri", country: "Spain" },
  { name: "Bukayo Saka", country: "England" },
  { name: "Declan Rice", country: "England" },
  { name: "Antoine Griezmann", country: "France" },
  { name: "Endrick", country: "Brazil" },
  { name: "Lautaro Martínez", country: "Argentina" },
  { name: "Julián Álvarez", country: "Argentina" },
  { name: "Florian Wirtz", country: "Germany" },
  { name: "Jamal Musiala", country: "Germany" },
  { name: "Kevin De Bruyne", country: "Belgium" },
  { name: "Achraf Hakimi", country: "Morocco" },
  { name: "Federico Valverde", country: "Uruguay" },
  { name: "Christian Pulisic", country: "USA" },
  { name: "Son Heung-min", country: "South Korea" },
  { name: "Virgil van Dijk", country: "Netherlands" },
  { name: "Alexis Mac Allister", country: "Argentina" },
  { name: "Nico Williams", country: "Spain" },
  { name: "Ousmane Dembélé", country: "France" },
  { name: "Raphinha", country: "Brazil" },
];
