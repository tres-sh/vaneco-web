// =====================
// FAQ DATA — single source for the /faq accordion AND the FAQPage JSON-LD
// (spec 7a rule 2: schema always in sync with the visible content).
// Answers are plain strings; links are rendered as plain text URLs where noted
// so the schema and the HTML stay identical. No prices (rule 3).
// =====================

export interface FaqItem {
  q: string;
  a: string;
}

export interface FaqGroup {
  title: string;
  items: FaqItem[];
}

export const faqGroups: FaqGroup[] = [
  {
    title: "Proceso y folio",
    items: [
      {
        q: "¿La visita a domicilio tiene costo?",
        a: "No. Vamos a tu domicilio en Tijuana, Rosarito, Tecate o Ensenada totalmente gratis y sin compromiso. Llevamos muestras físicas, medimos y resolvemos dudas en el momento.",
      },
      {
        q: "¿Qué es el folio y para qué sirve?",
        a: "El folio se crea automáticamente al agendar tu visita. Es tu llave: con él consultas tu cotización, revisas el estatus de tu proyecto y pagas, sin necesidad de crear una cuenta.",
      },
      {
        q: "¿Cuánto tarda la fabricación y la instalación?",
        a: "La fabricación toma de 5 a 10 días según tu proyecto. La instalación normalmente se realiza en un día, con sellado incluido.",
      },
      {
        q: "¿Cuánto cuesta una cubierta de granito o cuarzo en Tijuana?",
        a: "El precio depende de los ft², el material y el acabado que elijas. Por eso la visita es gratis: medimos, eliges material con muestras en mano y recibes una cotización exacta ligada a tu folio. Los precios consideran IVA del 8% por ser región fronteriza.",
      },
    ],
  },
  {
    title: "Materiales",
    items: [
      {
        q: "¿Granito o cuarzo: cuál me conviene?",
        a: "El granito es piedra 100% natural, resiste calor directo y cada losa es única; requiere sellado periódico. El cuarzo es no poroso, muy resistente a manchas y prácticamente sin mantenimiento, con un aspecto más uniforme. En la visita te ayudamos a decidir según tu uso.",
      },
      {
        q: "¿Cómo cuido mi cubierta de piedra natural?",
        a: "Limpia con jabón neutro y agua; evita ácidos (limón, vinagre) y abrasivos. En piedras naturales como granito o mármol, aplica sellado periódico para conservar su resistencia a manchas.",
      },
      {
        q: "¿Puedo ver los materiales antes de decidir?",
        a: "Sí. Llevamos muestras físicas a tu visita y puedes conocer nuestra guía de materiales en piedrasvaneco.com/materiales. Algunas obras están abiertas al público para verlas instaladas.",
      },
    ],
  },
  {
    title: "Pagos",
    items: [
      {
        q: "¿Cómo puedo pagar?",
        a: "Por transferencia bancaria o en efectivo en el taller. Pedimos un anticipo del 50% para iniciar la fabricación; al registrar tu pago, tu folio pasa a estatus En fabricación.",
      },
      {
        q: "¿Los precios incluyen IVA?",
        a: "Sí. Todas las cotizaciones consideran el IVA del 8% correspondiente a la región fronteriza.",
      },
    ],
  },
  {
    title: "Zona de servicio",
    items: [
      {
        q: "¿Atienden fuera de Tijuana?",
        a: "Sí. Además de Tijuana damos servicio en Rosarito, Tecate y Ensenada: visita a domicilio sin costo, fabricamos en nuestro taller de Tijuana e instalamos en tu casa.",
      },
    ],
  },
];

/** FAQPage JSON-LD generated from the same source that renders the accordion. */
export function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqGroups.flatMap((g) =>
      g.items.map((it) => ({
        "@type": "Question",
        name: it.q,
        acceptedAnswer: { "@type": "Answer", text: it.a },
      })),
    ),
  };
}
