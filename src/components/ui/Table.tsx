import type { PropsWithChildren, ReactNode } from 'react';

export function Table({
  columns,
  children,
}: PropsWithChildren<{ columns: ReactNode[] }>) {
  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>{columns.map((column, index) => <th key={index}>{column}</th>)}</tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
