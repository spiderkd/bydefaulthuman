"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Badge } from "@/registry/new-york/ui/badge";
import { Button } from "@/registry/new-york/ui/button";
import { Card } from "@/registry/new-york/ui/card";
import { Input } from "@/registry/new-york/ui/input";
import { Select } from "@/registry/new-york/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/new-york/ui/table";

export interface ColumnDef<T> {
  key: keyof T;
  label: string;
  render?: (value: T[keyof T], row: T) => ReactNode;
  searchable?: boolean;
}

export interface DataTableBlockProps<T extends Record<string, unknown>> {
  columns?: ColumnDef<T>[];
  data?: T[];
  defaultPageSize?: number;
  exportFileName?: string;
  onRowClick?: (row: T) => void;
  pageSizeOptions?: number[];
  searchPlaceholder?: string;
  showExport?: boolean;
  title?: string;
}

type Status = "active" | "inactive" | "pending";

interface DefaultRow {
  email: string;
  id: number;
  name: string;
  role: string;
  status: Status;
}

const STATUS_VARIANT: Record<Status, "success" | "outline" | "warning"> = {
  active: "success",
  inactive: "outline",
  pending: "warning",
};

const DEFAULT_DATA: DefaultRow[] = [
  { id: 1, name: "Alice Chen", email: "alice@example.com", role: "Admin", status: "active" },
  { id: 2, name: "Bob Marsh", email: "bob@example.com", role: "Editor", status: "inactive" },
  { id: 3, name: "Carol Dana", email: "carol@example.com", role: "Viewer", status: "active" },
  { id: 4, name: "Dev Patel", email: "dev@example.com", role: "Editor", status: "pending" },
  { id: 5, name: "Eva Kim", email: "eva@example.com", role: "Admin", status: "active" },
  { id: 6, name: "Felix Roy", email: "felix@example.com", role: "Viewer", status: "inactive" },
  { id: 7, name: "Grace Liu", email: "grace@example.com", role: "Editor", status: "active" },
  { id: 8, name: "Hiro Tanaka", email: "hiro@example.com", role: "Viewer", status: "pending" },
];

const DEFAULT_COLUMNS: ColumnDef<DefaultRow>[] = [
  {
    key: "name",
    label: "Name",
    searchable: true,
    render: (value) => <span className="text-sm font-medium">{String(value)}</span>,
  },
  {
    key: "email",
    label: "Email",
    searchable: true,
    render: (value) => <span className="text-xs text-muted-foreground">{String(value)}</span>,
  },
  {
    key: "role",
    label: "Role",
    searchable: true,
  },
  {
    key: "status",
    label: "Status",
    render: (value) => <Badge variant={STATUS_VARIANT[value as Status]}>{String(value)}</Badge>,
  },
];

export function DataTableBlock<T extends Record<string, unknown>>({
  columns = DEFAULT_COLUMNS as unknown as ColumnDef<T>[],
  data = DEFAULT_DATA as unknown as T[],
  defaultPageSize = 4,
  exportFileName = "export",
  onRowClick,
  pageSizeOptions = [4, 6, 8],
  searchPlaceholder = "Search...",
  showExport = true,
  title,
}: DataTableBlockProps<T>) {
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [page, setPage] = useState(0);

  const searchableKeys = columns.filter((column) => column.searchable).map((column) => column.key);
  const filtered = data.filter((row) => {
    if (!search.trim()) return true;
    const query = search.toLowerCase();
    return searchableKeys.some((key) =>
      String(row[key] ?? "")
        .toLowerCase()
        .includes(query),
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const start = page * pageSize;
  const paged = filtered.slice(start, start + pageSize);

  useEffect(() => {
    if (page >= totalPages) {
      setPage(totalPages - 1);
    }
  }, [page, totalPages]);

  const handleExport = () => {
    const headers = columns.map((column) => column.label).join(",");
    const rows = filtered
      .map((row) =>
        columns
          .map((column) => `"${String(row[column.key] ?? "").replace(/"/g, '""')}"`)
          .join(","),
      )
      .join("\n");

    const blob = new Blob([`${headers}\n${rows}`], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${exportFileName}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card padding={20} style={{ overflow: "visible" }} className="w-full">
      {title ? <p className="mb-4 text-sm font-semibold">{title}</p> : null}

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Input
          className="max-w-xs"
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(0);
          }}
          placeholder={searchPlaceholder}
          value={search}
        />
        <div className="flex items-center gap-2">
          <Select
            onChange={(value) => {
              setPageSize(Number(value));
              setPage(0);
            }}
            options={pageSizeOptions.map((option) => ({
              value: String(option),
              label: `${option} / page`,
            }))}
            value={String(pageSize)}
          />
          {showExport ? (
            <Button onClick={handleExport} size="sm" variant="ghost">
              Export
            </Button>
          ) : null}
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow index={0}>
            {columns.map((column) => (
              <TableHead key={String(column.key)}>{column.label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {paged.map((row, index) => (
            <TableRow
              key={String((row.id as string | number | undefined) ?? index)}
              className={
                onRowClick ? "cursor-pointer transition-colors hover:bg-muted/40" : undefined
              }
              index={index + 1}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((column) => (
                <TableCell key={String(column.key)}>
                  {column.render ? column.render(row[column.key], row) : String(row[column.key] ?? "")}
                </TableCell>
              ))}
            </TableRow>
          ))}

          {paged.length === 0 ? (
            <TableRow index={1}>
              <TableCell className="py-8 text-center text-xs text-muted-foreground" colSpan={columns.length}>
                No results found.
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>

      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {filtered.length} result{filtered.length === 1 ? "" : "s"}
        </span>
        <div className="flex items-center gap-2">
          <Button
            disabled={page === 0}
            onClick={() => setPage((current) => Math.max(0, current - 1))}
            size="sm"
            variant="ghost"
          >
            Prev
          </Button>
          <span>
            {page + 1} / {totalPages}
          </span>
          <Button
            disabled={page >= totalPages - 1}
            onClick={() => setPage((current) => Math.min(totalPages - 1, current + 1))}
            size="sm"
            variant="ghost"
          >
            Next
          </Button>
        </div>
      </div>
    </Card>
  );
}
