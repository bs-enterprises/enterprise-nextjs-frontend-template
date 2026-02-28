'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
  MoreHorizontal,
} from 'lucide-react';
import { PaginationProps, PaginationVariantProps } from './types';

export type { PaginationVariant, PaginationProps } from './types';

/* ─── Shared page-size selector ─────────────────────────────────────────── */
function PageSizeSelect({
  pageSize,
  pageSizeOptions,
  onPageSizeChange,
  disabled,
}: Pick<PaginationProps, 'pageSize' | 'pageSizeOptions' | 'onPageSizeChange' | 'disabled'>) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground hidden sm:inline">Rows:</span>
      <select
        value={pageSize}
        onChange={(e) => onPageSizeChange(Number(e.target.value))}
        disabled={disabled}
        className="h-8 rounded-md border border-input bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
      >
        {(pageSizeOptions ?? [10, 20, 50]).map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </div>
  );
}

/* ─── Default variant ────────────────────────────────────────────────────── */
export function DefaultPagination({
  pageIndex,
  pageSize,
  totalPages,
  canNextPage,
  onPageChange,
  onPageSizeChange,
  totalItems,
  pageSizeOptions,
  className,
  disabled,
}: PaginationProps) {
  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row items-center justify-between gap-3 border-t bg-card px-4 py-3',
        disabled && 'opacity-50 pointer-events-none',
        className
      )}
    >
      <PageSizeSelect
        pageSize={pageSize}
        pageSizeOptions={pageSizeOptions}
        onPageSizeChange={onPageSizeChange}
        disabled={disabled}
      />
      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        Page {pageIndex + 1} of {totalPages}
        {totalItems && <span className="ml-1 hidden sm:inline">({totalItems} total)</span>}
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(Math.max(0, pageIndex - 1))}
          disabled={pageIndex === 0 || disabled}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(Math.min(totalPages - 1, pageIndex + 1))}
          disabled={!canNextPage || disabled}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

/* ─── Compact variant ────────────────────────────────────────────────────── */
export function CompactPagination({
  pageIndex,
  pageSize,
  totalPages,
  canNextPage,
  onPageChange,
  onPageSizeChange,
  totalItems,
  pageSizeOptions,
  className,
  disabled,
}: PaginationProps) {
  const start = pageIndex * pageSize + 1;
  const end = Math.min((pageIndex + 1) * pageSize, totalItems ?? (pageIndex + 1) * pageSize);

  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-3 border-t bg-card px-4 py-3',
        disabled && 'opacity-50 pointer-events-none',
        className
      )}
    >
      <div className="text-sm text-muted-foreground">
        {totalItems ? (
          <>Showing {start}–{end} of {totalItems}</>
        ) : (
          <>Page {pageIndex + 1} of {totalPages}</>
        )}
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(0)}
          disabled={pageIndex === 0 || disabled}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(Math.max(0, pageIndex - 1))}
          disabled={pageIndex === 0 || disabled}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(Math.min(totalPages - 1, pageIndex + 1))}
          disabled={!canNextPage || disabled}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(totalPages - 1)}
          disabled={!canNextPage || disabled}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
        <PageSizeSelect
          pageSize={pageSize}
          pageSizeOptions={pageSizeOptions}
          onPageSizeChange={onPageSizeChange}
          disabled={disabled}
        />
      </div>
    </div>
  );
}

/* ─── Simple variant ─────────────────────────────────────────────────────── */
export function SimplePagination({
  pageIndex,
  pageSize,
  totalPages,
  canNextPage,
  onPageChange,
  onPageSizeChange,
  className,
  disabled,
}: PaginationProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center gap-3 py-3',
        disabled && 'opacity-50 pointer-events-none',
        className
      )}
    >
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.max(0, pageIndex - 1))}
        disabled={pageIndex === 0 || disabled}
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Prev
      </Button>
      <span className="text-sm text-muted-foreground">
        {pageIndex + 1} / {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.min(totalPages - 1, pageIndex + 1))}
        disabled={!canNextPage || disabled}
      >
        Next
        <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  );
}

/* ─── Numbered variant ───────────────────────────────────────────────────── */
export function NumberedPagination({
  pageIndex,
  pageSize,
  totalPages,
  canNextPage,
  onPageChange,
  onPageSizeChange,
  totalItems,
  pageSizeOptions,
  className,
  disabled,
}: PaginationProps) {
  const start = pageIndex * pageSize + 1;
  const end = Math.min((pageIndex + 1) * pageSize, totalItems ?? (pageIndex + 1) * pageSize);

  const getPages = (): (number | 'ellipsis-start' | 'ellipsis-end')[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i);
    if (pageIndex <= 3) return [0, 1, 2, 3, 4, 'ellipsis-end', totalPages - 1];
    if (pageIndex >= totalPages - 4)
      return [0, 'ellipsis-start', totalPages - 5, totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1];
    return [0, 'ellipsis-start', pageIndex - 1, pageIndex, pageIndex + 1, 'ellipsis-end', totalPages - 1];
  };

  return (
    <div
      className={cn(
        'flex flex-col gap-3 border-t bg-card px-4 py-3',
        disabled && 'opacity-50 pointer-events-none',
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm text-muted-foreground">
          {totalItems ? `${start}–${end} of ${totalItems}` : `Page ${pageIndex + 1} of ${totalPages}`}
        </span>
        <PageSizeSelect
          pageSize={pageSize}
          pageSizeOptions={pageSizeOptions}
          onPageSizeChange={onPageSizeChange}
          disabled={disabled}
        />
      </div>
      <div className="flex items-center justify-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(Math.max(0, pageIndex - 1))}
          disabled={pageIndex === 0 || disabled}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {getPages().map((page, i) =>
          typeof page === 'string' ? (
            <span key={page + i} className="flex h-8 w-8 items-center justify-center">
              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            </span>
          ) : (
            <Button
              key={page}
              variant={page === pageIndex ? 'default' : 'outline'}
              size="icon"
              className="h-8 w-8 text-xs"
              onClick={() => onPageChange(page)}
              disabled={disabled}
            >
              {page + 1}
            </Button>
          )
        )}
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(Math.min(totalPages - 1, pageIndex + 1))}
          disabled={!canNextPage || disabled}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

/* ─── Infinite / Load-more variant ──────────────────────────────────────── */
export function InfinitePagination({
  pageIndex,
  pageSize,
  totalPages,
  canNextPage,
  onPageChange,
  onPageSizeChange,
  totalItems,
  className,
  disabled,
  loading,
  loadMoreText = 'Load More',
}: PaginationProps) {
  const loaded = (pageIndex + 1) * pageSize;

  return (
    <div
      className={cn(
        'flex flex-col items-center gap-3 py-4',
        disabled && 'opacity-50 pointer-events-none',
        className
      )}
    >
      {totalItems && (
        <p className="text-sm text-muted-foreground">
          Showing {Math.min(loaded, totalItems)} of {totalItems} items
        </p>
      )}
      {canNextPage ? (
        <Button
          variant="outline"
          onClick={() => onPageChange(pageIndex + 1)}
          disabled={loading || disabled}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            loadMoreText
          )}
        </Button>
      ) : (
        <p className="text-sm text-muted-foreground italic">End of list</p>
      )}
    </div>
  );
}

/* ─── Unified <Pagination> switcher ─────────────────────────────────────── */
export function Pagination({ variant = 'default', ...props }: PaginationVariantProps) {
  switch (variant) {
    case 'compact':
      return <CompactPagination {...props} />;
    case 'simple':
      return <SimplePagination {...props} />;
    case 'numbered':
      return <NumberedPagination {...props} />;
    case 'infinite':
      return <InfinitePagination {...props} />;
    default:
      return <DefaultPagination {...props} />;
  }
}
