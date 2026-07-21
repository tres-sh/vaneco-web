// Franchise/Anton (the display font used for h1/h2 and .font-franchise
// headings) renders acute-accented vowels broken/misaligned. Strip only
// those — not ñ/Ñ, which is its own letter in Spanish, not an accent
// ("años" vs "anos" is a very different word).
const ACCENTED_VOWELS: Record<string, string> = {
  á: "a",
  é: "e",
  í: "i",
  ó: "o",
  ú: "u",
  Á: "A",
  É: "E",
  Í: "I",
  Ó: "O",
  Ú: "U",
};

export function stripAccents(text: string): string {
  return text.replace(/[áéíóúÁÉÍÓÚ]/g, (c) => ACCENTED_VOWELS[c] ?? c);
}
