'use client';

import { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
  FilterOperator,
  SortState,
} from './types';

export type { GenericToolbarProps, FilterField, ActiveFilter, SortState } from './types';

/* ── small helpers ─────────────────────────────────────────────────────────── */
function FilterTag({
  filter,
  field,
  onRemove,
}: {
  filter: ActiveFilter;
  field?: FilterField;
  onRemove: () => void;
}) {
  const label = field?.label ?? filter.filterId;
  const val = Array.isArray(filter.value) ? filter.value.join(', ') : String(filter.value ?? '');

  return (
    <Badge variant="secondary" className="gap-1 pr-1 text-xs">
      <span className="opacity-70">{label}:</span>
      <span>{val || filter.operator}</span>
      <button onClick={onRemove} className="ml-0.5 hover:text-destructive transition-colors">
        <X className="h-3 w-3" />
      </button>
    </Badge>
  );
}

function BasicFilterRow({
  filter,
  field,
  onChange,
  onRemove,
}: {
  filter: ActiveFilter;
  field: FilterField;
  onChange: (updated: ActiveFilter) => void;
  onRemove: () => void;
}) {
  if (field.type === 'select' || field.type === 'multi_select') {
    const options = field.options ?? [];
    return (
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-medium w-24 shrink-0">{field.label}</span>
        <div className="flex flex-wrap gap-1">
          {options.map((opt) => {
            const vals = (filter.value as string[]) ?? [];
            const selected = vals.includes(opt.value);
            return (
              <button
                key={opt.value}
                onClick={() => {
                  const next = selected
                    ? vals.filter((v) => v !== opt.value)
                    : [...vals, opt.value];
                  onChange({ ...filter, value: next, operator: 'in' });
                }}
                className={cn(
                  'text-xs px-2 py-0.5 rounded-full border transition-colors',
                  selected
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background border-border hover:border-primary'
                )}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6 ml-auto" onClick={onRemove}>
          <X className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium w-24 shrink-0">{field.label}</span>
      <Input
        className="h-8 text-sm flex-1"
        placeholder={field.placeholder ?? `Filter by ${field.label}…`}
        value={(filter.value as string) ?? ''}
        onChange={(e) => onChange({ ...filter, value: e.target.value, operator: 'contains' })}
      />
      <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={onRemove}>
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
}

/* ── GenericToolbar ─────────────────────────────────────────────────────────── */
/**
 * GenericToolbar — full-featured list/table toolbar with:
 *  - instant search
 *  - collapsible filter panel (basic mode)
 *  - sort dropdown
 *  - column-visibility toggle
 *  - export dropdown
 *  - add button
 *  - bulk-selection toggle
 *  - custom action slots
 *
 * All features are opt-in via props; unused features are simply not rendered.
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

  customActions = [],

  className,
}: GenericToolbarProps) {
  const [localSearch, setLocalSearch] = useState(searchValue);
  const [filtersOpen, setFiltersOpen] = useState(false);

  /* search */
  const handleSearchChange = useCallback(
    (val: string) => {
      setLocalSearch(val);
      onSearchChange?.(val);
    },
    [onSearchChange]
  );

  /* filters */
  const addFilter = (field: FilterField) => {
    if (activeFilters.find((f) => f.filterId === field.id)) return;
    const blank: ActiveFilter = {
      filterId: field.id,
      operator: field.type === 'select' || field.type === 'multi_select' ? 'in' : 'contains',
      value: field.type === 'select' || field.type === 'multi_select' ? [] : '',
    };
    onFiltersChange?.([...activeFilters, blank]);
  };

  const updateFilter = (updated: ActiveFilter) => {
    onFiltersChange?.(activeFilters.map((f) => (f.filterId === updated.filterId ? updated : f)));
  };

  const removeFilter = (filterId: string) => {
    onFiltersChange?.(activeFilters.filter((f) => f.filterId !== filterId));
  };

  const clearAllFilters = () => onFiltersChange?.([]);

  const activeCount = activeFilters.filter((f) => {
    if (f.operator === 'today' || f.operator === 'is_null' || f.operator === 'is_not_null') return true;
    if (f.value === null || f.value === undefined || f.value === '') return false;
    if (Array.isArray(f.value)) return f.value.length > 0;
    return true;
  }).length;

  return (
    <div className={cn('space-y-3', className)}>
      {/* ── Main row ── */}
      <div className="flex flex-col sm:flex-row gap-2">
        {/* Search */}
        {showSearch && (
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              placeholder={searchPlaceholder}
              value={localSearch}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9"
            />
            {localSearch && (
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => handleSearchChange('')}
              >
                <XCircle className="h-4 w-4" />
              </button>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Filters toggle */}
          {showFilters && availableFilters.length > 0 && (
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => setFiltersOpen(!filtersOpen)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span className="hidden sm:inline">Filters</span>
              {activeCount > 0 && (
                <span className="ml-1 bg-primary text-primary-foreground rounded-full px-1.5 text-xs">
                  {activeCount}
                </span>
              )}
              {filtersOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          )}

          {/* Columns */}
          {showConfigureView && allColumns.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Settings2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Columns</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Toggle Columns
                </div>
                <Separator className="my-1" />
                <div className="max-h-72 overflow-y-auto">
                  {allColumns.map((col) => {
                    const visible = visibleColumns.includes(col.id);
                    return (
                      <div
                        key={col.id}
                        className="flex items-center gap-2 px-2 py-1.5 cursor-pointer hover:bg-accent rounded-sm"
                        onClick={() =>
                          onVisibleColumnsChange?.(
                            visible
                              ? visibleColumns.filter((id) => id !== col.id)
                              : [...visibleColumns, col.id]
                          )
                        }
                      >
                        <Checkbox checked={visible} className="pointer-events-none" />
                        <span className="text-sm flex-1">{col.label}</span>
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
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Export</span>
                  <ChevronDown className="h-4 w-4" />
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
                <Button variant="outline" className="gap-2">
                  <ArrowUpDown className="h-4 w-4" />
                  <span className="hidden sm:inline">Sort</span>
                  {currentSort &&
                    (currentSort.direction === 1 ? (
                      <ArrowUp className="h-3 w-3 text-muted-foreground" />
                    ) : (
                      <ArrowDown className="h-3 w-3 text-muted-foreground" />
                    ))}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                {sortableFields.map((field) => {
                  const active = currentSort?.field === field.id;
                  return (
                    <DropdownMenuItem
                      key={field.id}
                      className="flex items-center justify-between"
                      onClick={() => {
                        if (!active) return onSortChange({ field: field.id, direction: 1 });
                        if (currentSort?.direction === 1) return onSortChange({ field: field.id, direction: -1 });
                        onSortChange(null);
                      }}
                    >
                      <span>{field.label}</span>
                      {active && (
                        <span className="flex items-center gap-1 text-xs">
                          {currentSort?.direction === 1 ? (
                            <><ArrowUp className="h-3 w-3" /> Asc</>
                          ) : (
                            <><ArrowDown className="h-3 w-3" /> Desc</>
                          )}
                        </span>
                      )}
                    </DropdownMenuItem>
                  );
                })}
                {currentSort && (
                  <>
                    <Separator className="my-1" />
                    <DropdownMenuItem
                      className="text-muted-foreground"
                      onClick={() => onSortChange(null)}
                    >
                      <X className="h-3 w-3 mr-2" /> Clear Sort
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Add */}
          {showAddButton && onAdd && (
            <Button onClick={onAdd} className="gap-2">
              <Plus className="h-4 w-4" />
              {addButtonLabel}
            </Button>
          )}

          {/* Bulk select */}
          {showBulkActions && onToggleSelection && (
            <Button
              variant={selectionMode ? 'default' : 'outline'}
              className="gap-2"
              onClick={onToggleSelection}
            >
              <Check className="h-4 w-4" />
              <span className="hidden sm:inline">
                {selectionMode ? 'Cancel Selection' : 'Select'}
              </span>
            </Button>
          )}

          {/* Custom actions */}
          {customActions.map((a) => (
            <Button key={a.id} variant={a.variant ?? 'outline'} onClick={a.onClick} className="gap-2">
              {a.icon}
              {a.label}
            </Button>
          ))}
        </div>
      </div>

      {/* ── Active filter tags ── */}
      {activeCount > 0 && !filtersOpen && (
        <div className="flex items-center gap-2 flex-wrap">
          {activeFilters.map((f) => (
            <FilterTag
              key={f.filterId}
              filter={f}
              field={availableFilters.find((af) => af.id === f.filterId)}
              onRemove={() => removeFilter(f.filterId)}
            />
          ))}
          <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={clearAllFilters}>
            Clear all
          </Button>
        </div>
      )}

      {/* ── Filters panel ── */}
      {showFilters && filtersOpen && (
        <Card className="p-4 space-y-3 border-border/50">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">Filters</span>
            {activeCount > 0 && (
              <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={clearAllFilters}>
                Clear all
              </Button>
            )}
          </div>

          {/* Available filter chips */}
          <div className="flex flex-wrap gap-2">
            {availableFilters.map((field) => {
              const active = !!activeFilters.find((f) => f.filterId === field.id);
              return (
                <button
                  key={field.id}
                  onClick={() => (active ? removeFilter(field.id) : addFilter(field))}
                  className={cn(
                    'text-xs px-2.5 py-1 rounded-full border transition-colors',
                    active
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background border-border hover:border-primary'
                  )}
                >
                  {field.label}
                </button>
              );
            })}
          </div>

          {/* Active filter controls */}
          {activeFilters.length > 0 && (
            <div className="space-y-2 pt-1">
              {activeFilters.map((f) => {
                const field = availableFilters.find((af) => af.id === f.filterId);
                if (!field) return null;
                return (
                  <BasicFilterRow
                    key={f.filterId}
                    filter={f}
                    field={field}
                    onChange={updateFilter}
                    onRemove={() => removeFilter(f.filterId)}
                  />
                );
              })}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
