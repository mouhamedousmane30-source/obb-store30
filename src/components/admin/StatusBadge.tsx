import { ReactNode } from 'react';

interface StatusBadgeProps {
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'completed' | 'failed' | 'refunded' | 'active' | 'inactive';
  children: ReactNode;
}

const statusStyles = {
  pending: 'bg-muted text-foreground/70 border-foreground/10',
  processing: 'bg-card border border-foreground/20 text-accent',
  shipped: 'bg-card border border-foreground/20 text-foreground',
  delivered: 'bg-card border border-foreground/20 text-card',
  cancelled: 'bg-destructive/10 text-destructive border-destructive/20',
  completed: 'bg-card border border-foreground/20 text-card',
  failed: 'bg-destructive/10 text-destructive border-destructive/20',
  refunded: 'bg-muted/50 text-foreground/60 border-foreground/10',
  active: 'bg-card border border-foreground/20 text-foreground',
  inactive: 'bg-muted text-foreground/60 border-foreground/10',
};

export default function StatusBadge({ status, children }: StatusBadgeProps) {
  return (
    <span className={`px-2.5 sm:px-3 py-1 rounded-md text-[10px] sm:text-xs font-semibold border transition-colors ${statusStyles[status]}`}>
      {children}
    </span>
  );
}
