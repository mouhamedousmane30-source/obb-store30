import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { formatPrice } from "@/lib/format";
import { fetchOrderReceipt } from "@/lib/api/orders";

const receiptSearchSchema = z
  .object({
    orderNumber: z.string(),
    customerPhone: z.string().optional(),
    customerEmail: z.string().email().optional(),
  })
  .refine((value) => value.customerPhone || value.customerEmail, {
    message: 'Téléphone ou email requis',
  });

type ReceiptSearch = z.infer<typeof receiptSearchSchema>;

type ReceiptOrder = {
  orderNumber: string;
  adresseLivraison: {
    prenom: string;
    nom: string;
    telephone: string;
    email?: string;
    adresse: string;
    ville: string;
  };
  produits: Array<{
    nom: string;
    quantite: number;
    prix: number;
    prixTotal: number;
    variant?: string;
    image: string;
  }>;
  montantTotal: number;
  paiement: {
    methode: string;
    statut: string;
  };
};

export const Route = createFileRoute("/receipt")({
  head: () => ({
    meta: [
      { title: "Reçu de commande — OBB Store" },
      { name: "description", content: "Votre reçu de commande OBB Store." },
    ],
  }),
  validateSearch: receiptSearchSchema,
  component: ReceiptPage,
});

function ReceiptPage() {
  const search = Route.useSearch() as ReceiptSearch;
  const [order, setOrder] = useState<ReceiptOrder | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadOrder() {
      try {
        const response = await fetchOrderReceipt(
          search.orderNumber,
          search.customerPhone,
          search.customerEmail,
        );

        if (!isMounted) return;

        setOrder(response.order as ReceiptOrder);
        setFetchError(null);
        setTimeout(() => setShowReceipt(true), 100);
      } catch (error) {
        if (!isMounted) return;
        setFetchError(
          error instanceof Error ? error.message : 'Impossible de charger le reçu',
        );
        setTimeout(() => setShowReceipt(true), 100);
      } finally {
        if (!isMounted) return;
        setLoading(false);
      }
    }

    loadOrder();

    return () => {
      isMounted = false;
    };
  }, [search.orderNumber, search.customerPhone, search.customerEmail]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p>Chargement du reçu...</p>
      </div>
    );
  }

  if (fetchError || !order) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <SiteNav />
        <section className="max-w-2xl mx-auto px-4 py-24 text-center">
          <h1 className="text-3xl font-display mb-4">Impossible de charger le reçu</h1>
          <p className="text-sm text-muted-foreground mb-8">{fetchError || 'Commande introuvable.'}</p>
          <Link
            to="/"
            className="inline-flex items-center justify-center bg-primary px-6 py-3 text-[11px] uppercase tracking-widest font-semibold text-primary-foreground hover:bg-foreground"
          >
            Retour à l'accueil
          </Link>
        </section>
        <SiteFooter />
      </div>
    );
  }

  const searchData = {
    orderNumber: order.orderNumber,
    customerName: `${order.adresseLivraison.prenom} ${order.adresseLivraison.nom}`,
    customerPhone: order.adresseLivraison.telephone,
    customerEmail: order.adresseLivraison.email,
    customerAddress: order.adresseLivraison.adresse,
    customerCity: order.adresseLivraison.ville,
    products: order.produits.map((product) => ({
      name: product.nom,
      variant: product.variant,
      quantity: product.quantite,
      price: product.prix,
      lineTotal: product.prixTotal,
      image: product.image,
    })),
    total: order.montantTotal,
    shippingCost: 0,
    paymentStatus: order.paiement?.statut === 'completed' ? 'paid' : 'pending',
  };

  const handlePrint = () => {
    setIsPrinting(true);
    window.print();
    setTimeout(() => setIsPrinting(false), 1000);
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  const generateQRCode = (data: string) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(data)}`;
  };

  if (!searchData.orderNumber) return null;

  return (
    <div className="min-h-screen bg-[#2A2438] text-[#DBD8E3]">
      <SiteNav />

      <section className="max-w-2xl mx-auto px-4 py-12 sm:py-16">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-display mb-2 text-[#DBD8E3]">Commande Confirmée</h1>
          <p className="text-[#5C5470] text-sm">Merci pour votre achat chez OBB Store</p>
        </div>

        {/* Thermal Receipt */}
        <div
          className={`bg-[#DBD8E3] text-[#2A2438] rounded-lg shadow-2xl max-w-md mx-auto overflow-hidden transform transition-all duration-700 ${
            showReceipt ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{
            fontFamily: "'Courier New', monospace",
            backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
          }}
        >
          {/* Receipt Header */}
          <div className="text-center py-6 px-4 border-b-2 border-dashed border-[#2A2438]/30">
            <div className="text-2xl font-bold mb-1 tracking-wider" style={{ fontFamily: 'Georgia, serif' }}>
              OBB STORE
            </div>
            <div className="text-xs mb-2">PREMIUM STREETWEAR</div>
            <div className="text-xs text-[#5C5470]"> Dakar, Sénégal</div>
            <div className="text-xs text-[#5C5470]"> +221 77 000 00 00</div>
          </div>

          {/* Order Info */}
          <div className="py-4 px-4 border-b-2 border-dashed border-[#2A2438]/30">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-[#5C5470]">N° COMMANDE</span>
              <span className="font-bold">{searchData.orderNumber}</span>
            </div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-[#5C5470]">DATE</span>
              <span>{new Date().toLocaleDateString('fr-FR')}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[#5C5470]">HEURE</span>
              <span>{new Date().toLocaleTimeString('fr-FR')}</span>
            </div>
          </div>

          {/* Customer Info */}
          <div className="py-4 px-4 border-b-2 border-dashed border-[#2A2438]/30">
            <div className="text-xs font-bold mb-2 text-[#5C5470]">CLIENT</div>
            <div className="text-xs mb-1">{searchData.customerName}</div>
            <div className="text-xs mb-1">{searchData.customerPhone}</div>
            {searchData.customerEmail && <div className="text-xs mb-1">{searchData.customerEmail}</div>}
            <div className="text-xs">{searchData.customerAddress}, {searchData.customerCity}</div>
          </div>

          {/* Products */}
          <div className="py-4 px-4 border-b-2 border-dashed border-[#2A2438]/30">
            <div className="text-xs font-bold mb-3 text-[#5C5470]">ARTICLES</div>
            {searchData.products.map((product, index) => (
              <div key={index} className="mb-3">
                <div className="flex justify-between text-xs font-medium">
                  <span className="flex-1 pr-2">{product.name}</span>
                  <span>{formatPrice(product.lineTotal)}</span>
                </div>
                {product.variant && (
                  <div className="text-xs text-[#5C5470]">{product.variant}</div>
                )}
                <div className="flex justify-between text-xs text-[#5C5470]">
                  <span>{product.quantity} × {formatPrice(product.price)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="py-4 px-4 border-b-2 border-dashed border-[#2A2438]/30">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-[#5C5470]">SOUS-TOTAL</span>
              <span>{formatPrice(searchData.total - searchData.shippingCost)}</span>
            </div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-[#5C5470]">LIVRAISON</span>
              <span>{formatPrice(searchData.shippingCost)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold mt-3 pt-2 border-t border-[#2A2438]/20">
              <span>TOTAL</span>
              <span className="text-lg">{formatPrice(searchData.total)}</span>
            </div>
          </div>

          {/* Payment Status */}
          <div className="py-4 px-4 border-b-2 border-dashed border-[#2A2438]/30">
            <div className="flex justify-between text-xs">
              <span className="text-[#5C5470]">STATUT PAIEMENT</span>
              <span className={`font-bold ${searchData.paymentStatus === 'paid' ? 'text-green-700' : 'text-orange-700'}`}>
                {searchData.paymentStatus === 'paid' ? 'PAYÉ' : 'EN ATTENTE'}
              </span>
            </div>
            <div className="text-xs text-[#5C5470] mt-1">Paiement à la livraison</div>
          </div>

          {/* QR Code */}
          <div className="py-6 px-4 text-center border-b-2 border-dashed border-[#2A2438]/30">
            <div className="text-xs font-bold mb-3 text-[#5C5470]">SCANNER POUR SUIVRE</div>
            <img
              src={generateQRCode(`OBB-STORE-${searchData.orderNumber}`)}
              alt="QR Code"
              className="mx-auto mb-2"
              width="120"
              height="120"
            />
            <div className="text-xs text-[#5C5470]">{searchData.orderNumber}</div>
          </div>

          {/* Footer */}
          <div className="py-6 px-4 text-center">
            <div className="text-xs mb-2 text-[#5C5470]">Merci de votre confiance!</div>
            <div className="text-xs text-[#5C5470]">www.obbstore.com</div>
            <div className="text-xs text-[#5C5470] mt-1">support@obbstore.com</div>
            <div className="mt-4 pt-4 border-t border-[#2A2438]/20">
              <div className="text-xs text-[#5C5470]">GARANTIE 30 JOURS</div>
              <div className="text-xs text-[#5C5470]">ÉCHANGES & RETOURS GRATUITS</div>
            </div>
          </div>

          {/* Thermal Paper Effect */}
          <div className="h-8 bg-gradient-to-b from-[#DBD8E3] to-transparent"></div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <button
            onClick={handlePrint}
            disabled={isPrinting}
            className="px-6 py-3 bg-[#5C5470] text-white rounded-lg uppercase tracking-widest text-xs font-bold hover:bg-[#352F44] transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
          >
            {isPrinting ? 'Impression...' : 'Imprimer'}
          </button>
          <button
            onClick={handleDownloadPDF}
            className="px-6 py-3 bg-[#2A2438] text-white rounded-lg uppercase tracking-widest text-xs font-bold hover:bg-[#352F44] transition-all shadow-lg hover:shadow-xl"
          >
            Télécharger PDF
          </button>
          <Link
            to="/"
            className="px-6 py-3 border-2 border-[#5C5470] text-[#DBD8E3] rounded-lg uppercase tracking-widest text-xs font-bold hover:bg-[#5C5470] hover:text-white transition-all text-center"
          >
            Retour à l'accueil
          </Link>
        </div>
      </section>

      <SiteFooter />

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .receipt-container, .receipt-container * {
            visibility: visible;
          }
          .receipt-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 0;
            box-shadow: none;
          }
          @page {
            size: 80mm auto;
            margin: 0;
          }
        }

        @keyframes receiptPrint {
          0% {
            transform: translateY(-100%);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .receipt-print-animation {
          animation: receiptPrint 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
