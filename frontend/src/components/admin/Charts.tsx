import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

// Données réalistes pour OBB STORE - Ventes sur 12 mois
const monthlyRevenueData = [
  { month: 'Jan', revenue: 1250000, orders: 89, visitors: 2450 },
  { month: 'Fév', revenue: 980000, orders: 72, visitors: 2100 },
  { month: 'Mar', revenue: 1450000, orders: 105, visitors: 2800 },
  { month: 'Avr', revenue: 1680000, orders: 118, visitors: 3200 },
  { month: 'Mai', revenue: 1520000, orders: 98, visitors: 2950 },
  { month: 'Jun', revenue: 1890000, orders: 134, visitors: 3600 },
  { month: 'Jul', revenue: 2100000, orders: 148, visitors: 4100 },
  { month: 'Aoû', revenue: 1950000, orders: 142, visitors: 3850 },
  { month: 'Sep', revenue: 1780000, orders: 125, visitors: 3400 },
  { month: 'Oct', revenue: 2200000, orders: 156, visitors: 4300 },
  { month: 'Nov', revenue: 2850000, orders: 198, visitors: 5200 },
  { month: 'Déc', revenue: 3200000, orders: 225, visitors: 5800 },
];

// Données par catégorie de produits OBB STORE
const categoryData = [
  { name: 'Maillots', sales: 45, revenue: 3150000, color: '#000000' },
  { name: 'T-shirts', sales: 32, revenue: 1440000, color: '#333333' },
  { name: 'Parfums', sales: 18, revenue: 2160000, color: '#666666' },
  { name: 'Chaussures', sales: 25, revenue: 1875000, color: '#999999' },
  { name: 'Accessoires', sales: 15, revenue: 450000, color: '#CCCCCC' },
];

// Produits les plus vendus OBB STORE
const topProductsData = [
  { name: 'Maillot Sénégal Player 2026', sales: 156, revenue: 1092000 },
  { name: 'T-shirt OBB Premium', sales: 124, revenue: 2728000 },
  { name: 'Parfum Royal Oud', sales: 89, revenue: 1068000 },
  { name: 'Sneakers Urban White', sales: 78, revenue: 585000 },
  { name: 'Casquette OBB Classic', sales: 67, revenue: 201000 },
];

interface ChartProps {
  type?: 'bar' | 'line' | 'area';
  title: string;
  data?: any[];
  dataKey?: string;
  height?: number;
}

// Colors from OBB theme
const colors = {
  primary: '#000000',
  accent: '#000000',
  muted: '#F5F5F5',
  border: 'rgba(0, 0, 0, 0.08)',
  grid: 'rgba(0, 0, 0, 0.04)',
};

export function RevenueChart({ title = 'Chiffre d\'affaires', height = 320, data }: ChartProps) {
  const chartData = data?.length ? data : monthlyRevenueData;
  return (
    <div className="bg-card rounded-lg p-6 border border-foreground/8 col-span-2 lg:col-span-3">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        <div className="flex gap-2">
          <button className="px-3 py-1 text-xs font-medium bg-accent text-accent-foreground rounded-md">12 mois</button>
          <button className="px-3 py-1 text-xs font-medium text-foreground/60 hover:text-foreground rounded-md hover:bg-foreground/5">6 mois</button>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
          <XAxis 
            stroke={colors.primary}
            tick={{ fill: colors.primary, fontSize: 12 }}
            axisLine={{ stroke: colors.border }}
          />
          <YAxis 
            stroke={colors.primary}
            tick={{ fill: colors.primary, fontSize: 12 }}
            axisLine={{ stroke: colors.border }}
            tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
          />
          <Tooltip
            contentStyle={{ 
              backgroundColor: '#FFFFFF', 
              border: `1px solid ${colors.border}`, 
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            labelStyle={{ color: colors.primary, fontWeight: 500 }}
            formatter={(value: number) => `${value.toLocaleString()} FCFA`}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke={colors.accent}
            strokeWidth={2}
            fill={colors.accent}
            fillOpacity={0.1}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function OrdersChart({ title = 'Commandes', height = 320, data }: ChartProps) {
  const chartData = data?.length ? data : monthlyRevenueData;
  return (
    <div className="bg-card rounded-lg p-6 border border-foreground/8 col-span-2 lg:col-span-1">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        <div className="flex gap-2">
          <button className="px-3 py-1 text-xs font-medium bg-accent text-accent-foreground rounded-md">12 mois</button>
          <button className="px-3 py-1 text-xs font-medium text-foreground/60 hover:text-foreground rounded-md hover:bg-foreground/5">6 mois</button>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
          <XAxis 
            stroke={colors.primary}
            tick={{ fill: colors.primary, fontSize: 12 }}
            axisLine={{ stroke: colors.border }}
          />
          <YAxis 
            stroke={colors.primary}
            tick={{ fill: colors.primary, fontSize: 12 }}
            axisLine={{ stroke: colors.border }}
          />
          <Tooltip
            contentStyle={{ 
              backgroundColor: '#FFFFFF', 
              border: `1px solid ${colors.border}`, 
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            labelStyle={{ color: colors.primary, fontWeight: 500 }}
          />
          <Bar 
            dataKey="orders" 
            fill={colors.accent} 
            radius={[4, 4, 0, 0]}
            isAnimationActive={true}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CategoryChart({ title = 'Ventes par catégorie', height = 320, data }: ChartProps) {
  const chartData = data?.length ? data : categoryData;
  return (
    <div className="bg-card rounded-lg p-6 border border-foreground/8 col-span-2">
      <h3 className="text-base font-semibold text-foreground mb-6">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }} layout="horizontal">
          <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
          <XAxis 
            type="number"
            stroke={colors.primary}
            tick={{ fill: colors.primary, fontSize: 12 }}
            axisLine={{ stroke: colors.border }}
            tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
          />
          <YAxis 
            type="category"
            dataKey="name"
            stroke={colors.primary}
            tick={{ fill: colors.primary, fontSize: 12 }}
            axisLine={{ stroke: colors.border }}
            width={80}
          />
          <Tooltip
            contentStyle={{ 
              backgroundColor: '#FFFFFF', 
              border: `1px solid ${colors.border}`, 
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            labelStyle={{ color: colors.primary, fontWeight: 500 }}
            formatter={(value: number) => `${value.toLocaleString()} FCFA`}
          />
          <Bar 
            dataKey="revenue" 
            fill={colors.accent} 
            radius={[0, 4, 4, 0]}
            isAnimationActive={true}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function ChartCard({ type = 'line', title, data, dataKey, height = 300 }: ChartProps) {
  const chartData = data || monthlyRevenueData;
  const key = dataKey || 'revenue';

  return (
    <div className="bg-card rounded-lg p-6 border border-foreground/8">
      <h3 className="text-base font-semibold text-foreground mb-6">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        {type === 'line' ? (
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
            <XAxis stroke={colors.primary} tick={{ fill: colors.primary, fontSize: 12 }} />
            <YAxis stroke={colors.primary} tick={{ fill: colors.primary, fontSize: 12 }} />
            <Tooltip
              contentStyle={{ 
                backgroundColor: '#FFFFFF', 
                border: `1px solid ${colors.border}`, 
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              labelStyle={{ color: colors.primary, fontWeight: 500 }}
            />
            <Line
              type="monotone"
              dataKey={key}
              stroke={colors.accent}
              strokeWidth={2}
              dot={{ fill: colors.accent, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        ) : (
          <BarChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
            <XAxis stroke={colors.primary} tick={{ fill: colors.primary, fontSize: 12 }} />
            <YAxis stroke={colors.primary} tick={{ fill: colors.primary, fontSize: 12 }} />
            <Tooltip
              contentStyle={{ 
                backgroundColor: '#FFFFFF', 
                border: `1px solid ${colors.border}`, 
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              labelStyle={{ color: colors.primary, fontWeight: 500 }}
            />
            <Bar 
              dataKey={key} 
              fill={colors.accent} 
              radius={[4, 4, 0, 0]}
              isAnimationActive={true}
            />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
