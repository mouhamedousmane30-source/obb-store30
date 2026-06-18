import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { z } from "zod";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { useCart } from "@/lib/cart-context";
import { formatPrice, generateOrderNumber } from "@/lib/format";
import { STORE_NAME, WHATSAPP_NUMBER } from "@/lib/config";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Commande — OBB Store" },
      { name: "description", content: "Finalisez votre commande OBB Store via WhatsApp." },
    ],
  }),
  component: CheckoutPage,
});

const formSchema = z.object({
  prenom: z.string().trim().min(1, "Prénom requis").max(80),
  nom: z.string().trim().min(1, "Nom requis").max(80),
  telephone: z
    .string()
    .trim()
    .min(7, "Numéro invalide")
    .max(20, "Numéro invalide")
    .regex(/^[+0-9\s().-]+$/, "Numéro invalide"),
  adresse: z.string().trim().min(2, "Adresse requise").max(200),
  ville: z.string().trim().min(1, "Ville requise").max(80),
});

type FormState = z.infer<typeof formSchema>;

function buildWhatsAppMessage({
  orderNumber,
  form,
  lines,
  total,
}: {
  orderNumber: string;
  form: FormState;
  lines: ReturnType<typeof useCart>["lines"];
  total: number;
}) {
  const itemsTxt = lines
    .map(
      (l) =>
        `• ${l.product.name}${l.variant ? ` (${l.variant})` : ""} × ${l.quantity} — ${formatPrice(l.lineTotal)}`,
    )
    .join("\n");
  return [
    `*Nouvelle commande ${STORE_NAME}*`,
    `N° ${orderNumber}`,
    ``,
    `*Client*`,
    `${form.prenom} ${form.nom}`,
    `Tél : ${form.telephone}`,
    `Adresse : ${form.adresse}`,
    `Ville : ${form.ville}`,
    ``,
    `*Produits*`,
    itemsTxt,
    ``,
    `*Total : ${formatPrice(total)}*`,
  ].join("\n");
}

function CheckoutPage() {
  const { lines, total, clear, count } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>({
    prenom: "",
    nom: "",
    telephone: "",
    adresse: "",
    ville: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const orderNumber = useMemo(() => generateOrderNumber(), []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = formSchema.safeParse(form);
    if (!parsed.success) {
      const errs: Partial<Record<keyof FormState, string>> = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as keyof FormState;
        errs[k] = issue.message;
      }
      setErrors(errs);
      return;
    }
    if (lines.length === 0) return;
    setErrors({});
    const text = buildWhatsAppMessage({ orderNumber, form: parsed.data, lines, total });
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    clear();
    navigate({ to: "/" });
  };

  if (lines.length === 0) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <SiteNav />
        <section className="max-w-2xl mx-auto px-6 py-32 text-center">
          <h1 className="text-3xl font-display mb-6">Votre panier est vide</h1>
          <Link
            to="/boutique"
            className="inline-block px-8 py-3 bg-primary text-primary-foreground uppercase tracking-widest text-[11px] font-semibold"
          >
            Découvrir la boutique
          </Link>
        </section>
        <SiteFooter />
      </div>
    );
  }

  const onChange = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      <section className="max-w-6xl mx-auto px-6 py-16 grid lg:grid-cols-5 gap-12">
        <div className="lg:col-span-3">
          <span className="text-accent text-[10px] uppercase tracking-[0.3em] font-semibold mb-4 block">
            Étape finale
          </span>
          <h1 className="text-4xl md:text-5xl font-display mb-2">Vos informations</h1>
          <p className="font-mono text-[11px] uppercase tracking-tighter text-muted mb-10">
            N° commande : {orderNumber}
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <Field label="Prénom" error={errors.prenom}>
                <input
                  value={form.prenom}
                  onChange={onChange("prenom")}
                  className="field"
                  autoComplete="given-name"
                />
              </Field>
              <Field label="Nom" error={errors.nom}>
                <input
                  value={form.nom}
                  onChange={onChange("nom")}
                  className="field"
                  autoComplete="family-name"
                />
              </Field>
            </div>
            <Field label="Téléphone" error={errors.telephone}>
              <input
                type="tel"
                value={form.telephone}
                onChange={onChange("telephone")}
                className="field"
                placeholder="+221 77 000 00 00"
                autoComplete="tel"
              />
            </Field>
            <Field label="Adresse ou quartier" error={errors.adresse}>
              <input
                value={form.adresse}
                onChange={onChange("adresse")}
                className="field"
                autoComplete="street-address"
              />
            </Field>
            <Field label="Ville" error={errors.ville}>
              <input
                value={form.ville}
                onChange={onChange("ville")}
                className="field"
                autoComplete="address-level2"
              />
            </Field>

            <button
              type="submit"
              className="w-full py-5 bg-primary text-primary-foreground uppercase tracking-[0.3em] text-xs font-bold hover:bg-foreground transition-colors mt-4"
            >
              Confirmer la commande sur WhatsApp
            </button>
            <p className="text-[10px] text-center text-muted uppercase tracking-widest">
              Aucun compte requis · Paiement à la livraison
            </p>
          </form>
        </div>

        <aside className="lg:col-span-2 bg-card border border-foreground/10 p-8 h-fit">
          <h2 className="font-display text-2xl mb-6">Votre commande</h2>
          <ul className="space-y-4 mb-6">
            {lines.map((l) => (
              <li
                key={`${l.product.slug}-${l.variant ?? ""}`}
                className="flex gap-3 text-sm"
              >
                <div className="w-12 h-16 bg-stone-100 overflow-hidden flex-shrink-0">
                  <img src={l.product.image} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <p className="font-medium leading-tight">{l.product.name}</p>
                  <p className="text-[11px] uppercase tracking-widest text-muted mt-1">
                    {l.variant ? `${l.variant} · ` : ""}× {l.quantity}
                  </p>
                </div>
                <span className="font-mono text-sm">{formatPrice(l.lineTotal)}</span>
              </li>
            ))}
          </ul>
          <div className="border-t border-foreground/10 pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-muted">
              <span>Articles</span>
              <span className="font-mono">{count}</span>
            </div>
            <div className="flex justify-between text-lg font-display pt-2">
              <span>Total</span>
              <span className="font-mono">{formatPrice(total)}</span>
            </div>
          </div>
        </aside>
      </section>

      <SiteFooter />

      <style>{`
        .field {
          width: 100%;
          background: transparent;
          border: 0;
          border-bottom: 1px solid rgba(12,12,12,0.2);
          padding: 12px 0;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
        }
        .field:focus { border-bottom-color: var(--color-accent); }
      `}</style>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-[10px] uppercase tracking-[0.3em] text-muted mb-1">{label}</span>
      {children}
      {error && <span className="block text-[11px] text-destructive mt-2">{error}</span>}
    </label>
  );
}
