import { createFileRoute } from '@tanstack/react-router';
import AdminLayout from '@/components/admin/AdminLayout';
import StatusBadge from '@/components/admin/StatusBadge';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Ban, Download, Search, Filter, Mail, Phone, Calendar } from 'lucide-react';

// Données réalistes pour OBB STORE
const customersData = [
  {
    id: '1',
    name: 'Amadou Diallo',
    email: 'amadou.diallo@email.com',
    phone: '+221 77 123 45 67',
    orders: 12,
    totalSpent: '285 000 FCFA',
    lastOrder: '22/06/2024',
    status: 'active' as const,
    joined: '15/01/2024',
  },
  {
    id: '2',
    name: 'Fatou Ndiaye',
    email: 'fatou.ndiaye@email.com',
    phone: '+221 78 234 56 78',
    orders: 8,
    totalSpent: '156 000 FCFA',
    lastOrder: '22/06/2024',
    status: 'active' as const,
    joined: '20/02/2024',
  },
  {
    id: '3',
    name: 'Moussa Sow',
    email: 'moussa.sow@email.com',
    phone: '+221 77 345 67 89',
    orders: 5,
    totalSpent: '420 000 FCFA',
    lastOrder: '21/06/2024',
    status: 'active' as const,
    joined: '10/03/2024',
  },
  {
    id: '4',
    name: 'Awa Diop',
    email: 'awa.diop@email.com',
    phone: '+221 76 456 78 90',
    orders: 3,
    totalSpent: '95 000 FCFA',
    lastOrder: '21/06/2024',
    status: 'active' as const,
    joined: '05/04/2024',
  },
  {
    id: '5',
    name: 'Ibrahima Fall',
    email: 'ibrahima.fall@email.com',
    phone: '+221 77 567 89 01',
    orders: 15,
    totalSpent: '575 000 FCFA',
    lastOrder: '20/06/2024',
    status: 'active' as const,
    joined: '01/01/2024',
  },
  {
    id: '6',
    name: 'Mariama Ba',
    email: 'mariama.ba@email.com',
    phone: '+221 78 678 90 12',
    orders: 2,
    totalSpent: '45 000 FCFA',
    lastOrder: '15/06/2024',
    status: 'inactive' as const,
    joined: '25/05/2024',
  },
];

function CustomersPage() {
  return (
    <AdminLayout title="Clients">
      {/* Barre supérieure */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
            <input
              type="text"
              placeholder="Rechercher des clients..."
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
            Ajouter un client
          </Button>
        </div>
      </div>

      {/* Tableau des clients */}
      <div className="bg-card rounded-lg border border-foreground/8 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-foreground/8 bg-muted/30">
                <th className="px-4 py-3 text-left text-xs font-semibold text-foreground/60 uppercase tracking-wider">Nom</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-foreground/60 uppercase tracking-wider">Contact</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-foreground/60 uppercase tracking-wider">Commandes</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-foreground/60 uppercase tracking-wider">Total dépensé</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-foreground/60 uppercase tracking-wider">Dernière commande</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-foreground/60 uppercase tracking-wider">Statut</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-foreground/60 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customersData.map((customer) => (
                <tr
                  key={customer.id}
                  className="border-b border-foreground/5 hover:bg-muted/20 transition-colors"
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-accent-foreground font-semibold text-sm">
                        {customer.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{customer.name}</p>
                        <p className="text-xs text-foreground/40">Membre depuis {customer.joined}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-foreground/80">
                        <Mail size={14} className="text-foreground/40" />
                        {customer.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-foreground/80">
                        <Phone size={14} className="text-foreground/40" />
                        {customer.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm font-semibold text-foreground">{customer.orders}</p>
                    <p className="text-xs text-foreground/40">commandes</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm font-semibold text-foreground">{customer.totalSpent}</p>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-foreground/40" />
                      <p className="text-sm text-foreground/80">{customer.lastOrder}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={customer.status}>
                      {customer.status === 'active' ? 'Actif' : 'Inactif'}
                    </StatusBadge>
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <div className="flex gap-1">
                      <button className="p-1.5 hover:bg-muted rounded-md transition-colors" title="Voir">
                        <Eye size={16} className="text-foreground/60" />
                      </button>
                      <button className="p-1.5 hover:bg-muted rounded-md transition-colors" title="Modifier">
                        <Edit size={16} className="text-foreground/60" />
                      </button>
                      <button className="p-1.5 hover:bg-muted rounded-md transition-colors" title="Bloquer">
                        <Ban size={16} className="text-destructive" />
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
            Affichage de 1 à {customersData.length} sur {customersData.length} clients
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

export const Route = createFileRoute('/admin/customers')({
  head: () => ({ meta: [{ title: 'Clients — OBB Store Admin' }] }),
  component: CustomersPage,
});
