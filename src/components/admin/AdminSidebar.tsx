import { useState } from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { Logo } from '@/components/logo';
import {
  BarChart3,
  Package,
  ShoppingCart,
  Users,
  Tag,
  Bell,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Layers,
  TrendingUp,
  Lock,
  Package2,
  Truck,
  Megaphone,
  Star,
  MessageSquare,
  CreditCard,
  DollarSign,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: <BarChart3 size={18} /> },
  { label: 'Produits', href: '/admin/products', icon: <Package size={18} /> },
  { label: 'Catégories', href: '/admin/categories', icon: <Layers size={18} /> },
  { label: 'Commandes', href: '/admin/orders', icon: <ShoppingCart size={18} />, badge: 12 },
  { label: 'Clients', href: '/admin/customers', icon: <Users size={18} /> },
  { label: 'Paiements', href: '/admin/payments', icon: <CreditCard size={18} /> },
  { label: 'Coupons', href: '/admin/coupons', icon: <Tag size={18} /> },
  { label: 'Livraisons', href: '/admin/shipping', icon: <Truck size={18} /> },
  { label: 'Stock', href: '/admin/inventory', icon: <Package2 size={18} /> },
  { label: 'Avis Clients', href: '/admin/reviews', icon: <Star size={18} /> },
  { label: 'Messages', href: '/admin/notifications', icon: <MessageSquare size={18} /> },
  { label: 'Statistiques', href: '/admin/analytics', icon: <TrendingUp size={18} /> },
  { label: 'Marketing', href: '/admin/marketing', icon: <Megaphone size={18} /> },
  { label: 'Paramètres', href: '/admin/settings', icon: <Settings size={18} /> },
  { label: 'Déconnexion', href: '/', icon: <LogOut size={18} /> },
];

export default function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-white border-r border-foreground/8 transition-all duration-300 z-40 flex flex-col ${
        isCollapsed ? 'w-20' : 'w-[260px]'
      }`}
    >
      {/* Header avec Logo */}
      <div className="flex items-center justify-between px-6 py-6 border-b border-foreground/8">
        {!isCollapsed && (
          <Link to="/" className="hover:opacity-80 transition-opacity flex-shrink-0">
            <Logo variant="vertical" size="sm" className="w-10 h-10" />
          </Link>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-muted rounded-md transition-colors text-foreground/50 hover:text-foreground"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-0.5">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <li key={item.href} className="list-none">
              <Link
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 relative group ${
                  isActive
                    ? 'bg-accent text-accent-foreground font-medium'
                    : 'text-foreground/60 hover:text-foreground hover:bg-foreground/[0.03]'
                }`}
              >
                <span className="flex-shrink-0 w-5 h-5">{item.icon}</span>
                {!isCollapsed && (
                  <span className="text-sm font-medium tracking-tight whitespace-nowrap flex-1">
                    {item.label}
                  </span>
                )}
                {!isCollapsed && item.badge && (
                  <span className="ml-auto flex-shrink-0 px-2 py-0.5 text-[11px] font-semibold bg-destructive text-destructive-foreground rounded-full font-mono">
                    {item.badge}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-foreground/8 px-4 py-4">
        <div className="text-xs text-foreground/40">
          {!isCollapsed && (
            <p className="font-medium">OBB STORE</p>
          )}
        </div>
      </div>
    </aside>
  );
}
