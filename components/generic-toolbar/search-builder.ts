/**
 * components/generic-toolbar/search-builder.ts
 *
 * Converts the GenericToolbar's `ActiveFilter` array + search state into a
 * `UniversalSearchRequest` ready to be sent to any paginated list endpoint.
 *
 * Use this in page-level hooks when you need to hit a real API:
 *
 * @example
 * const request = buildUniversalSearchRequest(activeFilters, searchValue, ['firstName','email'], sort);
 * const result  = await apiRequest({ method: 'POST', endpoint: '/employees/search', body: { ...request, page, size } });
 */

import type {
  UniversalSearchRequest,
  FieldFilterValue,
  OperatorMap,
  DateFilter,
  DateFilterType,
  SortMap,
  SortDirection,
} from '@/types/search';
import type { ActiveFilter, SortState } from './types';
import type { FilterOperator } from './types';

// ─── Date-operator guard ──────────────────────────────────────────────────────

const DATE_OPERATORS = new Set<string>(['today', 'on', '>=', '<=', 'between']);

function isDateOperator(op: string): op is DateFilterType {
  return DATE_OPERATORS.has(op);
}

// ─── Date filter builder ──────────────────────────────────────────────────────

function buildDateFilter(
  filterId: string,
  operator: DateFilterType,
  value: unknown
): DateFilter | undefined {
  const filter: DateFilter = { type: operator, field: filterId };

  if (operator === 'today') {
    // Always send current UTC date as ISO string (YYYY-MM-DDTHH:mm:ss.sssZ)
    const now = new Date();
    const utc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    return { ...filter, onDate: utc.toISOString() };
  }
  if (operator === 'on') {
    return { ...filter, onDate: String(value) };
  }
  if (operator === '>=') {
    return { ...filter, startDate: String(value) };
  }
  if (operator === '<=') {
    return { ...filter, endDate: String(value) };
  }
  // between: require both start and end, else skip filter
  if (typeof value === 'object' && value !== null && 'from' in value && 'to' in value) {
    const v = value as { from?: string; to?: string };
    if (v.from && v.to) {
      return { ...filter, startDate: v.from, endDate: v.to };
    }
    // If either is missing, do not apply filter
    return undefined;
  }
  return undefined;
}

// ─── Filter value builder ──────────────────────────────────────────────────────

function buildFilterValue(operator: FilterOperator, value: unknown): FieldFilterValue {
  switch (operator) {
    // ── text
    case 'contains':
      return { op: 'regex', pattern: String(value), options: 'i' } as OperatorMap;
    case 'equals':
      return { op: 'eq', value: value as string | number | boolean } as OperatorMap;

    // ── numeric
    case 'gt':  return { op: 'gt',  value: Number(value) } as OperatorMap;
    case 'gte': return { op: 'gte', value: Number(value) } as OperatorMap;
    case 'lt':  return { op: 'lt',  value: Number(value) } as OperatorMap;
    case 'lte': return { op: 'lte', value: Number(value) } as OperatorMap;

    // ── collection
    case 'in':
      return { op: 'in', values: value as Array<string | number | boolean> } as OperatorMap;
    case 'not_in':
      return { op: 'nin', values: value as Array<string | number | boolean> } as OperatorMap;

    // ── fallback: treat as equals
    default:
      return { op: 'eq', value: value as string | number | boolean } as OperatorMap;
  }
}

// ─── Main builder ─────────────────────────────────────────────────────────────

/**
 * Builds a `UniversalSearchRequest` from GenericToolbar state.
 *
 * @param activeFilters  Current filter state from the toolbar
 * @param searchText     Free-text search term
 * @param searchFields   Fields the backend should match `searchText` against
 * @param sort           Current sort state from the toolbar (or `null`)
 */
export function buildUniversalSearchRequest(
  activeFilters: ActiveFilter[],
  searchText?: string,
  searchFields?: string[],
  sort?: SortState | null
): UniversalSearchRequest {
  const request: UniversalSearchRequest = {};

  // ── free text
  if (searchText?.trim()) {
    request.searchText   = searchText.trim();
    request.searchFields = searchFields ?? [];
  }

  // ── sort
  if (sort) {
    const sortMap: SortMap = {
      [sort.field]: (sort.direction === 1 ? 'asc' : 'desc') as SortDirection,
    };
    request.sort = sortMap;
  }

  // ── filters
  const andFilters: Record<string, FieldFilterValue> = {};
  let dateFilter: DateFilter | undefined;

  for (const filter of activeFilters) {
    const { filterId, operator, value } = filter;

    // skip empty values (except 'today' which carries no explicit value)
    if (operator !== 'today') {
      if (value === null || value === undefined || value === '') continue;
      if (Array.isArray(value) && value.length === 0) continue;
    }

    // date filters get their own block
    if (isDateOperator(operator as string)) {
      const df = buildDateFilter(filterId, operator as DateFilterType, value);
      if (df) dateFilter = df;
      else continue; // skip if not valid (e.g. between missing a date)
      continue;
    }

    andFilters[filterId] = buildFilterValue(operator, value);
  }

  if (Object.keys(andFilters).length > 0) {
    request.filters = { and: andFilters };
  }

  if (dateFilter) {
    request.dateFilter = dateFilter;
  }

  return request;
}
