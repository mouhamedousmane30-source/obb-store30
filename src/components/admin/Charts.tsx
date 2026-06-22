import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const revenueData = [
  { name: 'Jan', revenue: 4000, orders: 240 },
  { name: 'Feb', revenue: 3000, orders: 221 },
  { name: 'Mar', revenue: 2000, orders: 229 },
  { name: 'Apr', revenue: 2780, orders: 200 },
  { name: 'May', revenue: 1890, orders: 220 },
  { name: 'Jun', revenue: 2390, orders: 250 },
  { name: 'Jul', revenue: 3490, orders: 210 },
];

interface ChartProps {
  type?: 'bar' | 'line';
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
};

export function RevenueChart({ title = 'Revenue Overview', height = 300 }: ChartProps) {
  return (
    <div className="bg-card rounded-sm p-4 sm:p-6 border border-foreground/10 col-span-2">
      <h3 className="text-base sm:text-lg font-semibold text-foreground mb-4 sm:mb-6">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={revenueData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
          <XAxis stroke={colors.primary} />
          <YAxis stroke={colors.primary} />
          <Tooltip
            contentStyle={{ backgroundColor: '#FFFFFF', border: `1px solid ${colors.border}`, borderRadius: '4px' }}
            labelStyle={{ color: colors.primary }}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke={colors.accent}
            strokeWidth={2}
            dot={{ fill: colors.accent, r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function OrdersChart({ title = 'Orders Overview', height = 300 }: ChartProps) {
  return (
    <div className="bg-card rounded-sm p-4 sm:p-6 border border-foreground/10 col-span-2">
      <h3 className="text-base sm:text-lg font-semibold text-foreground mb-4 sm:mb-6">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={revenueData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
          <XAxis stroke={colors.primary} />
          <YAxis stroke={colors.primary} />
          <Tooltip
            contentStyle={{ backgroundColor: '#FFFFFF', border: `1px solid ${colors.border}`, borderRadius: '4px' }}
            labelStyle={{ color: colors.primary }}
          />
          <Bar dataKey="orders" fill={colors.accent} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function ChartCard({ type = 'line', title, data, dataKey, height = 300 }: ChartProps) {
  const chartData = data || revenueData;
  const key = dataKey || 'revenue';

  return (
    <div className="bg-card rounded-sm p-4 sm:p-6 border border-foreground/10">
      <h3 className="text-base sm:text-lg font-semibold text-foreground mb-4 sm:mb-6">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        {type === 'line' ? (
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
            <XAxis stroke={colors.primary} />
            <YAxis stroke={colors.primary} />
            <Tooltip
              contentStyle={{ backgroundColor: '#FFFFFF', border: `1px solid ${colors.border}`, borderRadius: '4px' }}
              labelStyle={{ color: colors.primary }}
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
            <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
            <XAxis stroke={colors.primary} />
            <YAxis stroke={colors.primary} />
            <Tooltip
              contentStyle={{ backgroundColor: '#FFFFFF', border: `1px solid ${colors.border}`, borderRadius: '4px' }}
              labelStyle={{ color: colors.primary }}
            />
            <Bar dataKey={key} fill={colors.accent} radius={[4, 4, 0, 0]} />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
