import { createFileRoute } from '@tanstack/react-router';
import AdminLayout from '@/components/admin/AdminLayout';
import KPICard from '@/components/admin/KPICard';
import { RevenueChart, OrdersChart, CategoryChart } from '@/components/admin/Charts';
import { TrendingUp, Users, ShoppingCart, Percent, DollarSign, Eye, Target } from 'lucide-react';

function AnalyticsPage() {
  return (
    <AdminLayout title="Statistiques">
      {/* KPI Cards - Première ligne */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="Chiffre d'affaires"
          value="22 450 000 FCFA"
          change={18.5}
          icon={<DollarSign size={20} />}
          variant="default"
        />
        <KPICard
          title="Commandes"
          value="1 568"
          change={12.3}
          icon={<ShoppingCart size={20} />}
          variant="default"
        />
        <KPICard
          title="Visiteurs"
          value="4 520"
          change={32.4}
          icon={<Eye size={20} />}
          variant="default"
        />
        <KPICard
          title="Taux de conversion"
          value="3.47%"
          change={8.7}
          icon={<Percent size={20} />}
          variant="default"
        />
      </div>

      {/* KPI Cards - Deuxième ligne */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <KPICard
          title="Nouveaux clients"
          value="156"
          change={24.7}
          icon={<Users size={20} />}
          variant="default"
        />
        <KPICard
          title="Panier moyen"
          value="14 320 FCFA"
          change={5.2}
          icon={<Target size={20} />}
          variant="default"
        />
        <KPICard
          title="Croissance mensuelle"
          value="24.5%"
          change={5.8}
          icon={<TrendingUp size={20} />}
          variant="default"
        />
      </div>

      {/* Graphiques principaux */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <RevenueChart title="Chiffre d'affaires (12 mois)" height={350} />
        <OrdersChart title="Commandes (12 mois)" height={350} />
      </div>

      {/* Graphique catégories */}
      <div className="grid grid-cols-1 gap-6 mb-8">
        <CategoryChart title="Ventes par catégorie" height={350} />
      </div>

      {/* Graphiques additionnels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg p-6 border border-foreground/8">
          <h3 className="text-base font-semibold text-foreground mb-4">Performance par produit</h3>
          <div className="space-y-4">
            {[
              { name: 'Maillot Sénégal Player 2026', sales: 156, revenue: '1 092 000 FCFA' },
              { name: 'T-shirt OBB Premium', sales: 124, revenue: '2 728 000 FCFA' },
              { name: 'Parfum Royal Oud', sales: 89, revenue: '10 680 000 FCFA' },
              { name: 'Sneakers Urban White', sales: 78, revenue: '5 850 000 FCFA' },
            ].map((product, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{product.name}</p>
                  <p className="text-xs text-foreground/60">{product.sales} ventes</p>
                </div>
                <p className="text-sm font-semibold text-foreground">{product.revenue}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-card rounded-lg p-6 border border-foreground/8">
          <h3 className="text-base font-semibold text-foreground mb-4">Sources de trafic</h3>
          <div className="space-y-4">
            {[
              { source: 'Recherche organique', percentage: 45, color: 'bg-accent' },
              { source: 'Réseaux sociaux', percentage: 28, color: 'bg-blue-500' },
              { source: 'Direct', percentage: 18, color: 'bg-green-500' },
              { source: 'Publicité payante', percentage: 9, color: 'bg-orange-500' },
            ].map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">{item.source}</p>
                  <p className="text-sm text-foreground/60">{item.percentage}%</p>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className={`${item.color} h-2 rounded-full transition-all duration-300`} style={{ width: `${item.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export const Route = createFileRoute('/admin/analytics')({
  head: () => ({ meta: [{ title: 'Statistiques — OBB Store Admin' }] }),
  component: AnalyticsPage,
});
