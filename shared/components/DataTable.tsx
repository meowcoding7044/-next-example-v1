"use client";
import React from "react";

export type Column<T> = {
  key: string;
  label: string;
  className?: string;
  render?: (row: T) => React.ReactNode;
};

type Props<T> = {
  columns: Column<T>[];
  data: T[];
  rowKey?: (row: T) => string;
  className?: string;
};

export default function DataTable<T>({ columns, data, rowKey, className }: Props<T>) {
  return (
    <div className={className}>
      <table className="min-w-full">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} className={c.className || "text-left p-2"}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => {
            const rk = rowKey ? rowKey(row) : // @ts-ignore
              (row as any).id || JSON.stringify(row);
            return (
              <tr key={rk} className="border-t">
                {columns.map((c) => (
                  <td key={c.key} className={c.className || "p-2"}>
                    {c.render ? c.render(row) : // @ts-ignore
                      String((row as any)[c.key] ?? "")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
