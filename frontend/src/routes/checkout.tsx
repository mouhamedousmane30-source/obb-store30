import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/format";
import { STORE_NAME, WHATSAPP_NUMBER } from "@/lib/config";
import { getProduct } from "@/lib/products";
import { createOrder } from "@/lib/api/orders";
import { fetchProductBySlug } from "@/lib/api/products";
import { ApiError } from "@/lib/api/client";

const checkoutSearchSchema = z.object({
  product: z.string().optional(),
  variant: z.string().optional(),
  name: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
});

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Commande — OBB Store" },
      { name: "description", content: "Finalisez votre commande OBB Store via WhatsApp." },
    ],
  }),
  validateSearch: checkoutSearchSchema,
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
  email: z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || z.string().email().safeParse(value).success, {
      message: "Email invalide",
    }),
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
        `• ${l.product.nom}${l.variant ? ` (${l.variant})` : ""} × ${l.quantity} — ${formatPrice(l.lineTotal)}`,
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
  const search = Route.useSearch();
  const [form, setForm] = useState<FormState>({
    prenom: "",
    nom: "",
    telephone: "",
    email: "",
    adresse: "",
    ville: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: apiSingleProduct } = useQuery({
    queryKey: ["product", search?.product],
    queryFn: () => fetchProductBySlug(search!.product!),
    enabled: !!search?.product,
  });

  // Pre-fill form with customer info from search params
  useEffect(() => {
    if (search?.name) {
      const nameParts = search.name.split(' ');
      setForm(f => ({
        ...f,
        prenom: nameParts[0] || "",
        nom: nameParts.slice(1).join(' ') || "",
      }));
    }
    if (search?.phone) setForm(f => ({ ...f, telephone: search.phone || "" }));
    if (search?.email) setForm(f => ({ ...f, email: search.email || "" }));
    if (search?.address) setForm(f => ({ ...f, adresse: search.address || "" }));
    if (search?.city) setForm(f => ({ ...f, ville: search.city || "" }));
  }, [search?.name, search?.phone, search?.email, search?.address, search?.city]);

  // Check if customer info is provided (from cart page)
  const hasCustomerInfo = !!(search?.name || search?.phone || search?.address || search?.city);

  // Handle single product purchase
  const singleProduct = search?.product
    ? (apiSingleProduct ?? getProduct(search.product))
    : null;
  const isSingleProduct = !!singleProduct;
  const checkoutLines = isSingleProduct && singleProduct
    ? [{
        product: singleProduct,
        quantity: 1,
        variant: search?.variant || undefined,
        lineTotal: singleProduct.prix,
      }]
    : lines;
  const checkoutTotal = isSingleProduct && singleProduct ? singleProduct.prix : total;
  const checkoutCount = isSingleProduct ? 1 : count;
  const hasOrderItems = checkoutLines.length > 0;

  const redirectToReceipt = (orderNumber: string, formData: FormState) => {
    navigate({
      to: "/receipt",
      search: {
        orderNumber,
        customerName: `${formData.prenom} ${formData.nom}`,
        customerPhone: formData.telephone,
        ...(formData.email ? { customerEmail: formData.email } : {}),
        customerAddress: formData.adresse,
        customerCity: formData.ville,
        products: checkoutLines.map((l) => ({
          name: l.product.nom,
          variant: l.variant,
          quantity: l.quantity,
          price: l.product.prix,
          lineTotal: l.lineTotal,
          image: l.product.imagePrincipale,
        })),
        total: checkoutTotal,
        shippingCost: 0,
        paymentStatus: "pending",
      },
    });
  };

  const processOrder = async (formData: FormState) => {
    if (checkoutLines.length === 0) {
      throw new Error('Aucun article dans le panier. Ajoutez un produit pour finaliser la commande.');
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const produits = await Promise.all(
        checkoutLines.map(async (l) => {
          let productId = l.product._id;

          if (!productId) {
            const backendProduct = await fetchProductBySlug(l.product.slug);
            if (!backendProduct?._id) {
              throw new Error(`Produit « ${l.product.nom} » introuvable. Rechargez la page.`);
            }
            productId = backendProduct._id;
          }

          return {
            productId,
            quantite: l.quantity,
            variant: l.variant,
          };
        }),
      );

      const res = await createOrder({
        shippingAddress: {
          prenom: formData.prenom,
          nom: formData.nom,
          telephone: formData.telephone,
          email: formData.email || undefined,
          adresse: formData.adresse,
          ville: formData.ville,
        },
        produits,
        paymentMethod: "cash",
      });

      const orderNumber = res.order.orderNumber;
      const text = buildWhatsAppMessage({
        orderNumber,
        form: formData,
        lines: checkoutLines,
        total: checkoutTotal,
      });
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
      window.open(url, "_blank", "noopener,noreferrer");

      if (!isSingleProduct) clear();
      redirectToReceipt(orderNumber, formData);
    } catch (err) {
      setSubmitError(
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Impossible d'enregistrer la commande",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = formSchema.safeParse(form);
    if (!parsed.success) {
      const errs: Partial<Record<keyof FormState, string>> = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as keyof FormState;
        errs[k] = issue.message;
      }
      setErrors(errs);
      // Scroll to first error
      const firstErrorField = Object.keys(errs)[0] as keyof FormState;
      const element = document.querySelector(`[name="${firstErrorField}"]`) as HTMLElement;
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
      return;
    }
    if (checkoutLines.length === 0) return;
    setErrors({});
    await processOrder(parsed.data);
  };

  const handleWhatsAppOrder = async () => {
    const parsed = formSchema.safeParse(form);
    if (!parsed.success) {
      const errs: Partial<Record<keyof FormState, string>> = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as keyof FormState;
        errs[k] = issue.message;
      }
      setErrors(errs);
      // Scroll to first error
      const firstErrorField = Object.keys(errs)[0] as keyof FormState;
      const element = document.querySelector(`[name="${firstErrorField}"]`) as HTMLElement;
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
      return;
    }
    if (checkoutLines.length === 0) return;
    setErrors({});
    await processOrder(parsed.data);
  };

  if (!isSingleProduct && lines.length === 0 && !hasCustomerInfo) {
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

  if (!isSingleProduct && lines.length === 0 && hasCustomerInfo) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <SiteNav />
        <section className="max-w-2xl mx-auto px-6 py-32 text-center">
          <h1 className="text-3xl font-display mb-6">Aucun produit sélectionné</h1>
          <p className="max-w-xl mx-auto mb-8 text-sm text-foreground/70">
            Vos informations ont bien été reçues, mais aucun article n’est actuellement présent dans votre panier.
            Retournez à la boutique pour ajouter un produit avant de finaliser votre commande.
          </p>
          <Link
            to="/boutique"
            className="inline-block px-8 py-3 bg-primary text-primary-foreground uppercase tracking-widest text-[11px] font-semibold"
          >
            Retour à la boutique
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

      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-10">
          <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-[10px] uppercase tracking-[0.3em] font-semibold rounded-full mb-4">
            {hasCustomerInfo ? "Reçu de commande" : "Étape finale"}
          </span>
          <h1 className="text-4xl md:text-5xl font-display mb-2">
            {hasCustomerInfo ? "Votre commande" : "Vos informations"}
          </h1>
          <p className="font-mono text-[11px] uppercase tracking-tighter text-accent">
            Commande via WhatsApp — enregistrement automatique
          </p>
        </div>

        {submitError && (
          <div className="mb-6 p-4 rounded-lg bg-destructive/10 text-destructive text-sm border border-destructive/20">
            {submitError}
          </div>
        )}

        {hasCustomerInfo ? (
          // Receipt format when customer info is provided
          <div className="bg-white rounded-2xl border border-foreground/10 p-8 shadow-lg">
            {/* Customer Info */}
            <div className="mb-8 pb-6 border-b border-foreground/10">
              <h2 className="font-display text-xl mb-4 text-accent">Informations client</h2>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-muted mb-1">Nom</p>
                  <p className="font-medium">{form.prenom} {form.nom}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-muted mb-1">Téléphone</p>
                  <p className="font-medium">{form.telephone}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-muted mb-1">Email</p>
                  <p className="font-medium">{form.email}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-muted mb-1">Ville</p>
                  <p className="font-medium">{form.ville}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-[10px] uppercase tracking-widest text-muted mb-1">Adresse</p>
                  <p className="font-medium">{form.adresse}</p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-8 pb-6 border-b border-foreground/10">
              <h2 className="font-display text-xl mb-4 text-accent">Articles commandés</h2>
              <ul className="space-y-4">
                {checkoutLines.map((l) => (
                  <li
                    key={`${l.product.slug}-${l.variant ?? ""}`}
                    className="flex gap-4 text-sm"
                  >
                    <div className="w-16 h-20 bg-stone-100 overflow-hidden flex-shrink-0 rounded-lg">
                      <img src={l.product.imagePrincipale} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium leading-tight">{l.product.nom}</p>
                      <p className="text-[11px] uppercase tracking-widest text-muted mt-1">
                        {l.variant ? `${l.variant} · ` : ""}× {l.quantity}
                      </p>
                    </div>
                    <span className="font-mono text-sm font-semibold">{formatPrice(l.lineTotal)}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Total */}
            <div className="mb-8">
              <div className="flex justify-between text-xl font-display">
                <span className="font-semibold">Total</span>
                <span className="font-mono font-bold text-accent">{formatPrice(checkoutTotal)}</span>
              </div>
            </div>

            {/* WhatsApp Button */}
            <button
              onClick={handleWhatsAppOrder}
              disabled={isSubmitting || !hasOrderItems}
              className="w-full py-5 bg-[#25D366] text-white uppercase tracking-[0.3em] text-xs font-bold hover:bg-[#128C7E] transition-all rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Enregistrement…" : "Commander sur WhatsApp"}
            </button>
            <p className="text-[10px] text-center text-muted uppercase tracking-widest flex items-center justify-center gap-2 mt-4">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Paiement à la livraison
            </p>
          </div>
        ) : (
          // Form format when customer info is not provided
          <div className="grid lg:grid-cols-5 gap-12">
            <div className="lg:col-span-3">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid sm:grid-cols-2 gap-6">
                  <Field label="Prénom" error={errors.prenom}>
                    <input
                      value={form.prenom}
                      onChange={onChange("prenom")}
                      className="field"
                      autoComplete="given-name"
                      placeholder="Votre prénom"
                    />
                  </Field>
                  <Field label="Nom" error={errors.nom}>
                    <input
                      value={form.nom}
                      onChange={onChange("nom")}
                      className="field"
                      autoComplete="family-name"
                      placeholder="Votre nom"
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
                <Field label="Email (optionnel)" error={errors.email}>
                  <input
                    type="email"
                    value={form.email || ""}
                    onChange={onChange("email")}
                    className="field"
                    placeholder="votre@email.com"
                    autoComplete="email"
                  />
                </Field>
                <Field label="Adresse ou quartier" error={errors.adresse}>
                  <input
                    value={form.adresse}
                    onChange={onChange("adresse")}
                    className="field"
                    autoComplete="street-address"
                    placeholder="Votre adresse complète"
                  />
                </Field>
                <Field label="Ville" error={errors.ville}>
                  <input
                    value={form.ville}
                    onChange={onChange("ville")}
                    className="field"
                    autoComplete="address-level2"
                    placeholder="Dakar, Thiès, Saint-Louis..."
                  />
                </Field>

                <button
                  type="submit"
                  disabled={isSubmitting || !hasOrderItems}
                  className="w-full py-5 bg-primary text-primary-foreground uppercase tracking-[0.3em] text-xs font-bold hover:bg-primary/90 transition-all rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Enregistrement…" : "Confirmer la commande sur WhatsApp"}
                </button>
                <p className="text-[10px] text-center text-muted uppercase tracking-widest flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Aucun compte requis · Paiement à la livraison
                </p>
              </form>
            </div>

            <aside className="lg:col-span-2">
              <div className="bg-card border border-foreground/10 rounded-2xl p-8 shadow-sm sticky top-24">
                <h2 className="font-display text-2xl mb-6 pb-4 border-b border-foreground/10">Votre commande</h2>
                <ul className="space-y-4 mb-6">
                  {checkoutLines.map((l) => (
                    <li
                      key={`${l.product.slug}-${l.variant ?? ""}`}
                      className="flex gap-4 text-sm"
                    >
                      <div className="w-16 h-20 bg-stone-100 overflow-hidden flex-shrink-0 rounded-lg">
                        <img src={l.product.imagePrincipale} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium leading-tight">{l.product.nom}</p>
                        <p className="text-[11px] uppercase tracking-widest text-foreground/70 mt-1">
                          {l.variant ? `${l.variant} · ` : ""}× {l.quantity}
                        </p>
                      </div>
                      <span className="font-mono text-sm font-semibold">{formatPrice(l.lineTotal)}</span>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-foreground/10 pt-6 space-y-3 text-sm">
                  <div className="flex justify-between text-foreground/70">
                    <span>Articles</span>
                    <span className="font-mono">{checkoutCount}</span>
                  </div>
                  <div className="flex justify-between text-foreground/70">
                    <span>Sous-total</span>
                    <span className="font-mono">{formatPrice(checkoutTotal)}</span>
                  </div>
                  <div className="flex justify-between text-foreground/70">
                    <span>Livraison</span>
                    <span className="text-[11px] uppercase tracking-widest text-foreground/60">Calculée à la commande</span>
                  </div>
                  <div className="flex justify-between text-xl font-display pt-4 border-t border-foreground/10">
                    <span className="font-semibold">Total</span>
                    <span className="font-mono font-bold text-accent">{formatPrice(checkoutTotal)}</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}
      </section>

      <SiteFooter />

      <style>{`
        .field {
          width: 100%;
          background: transparent;
          border: 0;
          border-bottom: 2px solid rgba(12,12,12,0.1);
          padding: 16px 0;
          font-size: 15px;
          outline: none;
          transition: border-color 0.3s;
          color: var(--color-foreground);
          caret-color: var(--color-foreground);
        }
        .field:focus { border-bottom-color: var(--color-accent); }
        .field::placeholder { color: var(--color-muted-foreground); opacity: 0.8; }
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
      <span className="block text-[10px] uppercase tracking-[0.3em] text-accent mb-1">{label}</span>
      {children}
      {error && <span className="block text-[11px] text-destructive mt-2">{error}</span>}
    </label>
  );
}
