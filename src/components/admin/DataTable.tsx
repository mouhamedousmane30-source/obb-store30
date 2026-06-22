import { ReactNode } from 'react';

interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: any, row: T) => ReactNode;
  width?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  title?: string;
}

export default function DataTable<T extends { id: string | number }>({
  columns,
  data,
  title,
}: DataTableProps<T>) {
  return (
    <div className="bg-card rounded-sm border border-foreground/10 overflow-hidden">
      {title && (
        <div className="px-4 sm:px-6 py-4 border-b border-foreground/10">
          <h3 className="text-base sm:text-lg font-semibold text-foreground">{title}</h3>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-foreground/10 bg-foreground/5">
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className="px-3 sm:px-6 py-3 text-left text-[10px] sm:text-xs font-bold uppercase tracking-widest text-foreground/60"
                  style={col.width ? { width: col.width } : {}}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr
                key={row.id}
                className="border-b border-foreground/5 hover:bg-foreground/3 transition-colors"
              >
                {columns.map((col) => (
                  <td
                    key={`${row.id}-${String(col.key)}`}
                    className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-foreground/80"
                  >
                    {col.render ? col.render(row[col.key], row) : String(row[col.key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.length === 0 && (
        <div className="px-4 sm:px-6 py-12 text-center text-foreground/50 text-sm">
          No data available
        </div>
      )}
    </div>
  );
}
