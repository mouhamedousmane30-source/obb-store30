import { createFileRoute } from '@tanstack/react-router';
import AdminLayout from '@/components/admin/AdminLayout';
import StatusBadge from '@/components/admin/StatusBadge';
import { Button } from '@/components/ui/button';
import { MoreVertical, Eye, Edit, Printer, RefreshCw, Trash2, Search, Filter, Download, Calendar } from 'lucide-react';

// Données réalistes pour OBB STORE
const ordersData = [
  {
    id: '1',
    orderNumber: '#CMD-2024-001',
    customer: 'Amadou Diallo',
    email: 'amadou.diallo@email.com',
    product: 'Maillot Sénégal Player 2026',
    amount: '7 000 FCFA',
    paymentStatus: 'completed' as const,
    deliveryStatus: 'delivered' as const,
    date: '22/06/2024',
    time: '14:32',
  },
  {
    id: '2',
    orderNumber: '#CMD-2024-002',
    customer: 'Fatou Ndiaye',
    email: 'fatou.ndiaye@email.com',
    product: 'T-shirt OBB Premium',
    amount: '22 000 FCFA',
    paymentStatus: 'completed' as const,
    deliveryStatus: 'shipped' as const,
    date: '22/06/2024',
    time: '11:15',
  },
  {
    id: '3',
    orderNumber: '#CMD-2024-003',
    customer: 'Moussa Sow',
    email: 'moussa.sow@email.com',
    product: 'Parfum Royal Oud',
    amount: '120 000 FCFA',
    paymentStatus: 'completed' as const,
    deliveryStatus: 'processing' as const,
    date: '21/06/2024',
    time: '16:45',
  },
  {
    id: '4',
    orderNumber: '#CMD-2024-004',
    customer: 'Awa Diop',
    email: 'awa.diop@email.com',
    product: 'Sneakers Urban White',
    amount: '75 000 FCFA',
    paymentStatus: 'pending' as const,
    deliveryStatus: 'pending' as const,
    date: '21/06/2024',
    time: '09:20',
  },
  {
    id: '5',
    orderNumber: '#CMD-2024-005',
    customer: 'Ibrahima Fall',
    email: 'ibrahima.fall@email.com',
    product: 'Casquette OBB Classic',
    amount: '15 000 FCFA',
    paymentStatus: 'completed' as const,
    deliveryStatus: 'delivered' as const,
    date: '20/06/2024',
    time: '18:10',
  },
  {
    id: '6',
    orderNumber: '#CMD-2024-006',
    customer: 'Mariama Ba',
    email: 'mariama.ba@email.com',
    product: 'Maillot PSG Home 2024',
    amount: '25 000 FCFA',
    paymentStatus: 'failed' as const,
    deliveryStatus: 'cancelled' as const,
    date: '20/06/2024',
    time: '13:55',
  },
];

function OrdersPage() {
  return (
    <AdminLayout title="Commandes">
      {/* Barre supérieure avec filtres */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
            <input
              type="text"
              placeholder="Rechercher des commandes..."
              className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border border-foreground/8 rounded-lg text-sm text-foreground placeholder-foreground/40 focus:outline-none focus:border-foreground/15 transition-colors"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-muted/50 border border-foreground/8 rounded-lg text-sm text-foreground/70 hover:text-foreground hover:border-foreground/15 transition-colors">
            <Filter size={16} />
            Filtres
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-muted/50 border border-foreground/8 rounded-lg text-sm text-foreground/70 hover:text-foreground hover:border-foreground/15 transition-colors">
            <Download size={16} />
            Exporter
          </button>
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2 rounded-lg">
            <RefreshCw size={18} />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Filtres rapides */}
      <div className="mb-6 flex items-center gap-2 flex-wrap">
        <button className="px-4 py-2 bg-accent text-accent-foreground rounded-lg text-sm font-medium">
          Toutes
        </button>
        <button className="px-4 py-2 bg-muted/50 border border-foreground/8 rounded-lg text-sm text-foreground/70 hover:text-foreground hover:border-foreground/15 transition-colors">
          Aujourd'hui
        </button>
        <button className="px-4 py-2 bg-muted/50 border border-foreground/8 rounded-lg text-sm text-foreground/70 hover:text-foreground hover:border-foreground/15 transition-colors">
          Cette semaine
        </button>
        <button className="px-4 py-2 bg-muted/50 border border-foreground/8 rounded-lg text-sm text-foreground/70 hover:text-foreground hover:border-foreground/15 transition-colors">
          Ce mois
        </button>
        <div className="h-6 w-px bg-foreground/10 mx-2" />
        <button className="px-4 py-2 bg-muted/50 border border-foreground/8 rounded-lg text-sm text-foreground/70 hover:text-foreground hover:border-foreground/15 transition-colors">
          Payées
        </button>
        <button className="px-4 py-2 bg-muted/50 border border-foreground/8 rounded-lg text-sm text-foreground/70 hover:text-foreground hover:border-foreground/15 transition-colors">
          En attente
        </button>
        <button className="px-4 py-2 bg-muted/50 border border-foreground/8 rounded-lg text-sm text-foreground/70 hover:text-foreground hover:border-foreground/15 transition-colors">
          Annulées
        </button>
      </div>

      {/* Tableau des commandes */}
      <div className="bg-card rounded-lg border border-foreground/8 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-foreground/8 bg-muted/30">
                <th className="px-4 py-3 text-left text-xs font-semibold text-foreground/60 uppercase tracking-wider">ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-foreground/60 uppercase tracking-wider">Client</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-foreground/60 uppercase tracking-wider">Produit</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-foreground/60 uppercase tracking-wider">Montant</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-foreground/60 uppercase tracking-wider">Paiement</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-foreground/60 uppercase tracking-wider">Statut</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-foreground/60 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-foreground/60 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {ordersData.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-foreground/5 hover:bg-muted/20 transition-colors"
                >
                  <td className="px-4 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-foreground">{order.orderNumber}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">{order.customer}</p>
                      <p className="text-xs text-foreground/60">{order.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-foreground/80">{order.product}</td>
                  <td className="px-4 py-4 text-sm font-semibold text-foreground">{order.amount}</td>
                  <td className="px-4 py-4">
                    <StatusBadge status={order.paymentStatus}>
                      {order.paymentStatus === 'completed' ? 'Payé' : order.paymentStatus === 'pending' ? 'En attente' : 'Échoué'}
                    </StatusBadge>
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={order.deliveryStatus}>
                      {order.deliveryStatus === 'delivered' ? 'Livré' : 
                       order.deliveryStatus === 'shipped' ? 'Expédié' :
                       order.deliveryStatus === 'processing' ? 'En cours' :
                       order.deliveryStatus === 'cancelled' ? 'Annulé' : 'En attente'}
                    </StatusBadge>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-foreground/40" />
                      <div>
                        <p className="text-sm text-foreground/80">{order.date}</p>
                        <p className="text-xs text-foreground/40">{order.time}</p>
                    </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <div className="flex gap-1">
                      <button className="p-1.5 hover:bg-muted rounded-md transition-colors" title="Voir">
                        <Eye size={16} className="text-foreground/60" />
                      </button>
                      <button className="p-1.5 hover:bg-muted rounded-md transition-colors" title="Modifier">
                        <Edit size={16} className="text-foreground/60" />
                      </button>
                      <button className="p-1.5 hover:bg-muted rounded-md transition-colors" title="Imprimer">
                        <Printer size={16} className="text-foreground/60" />
                      </button>
                      <button className="p-1.5 hover:bg-muted rounded-md transition-colors" title="Supprimer">
                        <Trash2 size={16} className="text-destructive" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-4 py-3 border-t border-foreground/8 flex items-center justify-between">
          <p className="text-sm text-foreground/60">
            Affichage de 1 à {ordersData.length} sur {ordersData.length} commandes
          </p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-sm text-foreground/60 hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed rounded-md hover:bg-muted/50 transition-colors" disabled>
              Précédent
            </button>
            <button className="px-3 py-1.5 text-sm bg-accent text-accent-foreground rounded-md">
              1
            </button>
            <button className="px-3 py-1.5 text-sm text-foreground/60 hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed rounded-md hover:bg-muted/50 transition-colors" disabled>
              Suivant
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export const Route = createFileRoute('/admin/orders')({
  head: () => ({ meta: [{ title: 'Commandes — OBB Store Admin' }] }),
  component: OrdersPage,
});
