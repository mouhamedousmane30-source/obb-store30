import { createFileRoute } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api/client';
import { Star, Trash2, Check, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface Review {
  _id: string;
  utilisateur: { _id: string; prenom: string; nom: string; avatar?: string };
  produit: { _id: string; nom: string };
  note: number;
  commentaire: string;
  isApproved: boolean;
  isVerified: boolean;
  createdAt: string;
}

function ReviewsPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'reviews'],
    queryFn: () => api.get<{ success: boolean; reviews: Review[] }>('/reviews'),
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => api.put<{ success: boolean; review: Review }>(`/reviews/${id}`, { isApproved: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] });
      toast.success('Avis approuvé');
    },
    onError: () => toast.error('Erreur'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete<{ success: boolean }>(`/reviews/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] });
      toast.success('Avis supprimé');
    },
    onError: () => toast.error('Erreur'),
  });

  const reviews = (data?.reviews ?? []) as Review[];

  return (
    <AdminLayout title="Avis Clients">
      <div className="mb-6 flex items-center justify-between">
        <Button className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2 rounded-lg" onClick={() => queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] })}>
          <RefreshCw size={18} />
          Actualiser
        </Button>
      </div>

      <div className="bg-card rounded-lg border border-foreground/8 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-foreground/8 bg-muted/30">
                <th className="px-4 py-3 text-left text-xs font-semibold text-foreground/60 uppercase tracking-wider">Produit</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-foreground/60 uppercase tracking-wider">Client</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-foreground/60 uppercase tracking-wider">Note</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-foreground/60 uppercase tracking-wider">Commentaire</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-foreground/60 uppercase tracking-wider">Statut</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-foreground/60 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-foreground/60">Chargement…</td>
                </tr>
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-foreground/60">Aucun avis pour le moment.</td>
                </tr>
              ) : (
                reviews.map((review) => (
                  <tr key={review._id} className="border-b border-foreground/5 hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-4 text-sm text-foreground">{review.produit?.nom || 'Produit supprimé'}</td>
                    <td className="px-4 py-4 text-sm text-foreground/80">
                      {review.utilisateur?.prenom} {review.utilisateur?.nom}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={i < review.note ? 'fill-yellow-400 text-yellow-400' : 'text-foreground/20'}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-foreground/60 max-w-xs truncate">{review.commentaire}</td>
                    <td className="px-4 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        review.isApproved
                          ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                          : 'bg-yellow-500/10 text-yellow-600 border border-yellow-500/20'
                      }`}>
                        {review.isApproved ? 'Approuvé' : 'En attente'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm">
                      <div className="flex gap-1">
                        {!review.isApproved && (
                          <button
                            onClick={() => approveMutation.mutate(review._id)}
                            className="p-1.5 hover:bg-muted rounded-md transition-colors"
                          >
                            <Check size={16} className="text-emerald-500" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteMutation.mutate(review._id)}
                          className="p-1.5 hover:bg-muted rounded-md transition-colors"
                        >
                          <Trash2 size={16} className="text-destructive" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

export const Route = createFileRoute('/admin/reviews')({
  head: () => ({ meta: [{ title: 'Avis — OBB Store Admin' }] }),
  component: ReviewsPage,
});
