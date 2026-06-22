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
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: <BarChart3 size={18} /> },
  { label: 'Orders', href: '/admin/orders', icon: <ShoppingCart size={18} />, badge: 12 },
  { label: 'Products', href: '/admin/products', icon: <Package size={18} /> },
  { label: 'Categories', href: '/admin/categories', icon: <Layers size={18} /> },
  { label: 'Inventory', href: '/admin/inventory', icon: <Package2 size={18} /> },
  { label: 'Customers', href: '/admin/customers', icon: <Users size={18} /> },
  { label: 'Analytics', href: '/admin/analytics', icon: <TrendingUp size={18} /> },
  { label: 'Coupons', href: '/admin/coupons', icon: <Tag size={18} /> },
  { label: 'Shipping', href: '/admin/shipping', icon: <Truck size={18} /> },
  { label: 'Reviews', href: '/admin/reviews', icon: <Star size={18} /> },
  { label: 'Marketing', href: '/admin/marketing', icon: <Megaphone size={18} /> },
  { label: 'Notifications', href: '/admin/notifications', icon: <Bell size={18} /> },
  { label: 'Staff', href: '/admin/staff', icon: <Lock size={18} /> },
  { label: 'Settings', href: '/admin/settings', icon: <Settings size={18} /> },
];

export default function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-white border-r border-black/8 transition-all duration-300 z-40 flex flex-col ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Header avec Logo */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-6 border-b border-foreground/10">
        {!isCollapsed && (
          <Link to="/" className="hover:opacity-80 transition-opacity flex-shrink-0">
            <Logo variant="vertical" size="sm" className="w-8 h-8" />
          </Link>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 hover:bg-muted rounded-md transition-colors text-foreground/70 hover:text-foreground"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <li key={item.href} className="list-none">
              <Link
                to={item.href}
                className={`flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-all duration-300 relative group ${
                  isActive
                    ? 'bg-accent text-accent-foreground shadow-sm'
                    : 'text-foreground/70 hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <span className="flex-shrink-0 w-5 h-5">{item.icon}</span>
                {!isCollapsed && (
                  <span className="text-xs sm:text-sm font-medium tracking-wide whitespace-nowrap flex-1">
                    {item.label}
                  </span>
                )}
                {!isCollapsed && item.badge && (
                  <span className="ml-auto flex-shrink-0 px-2 py-0.5 text-[10px] font-bold bg-destructive text-destructive-foreground rounded-full font-mono">
                    {item.badge}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-foreground/10 px-3 sm:px-4 py-3 sm:py-4">
        <button className="w-full flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 text-foreground/70 hover:text-foreground rounded-lg transition-colors hover:bg-muted/50">
          <LogOut size={18} className="flex-shrink-0" />
          {!isCollapsed && <span className="text-xs sm:text-sm font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
