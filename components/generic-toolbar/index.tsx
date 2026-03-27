'use client';

import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Search,
  SlidersHorizontal,
  Settings2,
  Download,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  X,
  ChevronDown,
  Check,
  ChevronUp,
  Plus,
  XCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  GenericToolbarProps,
  ActiveFilter,
  FilterField,
  OPERATOR_LABELS,
  ExternalFilterController,
} from './types';
import { FilterPanel } from './filter-panel';

// ── Re-exports ────────────────────────────────────────────────────────────────
export type {
  GenericToolbarProps,
  FilterField,
  FilterOption,
  ActiveFilter,
  SortField,
  SortState,
  ColumnConfig,
  CustomAction,
  FilterOperator,
  ExternalFilterController,
  FilterFieldType,
} from './types';
export {
  OPERATOR_LABELS,
  OPERATORS_BY_FIELD_TYPE,
  DEFAULT_OPERATOR_BY_FIELD_TYPE,
} from './types';
export { buildUniversalSearchRequest } from './search-builder';

// ── helpers ───────────────────────────────────────────────────────────────────

/** Decides whether a filter should count as "active" for the badge count */
function isFilterActive(f: ActiveFilter): boolean {
  if (f.operator === 'today') return true;
  if (f.value === null || f.value === undefined || f.value === '') return false;
  if (Array.isArray(f.value)) return (f.value as unknown[]).length > 0;
  return true;
}

// ── FilterTag ─────────────────────────────────────────────────────────────────
// Shown in the collapsed state when the filter panel is closed but filters are active.

function FilterTag({
  filter,
  field,
  onRemove,
}: {
  filter: ActiveFilter;
  field?: FilterField;
  onRemove: () => void;
}) {
  const label   = field?.label ?? filter.filterId;
  const opLabel = OPERATOR_LABELS[filter.operator] ?? filter.operator;
  const noValue = filter.operator === 'today';
  const valLabel = noValue
    ? ''
    : Array.isArray(filter.value)
    ? (filter.value as string[]).join(', ')
    : String(filter.value ?? '');

  return (
    <Badge variant="secondary" className="gap-1 pr-1 text-xs font-normal">
      <span className="font-medium">{label}</span>
      <span className="opacity-60">{opLabel}</span>
      {valLabel && <span className="font-medium">{valLabel}</span>}
      <button
        onClick={onRemove}
        className="ml-0.5 rounded-sm p-px hover:text-destructive transition-colors"
        aria-label={`Remove ${label} filter`}
      >
        <X className="h-3 w-3" />
      </button>
    </Badge>
  );
}

// ── GenericToolbar ─────────────────────────────────────────────────────────────

/**
 * GenericToolbar — fully controlled, reusable table/list toolbar.
 *
 * Features (all opt-in via props):
 *  - Instant search (fully controlled, syncs with `searchValue` prop)
 *  - Collapsible filter panel (Basic / Advanced) with field-type-aware inputs
 *  - Operator selector per filter in Advanced mode (contains / equals / ≥ / between / …)
 *  - Filter count badge on the Filters button
 *  - Active filter tags shown when panel is collapsed
 *  - Sort dropdown (cycles Asc → Desc → none)
 *  - Column-visibility toggle with checkboxes
 *  - Export dropdown (All / Results)
 *  - Add button
 *  - Bulk-selection toggle
 *  - Custom action slots
 */
export function GenericToolbar({
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Search…',
  showSearch = true,

  showFilters = false,
  availableFilters = [],
  activeFilters = [],
  onFiltersChange,
  externalFilterControllers = [],

  showSort = false,
  sortableFields = [],
  currentSort,
  onSortChange,

  showConfigureView = false,
  allColumns = [],
  visibleColumns = [],
  onVisibleColumnsChange,

  showExport = false,
  onExportAll,
  onExportResults,

  showAddButton = false,
  addButtonLabel = 'Add',
  onAdd,

  showBulkActions = false,
  selectionMode = false,
  onToggleSelection,
  bulkActions = [],
  selectedCount = 0,

  customActions = [],

  className,
}: GenericToolbarProps) {
  // ── Controlled search ──────────────────────────────────────────────────────
  const [inputValue, setInputValue] = useState(searchValue);
  const isExternalChange = useRef(false);
  const searchDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const [hasUnappliedSearchChange, setHasUnappliedSearchChange] = useState(false);

  useEffect(() => {
    if (searchValue !== inputValue) {
      isExternalChange.current = true;
      setInputValue(searchValue);
      setHasUnappliedSearchChange(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, []);

  const handleSearchChange = (val: string) => {
    setInputValue(val);
    if (!isExternalChange.current) {
      // Set 2-second debounce timer for auto-search
      setHasUnappliedSearchChange(true);
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
      searchDebounceRef.current = setTimeout(() => {
        onSearchChange?.(val);
        setHasUnappliedSearchChange(false);
      }, 2000); // 2 seconds as requested
    }
    isExternalChange.current = false;
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // Immediately apply search on Enter key
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
      onSearchChange?.(inputValue);
      setHasUnappliedSearchChange(false);
    }
  };

  const clearSearch = () => {
    setInputValue('');
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }
    onSearchChange?.('');
    setHasUnappliedSearchChange(false);
  };

  // ── Filters ────────────────────────────────────────────────────────────────
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Calculate external filter IDs (filters managed by external components)
  const externalFilterIds = new Set<string>();
  externalFilterControllers.forEach(controller => {
    controller.representedFilters.forEach(rf => {
      externalFilterIds.add(rf.filterId);
    });
  });

  // Get user-managed filters (excluding external ones from display/count)
  const userFilters = activeFilters.filter(f => !externalFilterIds.has(f.filterId));

  const removeFilter = (filterId: string) => {
    // Only remove user filters, preserve external ones
    const newUserFilters = userFilters.filter((f) => f.filterId !== filterId);
    
    // Merge with external filters and notify parent
    const externalFilters: ActiveFilter[] = [];
    externalFilterControllers.forEach((controller, controllerIndex) => {
      controller.representedFilters.forEach((rf, filterIndex) => {
        externalFilters.push({
          filterId: rf.filterId,
          operator: rf.operator,
          value: rf.value,
        });
      });
    });
    
    onFiltersChange?.([...externalFilters, ...newUserFilters]);
  };

  const clearAllFilters = () => {
    // Clear only user filters, preserve external ones
    const externalFilters: ActiveFilter[] = [];
    externalFilterControllers.forEach((controller, controllerIndex) => {
      controller.representedFilters.forEach((rf, filterIndex) => {
        externalFilters.push({
          filterId: rf.filterId,
          operator: rf.operator,
          value: rf.value,
        });
      });
    });
    
    onFiltersChange?.(externalFilters);
  };

  const activeCount = userFilters.filter(isFilterActive).length;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className={cn('space-y-2.5', className)}>

      {/* ── Main row ── */}
      <div className="flex flex-col sm:flex-row gap-2">

        {/* Search */}
        {showSearch && (
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              placeholder={searchPlaceholder}
              value={inputValue}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="pl-9 pr-9 h-9 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            {hasUnappliedSearchChange && (
              <span className="absolute right-10 top-1/2 -translate-y-1/2 text-xs text-amber-600 font-medium whitespace-nowrap pointer-events-none">
                Press Enter
              </span>
            )}
            {inputValue && (
              <button
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={clearSearch}
              >
                <XCircle className="h-4 w-4" />
              </button>
            )}
          </div>
        )}

        {/* Right-side buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">

          {/* Filters toggle */}
          {showFilters && availableFilters.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-1.5"
              onClick={() => setFiltersOpen((o) => !o)}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span className="hidden sm:inline text-sm">Filters</span>
              {activeCount > 0 && (
                <span className="bg-primary text-primary-foreground rounded-full px-1.5 text-xs leading-none py-0.5">
                  {activeCount}
                </span>
              )}
              {filtersOpen
                ? <ChevronUp className="h-3.5 w-3.5" />
                : <ChevronDown className="h-3.5 w-3.5" />}
            </Button>
          )}

          {/* Column toggle */}
          {showConfigureView && allColumns.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 gap-1.5">
                  <Settings2 className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline text-sm">Columns</span>
                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel className="text-xs text-muted-foreground font-semibold uppercase tracking-wide py-1.5">
                  Toggle columns
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-72 overflow-y-auto py-1">
                  {allColumns.map((col) => {
                    const visible = visibleColumns.includes(col.id);
                    return (
                      <div
                        key={col.id}
                        role="menuitemcheckbox"
                        aria-checked={visible}
                        className="flex items-center gap-2 px-2 py-1.5 cursor-pointer hover:bg-accent rounded-sm select-none"
                        onClick={() =>
                          onVisibleColumnsChange?.(
                            visible
                              ? visibleColumns.filter((id) => id !== col.id)
                              : [...visibleColumns, col.id],
                          )
                        }
                      >
                        <Checkbox checked={visible} className="pointer-events-none" />
                        <span className="text-sm">{col.label}</span>
                      </div>
                    );
                  })}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Export */}
          {showExport && (onExportAll || onExportResults) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 gap-1.5">
                  <Download className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline text-sm">Export</span>
                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onExportAll && (
                  <DropdownMenuItem onClick={onExportAll}>Export All</DropdownMenuItem>
                )}
                {onExportResults && (
                  <DropdownMenuItem onClick={onExportResults}>Export Results</DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Sort */}
          {showSort && sortableFields.length > 0 && onSortChange && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant={currentSort ? 'default' : 'outline'}
                  size="sm"
                  className="h-9 gap-1.5"
                >
                  <ArrowUpDown className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline text-sm">
                    {currentSort
                      ? sortableFields.find((f) => f.id === currentSort.field)?.label ?? 'Sort'
                      : 'Sort'}
                  </span>
                  {currentSort && (
                    currentSort.direction === 1
                      ? <ArrowUp className="h-3 w-3" />
                      : <ArrowDown className="h-3 w-3" />
                  )}
                  {!currentSort && <ChevronDown className="h-3 w-3 text-muted-foreground" />}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel className="text-xs text-muted-foreground font-semibold uppercase tracking-wide py-1.5">
                  Sort by
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {sortableFields.map((field) => {
                  const active    = currentSort?.field === field.id;
                  const direction = currentSort?.direction;
                  return (
                    <DropdownMenuItem
                      key={field.id}
                      className="flex items-center justify-between"
                      onClick={() => {
                        if (!active)         return onSortChange({ field: field.id, direction: 1 });
                        if (direction === 1) return onSortChange({ field: field.id, direction: -1 });
                        onSortChange(null);
                      }}
                    >
                      <span>{field.label}</span>
                      {active && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          {direction === 1
                            ? <><ArrowUp className="h-3 w-3" /> Asc</>
                            : <><ArrowDown className="h-3 w-3" /> Desc</>}
                        </span>
                      )}
                    </DropdownMenuItem>
                  );
                })}
                {currentSort && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-muted-foreground text-sm"
                      onClick={() => onSortChange(null)}
                    >
                      <X className="h-3 w-3 mr-2" /> Clear sort
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Add */}
          {showAddButton && onAdd && (
            <Button size="sm" className="h-9 gap-1.5" onClick={onAdd}>
              <Plus className="h-3.5 w-3.5" />
              {addButtonLabel}
            </Button>
          )}

          {/* Bulk select */}
          {showBulkActions && onToggleSelection && (
            <Button
              variant={selectionMode ? 'default' : 'outline'}
              size="sm"
              className="h-9 gap-1.5"
              onClick={onToggleSelection}
            >
              <Check className="h-3.5 w-3.5" />
              <span className="hidden sm:inline text-sm">
                {selectionMode ? 'Cancel' : 'Select'}
              </span>
            </Button>
          )}

          {/* Custom actions */}
          {customActions.map((a) => (
            <Button
              key={a.id}
              variant={a.variant ?? 'outline'}
              size="sm"
              className="h-9 gap-1.5"
              onClick={a.onClick}
            >
              {a.icon}
              {a.label}
            </Button>
          ))}
        </div>
      </div>

      {/* ── Bulk-actions bar — shown while selectionMode is active ── */}
      {showBulkActions && selectionMode && (
        <div className="flex items-center gap-2 rounded-md border bg-muted/40 px-3 py-1.5">
          <span className="text-sm text-muted-foreground mr-1">
            {selectedCount} selected
          </span>
          {bulkActions.map((a) => (
            <Button
              key={a.id}
              variant={a.variant ?? 'outline'}
              size="sm"
              className="h-7 gap-1.5 text-xs"
              onClick={a.onClick}
              disabled={selectedCount === 0}
            >
              {a.icon}
              {a.label}
            </Button>
          ))}
        </div>
      )}

      {/* ── Active filter tags — shown when panel is closed but filters are active ── */}
      {activeCount > 0 && !filtersOpen && (
        <div className="flex items-center gap-1.5 flex-wrap">
          {userFilters.filter(isFilterActive).map((f) => (
            <FilterTag
              key={f.filterId}
              filter={f}
              field={availableFilters.find((af) => af.id === f.filterId)}
              onRemove={() => removeFilter(f.filterId)}
            />
          ))}
          <Button
            variant="outline"
            size="sm"
            className="h-6 px-2 text-xs text-primary border-primary/40 hover:bg-primary/10 hover:text-primary"
            onClick={clearAllFilters}
          >
            <X className="h-3 w-3 mr-1" />
            Clear all
          </Button>
        </div>
      )}

      {/* ── Filter panel (Basic / Advanced) ── */}
      {showFilters && filtersOpen && (
        <FilterPanel
          availableFilters={availableFilters}
          activeFilters={userFilters}
          onFiltersChange={(filters) => {
            // Merge user filters with external filters
            const externalFilters: ActiveFilter[] = [];
            externalFilterControllers.forEach((controller) => {
              controller.representedFilters.forEach((rf) => {
                externalFilters.push({
                  filterId: rf.filterId,
                  operator: rf.operator,
                  value: rf.value,
                });
              });
            });
            onFiltersChange?.([...externalFilters, ...filters]);
          }}
          onClose={() => setFiltersOpen(false)}
        />
      )}
    </div>
  );
}
