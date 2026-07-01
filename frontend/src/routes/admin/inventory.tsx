import { createFileRoute } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '@/components/admin/AdminLayout';
import KPICard from '@/components/admin/KPICard';
import StatusBadge from '@/components/admin/StatusBadge';
import { fetchInventory, updateAdminProduct, type InventoryItem } from '@/lib/api/admin';
import { AlertCircle, Package, AlertTriangle, Search, Filter, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

function InventoryPage() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [stockUpdates, setStockUpdates] = useState<Record<string, string>>({});

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'inventory'],
    queryFn: fetchInventory,
  });

  const updateStockMutation = useMutation({
    mutationFn: ({ id, stock }: { id: string; stock: number }) =>
      updateAdminProduct(id, { stock }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'inventory'] });
      toast.success('Stock mis à jour');
    },
    onError: () => toast.error('Erreur lors de la mise à jour du stock'),
  });

  const inventory = (data?.inventory ?? []) as InventoryItem[];
  const lowStockCount = inventory.filter(i => i.available > 0 && i.available <= 5).length;
  const outOfStockCount = inventory.filter(i => i.available === 0).length;
  const totalStock = inventory.reduce((acc, i) => acc + i.available, 0);

  const filteredInventory = searchQuery
    ? inventory.filter(i => i.product.toLowerCase().includes(searchQuery.toLowerCase()))
    : inventory;

  const handleStockChange = (id: string, value: string) => {
    setStockUpdates((prev) => ({ ...prev, [id]: value }));
  };

  const handleStockSave = (id: string, available: number) => {
    const updatedValue = stockUpdates[id];
    if (updatedValue === undefined) return;
    const newStock = Number(updatedValue);
    if (Number.isNaN(newStock) || newStock < 0) {
      toast.error('Veuillez saisir un stock valide');
      return;
    }

    if (newStock === available) {
      setStockUpdates((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      return;
    }

    updateStockMutation.mutate({ id, stock: newStock });
  };

  return (
    <AdminLayout title="Stock">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <KPICard title="Stock total" value={totalStock} icon={<Package size={20} />} variant="default" />
        <KPICard title="Stock faible" value={lowStockCount} icon={<AlertTriangle size={20} />} variant="default" />
        <KPICard title="Rupture de stock" value={outOfStockCount} icon={<AlertCircle size={20} />} variant="default" />
      </div>

      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
            <input
              type="text"
              placeholder="Rechercher des produits..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border border-foreground/8 rounded-lg text-sm text-foreground placeholder-foreground/40 focus:outline-none focus:border-foreground/15 transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg border border-foreground/8 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-foreground/8 bg-muted/30">
                <th className="px-4 py-3 text-left text-xs font-semibold text-foreground/60 uppercase tracking-wider">Produit</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-foreground/60 uppercase tracking-wider">Catégorie</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-foreground/60 uppercase tracking-wider">Disponible</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-foreground/60 uppercase tracking-wider">Statut</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center text-foreground/60">Chargement…</td>
                </tr>
              ) : filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center text-foreground/60">Aucun produit trouvé.</td>
                </tr>
              ) : (
                filteredInventory.map((item) => {
                  const isOutOfStock = item.available === 0;
                  const isLowStock = item.available > 0 && item.available <= 5;
                  return (
                    <tr key={item._id || item.id} className={`border-b border-foreground/5 hover:bg-muted/20 transition-colors ${
                      isOutOfStock ? 'bg-red-50/30' : isLowStock ? 'bg-orange-50/30' : ''
                    }`}>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          {item.image && (
                            <div className="w-10 h-10 bg-muted/50 rounded-md overflow-hidden flex-shrink-0">
                              <img src={item.image} alt={item.product} className="w-full h-full object-cover" />
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-medium text-foreground">{item.product}</p>
                            <p className="text-xs text-foreground/40 font-mono">{item.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-foreground/80">{item.category}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min={0}
                            value={stockUpdates[item._id || item.id] ?? String(item.available)}
                            onChange={(e) => handleStockChange(item._id || item.id, e.target.value)}
                            className="w-24 rounded-md border border-input bg-background px-2 py-1 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                          />
                          <button
                            type="button"
                            onClick={() => handleStockSave(item._id || item.id, item.available)}
                            className="rounded-md bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground hover:bg-accent/90 transition-colors"
                          >
                            Enregistrer
                          </button>
                        </div>
                        {stockUpdates[item._id || item.id] !== undefined && stockUpdates[item._id || item.id] !== String(item.available) ? (
                          <p className="text-xs text-foreground/60">Valeur non enregistrée</p>
                        ) : null}
                      </td>
                      <td className="px-4 py-4">
                        {isOutOfStock ? (
                          <StatusBadge status="cancelled">Rupture</StatusBadge>
                        ) : isLowStock ? (
                          <StatusBadge status="low_stock">Stock faible</StatusBadge>
                        ) : (
                          <StatusBadge status="active">En stock</StatusBadge>
                        )}
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

export const Route = createFileRoute('/admin/inventory')({
  head: () => ({ meta: [{ title: 'Stock — OBB Store Admin' }] }),
  component: InventoryPage,
});
