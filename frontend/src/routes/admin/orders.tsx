import { createFileRoute } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '@/components/admin/AdminLayout';
import StatusBadge from '@/components/admin/StatusBadge';
import { Button } from '@/components/ui/button';
import { fetchOrders, updateOrder, type Order } from '@/lib/api/orders';
import { MoreVertical, Eye, Edit, Printer, Trash2, Search, Filter, Download, Calendar, RefreshCw, CheckCircle, XCircle, Truck, Package } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

const STATUS_LABELS: Record<string, string> = {
  pending: 'En attente',
  processing: 'En cours',
  shipped: 'Expédiée',
  delivered: 'Livrée',
  cancelled: 'Annulée',
};

const STATUS_ACTIONS: Record<string, { next: string; label: string; icon: React.ReactNode }> = {
  pending: { next: 'processing', label: 'Confirmer', icon: <CheckCircle size={14} /> },
  processing: { next: 'shipped', label: 'Expédier', icon: <Truck size={14} /> },
  shipped: { next: 'delivered', label: 'Livrer', icon: <Package size={14} /> },
};

function OrdersPage() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'orders', statusFilter],
    queryFn: () => fetchOrders({ limit: 50, statut: statusFilter || undefined }),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, statut }: { id: string; statut: string }) =>
      updateOrder(id, { statut }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
      toast.success('Statut de la commande mis à jour');
    },
    onError: () => toast.error('Erreur lors de la mise à jour'),
  });

  const ordersData = (data?.orders ?? []) as Order[];

  const filteredOrders = useMemo(() => {
    return searchQuery
      ? ordersData.filter((o) => {
          const customerName = o.shippingAddress ? `${o.shippingAddress.prenom || ''} ${o.shippingAddress.nom || ''}`.trim() : (o.customer || '');
          const phone = o.shippingAddress?.telephone || '';
          const email = o.shippingAddress?.email || o.email || '';
          return [
            o.orderNumber,
            customerName,
            phone,
            email,
            (o as any).product,
            (o as any).produits?.[0]?.nom,
          ]
            .filter(Boolean)
            .some((value) => value.toLowerCase().includes(searchQuery.toLowerCase()));
        })
      : ordersData;
  }, [ordersData, searchQuery]);

  return (
    <AdminLayout title="Commandes">
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
            <input
              type="text"
              placeholder="Rechercher des commandes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2 rounded-lg" onClick={() => queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] })}>
            <RefreshCw size={18} />
            Actualiser
          </Button>
        </div>
      </div>

      <div className="mb-6 flex items-center gap-2 flex-wrap">
        {['', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === s
                ? 'bg-accent text-accent-foreground'
                : 'bg-muted/50 border border-foreground/8 text-foreground/70 hover:text-foreground hover:border-foreground/15'
            }`}
          >
            {s ? STATUS_LABELS[s] : 'Toutes'}
          </button>
        ))}
      </div>

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
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-foreground/60">
                    Chargement des commandes…
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-foreground/60">
                    Aucune commande pour le moment.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const statut = order.statut || order.status || 'pending';
                  const action = STATUS_ACTIONS[statut as string];
                  return (
                    <tr key={order._id} className="border-b border-foreground/5 hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-4">
                        <span className="text-sm font-medium text-foreground">{order.orderNumber}</span>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm font-medium text-foreground">
                          {order.shippingAddress
                            ? `${order.shippingAddress.prenom || ''} ${order.shippingAddress.nom || ''}`.trim()
                            : (order as any).customer || 'Client'}
                        </p>
                        {order.shippingAddress?.telephone ? (
                          <p className="text-xs text-foreground/60">Tél. {order.shippingAddress.telephone}</p>
                        ) : null}
                        {order.shippingAddress?.email ? (
                          <p className="text-xs text-foreground/60">{order.shippingAddress.email}</p>
                        ) : null}
                        {order.shippingAddress?.adresse || order.shippingAddress?.ville ? (
                          <p className="text-xs text-foreground/60">
                            {order.shippingAddress.adresse ? `${order.shippingAddress.adresse}, ` : ''}
                            {order.shippingAddress.ville}
                          </p>
                        ) : null}
                      </td>
                      <td className="px-4 py-4 text-sm text-foreground/80">
                        {(order as any).product || (order as any).produits?.[0]?.nom || '-'}
                      </td>
                      <td className="px-4 py-4 text-sm font-semibold text-foreground">
                        {order.montantTotal || order.totalAmount || order.total || 0} FCFA
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge status={(order as any).paymentStatus === 'completed' ? 'completed' : 'pending'}>
                          {(order as any).paymentStatus === 'completed' ? 'Payé' : 'En attente'}
                        </StatusBadge>
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge status={statut as any}>
                          {STATUS_LABELS[statut as string] || statut}
                        </StatusBadge>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-foreground/40" />
                          <p className="text-sm text-foreground/80">
                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString('fr-FR') : '-'}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <div className="flex gap-1">
                          {action && statut !== 'cancelled' && statut !== 'delivered' && (
                            <button
                              onClick={() => updateStatusMutation.mutate({ id: order._id, statut: action.next })}
                              className="p-1.5 hover:bg-muted rounded-md transition-colors"
                              title={action.label}
                            >
                              {action.icon}
                            </button>
                          )}
                          {statut !== 'cancelled' && (
                            <button
                              onClick={() => updateStatusMutation.mutate({ id: order._id, statut: 'cancelled' })}
                              className="p-1.5 hover:bg-muted rounded-md transition-colors"
                              title="Annuler"
                            >
                              <XCircle size={16} className="text-destructive" />
                            </button>
                          )}
                          <button className="p-1.5 hover:bg-muted rounded-md transition-colors" title="Imprimer">
                            <Printer size={16} className="text-foreground/60" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

export const Route = createFileRoute('/admin/orders')({
  head: () => ({ meta: [{ title: 'Commandes — OBB Store Admin' }] }),
  component: OrdersPage,
});
