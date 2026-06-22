import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { formatPrice, generateOrderNumber } from "@/lib/format";
import { STORE_NAME } from "@/lib/config";

const productSchema = z.object({
  name: z.string(),
  variant: z.string().optional(),
  quantity: z.number(),
  price: z.number(),
  lineTotal: z.number(),
  image: z.string(),
});

const receiptSearchSchema = z.object({
  orderNumber: z.string(),
  customerName: z.string(),
  customerPhone: z.string(),
  customerEmail: z.string().optional(),
  customerAddress: z.string(),
  customerCity: z.string(),
  products: z.array(productSchema),
  total: z.number(),
  shippingCost: z.number(),
  paymentStatus: z.enum(["pending", "paid"]),
});

type ReceiptSearch = z.infer<typeof receiptSearchSchema>;

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
  const navigate = useNavigate();
  const search = Route.useSearch() as ReceiptSearch;
  const [isPrinting, setIsPrinting] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);

  useEffect(() => {
    // Check if order data exists
    if (!search.orderNumber || search.products.length === 0) {
      navigate({ to: "/" });
      return;
    }
    // Trigger entrance animation
    setTimeout(() => setShowReceipt(true), 100);
  }, [search, navigate]);

  const handlePrint = () => {
    setIsPrinting(true);
    window.print();
    setTimeout(() => setIsPrinting(false), 1000);
  };

  const handleDownloadPDF = () => {
    // Simple PDF download using window.print() for now
    // In production, you'd use a library like jsPDF or html2pdf
    window.print();
  };

  const generateQRCode = (data: string) => {
    // Using a simple QR code API for demonstration
    // In production, you'd use a library like qrcode.react
    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(data)}`;
  };

  if (!search.orderNumber) return null;

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
            showReceipt ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{
            fontFamily: "'Courier New', monospace",
            backgroundImage: "linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)",
          }}
        >
          {/* Receipt Header */}
          <div className="text-center py-6 px-4 border-b-2 border-dashed border-[#2A2438]/30">
            <div className="text-2xl font-bold mb-1 tracking-wider" style={{ fontFamily: "Georgia, serif" }}>
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
              <span className="font-bold">{search.orderNumber}</span>
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
            <div className="text-xs mb-1">{search.customerName}</div>
            <div className="text-xs mb-1">{search.customerPhone}</div>
            {search.customerEmail && <div className="text-xs mb-1">{search.customerEmail}</div>}
            <div className="text-xs">{search.customerAddress}, {search.customerCity}</div>
          </div>

          {/* Products */}
          <div className="py-4 px-4 border-b-2 border-dashed border-[#2A2438]/30">
            <div className="text-xs font-bold mb-3 text-[#5C5470]">ARTICLES</div>
            {search.products.map((product, index) => (
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
              <span>{formatPrice(search.total - search.shippingCost)}</span>
            </div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-[#5C5470]">LIVRAISON</span>
              <span>{formatPrice(search.shippingCost)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold mt-3 pt-2 border-t border-[#2A2438]/20">
              <span>TOTAL</span>
              <span className="text-lg">{formatPrice(search.total)}</span>
            </div>
          </div>

          {/* Payment Status */}
          <div className="py-4 px-4 border-b-2 border-dashed border-[#2A2438]/30">
            <div className="flex justify-between text-xs">
              <span className="text-[#5C5470]">STATUT PAIEMENT</span>
              <span className={`font-bold ${search.paymentStatus === 'paid' ? 'text-green-700' : 'text-orange-700'}`}>
                {search.paymentStatus === 'paid' ? 'PAYÉ' : 'EN ATTENTE'}
              </span>
            </div>
            <div className="text-xs text-[#5C5470] mt-1">Paiement à la livraison</div>
          </div>

          {/* QR Code */}
          <div className="py-6 px-4 text-center border-b-2 border-dashed border-[#2A2438]/30">
            <div className="text-xs font-bold mb-3 text-[#5C5470]">SCANNER POUR SUIVRE</div>
            <img
              src={generateQRCode(`OBB-STORE-${search.orderNumber}`)}
              alt="QR Code"
              className="mx-auto mb-2"
              width="120"
              height="120"
            />
            <div className="text-xs text-[#5C5470]">{search.orderNumber}</div>
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
            {isPrinting ? "Impression..." : "Imprimer"}
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
