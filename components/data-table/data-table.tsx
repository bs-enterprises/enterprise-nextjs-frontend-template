'use client';

/**
 * components/data-table/data-table.tsx
 *
 * Generic DataTable built on TanStack Table v8.
 * Mirrors the reference common/DataTable/DataTable.tsx, adapted for this project:
 *  - Uses our @/components/ui/table (already has overflow wrapper)
 *  - Imports paginations from local pagination folder
 *  - fixedPagination uses @/contexts/layout-context for sidebar offset
 */

import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { useLayoutContext } from '@/contexts/layout-context';
import {
  DefaultPagination,
  CompactPagination,
  SimplePagination,
  NumberedPagination,
} from './pagination';
import type { DataTableProps, DataTableRef } from './types';

// ─── Inner component (uses forwardRef below) ──────────────────────────────────

function DataTableInner<TData, TFilters = unknown>(
  props: DataTableProps<TData, TFilters>,
  ref: React.Ref<DataTableRef>,
) {
  const {
    data,
    columns,
    context,
    loading = false,
    error = null,

    pagination,
    paginationVariant = 'default',
    fixedPagination = false,
    customPaginationComponent,
    serverSidePagination = false,

    enableSorting = true,
    enableFiltering = true,
    enableColumnVisibility = true,
    selection,

    initialSorting = [],
    initialColumnFilters = [],
    initialColumnVisibility = {},
    initialPageSize = 10,

    emptyState,
    loadingState,
    className,
    showBorder = true,
    stripedRows = false,
    hoverEffect = true,
    dense = false,

    onRowClick,
    onRowDoubleClick,
    getRowClassName,
    renderHeader,
    renderFooter,
    ariaLabel,
  } = props;

  const { sidebarCollapsed } = useLayoutContext();
    console.log("Search clients response:", data);
  

  // ── TanStack state ───────────────────────────────────────────────────────
  const [sorting,          setSorting]          = useState<SortingState>(initialSorting);
  const [columnFilters,    setColumnFilters]    = useState<ColumnFiltersState>(initialColumnFilters);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(initialColumnVisibility);
  const [rowSelection,     setRowSelection]     = useState<Record<string, boolean>>({});

  // Clear selection when selection mode is disabled
  useEffect(() => {
    if (!selection?.enabled) setRowSelection({});
  }, [selection?.enabled]);

  // Notify parent of selection changes
  useEffect(() => {
    if (selection?.enabled && selection.onSelectionChange) {
      const selectedIds = Object.keys(rowSelection).filter((k) => rowSelection[k]);
      selection.onSelectionChange(selectedIds);
    }
  }, [rowSelection, selection?.enabled, selection?.onSelectionChange]);

  // ── Table instance ───────────────────────────────────────────────────────
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel:       getCoreRowModel(),
    getPaginationRowModel: serverSidePagination ? undefined : getPaginationRowModel(),
    getSortedRowModel:     enableSorting  ? getSortedRowModel()  : undefined,
    getFilteredRowModel:   enableFiltering ? getFilteredRowModel() : undefined,
    onSortingChange:          setSorting,
    onColumnFiltersChange:    setColumnFilters,
    onColumnVisibilityChange: enableColumnVisibility ? setColumnVisibility : undefined,
    onRowSelectionChange:     selection?.enabled ? setRowSelection : undefined,
    getRowId:  selection?.getRowId ?? ((row: unknown) => (row as { id: string }).id),
    enableRowSelection: selection?.enabled ?? false,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      ...(pagination && !serverSidePagination
        ? { pagination: { pageIndex: pagination.pageIndex, pageSize: pagination.pageSize } }
        : {}),
    },
    initialState: {
      pagination: { pageSize: initialPageSize },
    },
    ...(serverSidePagination
      ? { manualPagination: true, pageCount: pagination?.totalPages ?? -1 }
      : {}),
  });

  // ── Imperative handle ────────────────────────────────────────────────────
  useImperativeHandle(ref, () => ({
    refresh: () => {
      if (context?.refresh && pagination) {
        context.refresh(undefined, pagination.pageIndex, pagination.pageSize);
      }
    },
    clearSelection:  () => setRowSelection({}),
    getSelectedIds:  () => Object.keys(rowSelection).filter((k) => rowSelection[k]),
    setPage:         (pageIndex: number) => {
      if (pagination) pagination.onPageChange(pageIndex);
      else if (!serverSidePagination) table.setPageIndex(pageIndex);
    },
    setPageSize:     (pageSize: number) => {
      if (pagination) pagination.onPageSizeChange(pageSize);
      else if (!serverSidePagination) table.setPageSize(pageSize);
    },
  }));

  // ── Empty state ──────────────────────────────────────────────────────────
  const renderEmptyState = () => {
    if (emptyState?.render) return emptyState.render();
    return (
      <TableRow>
        <TableCell colSpan={columns.length} className="h-40 text-center">
          <div className="flex flex-col items-center justify-center gap-2">
            {emptyState?.icon && (
              <div className="text-muted-foreground/40">{emptyState.icon}</div>
            )}
            <p className="text-sm font-medium text-foreground">
              {emptyState?.title ?? 'No data available'}
            </p>
            {emptyState?.description && (
              <p className="text-sm text-muted-foreground">{emptyState.description}</p>
            )}
            {emptyState?.action && (
              <button
                className="mt-1 text-sm text-primary hover:underline"
                onClick={emptyState.action.onClick}
              >
                {emptyState.action.label}
              </button>
            )}
          </div>
        </TableCell>
      </TableRow>
    );
  };

  // ── Loading state ────────────────────────────────────────────────────────
  const renderLoadingState = () => {
    if (loadingState?.render) return loadingState.render();
    return (
      <TableRow>
        <TableCell colSpan={columns.length} className="h-40 text-center text-muted-foreground">
          {loadingState?.message ?? 'Loading…'}
        </TableCell>
      </TableRow>
    );
  };

  // ── Pagination ───────────────────────────────────────────────────────────
  const renderPagination = () => {
    if (!pagination) return null;

    const fixedCls = fixedPagination
      ? cn(
          'fixed bottom-0 left-0 right-0 z-30',
          'border-t border-border bg-background/95 backdrop-blur-sm',
          'transition-[padding-left] duration-200 ease-out',
          sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-64',
        )
      : undefined;

    if (customPaginationComponent) {
      const Custom = customPaginationComponent;
      return <Custom {...pagination} className={fixedCls} />;
    }
    if (paginationVariant === 'custom') return null;

    const paginationProps = {
      pageIndex:        pagination.pageIndex,
      pageSize:         pagination.pageSize,
      totalPages:       pagination.totalPages ?? table.getPageCount(),
      canNextPage:      pagination.canNextPage ?? table.getCanNextPage(),
      totalItems:       pagination.totalItems,
      pageSizeOptions:  pagination.pageSizeOptions ?? [5, 10, 25, 50, 100],
      onPageChange:     pagination.onPageChange,
      onPageSizeChange: pagination.onPageSizeChange,
      className:        fixedCls,
    };

    switch (paginationVariant) {
      case 'compact':  return <CompactPagination  {...paginationProps} />;
      case 'simple':   return <SimplePagination   {...paginationProps} />;
      case 'numbered': return <NumberedPagination {...paginationProps} />;
      default:         return <DefaultPagination  {...paginationProps} />;
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div
      className={cn(
        'flex flex-col',
        showBorder && 'rounded-xl border border-border/60 overflow-hidden bg-card',
        className,
      )}
    >
      {renderHeader?.()}

      {/* The shadcn Table component already wraps in overflow-x-auto */}
      <Table aria-label={ariaLabel}>
        <TableHeader className="bg-muted/30">
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id} className="hover:bg-transparent">
              {hg.headers.map((header) => (
                <TableHead key={header.id} className={cn(dense && 'py-2', 'font-medium')}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {loading ? (
            renderLoadingState()
          ) : error ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-40 text-center text-destructive">
                {error}
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row, index) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() ? 'selected' : undefined}
                className={cn(
                  hoverEffect && 'hover:bg-muted/40 transition-colors',
                  stripedRows && index % 2 === 1 && 'bg-muted/10',
                  onRowClick && 'cursor-pointer',
                  dense && 'h-10',
                  getRowClassName?.(row.original),
                )}
                onClick={() => onRowClick?.(row.original)}
                onDoubleClick={() => onRowDoubleClick?.(row.original)}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className={cn('align-top', dense && 'py-2')}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            renderEmptyState()
          )}
        </TableBody>
      </Table>

      {renderPagination()}

      {renderFooter?.()}
    </div>
  );
}

// ─── Exported component with generic forwardRef ───────────────────────────────

export const DataTable = forwardRef(DataTableInner) as <TData, TFilters = unknown>(
  props: DataTableProps<TData, TFilters> & { ref?: React.Ref<DataTableRef> },
) => ReturnType<typeof DataTableInner>;
