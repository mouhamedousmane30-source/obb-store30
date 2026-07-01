import { Bell, Search, User, Moon, Sun, MessageSquare, Menu } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';

interface AdminTopNavProps {
  title?: string;
  onToggleSidebar: () => void;
}

export default function AdminTopNav({ title, onToggleSidebar }: AdminTopNavProps) {
  const [search, setSearch] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { user } = useAuth();

  return (
    <nav className="h-16 bg-card border-b border-foreground/8 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-30">
      <div className="flex items-center gap-4 sm:gap-8 flex-1">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="inline-flex items-center justify-center p-2 rounded-lg text-foreground/60 hover:text-foreground hover:bg-muted transition-colors sm:hidden"
          aria-label="Ouvrir le menu"
        >
          <Bars3 size={20} />
        </button>

        {title && (
          <h2 className="text-lg font-semibold text-foreground hidden sm:block">
            {title}
          </h2>
        )}

        <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2 w-full sm:w-80 border border-foreground/5 focus-within:border-foreground/10 transition-colors">
          <Search size={16} className="text-foreground/40" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm text-foreground placeholder-foreground/40 outline-none flex-1"
          />
          <kbd className="hidden xs:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono text-foreground/40 bg-foreground/5 rounded">
            ⌘K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-2 ml-4">
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2 hover:bg-muted rounded-lg transition-colors text-foreground/60 hover:text-foreground"
          title={isDarkMode ? 'Mode clair' : 'Mode sombre'}
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button
          className="p-2 hover:bg-muted rounded-lg transition-colors text-foreground/60 hover:text-foreground relative"
          title="Messages"
        >
          <MessageSquare size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
        </button>

        <button
          className="p-2 hover:bg-muted rounded-lg transition-colors text-foreground/60 hover:text-foreground relative"
          title="Notifications"
        >
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
        </button>

        <div className="flex items-center gap-3 ml-4 pl-4 border-l border-foreground/8 hidden sm:flex">
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">
              {user ? `${user.prenom} ${user.nom}` : 'Admin OBB'}
            </p>
            <p className="text-[11px] text-foreground/50 capitalize">
              {user?.role === 'admin' ? 'Administrateur' : user?.role === 'manager' ? 'Gestionnaire' : 'Utilisateur'}
            </p>
          </div>
          <div className="w-9 h-9 bg-accent rounded-lg flex items-center justify-center cursor-pointer hover:shadow-sm transition-all flex-shrink-0">
            {user?.avatar ? (
              <img src={user.avatar} alt="" className="w-full h-full rounded-lg object-cover" />
            ) : (
              <User size={18} className="text-accent-foreground" />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
