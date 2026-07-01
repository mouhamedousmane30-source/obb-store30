import { useState } from 'react';
import { Link, useLocation, useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { Logo } from '@/components/logo';
import { useAuth } from '@/lib/auth-context';
import { fetchDashboardStats } from '@/lib/api/admin';
import {
  BarChart3,
  Package,
  ShoppingCart,
  Users,
  Tag,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Layers,
  TrendingUp,
  Package2,
  Truck,
  Megaphone,
  Star,
  MessageSquare,
  CreditCard,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const { data: statsData } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: fetchDashboardStats,
    staleTime: 60 * 1000,
  });

  const pendingOrders = (statsData?.stats?.pendingOrders as number | undefined) ?? 0;

  const navItems: NavItem[] = [
    { label: 'Dashboard', href: '/admin', icon: <BarChart3 size={18} /> },
    { label: 'Produits', href: '/admin/products', icon: <Package size={18} /> },
    { label: 'Catégories', href: '/admin/categories', icon: <Layers size={18} /> },
    {
      label: 'Commandes',
      href: '/admin/orders',
      icon: <ShoppingCart size={18} />,
      badge: pendingOrders > 0 ? pendingOrders : undefined,
    },
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
  ];

  const handleLogout = async () => {
    await logout();
    navigate({ to: '/login' });
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 h-screen w-[260px] bg-white border-r border-foreground/8 transition-transform duration-300 shadow-xl sm:shadow-none sm:static ${
        isOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'
      } ${isCollapsed ? 'sm:w-20' : 'sm:w-[260px]'}`}
      aria-hidden={!isOpen}
    >
      <div className="flex items-center justify-between px-4 py-5 border-b border-foreground/8 sm:px-6">
        <div className="flex items-center gap-3">
          {!isCollapsed && (
            <Link to="/" className="hover:opacity-80 transition-opacity flex-shrink-0">
              <Logo variant="vertical" size="sm" className="w-10 h-10" animated={true} />
            </Link>
          )}
          {isCollapsed && (
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-foreground/80">OBB</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsCollapsed((prev) => !prev)}
            className="hidden sm:inline-flex p-2 hover:bg-muted rounded-md transition-colors text-foreground/50 hover:text-foreground"
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex sm:hidden p-2 hover:bg-muted rounded-md transition-colors text-foreground/50 hover:text-foreground"
            aria-label="Fermer la navigation"
          >
            <ChevronLeft size={18} />
          </button>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-5 sm:px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <li key={item.href} className="list-none">
              <Link
                to={item.href}
                onClick={onClose}
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

        <li className="list-none mt-2 pt-2 border-t border-foreground/8">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-foreground/60 hover:text-foreground hover:bg-foreground/[0.03]"
          >
            <span className="flex-shrink-0 w-5 h-5">
              <LogOut size={18} />
            </span>
            {!isCollapsed && (
              <span className="text-sm font-medium tracking-tight whitespace-nowrap">
                Déconnexion
              </span>
            )}
          </button>
        </li>
      </nav>

      <div className="border-t border-foreground/8 px-4 py-4">
        <div className="text-xs text-foreground/40">
          {!isCollapsed && <p className="font-medium">OBB STORE</p>}
        </div>
      </div>
    </aside>
  );
}
