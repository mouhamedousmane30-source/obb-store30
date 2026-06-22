import { Bell, Search, User } from 'lucide-react';
import { useState } from 'react';

interface AdminTopNavProps {
  title?: string;
}

export default function AdminTopNav({ title }: AdminTopNavProps) {
  const [search, setSearch] = useState('');

  return (
    <nav className="h-16 sm:h-20 bg-card border-b border-foreground/10 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-30">
      <div className="flex items-center gap-4 sm:gap-8 flex-1">
        {title && (
          <h2 className="text-base sm:text-lg font-semibold text-foreground hidden sm:block">
            {title}
          </h2>
        )}
        
        <div className="hidden md:flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2 w-64 border border-foreground/5">
          <Search size={16} className="text-foreground/50" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-sm text-foreground placeholder-foreground/40 outline-none flex-1"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <button
          className="p-2 hover:bg-muted rounded-lg transition-colors text-foreground/70 hover:text-foreground hidden sm:flex"
        >
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
        </button>

        <div className="flex items-center gap-2 sm:gap-3 ml-2 sm:ml-4 pl-2 sm:pl-4 border-l border-foreground/10">
          <div className="text-right hidden xs:block">
            <p className="text-xs sm:text-sm font-medium text-foreground">Admin</p>
            <p className="text-[10px] text-foreground/60">Administrator</p>
          </div>
          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-accent rounded-lg flex items-center justify-center cursor-pointer hover:shadow-sm transition-all flex-shrink-0">
            <User size={16} className="text-accent-foreground" />
          </div>
        </div>
      </div>
    </nav>
  );
}
