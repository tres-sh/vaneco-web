import { useState, type ReactNode } from "react";
import { Check, ArrowRight, Copy, MessageCircle } from "lucide-react";
import { useLang } from "../../lib/useLang";
import { PrimaryBtn } from "../ui/Button";

const SHELL = "mx-auto w-full max-w-[1440px] px-5 md:px-20";
type Tab = "schedule" | "lookup";
type StatusKey = "scheduled" | "pending" | "fabricating" | "cancelled";

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
      sub: "Vamos a tu domicilio, sin costo y sin compromiso. Llevamos muestras. Al enviar se crea tu folio.",
      name: "Nombre completo",
      phone: "Teléfono",
      email: "Correo",
      type: "Tipo de trabajo",
      typeOptions: ["Cocina", "Isla", "Barra", "Baño", "Comercial", "Otro"],
      address: "Domicilio para la visita",
      date: "Fecha preferida",
      time: "Horario",
      timeOptions: ["Mañana", "Tarde"],
      submit: "Agendar y generar folio",
      error: "Completa todos los campos para continuar.",
      placeholderType: "Selecciona…",
      consentPre: "He leído y acepto el ",
      consentLink: "Aviso de Privacidad",
      consentPost:
        " y autorizo a Piedras Vaneco el uso de mis datos para agendar la visita, generar mi folio y dar seguimiento a mi cotización.",
      consentNote:
        "El botón se habilita al aceptar. Tus datos nunca se comparten con terceros.",
    },
    confirm: {
      title: ["CITA", "AGENDADA"],
      body: "Te contactaremos para confirmar. Guarda tu folio para consultar y pagar tu cotización.",
      folioLabel: "Tu folio",
      viewQuote: "Ver mi cotización",
      another: "Agendar otra",
    },
    expect: {
      title: "Qué esperar",
      steps: [
        "Confirmamos tu cita por WhatsApp.",
        "Medimos y elegimos material con muestras en tu domicilio.",
        "Recibes tu cotización ligada al folio.",
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
      sub: "We come to your home, free and with no commitment. We bring samples. Submitting creates your folio.",
      name: "Full name",
      phone: "Phone",
      email: "Email",
      type: "Type of work",
      typeOptions: ["Kitchen", "Island", "Bar", "Bath", "Commercial", "Other"],
      address: "Visit address",
      date: "Preferred date",
      time: "Time",
      timeOptions: ["Morning", "Afternoon"],
      submit: "Book and generate folio",
      error: "Fill in every field to continue.",
      placeholderType: "Select…",
      consentPre: "I have read and accept the ",
      consentLink: "Privacy Notice",
      consentPost:
        " and authorize Piedras Vaneco to use my data to book the visit, generate my folio and follow up on my quote.",
      consentNote:
        "The button enables once you accept. Your data is never shared with third parties.",
    },
    confirm: {
      title: ["VISIT", "BOOKED"],
      body: "We'll reach out to confirm. Keep your folio to check and pay your quote.",
      folioLabel: "Your folio",
      viewQuote: "View my quote",
      another: "Book another",
    },
    expect: {
      title: "What to expect",
      steps: [
        "We confirm your appointment via WhatsApp.",
        "We measure and pick material with samples at your home.",
        "You receive your quote linked to the folio.",
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
      <span className="text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputCls =
  "w-full bg-transparent border-b border-[var(--border-default)] py-2 text-[15px] text-[var(--text-primary)] outline-none transition-colors duration-200 focus:border-veta placeholder:text-[var(--text-muted)]";

// =====================
// CITA FLOW
// =====================
export function CitaFlow() {
  const [lang] = useLang("es");
  const t = copy[lang];

  const [tab, setTab] = useState<Tab>("schedule");

  // schedule
  const empty = { name: "", phone: "", email: "", type: "", address: "", date: "", time: "" };
  const [form, setForm] = useState(empty);
  const [formError, setFormError] = useState(false);
  const [consent, setConsent] = useState(false);
  const [folioCreated, setFolioCreated] = useState(false);
  const [newFolio, setNewFolio] = useState("");

  // lookup
  const [lookupValue, setLookupValue] = useState("");
  const [quote, setQuote] = useState<Quote | null>(null);
  const [lookupError, setLookupError] = useState(false);
  const [copied, setCopied] = useState(false);

  const upd = (k: keyof typeof empty, v: string) => setForm((p) => ({ ...p, [k]: v }));

  function submitForm(e: React.FormEvent) {
    e.preventDefault();
    const complete = Object.values(form).every((v) => v.trim() !== "");
    if (!complete || !consent) {
      setFormError(true);
      return;
    }
    setFormError(false);
    const folio = `COT-VNC-${Math.floor(1000 + Math.random() * 9000)}`;
    setNewFolio(folio);
    setFolioCreated(true);
  }

  function resetForm() {
    setForm(empty);
    setConsent(false);
    setFolioCreated(false);
    setNewFolio("");
    setFormError(false);
  }

  function viewNewQuote() {
    setTab("lookup");
    setLookupValue(newFolio);
    setQuote({ kind: "pending", folio: newFolio, status: "scheduled" });
    setLookupError(false);
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
        <div className="flex w-full sm:inline-flex sm:w-auto gap-1.5 rounded-[12px] border border-[var(--border-default)] p-1 mb-10">
          {(["schedule", "lookup"] as Tab[]).map((k) => (
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

        {/* ===== SCHEDULE TAB ===== */}
        {tab === "schedule" && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 lg:gap-14 items-start">
            {/* left: form OR confirmation */}
            {!folioCreated ? (
              <form onSubmit={submitForm}>
                <h1 className="font-franchise text-[48px] md:text-[72px] leading-[0.95] text-[var(--text-primary)]">
                  {t.form.title[0]}
                  <br />
                  {t.form.title[1]}
                </h1>
                <p className="mt-4 max-w-[520px] text-[15px] md:text-[16px] text-[var(--text-secondary)]">
                  {t.form.sub}
                </p>

                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                  <Field label={t.form.name}>
                    <input
                      className={inputCls}
                      value={form.name}
                      onChange={(e) => upd("name", e.target.value)}
                    />
                  </Field>
                  <Field label={t.form.phone}>
                    <div className="flex items-center gap-2 border-b border-[var(--border-default)] focus-within:border-veta transition-colors">
                      <span className="text-[15px] text-[var(--text-muted)]">+52</span>
                      <input
                        className="w-full bg-transparent py-2 text-[15px] text-[var(--text-primary)] outline-none"
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
                </div>

                {/* consent checkbox (LFPDPPP) */}
                <label className="mt-6 flex items-start gap-3 cursor-pointer select-none">
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
                  <p className="mt-4 text-[13px]" style={{ color: "#FCA5A5" }}>
                    {t.form.error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={!consent}
                  className={[
                    "mt-6 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-[10px]",
                    "text-[15px] font-medium tracking-wide",
                    "border border-transparent bg-[var(--invert-bg)] text-[var(--invert-fg)]",
                    "transition-all duration-200",
                    consent
                      ? "active:scale-[0.96] hover:bg-transparent hover:text-[var(--text-primary)] hover:border-[var(--border-strong)]"
                      : "opacity-40 cursor-not-allowed",
                  ].join(" ")}
                >
                  {t.form.submit}
                  <ArrowRight size={16} />
                </button>

                <p className="mt-3 text-[12px] text-[var(--text-muted)]">
                  {t.form.consentNote}
                </p>
              </form>
            ) : (
              /* confirmation */
              <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-6 md:p-10">
                <span
                  className="grid h-14 w-14 place-items-center rounded-full"
                  style={{ background: "rgba(34,197,94,0.1)" }}
                >
                  <Check size={26} color="#4ADE80" strokeWidth={2.5} />
                </span>
                <h2 className="mt-6 font-franchise text-[36px] md:text-[48px] leading-[0.95] text-[var(--text-primary)]">
                  {t.confirm.title[0]} {t.confirm.title[1]}
                </h2>
                <p className="mt-3 max-w-[460px] text-[15px] text-[var(--text-secondary)]">
                  {t.confirm.body}
                </p>

                {/* folio block */}
                <div
                  className="mt-6 rounded-2xl border border-dashed border-[var(--border-strong)] bg-[var(--bg-elevated)] p-5 flex flex-wrap items-center justify-between gap-3"
                >
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
                      {t.confirm.folioLabel}
                    </p>
                    <p className="font-franchise text-[28px] leading-none text-[var(--text-primary)] mt-1">
                      {newFolio}
                    </p>
                  </div>
                  <StatusBadge status="scheduled" label={t.status.scheduled} />
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={viewNewQuote}
                    className="inline-flex items-center gap-2 rounded-[10px] bg-[var(--invert-bg)] text-[var(--invert-fg)] px-5 py-3 text-[14px] font-medium transition-transform active:scale-[0.96]"
                  >
                    {t.confirm.viewQuote} <ArrowRight size={15} />
                  </button>
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

            {/* right: what to expect */}
            <aside className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-6 md:p-8">
              <h3 className="text-[11px] uppercase tracking-[0.14em] text-veta">{t.expect.title}</h3>
              <ol className="mt-5 space-y-5">
                {t.expect.steps.map((s, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="font-franchise text-[20px] leading-none text-veta-dark">
                      0{i + 1}
                    </span>
                    <p className="text-[14px] leading-relaxed text-[var(--text-secondary)]">{s}</p>
                  </li>
                ))}
              </ol>
              <p className="mt-6 border-t border-[var(--border-default)] pt-4 text-[13px] text-[var(--text-muted)]">
                {t.expect.note}
              </p>
            </aside>
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
