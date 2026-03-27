/**
 * types/search.ts
 *
 * Shared type definitions for the Universal Search Request used by
 * GenericToolbar's search-builder and any paginated API endpoint.
 */

// ─── Sort ─────────────────────────────────────────────────────────────────────

export type SortDirection = 'asc' | 'desc';

export type SortMap = {
  [field: string]: SortDirection;
};

// ─── Date Filters ─────────────────────────────────────────────────────────────

export type DateFilterType = 'today' | 'on' | '>=' | '<=' | 'between';

export interface DateFilter {
  type: DateFilterType;
  field: string;
  onDate?: string;
  startDate?: string;
  endDate?: string;
}

// ─── Field Filters ────────────────────────────────────────────────────────────

export type OperatorMap =
  | { op: 'eq';    value: string | number | boolean }
  | { op: 'neq';   value: string | number | boolean }
  | { op: 'gt';    value: number }
  | { op: 'gte';   value: number }
  | { op: 'lt';    value: number }
  | { op: 'lte';   value: number }
  | { op: 'in';    values: Array<string | number | boolean> }
  | { op: 'nin';   values: Array<string | number | boolean> }
  | { op: 'regex'; pattern: string; options?: string };

export type FieldFilterValue = OperatorMap;

// ─── Universal Search Request ─────────────────────────────────────────────────

export interface UniversalSearchRequest {
  searchText?: string;
  searchFields?: string[];
  sort?: SortMap;
  filters?: {
    and?: Record<string, FieldFilterValue>;
    or?: Record<string, FieldFilterValue>;
  };
  dateFilter?: DateFilter;
}
