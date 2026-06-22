import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { ReactNode } from 'react';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: ReactNode;
  variant?: 'default' | 'accent' | 'muted';
}

export default function KPICard({ title, value, change, icon, variant = 'default' }: KPICardProps) {
  const isPositive = change ? change > 0 : false;
  
  const baseClasses = 'bg-card border border-foreground/10 hover:border-foreground/20 rounded-sm p-4 sm:p-6 transition-all duration-300 hover:shadow-sm';
  
  const accentClasses = variant === 'accent' ? 'bg-accent/5 border-accent/15 hover:border-accent/25' : '';

  return (
    <div className={`${baseClasses} ${accentClasses} group`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-foreground/70 text-[11px] sm:text-xs uppercase tracking-widest font-semibold mb-2">
            {title}
          </p>
          <p className="text-2xl sm:text-3xl font-bold text-foreground font-display">
            {value}
          </p>
        </div>
        <div className="flex-shrink-0 text-foreground/30 group-hover:text-foreground/50 transition-colors">
          {icon}
        </div>
      </div>

      {change !== undefined && (
        <div className="flex items-center gap-1.5 text-xs">
          {isPositive ? (
            <>
              <ArrowUpRight size={14} className="text-foreground/70" />
              <span className="font-mono text-foreground/70 font-semibold">{change}%</span>
            </>
          ) : (
            <>
              <ArrowDownRight size={14} className="text-foreground/70" />
              <span className="font-mono text-foreground/70 font-semibold">{Math.abs(change)}%</span>
            </>
          )}
          <span className="text-foreground/50">vs last month</span>
        </div>
      )}
    </div>
  );
}
