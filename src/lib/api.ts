import type { Proyecto } from "../data/projects";

const BASE_URL =
  import.meta.env.PUBLIC_API_URL ||
  import.meta.env.VITE_API_URL ||
  "https://api.pvane.co";

interface ApiImage {
  id: string;
  url: string;
  key: string;
  alt: string | null;
  order: number;
}
interface ApiProject {
  id: string;
  title: string;
  description: string | null;
  category: "RESIDENTIAL" | "COMMERCIAL" | "DESIGN" | "BREAKDOWN";
  location: string | null;
  year: number | null;
  featured: boolean;
  published: boolean;
  material: "GRANITO" | "CUARZO" | "CUARCITA" | "MARMOL" | "ONIX" | null;
  color: "BLANCO" | "NEGRO" | "GRIS" | null;
  colorName: string | null;
  finish: "VETA" | "LISO" | null;
  finishName: string | null;
  workType: string | null;
  sqft: number | null;
  isPublic: boolean;
  place: string | null;
  instagram: string | null;
  mapsUrl: string | null;
  createdAt: string;
  images: ApiImage[];
}

const MATERIAL_LABEL: Record<string, string> = {
  GRANITO: "Granito",
  CUARZO: "Cuarzo",
  CUARCITA: "Cuarcita",
  MARMOL: "Mármol",
  ONIX: "Ónix",
};
const COLOR_KEY: Record<string, "blanco" | "negro" | "gris"> = {
  BLANCO: "blanco",
  NEGRO: "negro",
  GRIS: "gris",
};
const FINISH_KEY: Record<string, "veta" | "liso"> = { VETA: "veta", LISO: "liso" };
const FINISH_LABEL: Record<string, string> = { VETA: "Veta marcada", LISO: "Liso" };
const CATEGORY_LABEL: Record<string, string> = {
  RESIDENTIAL: "Residencial",
  COMMERCIAL: "Comercial",
  DESIGN: "Diseño",
  BREAKDOWN: "Despiece",
};

function mapProject(p: ApiProject): Proyecto {
  const material = p.material ? MATERIAL_LABEL[p.material] : "";
  const images = p.images
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((i) => i.url);
  return {
    id: p.id,
    title: p.title,
    material,
    color: p.color ? COLOR_KEY[p.color] : "",
    colorName: p.colorName || material || "Piedra natural",
    finish: p.finish ? FINISH_KEY[p.finish] : "",
    finishName: p.finishName || (p.finish ? FINISH_LABEL[p.finish] : ""),
    type: p.workType || CATEGORY_LABEL[p.category] || "",
    sqft: p.sqft ? `${p.sqft} ft²` : "",
    img: images[0] || "",
    images,
    description: p.description || "",
    isPublic: p.isPublic,
    place: p.place || undefined,
    location: p.location || undefined,
    instagram: p.instagram || undefined,
    mapsUrl: p.mapsUrl || undefined,
  };
}

async function get<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${BASE_URL}${path}`);
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function getPublishedProjects(): Promise<Proyecto[]> {
  const data = await get<ApiProject[]>("/portfolio/projects");
  if (!data) return [];
  return data.filter((p) => p.published).map(mapProject);
}

export async function getFeaturedProjects(): Promise<Proyecto[]> {
  const data = await get<ApiProject[]>("/portfolio/projects/featured");
  if (!data) return [];
  return data.map(mapProject);
}

export async function getProjectById(id: string): Promise<Proyecto | null> {
  const p = await get<ApiProject>(`/portfolio/projects/${id}`);
  return p ? mapProject(p) : null;
}

export interface CitaLeadInput {
  name: string;
  phone: string;
  email: string;
  city: string;
  date: string;
  referralSource?: string;
}

// El folio se genera y se guarda internamente, pero todavía no se expone
// al cliente — solo confirmamos que el lead se creó.
export interface CitaLeadResult {
  id: string;
}

export async function createCitaLead(input: CitaLeadInput): Promise<CitaLeadResult> {
  const res = await fetch(`${BASE_URL}/leads/web`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("No se pudo agendar la cita");
  return (await res.json()) as CitaLeadResult;
}
