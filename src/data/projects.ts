// =====================
// PROJECT DATA MODEL
// Real photos are pending — `img`/`images` are left empty on purpose so the
// UI renders marked StonePlaceholders until assets arrive (spec §5.6).
// =====================

export type Material = "Granito" | "Cuarzo" | "Cuarcita" | "Ónix" | "Mármol";
export type ColorKey = "blanco" | "negro" | "gris";
export type FinishKey = "veta" | "liso";

export interface Proyecto {
  id: string;
  title: string;
  material: Material;
  color: ColorKey;
  colorName: string;
  finish: FinishKey;
  finishName: string;
  type: string;
  sqft: string;
  img: string;
  images?: string[];
  description: string;
  description2?: string;
  isPublic: boolean;
  place?: string;
  location?: string;
  instagram?: string;
  mapsUrl?: string;
}

export const projects: Proyecto[] = [
  {
    id: "cocina-chapultepec",
    title: "Cocina Chapultepec",
    material: "Granito",
    color: "blanco",
    colorName: "Blanco Dallas",
    finish: "veta",
    finishName: "Veta marcada",
    type: "Cocina",
    sqft: "62 ft²",
    img: "",
    images: ["", ""],
    description:
      "Cubierta de cocina en granito Blanco Dallas con veta marcada. Fabricada en una sola pieza para minimizar juntas, con pulido brillante y canto recto de 3 cm.",
    description2:
      "Instalación en un día con sellado incluido. El tono claro amplía visualmente el espacio y resiste el uso diario.",
    isPublic: false,
  },
  {
    id: "isla-hipodromo",
    title: "Isla Hipódromo",
    material: "Cuarzo",
    color: "gris",
    colorName: "Gris cemento",
    finish: "liso",
    finishName: "Liso mate",
    type: "Isla",
    sqft: "38 ft²",
    img: "",
    images: [""],
    description:
      "Isla central en cuarzo gris cemento, acabado liso mate. Superficie no porosa, ideal para preparación intensiva y fácil de limpiar.",
    isPublic: false,
  },
  {
    id: "barra-torre-yng",
    title: "Barra Torre YNG",
    material: "Cuarcita",
    color: "blanco",
    colorName: "Blanco translúcido",
    finish: "veta",
    finishName: "Veta natural",
    type: "Barra",
    sqft: "24 ft²",
    img: "",
    images: ["", "", ""],
    description:
      "Barra de recepción en cuarcita blanca con veta natural translúcida. Pieza a la vista en un lobby de alto tránsito.",
    description2:
      "La cuarcita ofrece la estética del mármol con mayor dureza y resistencia a rayaduras.",
    isPublic: true,
    place: "Torre YNG",
    location: "Zona Río, Tijuana, B.C.",
    instagram: "@torreyng",
    mapsUrl: "https://maps.google.com/?q=Torre+YNG+Tijuana",
  },
  {
    id: "cocina-cacho",
    title: "Cocina Cacho",
    material: "Granito",
    color: "negro",
    colorName: "Negro absoluto",
    finish: "liso",
    finishName: "Pulido espejo",
    type: "Cocina",
    sqft: "54 ft²",
    img: "",
    images: [""],
    description:
      "Cocina en granito negro absoluto con pulido espejo. Contraste profundo con gabinetes claros y canto biselado.",
    isPublic: false,
  },
  {
    id: "bano-onix-altabrisa",
    title: "Baño Ónix Altabrisa",
    material: "Ónix",
    color: "gris",
    colorName: "Miel translúcido",
    finish: "veta",
    finishName: "Veta iluminada",
    type: "Baño",
    sqft: "18 ft²",
    img: "",
    images: ["", ""],
    description:
      "Cubierta de lavabo en ónix con retroiluminación LED que resalta la veta translúcida de la piedra.",
    description2:
      "El ónix es una piedra delicada; recomendamos sellado periódico para conservar su brillo.",
    isPublic: false,
  },
  {
    id: "comercial-plaza-financiera",
    title: "Recepción Plaza Financiera",
    material: "Mármol",
    color: "blanco",
    colorName: "Blanco Carrara",
    finish: "veta",
    finishName: "Veta gris",
    type: "Comercial",
    sqft: "96 ft²",
    img: "",
    images: ["", "", ""],
    description:
      "Mostrador de recepción corporativa en mármol Blanco Carrara con veta gris. Uniones invisibles en un frente de 8 metros.",
    isPublic: true,
    place: "Plaza Financiera",
    location: "Blvd. Agua Caliente, Tijuana, B.C.",
    instagram: "@plazafinanciera",
    mapsUrl: "https://maps.google.com/?q=Plaza+Financiera+Tijuana",
  },
  {
    id: "isla-cuarzo-negro",
    title: "Isla Cuarzo Negro",
    material: "Cuarzo",
    color: "negro",
    colorName: "Negro estelar",
    finish: "liso",
    finishName: "Liso satinado",
    type: "Isla",
    sqft: "42 ft²",
    img: "",
    description:
      "Isla en cuarzo negro estelar con acabado satinado, sin poros y de mantenimiento mínimo. Canto recto de 4 cm.",
    isPublic: false,
  },
  {
    id: "cocina-cuarcita-gris",
    title: "Cocina Cuarcita Gris",
    material: "Cuarcita",
    color: "gris",
    colorName: "Gris tormenta",
    finish: "veta",
    finishName: "Veta dramática",
    type: "Cocina",
    sqft: "70 ft²",
    img: "",
    images: [""],
    description:
      "Cocina completa en cuarcita gris tormenta con veta dramática de lado a lado. Salpicadero a juego en la misma pieza.",
    isPublic: false,
  },
];

// =====================
// FILTER OPTIONS — derived from the data so the lists stay extensible
// (spec §5.4: never hardcode the option list in the markup).
// =====================
export const colorSwatch: Record<ColorKey, string> = {
  blanco: "#F5F5F5",
  negro: "#0A0A0A",
  gris: "#9BA8B0",
};

function uniqueInOrder<T>(values: T[]): T[] {
  return [...new Set(values)];
}

export const materialOptions = uniqueInOrder(projects.map((p) => p.material));
export const colorOptions = uniqueInOrder(projects.map((p) => p.color));
export const finishOptions = uniqueInOrder(projects.map((p) => p.finish));

// Visible label per finish/color key (first occurrence wins).
export const colorLabels: Record<string, string> = {
  blanco: "Blanco",
  negro: "Negro",
  gris: "Gris",
};
export const finishLabels: Record<string, string> = {
  veta: "Veta",
  liso: "Liso",
};
