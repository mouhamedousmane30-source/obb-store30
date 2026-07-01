import { createFileRoute } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '@/components/admin/AdminLayout';
import StatusBadge from '@/components/admin/StatusBadge';
import { Button } from '@/components/ui/button';
import { fetchUsers, updateUser } from '@/lib/api/admin';
import { Search, Ban, Mail, Phone, Calendar, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Customer {
  _id: string;
  prenom: string;
  nom: string;
  email: string;
  telephone?: string;
  role: string;
  createdAt: string;
  commandes?: string[];
}

function CustomersPage() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'customers'],
    queryFn: () => fetchUsers({ limit: 100 }),
  });

  const toggleUserMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) =>
      updateUser(id, { role: role === 'customer' ? 'client' : 'customer' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'customers'] });
      toast.success('Statut du client mis à jour');
    },
    onError: () => toast.error('Erreur lors de la mise à jour'),
  });

  const allUsers = (data?.users ?? []) as Customer[];
  const customersData = allUsers.filter(
    (u) => u.role === 'customer' || u.role === 'client'
  );

  const filteredCustomers = searchQuery
    ? customersData.filter(
        (c) =>
          `${c.prenom} ${c.nom}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : customersData;

  return (
    <AdminLayout title="Clients">
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
            <input
              type="text"
              placeholder="Rechercher des clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border border-foreground/8 rounded-lg text-sm text-foreground placeholder-foreground/40 focus:outline-none focus:border-foreground/15 transition-colors"
            />
          </div>
        </div>
        <Button className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2 rounded-lg" onClick={() => queryClient.invalidateQueries({ queryKey: ['admin', 'customers'] })}>
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
                <th className="px-4 py-3 text-left text-xs font-semibold text-foreground/60 uppercase tracking-wider">Contact</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-foreground/60 uppercase tracking-wider">Commandes</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-foreground/60 uppercase tracking-wider">Inscrit le</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-foreground/60 uppercase tracking-wider">Statut</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-foreground/60 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-foreground/60">
                    Chargement des clients…
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-foreground/60">
                    Aucun client trouvé.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer._id} className="border-b border-foreground/5 hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-accent-foreground font-semibold text-sm">
                          {customer.prenom?.[0]}{customer.nom?.[0]}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{customer.prenom} {customer.nom}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-foreground/80">
                          <Mail size={14} className="text-foreground/40" />
                          {customer.email}
                        </div>
                        {customer.telephone && (
                          <div className="flex items-center gap-2 text-sm text-foreground/80">
                            <Phone size={14} className="text-foreground/40" />
                            {customer.telephone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm font-semibold text-foreground">{customer.commandes?.length || 0}</p>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-foreground/40" />
                        <p className="text-sm text-foreground/80">
                          {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString('fr-FR') : '-'}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={customer.role === 'customer' ? 'active' : 'inactive'}>
                        {customer.role === 'customer' ? 'Actif' : 'Inactif'}
                      </StatusBadge>
                    </td>
                    <td className="px-4 py-4 text-sm">
                      <button
                        onClick={() => toggleUserMutation.mutate({ id: customer._id, role: customer.role })}
                        className="p-1.5 hover:bg-muted rounded-md transition-colors"
                        title={customer.role === 'customer' ? 'Désactiver' : 'Activer'}
                      >
                        <Ban size={16} className={customer.role === 'customer' ? 'text-destructive' : 'text-green-600'} />
                      </button>
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

export const Route = createFileRoute('/admin/customers')({
  head: () => ({ meta: [{ title: 'Clients — OBB Store Admin' }] }),
  component: CustomersPage,
});
