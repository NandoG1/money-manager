// components/ui/data-table.tsx
"use client";

import { useState, useMemo } from "react";
import {
  ColumnDef, ColumnFiltersState, SortingState, VisibilityState, flexRender,
  getCoreRowModel, getFacetedRowModel, getFacetedUniqueValues, getFilteredRowModel,
  getPaginationRowModel, getSortedRowModel, useReactTable, Column,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DataTableViewOptions } from "@/components/table/DataTableViewOptions"; 
import { DataTableFilter } from "@/components/table/DataTableFilter";    
import Image from "next/image";


interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

interface CommonFilterableItem {
  account?: string;
  category?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) { 
  const [sorting, setSorting] = useState<SortingState>([
    { id: columns.length > 0 ? (columns[0] as any).id || (columns[0] as any).accessorKey || "" : "", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnVisibility, rowSelection, columnFilters },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  const accountColumn = useMemo(
    () => table.getAllColumns().find(col => col.id === "account") as Column<TData, unknown> | undefined,
    [table]
  );
  const categoryColumn = useMemo(
    () => table.getAllColumns().find(col => col.id === "category") as Column<TData, unknown> | undefined,
    [table]
  );

  const accountFilterOptions = useMemo(() => {
    if (!accountColumn) return [];
    const accounts = data
        .map(item => (item as CommonFilterableItem).account)
        .filter(Boolean); // Filter nilai falsy
    const uniqueValues = Array.from(new Set(accounts));
    return uniqueValues.map((value) => ({
      value: value as string,
      label: value as string,
    }));
  }, [accountColumn, data]);

  const categoryFilterOptions = useMemo(() => {
    if (!categoryColumn) return [];
    const categories = data
        .map(item => (item as CommonFilterableItem).category)
        .filter(Boolean);
    const uniqueValues = Array.from(new Set(categories));
    return uniqueValues.map((value) => ({
      value: value as string,
      label: value as string,
    }));
  }, [categoryColumn, data]);

  return (
    <div>
      <div className="flex flex-col gap-4 py-4 md:flex-row md:items-center">
        <Input
          placeholder="Filter by name..." 
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="bg-background/50 border-border/50 focus:ring-main-cyan focus:border-main-cyan md:w-[150px] lg:w-[250px]"
        />
        <div className="flex h-8 flex-col items-center gap-2 md:ml-auto xl:flex-row">
          <div className="ml-auto flex h-8 items-center gap-2">
            {accountColumn && accountFilterOptions.length > 0 && (
              <DataTableFilter
                column={accountColumn}
                title="Account"
                options={accountFilterOptions}
              />
            )}
            {categoryColumn && categoryFilterOptions.length > 0 && (
              <DataTableFilter
                column={categoryColumn}
                title="Category"
                options={categoryFilterOptions}
              />
            )}
          </div>
          <DataTableViewOptions table={table} />
        </div>
      </div>
      <div className="mt-6 rounded-xl border border-white/5 bg-black/80 backdrop-blur-sm shadow-lg overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                )}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center gap-4 py-4">
                    <Image src={"/assets/no-result.svg"} width={200} height={200} alt="no-result" className="hidden sm:block opacity-70" />
                    <p className="text-white/80">No results found.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} row(s) available.
        </div>
        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="border-white/5 bg-black/80 hover:border-main-cyan/30 hover:text-main-cyan transition-all duration-300">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => table.nextPage()} className="border-white/5 bg-black/80 hover:border-main-cyan/30 hover:text-main-cyan transition-all duration-300" disabled={!table.getCanNextPage()}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}