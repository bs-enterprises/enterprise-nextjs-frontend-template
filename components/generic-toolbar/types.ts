import { ReactNode } from 'react';

// ─── Filter operators ─────────────────────────────────────────────────────────

/** Text operators — matches reference: regex (contains) | eq (equals) */
export type TextFilterOperator = 'contains' | 'equals';

/** Numeric operators — matches reference ComparisonOp: eq | gt | gte | lt | lte */
export type NumberFilterOperator = 'equals' | 'gt' | 'gte' | 'lt' | 'lte';

/** Date operators — matches reference DateFilterType exactly */
export type DateFilterOperator = 'today' | 'on' | '>=' | '<=' | 'between';

/** Select operators — matches reference: in */
export type SelectFilterOperator = 'in';

/** Multi-select operators — matches reference CollectionOp: in | nin */
export type MultiSelectFilterOperator = 'in' | 'not_in';

/** Boolean operators — matches reference: eq */
export type BooleanFilterOperator = 'equals';

/** Union of every operator that can appear on an ActiveFilter */
export type FilterOperator =
  | TextFilterOperator
  | NumberFilterOperator
  | DateFilterOperator
  | SelectFilterOperator
  | MultiSelectFilterOperator
  | BooleanFilterOperator;

// ─── Human-readable operator labels (used in filter tags) ────────────────────

export const OPERATOR_LABELS: Record<FilterOperator, string> = {
  // text
  contains: 'contains',
  equals:   '=',
  // number
  gt:       '>',
  gte:      '≥',
  lt:       '<',
  lte:      '≤',
  // date
  today:    'is today',
  on:       'on',
  '>=':     'on or after',
  '<=':     'on or before',
  between:  'between',
  // select / multi-select
  in:       'in',
  not_in:   'not in',
};

// ─── Field types ──────────────────────────────────────────────────────────────

export type FilterFieldType =
  | 'text'
  | 'number'
  | 'date'
  | 'datetime'
  | 'boolean'
  | 'select'
  | 'multi_select';

/** Default operator applied when a filter is first added by field type */
export const DEFAULT_OPERATOR_BY_FIELD_TYPE: Record<FilterFieldType, FilterOperator> = {
  text:        'contains',
  number:      'equals',
  date:        'today',
  datetime:    'today',
  boolean:     'equals',
  select:      'in',
  multi_select:'in',
};

/** Selectable operators per field type (matches reference GenericToolbar exactly) */
export const OPERATORS_BY_FIELD_TYPE: Record<FilterFieldType, FilterOperator[]> = {
  text:         ['contains', 'equals'],
  number:       ['equals', 'gt', 'gte', 'lt', 'lte'],
  date:         ['today', 'on', '>=', '<=', 'between'],
  datetime:     ['today', 'on', '>=', '<=', 'between'],
  boolean:      ['equals'],
  select:       ['in'],
  multi_select: ['in', 'not_in'],
};

// ─── Filter field / active filter models ─────────────────────────────────────

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterField {
  /** Unique field key that matches the backend field name */
  id: string;
  label: string;
  type: FilterFieldType;
  /** Override the default operator list for this field */
  operators?: FilterOperator[];
  /** For select / multi_select types */
  options?: FilterOption[];
  placeholder?: string;
}

export interface ActiveFilter {
  /** Matches FilterField.id */
  filterId: string;
  operator: FilterOperator;
  value: unknown;
}

// ─── External filter controllers ─────────────────────────────────────────────

/** External filter controller for programmatic filters (e.g., from tabs, custom UI) */
export interface ExternalFilterController {
  /** Filters represented by this external controller */
  representedFilters: Array<{
    filterId: string;
    operator: FilterOperator;
    value: any;
  }>;
}

// ─── Sort ─────────────────────────────────────────────────────────────────────

export interface SortField {
  id: string;
  label: string;
  type?: 'text' | 'number' | 'date';
}

export interface SortState {
  /** Matches SortField.id */
  field: string;
  /** 1 = ascending, -1 = descending */
  direction: 1 | -1;
}

// ─── Column config ────────────────────────────────────────────────────────────

export interface ColumnConfig {
  id: string;
  label: string;
}

// ─── Custom actions ───────────────────────────────────────────────────────────

export interface CustomAction {
  id: string;
  label: string;
  icon?: ReactNode;
  variant?: 'default' | 'outline' | 'ghost' | 'destructive';
  onClick: () => void;
}

// ─── Main toolbar props ───────────────────────────────────────────────────────

export interface GenericToolbarProps {
  /* ── Search ── */
  /** Controlled search string; changing this from outside resets the input */
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  showSearch?: boolean;

  /* ── Filters ── */
  showFilters?: boolean;
  availableFilters?: FilterField[];
  /** Controlled active filter list; mutate via onFiltersChange */
  activeFilters?: ActiveFilter[];
  onFiltersChange?: (filters: ActiveFilter[]) => void;
  /** External filter controllers for programmatic filters (e.g., tabs, custom components) */
  externalFilterControllers?: ExternalFilterController[];

  /* ── Sort ── */
  showSort?: boolean;
  sortableFields?: SortField[];
  /** null means no sort applied */
  currentSort?: SortState | null;
  onSortChange?: (sort: SortState | null) => void;

  /* ── Column visibility ── */
  showConfigureView?: boolean;
  allColumns?: ColumnConfig[];
  /** Array of column ids that are currently visible */
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
  /**
   * Actions rendered in the bulk-actions bar that appears below the toolbar
   * row while `selectionMode` is true. Typically Delete, Manage Roles, etc.
   */
  bulkActions?: CustomAction[];
  /** Number of currently selected rows — shown in the bulk-actions bar. */
  selectedCount?: number;

  /* ── Custom actions ── */
  customActions?: CustomAction[];

  className?: string;
}
