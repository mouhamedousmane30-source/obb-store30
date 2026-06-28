import { createFileRoute } from '@tanstack/react-router';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/admin/StatusBadge';
import { Plus, Grid3x3, List, Edit, Trash2, Copy, Archive, Search, Filter, MoreVertical, Download, Upload } from 'lucide-react';
import { useState } from 'react';

// Données réalistes pour OBB STORE
const productsData = [
  {
    id: '1',
    name: 'Maillot Sénégal Player 2026',
    sku: 'OBB-MAI-SEN-001',
    price: '7 000 FCFA',
    originalPrice: '10 000 FCFA',
    stock: 45,
    sales: 156,
    category: 'Maillots',
    status: 'active' as const,
    image: '/assets/maillotsenegal.png',
    date: '15/06/2024',
  },
  {
    id: '2',
    name: 'T-shirt OBB Premium',
    sku: 'OBB-TSH-PRE-001',
    price: '22 000 FCFA',
    stock: 78,
    sales: 124,
    category: 'T-shirts',
    status: 'active' as const,
    image: '/assets/weaintboyz2.png',
    date: '10/06/2024',
  },
  {
    id: '3',
    name: 'Parfum Royal Oud',
    sku: 'OBB-PAR-ROY-001',
    price: '120 000 FCFA',
    stock: 23,
    sales: 89,
    category: 'Parfums',
    status: 'active' as const,
    image: '/assets/cat-parfums.jpg',
    date: '08/06/2024',
  },
  {
    id: '4',
    name: 'Sneakers Urban White',
    sku: 'OBB-SNE-URB-001',
    price: '75 000 FCFA',
    stock: 34,
    sales: 78,
    category: 'Chaussures',
    status: 'active' as const,
    image: '/assets/shoes2.png',
    date: '05/06/2024',
  },
  {
    id: '5',
    name: 'Casquette OBB Classic',
    sku: 'OBB-CAS-CLA-001',
    price: '15 000 FCFA',
    stock: 56,
    sales: 67,
    category: 'Accessoires',
    status: 'active' as const,
    image: '/assets/hero.jpg',
    date: '01/06/2024',
  },
  {
    id: '6',
    name: 'Maillot PSG Home 2024',
    sku: 'OBB-MAI-PSG-001',
    price: '25 000 FCFA',
    stock: 12,
    sales: 45,
    category: 'Maillots',
    status: 'low_stock' as const,
    image: '/assets/shoptonmaillot.png',
    date: '28/05/2024',
  },
];

function ProductsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  return (
    <AdminLayout title="Produits">
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
          <select className="px-4 py-2.5 bg-muted/50 border border-foreground/8 rounded-lg text-sm text-foreground focus:outline-none focus:border-foreground/15 transition-colors">
            <option value="">Toutes les catégories</option>
            <option value="maillots">Maillots</option>
            <option value="tshirts">T-shirts</option>
            <option value="parfums">Parfums</option>
            <option value="chaussures">Chaussures</option>
            <option value="accessoires">Accessoires</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-muted/50 border border-foreground/8 rounded-lg text-sm text-foreground/70 hover:text-foreground hover:border-foreground/15 transition-colors">
            <Download size={16} />
            Exporter
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-muted/50 border border-foreground/8 rounded-lg text-sm text-foreground/70 hover:text-foreground hover:border-foreground/15 transition-colors">
            <Upload size={16} />
            Importer
          </button>
          <div className="h-6 w-px bg-foreground/10" />
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-accent text-accent-foreground' : 'bg-muted/50 text-foreground/60 hover:text-foreground'}`}
          >
            <Grid3x3 size={18} />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-2.5 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-accent text-accent-foreground' : 'bg-muted/50 text-foreground/60 hover:text-foreground'}`}
          >
            <List size={18} />
          </button>
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2 rounded-lg">
            <Plus size={18} />
            Ajouter un produit
          </Button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {productsData.map((product) => (
            <div
              key={product.id}
              className="bg-card rounded-lg border border-foreground/8 overflow-hidden hover:border-foreground/15 transition-all group"
            >
              <div className="relative h-48 bg-muted/50 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2">
                  <button className="p-1.5 bg-white/90 backdrop-blur rounded-md shadow-sm hover:bg-white transition-colors">
                    <MoreVertical size={16} className="text-foreground" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="text-xs text-foreground/50 mb-1 font-mono">{product.sku}</p>
                    <h3 className="text-sm font-semibold text-foreground mb-1 line-clamp-2">{product.name}</h3>
                    <p className="text-xs text-foreground/60">{product.category}</p>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-bold text-foreground">{product.price}</p>
                    {product.originalPrice && (
                      <p className="text-xs text-foreground/40 line-through">{product.originalPrice}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-foreground/60">Stock: {product.stock}</p>
                    <StatusBadge status={product.status}>{product.status === 'active' ? 'Actif' : 'Stock faible'}</StatusBadge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 px-3 py-2 bg-accent hover:bg-accent/90 rounded-md text-sm text-accent-foreground transition-colors flex items-center justify-center gap-2">
                    <Edit size={14} />
                    Modifier
                  </button>
                  <button className="px-3 py-2 bg-muted/50 hover:bg-muted rounded-md text-foreground/60 transition-colors">
                    <Copy size={14} />
                  </button>
                  <button className="px-3 py-2 bg-muted/50 hover:bg-muted rounded-md text-destructive transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card rounded-lg border border-foreground/8 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-foreground/8 bg-muted/30">
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-foreground/20"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-foreground/60 uppercase tracking-wider">Produit</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-foreground/60 uppercase tracking-wider">SKU</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-foreground/60 uppercase tracking-wider">Catégorie</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-foreground/60 uppercase tracking-wider">Prix</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-foreground/60 uppercase tracking-wider">Promotion</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-foreground/60 uppercase tracking-wider">Stock</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-foreground/60 uppercase tracking-wider">Statut</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-foreground/60 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-foreground/60 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {productsData.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-foreground/5 hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-foreground/20"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-muted/50 rounded-md overflow-hidden flex-shrink-0">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{product.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-foreground/60 font-mono">{product.sku}</td>
                    <td className="px-4 py-4 text-sm text-foreground/80">{product.category}</td>
                    <td className="px-4 py-4 text-sm font-semibold text-foreground">{product.price}</td>
                    <td className="px-4 py-4 text-sm text-foreground/60">
                      {product.originalPrice ? (
                        <span className="text-destructive text-xs font-medium">-30%</span>
                      ) : (
                        <span className="text-foreground/40">-</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm text-foreground/80">{product.stock}</td>
                    <td className="px-4 py-4">
                      <StatusBadge status={product.status}>
                        {product.status === 'active' ? 'Actif' : 'Stock faible'}
                      </StatusBadge>
                    </td>
                    <td className="px-4 py-4 text-sm text-foreground/60">{product.date}</td>
                    <td className="px-4 py-4 text-sm">
                      <div className="flex gap-1">
                        <button className="p-1.5 hover:bg-muted rounded-md transition-colors" title="Modifier">
                          <Edit size={16} className="text-foreground/60" />
                        </button>
                        <button className="p-1.5 hover:bg-muted rounded-md transition-colors" title="Dupliquer">
                          <Copy size={16} className="text-foreground/60" />
                        </button>
                        <button className="p-1.5 hover:bg-muted rounded-md transition-colors" title="Archiver">
                          <Archive size={16} className="text-foreground/60" />
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
              Affichage de 1 à {productsData.length} sur {productsData.length} produits
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
      )}
    </AdminLayout>
  );
}

export const Route = createFileRoute('/admin/products')({
  head: () => ({ meta: [{ title: 'Produits — OBB Store Admin' }] }),
  component: ProductsPage,
});
