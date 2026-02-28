import { ReactNode } from 'react';

export type FilterOperator =
  | 'equals'
  | 'not_equals'
  | 'contains'
  | 'not_contains'
  | 'starts_with'
  | 'ends_with'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'between'
  | 'in'
  | 'not_in'
  | 'today'
  | 'is_null'
  | 'is_not_null';

export type FilterFieldType =
  | 'text'
  | 'number'
  | 'date'
  | 'datetime'
  | 'boolean'
  | 'select'
  | 'multi_select';

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterField {
  id: string;
  label: string;
  type: FilterFieldType;
  operators?: FilterOperator[];
  options?: FilterOption[];
  placeholder?: string;
}

export interface ActiveFilter {
  filterId: string;
  operator: FilterOperator;
  value: unknown;
}

export interface SortField {
  id: string;
  label: string;
  type?: 'text' | 'number' | 'date';
}

export interface SortState {
  field: string;
  direction: 1 | -1;
}

export interface ColumnConfig {
  id: string;
  label: string;
}

export interface CustomAction {
  id: string;
  label: string;
  icon?: ReactNode;
  variant?: 'default' | 'outline' | 'ghost' | 'destructive';
  onClick: () => void;
}

export interface GenericToolbarProps {
  /* ── Search ── */
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  showSearch?: boolean;

  /* ── Filters ── */
  showFilters?: boolean;
  availableFilters?: FilterField[];
  activeFilters?: ActiveFilter[];
  onFiltersChange?: (filters: ActiveFilter[]) => void;

  /* ── Sort ── */
  showSort?: boolean;
  sortableFields?: SortField[];
  currentSort?: SortState | null;
  onSortChange?: (sort: SortState | null) => void;

  /* ── Column visibility ── */
  showConfigureView?: boolean;
  allColumns?: ColumnConfig[];
  visibleColumns?: string[];
  onVisibleColumnsChange?: (cols: string[]) => void;

  /* ── Export ── */
  showExport?: boolean;
  onExportAll?: () => void;
  onExportResults?: () => void;

  /* ── Add button ── */
  showAddButton?: boolean;
  addButtonLabel?: string;
  onAdd?: () => void;

  /* ── Bulk selection ── */
  showBulkActions?: boolean;
  selectionMode?: boolean;
  onToggleSelection?: () => void;

  /* ── Custom actions ── */
  customActions?: CustomAction[];

  className?: string;
}
