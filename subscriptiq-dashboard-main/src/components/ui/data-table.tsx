import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface DataTableProps<T> {
  data: T[];
  columns: {
    key: keyof T | string;
    label: string;
    render?: (item: T) => ReactNode;
    className?: string;
  }[];
  onRowClick?: (item: T) => void;
  isLoading?: boolean;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  onRowClick,
  isLoading,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-border overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={String(col.key)} className={col.className}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}>
                {columns.map((col) => (
                  <td key={String(col.key)} className={col.className}>
                    <div className="skeleton h-4 w-24" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={String(col.key)} className={col.className}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <motion.tr
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              onClick={() => onRowClick?.(item)}
              className={cn(onRowClick && 'cursor-pointer')}
            >
              {columns.map((col) => (
                <td key={String(col.key)} className={col.className}>
                  {col.render ? col.render(item) : item[col.key as keyof T]}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
