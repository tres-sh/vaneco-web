import { useState, type ReactNode } from "react";
import { Check, ArrowRight, ArrowUpRight, Copy, MessageCircle, Loader2 } from "lucide-react";
import { useLang } from "../../lib/useLang";
import { PrimaryBtn } from "../ui/Button";
import { createCitaLead } from "../../lib/api";

const SHELL = "mx-auto w-full max-w-[1440px] px-5 md:px-20";
type Tab = "schedule" | "lookup";
type StatusKey = "scheduled" | "pending" | "fabricating" | "cancelled";

// MVP: la consulta de cotización por folio todavía no está lista para el
// cliente (el folio es interno por ahora). El código queda listo para
// reactivarla más adelante.
const SHOW_LOOKUP_TAB = false;
const VISIBLE_TABS: Tab[] = SHOW_LOOKUP_TAB ? ["schedule", "lookup"] : ["schedule"];

// =====================
// MOCK QUOTE DATA (prototype — real data comes from api.pvane.co)
// =====================
type LineItem = { concept: string; detail: string; price: number };
type Quote =
  | { kind: "full"; folio: string; client: string; items: LineItem[]; status: StatusKey }
  | { kind: "pending"; folio: string; status: StatusKey };

const DEMO_QUOTE: Quote = {
  kind: "full",
  folio: "COT-YNG-2606",
  client: "Torre YNG",
  status: "pending",
  items: [
    { concept: "Cubierta lobby principal", detail: "Cuarcita · Veta natural", price: 36000 },
    { concept: "Cubierta para baño", detail: "Mármol · Veta gris", price: 10000 },
    { concept: "Isla central", detail: "Cuarzo · Liso mate", price: 14000 },
    { concept: "Backsplash", detail: "Cuarcita · Veta natural", price: 6000 },
  ],
};

const IVA_RATE = 0.08;
const BANK = {
  clabe: "0121 8000 1234 5678 90",
  bank: "BBVA",
  legal: "Piedras Vaneco S. de R.L.",
};

function getQuote(raw: string): Quote | null {
  const folio = raw.trim().toUpperCase();
  if (!folio) return null;
  if (folio === "COT-YNG-2606") return DEMO_QUOTE;
  if (/^COT-VNC-\d{3,}$/.test(folio)) return { kind: "pending", folio, status: "scheduled" };
  return null;
}

const money = (n: number) => "$" + n.toLocaleString("en-US");

// =====================
// COPY
// =====================
const copy = {
  es: {
    tabs: { schedule: "Agendar cita", lookup: "Consultar cotización" },
    form: {
      title: ["AGENDA", "TU VISITA"],
      badge: "Visita gratis · Sin compromiso",
      photoAlt: "Cocina con cubierta de cuarzo instalada por Vaneco",
      sub: "Déjanos tus datos y agendamos la visita a tu domicilio. Te contactaremos por WhatsApp para confirmar los detalles.",
      name: "Nombre completo",
      phone: "Teléfono",
      email: "Correo",
      type: "Tipo de trabajo",
      typeOptions: ["Cocina", "Isla", "Barra", "Baño", "Comercial", "Otro"],
      address: "Domicilio para la visita",
      date: "Fecha preferida",
      time: "Horario",
      timeOptions: ["Mañana", "Tarde"],
      source: "¿Cómo nos encontraste? (opcional)",
      sourceOptions: ["Google", "Facebook", "Instagram", "Recomendación", "Otro"],
      submit: "Agendar visita",
      submitting: "Agendando…",
      error: "Completa todos los campos para continuar.",
      apiError: "No pudimos agendar tu cita. Intenta de nuevo o escríbenos por WhatsApp.",
      placeholderType: "Selecciona…",
      placeholderSource: "Selecciona (opcional)",
      consentPre: "He leído y acepto el ",
      consentLink: "Aviso de Privacidad",
      consentPost:
        " y autorizo a Piedras Vaneco el uso de mis datos para agendar la visita y dar seguimiento a mi solicitud.",
      consentNote:
        "El botón se habilita al aceptar. Tus datos nunca se comparten con terceros.",
    },
    confirm: {
      title: ["CITA", "AGENDADA"],
      body: "Te contactaremos por WhatsApp muy pronto para confirmar los detalles de tu visita.",
      another: "Agendar otra",
    },
    expect: {
      title: "Qué esperar",
      steps: [
        "Confirmamos tu cita por WhatsApp.",
        "Medimos y elegimos material con muestras en tu domicilio.",
        "Recibes tu cotización personalizada.",
      ],
      note: "¿Ya tienes folio? Consúltalo en la pestaña de arriba.",
    },
    lookup: {
      title: ["CONSULTA TU", "COTIZACIÓN"],
      sub: "Ingresa el folio que te dimos al agendar para ver el detalle y pagar.",
      label: "Folio",
      placeholder: "COT-…",
      button: "Ver cotización",
      hint: "Prueba con COT-YNG-2606",
      notFound: "No encontramos ese folio. Revisa que esté completo.",
      pendingTitle: "Cotización en preparación",
      pendingBody: "Tu cita quedó registrada. Generamos tu cotización tras la visita a domicilio.",
      subtotal: "Subtotal",
      iva: "IVA (8%)",
      total: "Total",
      pesos: "pesos",
      pay: "Cómo pagar",
      transfer: "Pagar por transferencia",
      cash: "Pagar en efectivo en taller",
      clabeLabel: "CLABE",
      legalLabel: "Razón social",
      copied: "¡Copiado!",
      payNote: "Al pagar, tu folio pasa a En fabricación. Anticipo del 50% para iniciar.",
      whatsTitle: "¿Dudas con tu cotización?",
      whatsBody: "Escríbenos al (664) 808 1307.",
      client: "Cliente",
    },
    status: {
      scheduled: "Cita agendada",
      pending: "Pendiente de pago",
      fabricating: "En fabricación",
      cancelled: "Cancelada",
    },
  },
  en: {
    tabs: { schedule: "Book a visit", lookup: "Check your quote" },
    form: {
      title: ["BOOK", "YOUR VISIT"],
      badge: "Free visit · No commitment",
      photoAlt: "Kitchen with a quartz countertop installed by Vaneco",
      sub: "Leave us your info and we'll book the visit to your home. We'll reach out via WhatsApp to confirm the details.",
      name: "Full name",
      phone: "Phone",
      email: "Email",
      type: "Type of work",
      typeOptions: ["Kitchen", "Island", "Bar", "Bath", "Commercial", "Other"],
      address: "Visit address",
      date: "Preferred date",
      time: "Time",
      timeOptions: ["Morning", "Afternoon"],
      source: "How did you find us? (optional)",
      sourceOptions: ["Google", "Facebook", "Instagram", "Referral", "Other"],
      submit: "Book visit",
      submitting: "Booking…",
      error: "Fill in every field to continue.",
      apiError: "We couldn't book your visit. Please try again or message us on WhatsApp.",
      placeholderType: "Select…",
      placeholderSource: "Select (optional)",
      consentPre: "I have read and accept the ",
      consentLink: "Privacy Notice",
      consentPost:
        " and authorize Piedras Vaneco to use my data to book the visit and follow up on my request.",
      consentNote:
        "The button enables once you accept. Your data is never shared with third parties.",
    },
    confirm: {
      title: ["VISIT", "BOOKED"],
      body: "We'll reach out via WhatsApp shortly to confirm the details of your visit.",
      another: "Book another",
    },
    expect: {
      title: "What to expect",
      steps: [
        "We confirm your appointment via WhatsApp.",
        "We measure and pick material with samples at your home.",
        "You receive your personalized quote.",
      ],
      note: "Already have a folio? Check it in the tab above.",
    },
    lookup: {
      title: ["CHECK YOUR", "QUOTE"],
      sub: "Enter the folio we gave you when booking to see the detail and pay.",
      label: "Folio",
      placeholder: "COT-…",
      button: "View quote",
      hint: "Try COT-YNG-2606",
      notFound: "We couldn't find that folio. Check it's complete.",
      pendingTitle: "Quote in preparation",
      pendingBody: "Your appointment is registered. We'll prepare your quote after the home visit.",
      subtotal: "Subtotal",
      iva: "VAT (8%)",
      total: "Total",
      pesos: "pesos",
      pay: "How to pay",
      transfer: "Pay by transfer",
      cash: "Pay cash at the workshop",
      clabeLabel: "CLABE",
      legalLabel: "Legal name",
      copied: "Copied!",
      payNote: "Once paid, your folio moves to In fabrication. 50% deposit to start.",
      whatsTitle: "Questions about your quote?",
      whatsBody: "Message us at (664) 808 1307.",
      client: "Client",
    },
    status: {
      scheduled: "Scheduled",
      pending: "Payment due",
      fabricating: "In fabrication",
      cancelled: "Cancelled",
    },
  },
} as const;

const STATUS_STYLE: Record<StatusKey, { color: string; bg: string }> = {
  scheduled: { color: "#9BA8B0", bg: "rgba(155,168,176,0.12)" },
  pending: { color: "#FCD34D", bg: "rgba(252,211,77,0.12)" },
  fabricating: { color: "#4ADE80", bg: "rgba(74,222,128,0.12)" },
  cancelled: { color: "#FCA5A5", bg: "rgba(252,165,165,0.12)" },
};

function StatusBadge({ status, label }: { status: StatusKey; label: string }) {
  const s = STATUS_STYLE[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-[10px] px-2.5 py-1 text-[12px] font-medium"
      style={{ color: s.color, background: s.bg }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.color }} />
      {label}
    </span>
  );
}

// =====================
// UNDERLINE FIELD
// =====================
function Field({
  label,
  span2,
  children,
}: {
  label: string;
  span2?: boolean;
  children: ReactNode;
}) {
  return (
    <label className={`flex flex-col gap-1.5 ${span2 ? "sm:col-span-2" : ""}`}>
      <span className="text-[11px] font-medium uppercase tracking-[1.5px] text-[var(--text-muted)]">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputCls =
  "w-full bg-transparent border-b-[1.5px] border-[var(--border-default)] py-2 text-[16px] md:text-[17px] text-[var(--text-primary)] outline-none transition-colors duration-200 focus:border-veta placeholder:text-[var(--text-muted)]";

// =====================
// CITA FLOW
// =====================
export function CitaFlow() {
  const [lang] = useLang("es");
  const t = copy[lang];

  const [tab, setTab] = useState<Tab>("schedule");

  // schedule
  const empty = {
    name: "",
    phone: "",
    email: "",
    type: "",
    address: "",
    date: "",
    time: "",
    source: "",
  };
  const REQUIRED_FIELDS = ["name", "phone", "email", "type", "address", "date", "time"] as const;
  const [form, setForm] = useState(empty);
  const [formError, setFormError] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // lookup
  const [lookupValue, setLookupValue] = useState("");
  const [quote, setQuote] = useState<Quote | null>(null);
  const [lookupError, setLookupError] = useState(false);
  const [copied, setCopied] = useState(false);

  const upd = (k: keyof typeof empty, v: string) => setForm((p) => ({ ...p, [k]: v }));

  async function submitForm(e: React.FormEvent) {
    e.preventDefault();
    const complete = REQUIRED_FIELDS.every((k) => form[k].trim() !== "");
    if (!complete || !consent) {
      setFormError(true);
      return;
    }
    setFormError(false);
    setApiError(false);
    setSubmitting(true);
    try {
      await createCitaLead({
        name: form.name,
        phone: `+52${form.phone}`,
        email: form.email,
        workType: form.type,
        address: form.address,
        date: form.date,
        time: form.time,
        referralSource: form.source || undefined,
      });
      setSubmitted(true);
    } catch {
      setApiError(true);
    } finally {
      setSubmitting(false);
    }
  }

  function resetForm() {
    setForm(empty);
    setConsent(false);
    setSubmitted(false);
    setFormError(false);
    setApiError(false);
  }

  function doLookup(e: React.FormEvent) {
    e.preventDefault();
    const q = getQuote(lookupValue);
    if (q) {
      setQuote(q);
      setLookupError(false);
    } else {
      setQuote(null);
      setLookupError(true);
    }
  }

  async function copyClabe() {
    try {
      await navigator.clipboard.writeText(BANK.clabe.replace(/\s/g, ""));
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="pt-15">
      <section className={`${SHELL} py-10 md:py-16`}>
        {/* ===== TABS ===== */}
        {VISIBLE_TABS.length > 1 && (
          <div className="flex w-full sm:inline-flex sm:w-auto gap-1.5 rounded-[12px] border border-[var(--border-default)] p-1 mb-10">
            {VISIBLE_TABS.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setTab(k)}
                className={[
                  "flex-1 sm:flex-none rounded-[10px] px-4 py-2 text-[14px] font-medium transition-all duration-200",
                  tab === k
                    ? "bg-[var(--invert-bg)] text-[var(--invert-fg)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
                ].join(" ")}
              >
                {t.tabs[k]}
              </button>
            ))}
          </div>
        )}

        {/* ===== SCHEDULE TAB ===== */}
        {tab === "schedule" && (
          <div className="rounded-[24px] border border-[var(--border-default)] bg-[var(--bg-base)] overflow-hidden grid grid-cols-1 md:grid-cols-[0.92fr_1.08fr]">
            {/* left: photo panel — badge, gradient title, steps. Static regardless of form state.
                Explicit height (not min-height) so the absolutely-positioned photo/gradient
                resolve their percentage sizing reliably instead of against an auto-grown box. */}
            <div className="relative h-[560px] md:h-[660px] bg-[#0A0A0A]">
              <img
                src="/images/cocina-cuarzo.jpg"
                alt={t.form.photoAlt}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(10,10,10,0) 0%, rgba(10,10,10,0.05) 30%, rgba(10,10,10,0.45) 50%, rgba(10,10,10,0.9) 66%, #0A0A0A 82%)",
                }}
              />
              <div className="absolute top-7 left-7 inline-flex items-center gap-2 rounded-full bg-[rgba(10,10,10,0.5)] backdrop-blur-[6px] px-3.5 py-2 text-[12px] uppercase tracking-wide text-white">
                <span className="h-1.5 w-1.5 rounded-full bg-veta" />
                {t.form.badge}
              </div>

              <div className="absolute bottom-0 left-0 right-0 flex flex-col gap-4 md:gap-[22px] px-6 pb-6 md:px-9 md:pb-[34px]">
                <h1
                  className="font-franchise uppercase leading-[0.88] text-[40px] md:text-[66px]"
                  style={{
                    backgroundImage: "linear-gradient(180deg,#FFFFFF 0%,#DCE3E7 42%,#9BA8B0 100%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {t.form.title[0]}
                  <br />
                  {t.form.title[1]}
                </h1>
                <div className="flex flex-col gap-2.5">
                  {t.expect.steps.map((s, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 rounded-xl border border-white/12 bg-[rgba(31,31,31,0.6)] backdrop-blur-[8px] px-4 py-3.5"
                    >
                      <span className="font-franchise text-[18px] leading-none text-veta">0{i + 1}</span>
                      <p className="text-[14px] font-light text-white">{s}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* right: form OR confirmation */}
            <div className="flex flex-col gap-5 md:gap-[26px] p-6 md:pt-12 md:px-16 md:pb-11">
            {!submitted ? (
              <form onSubmit={submitForm} className="flex flex-col gap-5 md:gap-[26px]">
                <p className="max-w-[460px] text-[15px] md:text-[16px] font-light text-[var(--text-secondary)]">
                  {t.form.sub}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                  <Field label={t.form.name}>
                    <input
                      className={inputCls}
                      value={form.name}
                      onChange={(e) => upd("name", e.target.value)}
                    />
                  </Field>
                  <Field label={t.form.phone}>
                    <div className="flex items-center gap-2 border-b-[1.5px] border-[var(--border-default)] focus-within:border-veta transition-colors">
                      <span className="text-[16px] md:text-[17px] text-[var(--text-muted)]">+52</span>
                      <input
                        className="w-full bg-transparent py-2 text-[16px] md:text-[17px] text-[var(--text-primary)] outline-none"
                        value={form.phone}
                        onChange={(e) => upd("phone", e.target.value)}
                        inputMode="tel"
                      />
                    </div>
                  </Field>
                  <Field label={t.form.email}>
                    <input
                      className={inputCls}
                      type="email"
                      value={form.email}
                      onChange={(e) => upd("email", e.target.value)}
                    />
                  </Field>
                  <Field label={t.form.type}>
                    <select
                      className={inputCls}
                      value={form.type}
                      onChange={(e) => upd("type", e.target.value)}
                    >
                      <option value="" disabled>
                        {t.form.placeholderType}
                      </option>
                      {t.form.typeOptions.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label={t.form.address} span2>
                    <input
                      className={inputCls}
                      value={form.address}
                      onChange={(e) => upd("address", e.target.value)}
                    />
                  </Field>
                  <Field label={t.form.date}>
                    <input
                      className={inputCls}
                      type="date"
                      value={form.date}
                      onChange={(e) => upd("date", e.target.value)}
                    />
                  </Field>
                  <Field label={t.form.time}>
                    <select
                      className={inputCls}
                      value={form.time}
                      onChange={(e) => upd("time", e.target.value)}
                    >
                      <option value="" disabled>
                        {t.form.placeholderType}
                      </option>
                      {t.form.timeOptions.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label={t.form.source} span2>
                    <select
                      className={inputCls}
                      value={form.source}
                      onChange={(e) => upd("source", e.target.value)}
                    >
                      <option value="">{t.form.placeholderSource}</option>
                      {t.form.sourceOptions.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>

                {/* consent checkbox (LFPDPPP) */}
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="sr-only"
                  />
                  <span
                    aria-hidden="true"
                    className={[
                      "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-[6px] border transition-colors",
                      consent
                        ? "bg-veta border-veta"
                        : "border-[var(--border-default)] bg-transparent",
                    ].join(" ")}
                  >
                    {consent && <Check size={13} color="#0A0A0A" strokeWidth={3} />}
                  </span>
                  <span className="text-[13px] font-light leading-[1.6] text-[var(--text-secondary)]">
                    {t.form.consentPre}
                    <a
                      href="/privacidad"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-veta underline underline-offset-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {t.form.consentLink}
                    </a>
                    {t.form.consentPost}
                  </span>
                </label>

                {formError && (
                  <p className="text-[13px]" style={{ color: "#FCA5A5" }}>
                    {t.form.error}
                  </p>
                )}
                {apiError && (
                  <p className="text-[13px]" style={{ color: "#FCA5A5" }}>
                    {t.form.apiError}
                  </p>
                )}

                <div className="flex flex-col gap-3">
                  <button
                    type="submit"
                    disabled={!consent || submitting}
                    className={[
                      "w-full md:w-auto md:self-start inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-[10px]",
                      "text-[15px] font-medium tracking-wide",
                      "border border-transparent bg-[var(--invert-bg)] text-[var(--invert-fg)]",
                      "transition-all duration-200",
                      consent && !submitting
                        ? "active:scale-[0.96] hover:bg-transparent hover:text-[var(--text-primary)] hover:border-[var(--border-strong)]"
                        : "opacity-40 cursor-not-allowed",
                    ].join(" ")}
                  >
                    {submitting ? t.form.submitting : t.form.submit}
                    {submitting ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <ArrowUpRight size={16} />
                    )}
                  </button>

                  <p className="text-[12px] text-[var(--text-muted)]">{t.form.consentNote}</p>
                </div>
              </form>
            ) : (
              /* confirmation */
              <div className="flex flex-col gap-4">
                <span
                  className="grid h-14 w-14 place-items-center rounded-full"
                  style={{ background: "rgba(34,197,94,0.1)" }}
                >
                  <Check size={26} color="#4ADE80" strokeWidth={2.5} />
                </span>
                <h2 className="font-franchise text-[36px] md:text-[48px] leading-[0.95] text-[var(--text-primary)]">
                  {t.confirm.title[0]} {t.confirm.title[1]}
                </h2>
                <p className="max-w-[460px] text-[15px] text-[var(--text-secondary)]">
                  {t.confirm.body}
                </p>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="inline-flex items-center gap-2 rounded-[10px] border border-[var(--border-default)] px-5 py-3 text-[14px] text-[var(--text-primary)] hover:border-[var(--border-strong)] transition-colors"
                  >
                    {t.confirm.another}
                  </button>
                </div>
              </div>
            )}
            </div>
          </div>
        )}

        {/* ===== LOOKUP TAB ===== */}
        {tab === "lookup" && (
          <div>
            <h1 className="font-franchise text-[40px] md:text-[72px] leading-[0.95] text-[var(--text-primary)]">
              {t.lookup.title[0]}
              <br />
              {t.lookup.title[1]}
            </h1>
            <p className="mt-4 max-w-[520px] text-[15px] md:text-[16px] text-[var(--text-secondary)]">
              {t.lookup.sub}
            </p>

            {/* folio input */}
            <form onSubmit={doLookup} className="mt-8 max-w-[560px]">
              <span className="text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
                {t.lookup.label}
              </span>
              <div className="flex flex-col sm:flex-row sm:items-end gap-3 mt-1.5">
                <input
                  className={`${inputCls} text-[18px] tracking-[0.08em] uppercase`}
                  placeholder={t.lookup.placeholder}
                  value={lookupValue}
                  onChange={(e) => setLookupValue(e.target.value)}
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-[10px] bg-[var(--invert-bg)] text-[var(--invert-fg)] px-5 py-3 text-[14px] font-medium whitespace-nowrap transition-transform active:scale-[0.96]"
                >
                  {t.lookup.button} <ArrowRight size={15} />
                </button>
              </div>
              {lookupError ? (
                <p className="mt-3 text-[13px]" style={{ color: "#FCA5A5" }}>
                  {t.lookup.notFound}
                </p>
              ) : (
                <p className="mt-3 text-[13px] text-[var(--text-muted)]">{t.lookup.hint}</p>
              )}
            </form>

            {/* pending quote */}
            {quote?.kind === "pending" && (
              <div className="mt-10 max-w-[560px] rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-6">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-franchise text-[22px] text-[var(--text-primary)]">{quote.folio}</p>
                  <StatusBadge status={quote.status} label={t.status[quote.status]} />
                </div>
                <p className="mt-3 text-[15px] font-semibold text-[var(--text-primary)]">
                  {t.lookup.pendingTitle}
                </p>
                <p className="mt-1 text-[14px] text-[var(--text-secondary)]">{t.lookup.pendingBody}</p>
              </div>
            )}

            {/* full quote */}
            {quote?.kind === "full" && (
              <QuoteDetail quote={quote} t={t} copied={copied} onCopy={copyClabe} />
            )}
          </div>
        )}
      </section>
    </div>
  );
}

// =====================
// QUOTE DETAIL + PAYMENT
// =====================
function QuoteDetail({
  quote,
  t,
  copied,
  onCopy,
}: {
  quote: Extract<Quote, { kind: "full" }>;
  t: (typeof copy)[keyof typeof copy];
  copied: boolean;
  onCopy: () => void;
}) {
  const subtotal = quote.items.reduce((s, i) => s + i.price, 0);
  const iva = Math.round(subtotal * IVA_RATE);
  const total = subtotal + iva;

  return (
    <div className="mt-10 grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6">
      {/* detail */}
      <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-6 md:p-7">
        <div className="flex items-center justify-between gap-3">
          <p className="font-franchise text-[24px] text-[var(--text-primary)]">{quote.folio}</p>
          <StatusBadge status={quote.status} label={t.status[quote.status]} />
        </div>
        <p className="mt-1 text-[13px] text-[var(--text-muted)]">
          {t.lookup.client}: {quote.client}
        </p>

        <div className="mt-5 divide-y divide-[var(--border-default)]">
          {quote.items.map((it) => (
            <div key={it.concept} className="flex items-start justify-between gap-4 py-3">
              <div>
                <p className="text-[15px] text-[var(--text-primary)]">{it.concept}</p>
                <p className="text-[12px] text-[var(--text-muted)]">{it.detail}</p>
              </div>
              <p className="text-[15px] text-[var(--text-primary)] whitespace-nowrap">
                {money(it.price)}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-2 text-[14px]">
          <div className="flex justify-between text-[var(--text-secondary)]">
            <span>{t.lookup.subtotal}</span>
            <span>{money(subtotal)}</span>
          </div>
          <div className="flex justify-between text-[var(--text-secondary)]">
            <span>{t.lookup.iva}</span>
            <span>{money(iva)}</span>
          </div>
          <div className="flex items-baseline justify-between border-t border-[var(--border-strong)] pt-3 mt-3">
            <span className="text-[15px] font-semibold text-[var(--text-primary)]">
              {t.lookup.total}
            </span>
            <span className="font-franchise text-[28px] leading-none text-[var(--text-primary)]">
              {money(total)}{" "}
              <span className="text-[13px] font-normal text-[var(--text-muted)]">
                {t.lookup.pesos}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* payment */}
      <div className="flex flex-col gap-4">
        <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-6">
          <h3 className="text-[11px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
            {t.lookup.pay}
          </h3>

          <button
            type="button"
            onClick={onCopy}
            className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-[10px] bg-[var(--invert-bg)] text-[var(--invert-fg)] px-5 py-3 text-[14px] font-medium transition-transform active:scale-[0.96]"
          >
            {copied ? t.lookup.copied : t.lookup.transfer}
            {!copied && <Copy size={14} />}
          </button>

          {/* CLABE block */}
          <div className="mt-4 rounded-[10px] border border-[var(--border-default)] bg-[var(--bg-elevated)] p-4">
            <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
              {t.lookup.clabeLabel} · {BANK.bank}
            </p>
            <p className="font-franchise text-[20px] tracking-wide text-[var(--text-primary)] mt-1">
              {BANK.clabe}
            </p>
            <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)] mt-3">
              {t.lookup.legalLabel}
            </p>
            <p className="text-[14px] text-[var(--text-secondary)] mt-0.5">{BANK.legal}</p>
          </div>

          <button
            type="button"
            className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-[10px] border border-[var(--border-default)] px-5 py-3 text-[14px] text-[var(--text-primary)] hover:border-[var(--border-strong)] transition-colors"
          >
            {t.lookup.cash}
          </button>

          <p className="mt-4 text-[12px] leading-relaxed text-[var(--text-muted)]">
            {t.lookup.payNote}
          </p>
        </div>

        {/* whatsapp */}
        <a
          href="https://wa.me/526648081307"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-5 flex items-start gap-3 hover:border-[var(--border-strong)] transition-colors"
        >
          <span className="text-veta mt-0.5">
            <MessageCircle size={18} />
          </span>
          <div>
            <p className="text-[14px] font-medium text-[var(--text-primary)]">
              {t.lookup.whatsTitle}
            </p>
            <p className="text-[13px] text-[var(--text-secondary)]">{t.lookup.whatsBody}</p>
          </div>
        </a>
      </div>
    </div>
  );
}
