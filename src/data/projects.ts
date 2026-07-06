// =====================
// PROJECT TYPES + FILTER CONFIG
// Project records now come from the leads backend (see src/lib/api.ts); this
// file holds the UI shape and the (fixed-enum) filter options.
// =====================

export type ColorKey = "blanco" | "negro" | "gris";
export type FinishKey = "veta" | "liso";

/** Normalized project as consumed by the gallery + detail UI. */
export interface Proyecto {
  id: string;
  title: string;
  /** material display name, e.g. "Granito" ("" if unset) */
  material: string;
  color: ColorKey | "";
  colorName: string;
  finish: FinishKey | "";
  finishName: string;
  /** work type, e.g. "Cocina" ("" if unset) */
  type: string;
  /** formatted surface, e.g. "62 ft²" ("" if unset) */
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

// Fixed filter options (mirror the backend enums). Kept static so the filters
// render consistently regardless of what's currently in the catalog.
export const materialOptions: string[] = [
  "Granito",
  "Cuarzo",
  "Cuarcita",
  "Mármol",
  "Ónix",
];
export const colorOptions: ColorKey[] = ["blanco", "negro", "gris"];
export const finishOptions: FinishKey[] = ["veta", "liso"];

export const colorSwatch: Record<ColorKey, string> = {
  blanco: "#F5F5F5",
  negro: "#0A0A0A",
  gris: "#9BA8B0",
};

export const colorLabels: Record<string, string> = {
  blanco: "Blanco",
  negro: "Negro",
  gris: "Gris",
};
export const finishLabels: Record<string, string> = {
  veta: "Veta",
  liso: "Liso",
};
