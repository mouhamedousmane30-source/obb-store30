import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown } from 'lucide-react';
import { ReactNode } from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: ReactNode;
  variant?: 'default' | 'accent' | 'muted';
  sparklineData?: number[];
}

const generateSparklineData = (trend: 'up' | 'down' | 'neutral') => {
  const base = [10, 12, 11, 14, 13, 16, 15, 18, 17, 20];
  if (trend === 'up') return base.map(v => v + Math.random() * 5);
  if (trend === 'down') return base.map(v => v - Math.random() * 5);
  return base;
};

export default function KPICard({ title, value, change, icon, variant = 'default', sparklineData }: KPICardProps) {
  const isPositive = change ? change > 0 : false;
  const trend = isPositive ? 'up' : change ? 'down' : 'neutral';
  const data = sparklineData || generateSparklineData(trend);
  
  const baseClasses = 'bg-card border border-foreground/8 hover:border-foreground/12 rounded-lg p-6 transition-all duration-300 hover:shadow-sm';
  
  const accentClasses = variant === 'accent' ? 'bg-accent/5 border-accent/15 hover:border-accent/25' : '';

  return (
    <div className={`${baseClasses} ${accentClasses} group`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-foreground/60 text-xs uppercase tracking-wider font-medium mb-2">
            {title}
          </p>
          <p className="text-3xl font-bold text-foreground font-display">
            {value}
          </p>
        </div>
        <div className="flex-shrink-0 w-10 h-10 bg-foreground/5 rounded-lg flex items-center justify-center text-foreground/50 group-hover:text-foreground group-hover:bg-foreground/10 transition-all">
          {icon}
        </div>
      </div>

      {change !== undefined && (
        <div className="flex items-center gap-2 mb-4">
          <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold ${
            isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            <span className="font-mono">{Math.abs(change)}%</span>
          </div>
          <span className="text-foreground/40 text-xs">vs mois dernier</span>
        </div>
      )}

      {/* Mini Sparkline Chart */}
      <div className="h-12">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data.map((v, i) => ({ value: v }))}>
            <Line
              type="monotone"
              dataKey="value"
              stroke={isPositive ? '#16a34a' : '#dc2626'}
              strokeWidth={2}
              dot={false}
              isAnimationActive={true}
              animationDuration={1000}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
