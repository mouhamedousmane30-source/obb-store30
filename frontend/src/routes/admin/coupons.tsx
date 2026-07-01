import { createFileRoute } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '@/components/admin/AdminLayout';
import StatusBadge from '@/components/admin/StatusBadge';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api/client';
import { Plus, Edit, Trash2, Copy, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface Coupon {
  _id: string;
  code: string;
  reduction: number;
  type: 'percentage' | 'fixed';
  minAmount: number;
  maxReduction: number | null;
  expiration: string;
  nombreUtilisations: number;
  maxUtilisations: number | null;
  isActive: boolean;
  description: string;
  createdAt: string;
}

function CouponsPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'coupons'],
    queryFn: () => api.get<{ success: boolean; coupons: Coupon[] }>('/coupons'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete<{ success: boolean }>(`/coupons/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'coupons'] });
      toast.success('Coupon supprimé');
    },
    onError: () => toast.error('Erreur lors de la suppression'),
  });

  const coupons = (data?.coupons ?? []) as Coupon[];

  return (
    <AdminLayout title="Coupons & Promotions">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Rechercher des coupons..."
            className="px-4 py-2.5 bg-muted/50 border border-foreground/8 rounded-lg text-sm text-foreground placeholder-foreground/40 focus:outline-none focus:border-foreground/15"
          />
        </div>
        <Button className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2 rounded-lg" onClick={() => queryClient.invalidateQueries({ queryKey: ['admin', 'coupons'] })}>
          <RefreshCw size={18} />
          Actualiser
        </Button>
      </div>

      <div className="bg-card rounded-lg border border-foreground/8 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-foreground/8 bg-muted/30">
                <th className="px-4 py-3 text-left text-xs font-semibold text-foreground/60 uppercase tracking-wider">Code</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-foreground/60 uppercase tracking-wider">Réduction</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-foreground/60 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-foreground/60 uppercase tracking-wider">Utilisations</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-foreground/60 uppercase tracking-wider">Expiration</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-foreground/60 uppercase tracking-wider">Statut</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-foreground/60 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-foreground/60">Chargement…</td>
                </tr>
              ) : coupons.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-foreground/60">Aucun coupon trouvé.</td>
                </tr>
              ) : (
                coupons.map((coupon) => {
                  const isExpired = new Date(coupon.expiration) < new Date();
                  const status = coupon.isActive && !isExpired ? 'active' : 'inactive';
                  return (
                    <tr key={coupon._id} className="border-b border-foreground/5 hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-4 text-sm font-mono font-semibold text-foreground">{coupon.code}</td>
                      <td className="px-4 py-4 text-sm text-foreground/80">
                        {coupon.type === 'percentage' ? `${coupon.reduction}%` : `${coupon.reduction.toLocaleString()} FCFA`}
                      </td>
                      <td className="px-4 py-4 text-sm text-foreground/80">
                        {coupon.type === 'percentage' ? 'Pourcentage' : 'Montant fixe'}
                      </td>
                      <td className="px-4 py-4 text-sm text-foreground font-semibold">
                        {coupon.nombreUtilisations}{coupon.maxUtilisations ? ` / ${coupon.maxUtilisations}` : ''}
                      </td>
                      <td className="px-4 py-4 text-sm text-foreground/80">
                        {new Date(coupon.expiration).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge status={status}>
                          {status === 'active' ? 'Actif' : 'Expiré'}
                        </StatusBadge>
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <div className="flex gap-1">
                          <button className="p-1.5 hover:bg-muted rounded-md transition-colors">
                            <Edit size={16} className="text-foreground/60" />
                          </button>
                          <button className="p-1.5 hover:bg-muted rounded-md transition-colors">
                            <Copy size={16} className="text-foreground/60" />
                          </button>
                          <button
                            onClick={() => deleteMutation.mutate(coupon._id)}
                            className="p-1.5 hover:bg-muted rounded-md transition-colors"
                          >
                            <Trash2 size={16} className="text-destructive" />
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

export const Route = createFileRoute('/admin/coupons')({
  head: () => ({ meta: [{ title: 'Coupons — OBB Store Admin' }] }),
  component: CouponsPage,
});
