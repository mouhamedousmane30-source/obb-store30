import { ReactNode } from 'react';

interface StatusBadgeProps {
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'completed' | 'failed' | 'refunded' | 'active' | 'inactive' | 'low_stock';
  children: ReactNode;
}

const statusStyles = {
  pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  processing: 'bg-blue-50 text-blue-700 border-blue-200',
  shipped: 'bg-purple-50 text-purple-700 border-purple-200',
  delivered: 'bg-green-50 text-green-700 border-green-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
  completed: 'bg-green-50 text-green-700 border-green-200',
  failed: 'bg-red-50 text-red-700 border-red-200',
  refunded: 'bg-gray-50 text-gray-700 border-gray-200',
  active: 'bg-green-50 text-green-700 border-green-200',
  inactive: 'bg-gray-50 text-gray-700 border-gray-200',
  low_stock: 'bg-orange-50 text-orange-700 border-orange-200',
};

export default function StatusBadge({ status, children }: StatusBadgeProps) {
  return (
    <span className={`px-2.5 py-1 rounded-md text-[11px] font-medium border transition-colors ${statusStyles[status]}`}>
      {children}
    </span>
  );
}
