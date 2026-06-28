import { createFileRoute } from '@tanstack/react-router';
import AdminLayout from '@/components/admin/AdminLayout';
import KPICard from '@/components/admin/KPICard';
import StatusBadge from '@/components/admin/StatusBadge';
import { AlertCircle, Package, TrendingDown, Package2, Search, Filter, AlertTriangle, CheckCircle } from 'lucide-react';

// Données réalistes pour OBB STORE
const inventoryData = [
  {
    id: '1',
    product: 'Maillot Sénégal Player 2026',
    sku: 'OBB-MAI-SEN-001',
    category: 'Maillots',
    available: 45,
    reserved: 5,
    lowStock: false,
    outOfStock: false,
    image: '/assets/maillotsenegal.png',
  },
  {
    id: '2',
    product: 'T-shirt OBB Premium',
    sku: 'OBB-TSH-PRE-001',
    category: 'T-shirts',
    available: 78,
    reserved: 12,
    lowStock: false,
    outOfStock: false,
    image: '/assets/weaintboyz2.png',
  },
  {
    id: '3',
    product: 'Parfum Royal Oud',
    sku: 'OBB-PAR-ROY-001',
    category: 'Parfums',
    available: 23,
    reserved: 3,
    lowStock: true,
    outOfStock: false,
    image: '/assets/cat-parfums.jpg',
  },
  {
    id: '4',
    product: 'Sneakers Urban White',
    sku: 'OBB-SNE-URB-001',
    category: 'Chaussures',
    available: 34,
    reserved: 8,
    lowStock: false,
    outOfStock: false,
    image: '/assets/shoes2.png',
  },
  {
    id: '5',
    product: 'Casquette OBB Classic',
    sku: 'OBB-CAS-CLA-001',
    category: 'Accessoires',
    available: 56,
    reserved: 4,
    lowStock: false,
    outOfStock: false,
    image: '/assets/hero.jpg',
  },
  {
    id: '6',
    product: 'Maillot PSG Home 2024',
    sku: 'OBB-MAI-PSG-001',
    category: 'Maillots',
    available: 12,
    reserved: 2,
    lowStock: true,
    outOfStock: false,
    image: '/assets/shoptonmaillot.png',
  },
  {
    id: '7',
    product: 'Bracelet Premium',
    sku: 'OBB-BRA-PRE-001',
    category: 'Accessoires',
    available: 0,
    reserved: 0,
    lowStock: false,
    outOfStock: true,
    image: '/assets/hero.jpg',
  },
];

function InventoryPage() {
  const lowStockCount = inventoryData.filter(i => i.lowStock).length;
  const outOfStockCount = inventoryData.filter(i => i.outOfStock).length;
  const totalStock = inventoryData.reduce((acc, i) => acc + i.available, 0);
  const reservedStock = inventoryData.reduce((acc, i) => acc + i.reserved, 0);

  return (
    <AdminLayout title="Stock">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="Stock total"
          value={totalStock}
          change={8.5}
          icon={<Package size={20} />}
          variant="default"
        />
        <KPICard
          title="Stock réservé"
          value={reservedStock}
          change={12.3}
          icon={<Package2 size={20} />}
          variant="default"
        />
        <KPICard
          title="Alertes stock faible"
          value={lowStockCount}
          change={-15.2}
          icon={<AlertTriangle size={20} />}
          variant="default"
        />
        <KPICard
          title="Rupture de stock"
          value={outOfStockCount}
          change={-5.0}
          icon={<AlertCircle size={20} />}
          variant="default"
        />
      </div>

      {/* Barre supérieure */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
            <input
              type="text"
              placeholder="Rechercher des produits..."
              className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border border-foreground/8 rounded-lg text-sm text-foreground placeholder-foreground/40 focus:outline-none focus:border-foreground/15 transition-colors"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-muted/50 border border-foreground/8 rounded-lg text-sm text-foreground/70 hover:text-foreground hover:border-foreground/15 transition-colors">
            <Filter size={16} />
            Filtres
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-orange-50 border border-orange-200 rounded-lg text-sm text-orange-700 hover:bg-orange-100 transition-colors">
            <AlertTriangle size={16} />
            Stock faible ({lowStockCount})
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 hover:bg-red-100 transition-colors">
            <AlertCircle size={16} />
            Rupture_stock ({outOfStockCount})
          </button>
        </div>
      </div>

      {/* Tableau du stock */}
      <div className="bg-card rounded-lg border border-foreground/8 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-foreground/8 bg-muted/30">
                <th className="px-4 py-3 text-left text-xs font-semibold text-foreground/60 uppercase tracking-wider">Produit</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-foreground/60 uppercase tracking-wider">SKU</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-foreground/60 uppercase tracking-wider">Catégorie</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-foreground/60 uppercase tracking-wider">Disponible</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-foreground/60 uppercase tracking-wider">Réservé</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-foreground/60 uppercase tracking-wider">Statut</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-foreground/60 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventoryData.map((item) => (
                <tr
                  key={item.id}
                  className={`border-b border-foreground/5 hover:bg-muted/20 transition-colors ${
                    item.outOfStock ? 'bg-red-50/30' : item.lowStock ? 'bg-orange-50/30' : ''
                  }`}
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-muted/50 rounded-md overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.product}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{item.product}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-foreground/60 font-mono">{item.sku}</td>
                  <td className="px-4 py-4 text-sm text-foreground/80">{item.category}</td>
                  <td className="px-4 py-4">
                    <p className={`text-sm font-semibold ${item.outOfStock ? 'text-red-600' : item.lowStock ? 'text-orange-600' : 'text-foreground'}`}>
                      {item.available}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-sm text-foreground/80">{item.reserved}</td>
                  <td className="px-4 py-4">
                    {item.outOfStock ? (
                      <StatusBadge status="cancelled">Rupture</StatusBadge>
                    ) : item.lowStock ? (
                      <StatusBadge status="low_stock">Stock faible</StatusBadge>
                    ) : (
                      <StatusBadge status="active">En stock</StatusBadge>
                    )}
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <button className="px-3 py-1.5 bg-accent hover:bg-accent/90 rounded-md text-xs font-medium text-accent-foreground transition-colors">
                      Réapprovisionner
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-4 py-3 border-t border-foreground/8 flex items-center justify-between">
          <p className="text-sm text-foreground/60">
            Affichage de 1 à {inventoryData.length} sur {inventoryData.length} produits
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

export const Route = createFileRoute('/admin/inventory')({
  head: () => ({ meta: [{ title: 'Stock — OBB Store Admin' }] }),
  component: InventoryPage,
});
