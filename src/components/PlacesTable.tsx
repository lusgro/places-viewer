"use client";

import { Place } from "@/types/place";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  ArrowUpDown,
  ExternalLink,
  Phone,
  Globe,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

interface PlacesTableProps {
  data: Place[];
}

function StarRating({ score }: { score: number | null | undefined }) {
  if (score === null || score === undefined) return <span className="text-muted-foreground">-</span>;
  return (
    <div className="flex items-center gap-1">
      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      <span className="font-medium">{score.toFixed(1)}</span>
    </div>
  );
}

const columns: ColumnDef<Place>[] = [
  {
    accessorKey: "rank",
    header: "#",
    cell: ({ row }) => (
      <span className="text-muted-foreground font-mono text-sm">
        {row.getValue("rank") || "-"}
      </span>
    ),
    size: 50,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Nombre
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const place = row.original;
      return (
        <div className="flex items-center gap-3">
          {place.imageUrl && (
            <img
              src={place.imageUrl}
              alt={place.title}
              className="h-10 w-10 rounded object-cover"
            />
          )}
          <div>
            <div className="font-medium">{place.title}</div>
            {place.categoryName && (
              <div className="text-xs text-muted-foreground">
                {place.categoryName}
              </div>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "totalScore",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Rating
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <StarRating score={row.getValue("totalScore")} />,
  },
  {
    accessorKey: "reviewsCount",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Reseñas
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const count = row.getValue("reviewsCount") as number | undefined;
      return count ? count.toLocaleString() : "-";
    },
  },
  {
    accessorKey: "neighborhood",
    header: "Barrio",
    cell: ({ row }) => (
      <Badge variant="outline">{row.getValue("neighborhood") || "-"}</Badge>
    ),
  },
  {
    accessorKey: "address",
    header: "Dirección",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground max-w-[200px] truncate block">
        {row.getValue("address")}
      </span>
    ),
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const place = row.original;
      return (
        <div className="flex gap-1">
          {place.phone && (
            <Button variant="ghost" size="icon" asChild>
              <a href={`tel:${place.phoneUnformatted || place.phone}`}>
                <Phone className="h-4 w-4" />
              </a>
            </Button>
          )}
          {place.website && (
            <Button variant="ghost" size="icon" asChild>
              <a href={place.website} target="_blank" rel="noopener noreferrer">
                <Globe className="h-4 w-4" />
              </a>
            </Button>
          )}
          {place.url && (
            <Button variant="ghost" size="icon" asChild>
              <a href={place.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      );
    },
  },
];

export function PlacesTable({ data }: PlacesTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, _columnId, filterValue) => {
      const search = normalizeText(String(filterValue));
      const title = normalizeText(row.original.title || "");
      const category = normalizeText(row.original.categoryName || "");
      const neighborhood = normalizeText(row.original.neighborhood || "");
      const address = normalizeText(row.original.address || "");
      return (
        title.includes(search) ||
        category.includes(search) ||
        neighborhood.includes(search) ||
        address.includes(search)
      );
    },
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 20,
      },
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Buscar lugares..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
        <div className="text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} resultados
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No se encontraron resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Página {table.getState().pagination.pageIndex + 1} de{" "}
          {table.getPageCount()}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Siguiente
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
