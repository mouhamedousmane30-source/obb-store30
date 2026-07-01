import { createFileRoute } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '@/components/admin/AdminLayout';
import StatusBadge from '@/components/admin/StatusBadge';
import { Button } from '@/components/ui/button';
import { fetchCategories } from '@/lib/api/categories';
import { Plus, Edit, Trash2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api/client';

interface Category {
  _id: string;
  nom: string;
  slug: string;
  image: string;
  isActive: boolean;
  description?: string;
  productsCount?: number;
}

function CategoriesPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'categories'],
    queryFn: () => api.get<{ success: boolean; categories: Category[] }>('/categories'),
  });

  const toggleMutation = useMutation({
    mutationFn: (id: string) =>
      api.put<{ success: boolean; category: Category }>(`/categories/${id}`, { isActive: false }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
      toast.success('Catégorie mise à jour');
    },
    onError: () => toast.error('Erreur'),
  });

  const categories = (data?.categories ?? []) as Category[];

  return (
    <AdminLayout title="Catégories">
      <div className="mb-6 flex items-center justify-between">
        <Button className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2 rounded-lg" onClick={() => queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] })}>
          <RefreshCw size={18} />
          Actualiser
        </Button>
      </div>

      <div className="bg-card rounded-lg border border-foreground/8 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-foreground/8 bg-muted/30">
                <th className="px-4 py-3 text-left text-xs font-semibold text-foreground/60 uppercase tracking-wider">Nom</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-foreground/60 uppercase tracking-wider">Slug</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-foreground/60 uppercase tracking-wider">Statut</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-foreground/60 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center text-foreground/60">Chargement…</td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center text-foreground/60">Aucune catégorie</td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat._id} className="border-b border-foreground/5 hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        {cat.image && (
                          <div className="w-10 h-10 bg-muted/50 rounded-md overflow-hidden">
                            <img src={cat.image} alt={cat.nom} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <p className="text-sm font-medium text-foreground">{cat.nom}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-foreground/60 font-mono">{cat.slug}</td>
                    <td className="px-4 py-4">
                      <StatusBadge status={cat.isActive ? 'active' : 'inactive'}>
                        {cat.isActive ? 'Active' : 'Inactive'}
                      </StatusBadge>
                    </td>
                    <td className="px-4 py-4 text-sm">
                      <div className="flex gap-1">
                        <button className="p-1.5 hover:bg-muted rounded-md transition-colors">
                          <Edit size={16} className="text-foreground/60" />
                        </button>
                        <button
                          onClick={() => toggleMutation.mutate(cat._id)}
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

export const Route = createFileRoute('/admin/categories')({
  head: () => ({ meta: [{ title: 'Catégories — OBB Store Admin' }] }),
  component: CategoriesPage,
});
