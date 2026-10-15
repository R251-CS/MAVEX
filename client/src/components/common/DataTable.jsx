import React from 'react';
import { Skeleton } from './Skeleton';
import { EmptyState } from './EmptyState';

export const DataTable = ({
  columns = [],
  data = [],
  isLoading = false,
  emptyMessage = 'لا توجد بيانات مسجلة في هذا الجدول',
  className = '',
  keyExtractor = (item, idx) => item.id || idx
}) => {
  return (
    <div className={`mx-table-container ${className}`}>
      <table className="mx-table">
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th
                key={idx}
                style={{ textAlign: col.align || 'right', width: col.width || 'auto' }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            Array.from({ length: 4 }).map((_, rIdx) => (
              <tr key={rIdx}>
                {columns.map((col, cIdx) => (
                  <td key={cIdx} style={{ textAlign: col.align || 'right' }}>
                    <Skeleton height="1.25rem" width={cIdx === 0 ? '60%' : '80%'} />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <EmptyState description={emptyMessage} />
              </td>
            </tr>
          ) : (
            data.map((row, rIdx) => (
              <tr key={keyExtractor(row, rIdx)}>
                {columns.map((col, cIdx) => (
                  <td key={cIdx} style={{ textAlign: col.align || 'right' }}>
                    {col.render ? col.render(row, rIdx) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
