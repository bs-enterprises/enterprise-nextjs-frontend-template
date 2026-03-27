/**
 * components/data-table/types.ts
 *
 * Framework-agnostic types for the reusable DataTable component.
 * Mirrors the structure from the reference common/DataTable/types.ts,
 * adapted for this Next.js project.
 */

import type { ColumnDef, SortingState, ColumnFiltersState, VisibilityState } from '@tanstack/react-table';
import type { ComponentType, ReactNode, Ref } from 'react';

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface PaginationConfig {
  /** Current page index (0-based) */
  pageIndex: number;
  /** Items per page */
  pageSize: number;
  /** Total number of pages */
  totalPages?: number;
  /** Whether next page exists */
  canNextPage?: boolean;
  /** Whether previous page exists */
  canPreviousPage?: boolean;
  /** Total item count */
  totalItems?: number;
  /** Available page-size options */
  pageSizeOptions?: number[];
  /** Page change callback */
  onPageChange: (pageIndex: number) => void;
  /** Page-size change callback */
  onPageSizeChange: (pageSize: number) => void;
}

export type PaginationVariant = 'default' | 'simple' | 'compact' | 'numbered' | 'custom';

export interface CustomPaginationProps extends PaginationConfig {
  className?: string;
}

// ─── Empty / Loading state ────────────────────────────────────────────────────

export interface EmptyStateConfig {
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: { label: string; onClick: () => void };
  /** Override the default empty cell with a full custom ReactNode */
  render?: () => ReactNode;
}

export interface LoadingStateConfig {
  message?: string;
  /** Override the default loading cell with a full custom ReactNode */
  render?: () => ReactNode;
}

// ─── Row selection ────────────────────────────────────────────────────────────

export interface SelectionConfig<TData> {
  /** Enable checkbox selection */
  enabled: boolean;
  /** Called whenever selected row IDs change */
  onSelectionChange?: (selectedIds: string[]) => void;
  /** How to derive a string ID from a row (default: `row.id`) */
  getRowId?: (row: TData) => string;
  /** Show a select-all checkbox in the header */
  enableSelectAll?: boolean;
}

// ─── Context (optional backend integration) ───────────────────────────────────

export interface DataTableContext<TData, TFilters = unknown> {
  data: TData[];
  loading: boolean;
  error?: string | null;
  refresh: (filters?: TFilters, page?: number, size?: number) => Promise<void>;
  create?: (item: Partial<TData>) => Promise<TData>;
  update?: (id: string, item: Partial<TData>) => Promise<TData>;
  delete?: (id: string) => Promise<void>;
  bulkDelete?: (ids: string[]) => Promise<number>;
  getById?: (id: string) => Promise<TData | null>;
}

// ─── Main props ───────────────────────────────────────────────────────────────

export interface DataTableProps<TData, TFilters = unknown> {
  // ── Data ─────────────────────────────────────────────────────────────────
  data: TData[];
  columns: ColumnDef<TData, unknown>[];
  context?: DataTableContext<TData, TFilters>;

  // ── State ─────────────────────────────────────────────────────────────────
  loading?: boolean;
  error?: string | null;

  // ── Pagination ─────────────────────────────────────────────────────────────
  pagination?: PaginationConfig;
  paginationVariant?: PaginationVariant;
  /**
   * Pin the pagination bar to the bottom of the viewport.
   * The bar will automatically shift right to account for the sidebar.
   */
  fixedPagination?: boolean;
  customPaginationComponent?: ComponentType<CustomPaginationProps>;
  serverSidePagination?: boolean;

  // ── Features ───────────────────────────────────────────────────────────────
  enableSorting?: boolean;
  enableFiltering?: boolean;
  enableColumnVisibility?: boolean;
  selection?: SelectionConfig<TData>;

  // ── Initial state ─────────────────────────────────────────────────────────
  initialSorting?: SortingState;
  initialColumnFilters?: ColumnFiltersState;
  initialColumnVisibility?: VisibilityState;
  initialPageSize?: number;

  // ── Appearance ─────────────────────────────────────────────────────────────
  emptyState?: EmptyStateConfig;
  loadingState?: LoadingStateConfig;
  className?: string;
  showBorder?: boolean;
  stripedRows?: boolean;
  hoverEffect?: boolean;
  /** Compact / dense row height */
  dense?: boolean;

  // ── Callbacks ─────────────────────────────────────────────────────────────
  onRowClick?: (row: TData) => void;
  onRowDoubleClick?: (row: TData) => void;
  /** Custom function to generate row className based on row data */
  getRowClassName?: (row: TData) => string;

  // ── Custom slots ──────────────────────────────────────────────────────────
  renderHeader?: () => ReactNode;
  renderFooter?: () => ReactNode;

  // ── Accessibility ─────────────────────────────────────────────────────────
  ariaLabel?: string;
  ariaDescription?: string;
}

// ─── Imperative ref ──────────────────────────────────────────────────────────

export interface DataTableRef {
  /** Trigger a context.refresh() if a context is provided */
  refresh: () => void;
  /** Clear all row selections */
  clearSelection: () => void;
  /** Get the currently selected row IDs */
  getSelectedIds: () => string[];
  /** Jump to a specific page */
  setPage: (pageIndex: number) => void;
  /** Change page size */
  setPageSize: (pageSize: number) => void;
}
