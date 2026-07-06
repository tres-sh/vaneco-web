// =====================
// MATERIALS GUIDE DATA — single source for /materiales (sections + ItemList
// schema) and cross-links to /proyectos?material=…
// Copy approved in spec 7b. No prices — conversion is always "agenda y cotiza".
// =====================

export interface MaterialSpec {
  dureza: string;
  calor: string;
  manchas: string;
  mantenimiento: string;
  ideal: string;
}

export interface Material {
  id: string; // anchor id, e.g. "granito"
  num: string; // "01"
  name: string; // "Granito"
  category: string; // chip label
  /** material filter value for /proyectos?material= */
  filter: string;
  description: string;
  /** keyworded alt for the (placeholder) photo */
  alt: string;
  spec: MaterialSpec;
}

export const materials: Material[] = [
  {
    id: "granito",
    num: "01",
    name: "Granito",
    category: "Piedra natural",
    filter: "Granito",
    description:
      "Piedra 100% natural y la más usada en cubiertas de cocina. Cada losa es única: soporta calor directo, rayones y uso rudo por décadas. Es el punto de partida de la mayoría de nuestros proyectos en Tijuana.",
    alt: "Cubierta de granito para cocina en Tijuana",
    spec: {
      dureza: "Alta",
      calor: "Excelente",
      manchas: "Buena, con sellado",
      mantenimiento: "Sellado periódico",
      ideal: "Cocinas de uso diario y exteriores",
    },
  },
  {
    id: "cuarzo",
    num: "02",
    name: "Cuarzo",
    category: "Piedra de ingeniería",
    filter: "Cuarzo",
    description:
      "Mineral de cuarzo con resinas: superficie no porosa, uniforme y prácticamente libre de mantenimiento. La opción más resistente a manchas para cocinas de uso intenso.",
    alt: "Cubierta de cuarzo blanco en cocina, Tijuana",
    spec: {
      dureza: "Alta",
      calor: "Moderada — usar salvamanteles",
      manchas: "Excelente — no poroso",
      mantenimiento: "Prácticamente nulo",
      ideal: "Cocinas de uso intenso y diseño uniforme",
    },
  },
  {
    id: "cuarcita",
    num: "03",
    name: "Cuarcita",
    category: "Piedra natural",
    filter: "Cuarcita",
    description:
      "Más dura que el granito, con la apariencia veteada del mármol. Para quien busca el look del mármol sin sacrificar resistencia — como la recepción de Torre YNG.",
    alt: "Cubierta de cuarcita veteada estilo mármol, Tijuana",
    spec: {
      dureza: "Muy alta",
      calor: "Excelente",
      manchas: "Buena, con sellado",
      mantenimiento: "Sellado periódico",
      ideal: "Cocinas, islas y zonas de alto tránsito",
    },
  },
  {
    id: "marmol",
    num: "04",
    name: "Mármol",
    category: "Piedra natural",
    filter: "Mármol",
    description:
      "El clásico: vetas únicas y elegancia atemporal. Es más poroso y suave que el granito, por lo que pide cuidado — brilla en espacios de uso moderado.",
    alt: "Cubierta de mármol con vetas para baño, Tijuana",
    spec: {
      dureza: "Media",
      calor: "Buena",
      manchas: "Delicado — requiere sellado",
      mantenimiento: "Sellado y limpieza suave",
      ideal: "Baños, chimeneas y cocinas de bajo uso",
    },
  },
  {
    id: "onix",
    num: "05",
    name: "Ónix",
    category: "Piedra natural · translúcida",
    filter: "Ónix",
    description:
      "Piedra translúcida que puede retroiluminarse: cada losa es una pieza de exhibición. La usamos en barras y muros de acento, como la barra retroiluminada de Almadía.",
    alt: "Barra de ónix retroiluminado, Tijuana",
    spec: {
      dureza: "Baja — delicado",
      calor: "Moderada",
      manchas: "Delicado",
      mantenimiento: "Cuidado especializado",
      ideal: "Barras, muros decorativos y piezas de acento",
    },
  },
];

// Row labels for the spec table (order matters).
export const specRows: { key: keyof MaterialSpec; label: string }[] = [
  { key: "dureza", label: "Dureza" },
  { key: "calor", label: "Resistencia al calor" },
  { key: "manchas", label: "Resistencia a manchas" },
  { key: "mantenimiento", label: "Mantenimiento" },
  { key: "ideal", label: "Ideal para" },
];
