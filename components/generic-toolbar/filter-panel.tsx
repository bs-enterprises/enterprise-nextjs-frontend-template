'use client';

/**
 * components/generic-toolbar/filter-panel.tsx
 *
 * Collapsible filter panel rendered below the main toolbar row.
 *
 * Structure:
 *   ┌─────────────────────────────────────────────────────────────┐
 *   │  Filters   [Basic] [Advanced]       [Clear all]  [✕ close] │
 *   ├─────────────────────────────────────────────────────────────┤
 *   │  <FilterRow> per active filter                              │
 *   │  (empty state message when no filters)                      │
 *   ├─────────────────────────────────────────────────────────────┤
 *   │  + Add a filter…  (dropdown)                                │
 *   └─────────────────────────────────────────────────────────────┘
 *
 * - "Basic" mode hides the operator dropdown and resets operators to defaults.
 * - "Advanced" mode shows the operator dropdown for full control.
 */

import { useState, useRef, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FilterRow } from './filter-row';
import type { ActiveFilter, FilterField } from './types';
import { DEFAULT_OPERATOR_BY_FIELD_TYPE } from './types';

export interface FilterPanelProps {
  availableFilters: FilterField[];
  activeFilters: ActiveFilter[];
  onFiltersChange: (filters: ActiveFilter[]) => void;
  onClose: () => void;
  className?: string;
}

export function FilterPanel({
  availableFilters,
  activeFilters,
  onFiltersChange,
  onClose,
  className,
}: FilterPanelProps) {
  const [mode, setMode] = useState<'basic' | 'advanced'>('basic');
  const [pendingFilters, setPendingFilters] = useState<ActiveFilter[]>(activeFilters);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const flushPendingFilters = () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    onFiltersChange(pendingFilters);
  };

  // Sync pending filters when parent changes
  useEffect(() => {
    setPendingFilters(activeFilters);
  }, [activeFilters]);

  // Track if there are unapplied text filter changes
  const hasUnappliedTextChanges = useMemo(() => {
    return pendingFilters.some((pf) => {
      const field = availableFilters.find((af) => af.id === pf.filterId);
      if (field?.type !== 'text') return false;
      const applied = activeFilters.find((af) => af.filterId === pf.filterId);
      return JSON.stringify(pf.value) !== JSON.stringify(applied?.value);
    });
  }, [pendingFilters, activeFilters, availableFilters]);

  // Cleanup debounce timer on unmount and flush unapplied text edits.
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (hasUnappliedTextChanges) {
        onFiltersChange(pendingFilters);
      }
    };
  }, [hasUnappliedTextChanges, onFiltersChange, pendingFilters]);

  // ── Filter mutations ────────────────────────────────────────────────────────

  const addFilter = (fieldId: string) => {
    if (!fieldId || activeFilters.find((f) => f.filterId === fieldId)) return;
    const field = availableFilters.find((f) => f.id === fieldId);
    if (!field) return;
    const operator = DEFAULT_OPERATOR_BY_FIELD_TYPE[field.type];
    const value: unknown =
      field.type === 'select' || field.type === 'multi_select' ? [] : '';
    const newFilters = [...activeFilters, { filterId: field.id, operator, value }];
    onFiltersChange(newFilters);
    setPendingFilters(newFilters);
  };

  const updateFilter = (updated: ActiveFilter) => {
    const updatedPending = pendingFilters.map((f) =>
      f.filterId === updated.filterId ? updated : f
    );
    setPendingFilters(updatedPending);

    const field = availableFilters.find((af) => af.id === updated.filterId);
    const fieldType = field?.type;

    // For text: debounce/enter logic (unchanged)
    if (fieldType === 'text') {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      // Only apply if value is non-empty
      if (updated.value && String(updated.value).trim() !== '') {
        debounceTimerRef.current = setTimeout(() => {
          onFiltersChange(updatedPending);
        }, 2000);
      }
      // If value is empty, do not apply filter
      return;
    }

    // For date: only apply if value is present and valid
    if (fieldType === 'date' || fieldType === 'datetime') {
      if (updated.operator === 'between') {
        const v = updated.value as { from?: string; to?: string };
        if (v && v.from && v.to) {
          onFiltersChange(updatedPending);
        }
        // else, do not apply until both dates are selected
        return;
      } else if (updated.operator === 'on' || updated.operator === '>=' || updated.operator === '<=') {
        if (updated.value && String(updated.value).trim() !== '') {
          onFiltersChange(updatedPending);
        }
        // else, do not apply until a date is picked
        return;
      } else if (updated.operator === 'today') {
        // 'today' needs no value
        onFiltersChange(updatedPending);
        return;
      }
      // fallback: do not apply
      return;
    }

    // For other types (select, boolean, number): only apply if value is present
    if (updated.value !== null && updated.value !== undefined && updated.value !== '' && (!Array.isArray(updated.value) || updated.value.length > 0)) {
      onFiltersChange(updatedPending);
    }
    // else, do not apply
  };

  // Handle Enter key press in text fields - apply immediately
  const handleEnterKey = () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    onFiltersChange(pendingFilters);
  };

  const removeFilter = (filterId: string) => {
    const newFilters = activeFilters.filter((f) => f.filterId !== filterId);
    onFiltersChange(newFilters);
    setPendingFilters(newFilters);
  };

  const clearAll = () => {
    onFiltersChange([]);
    setPendingFilters([]);
  };

  // ── Mode switch ─────────────────────────────────────────────────────────────

  const handleModeChange = (next: 'basic' | 'advanced') => {
    if (next === 'basic' && mode === 'advanced') {
      // Reset all operators to type defaults when switching back to Basic
      const reset = activeFilters.map((f) => {
        const field = availableFilters.find((af) => af.id === f.filterId);
        if (!field) return f;
        return { ...f, operator: DEFAULT_OPERATOR_BY_FIELD_TYPE[field.type] };
      });
      onFiltersChange(reset);
    }
    setMode(next);
  };

  // Filters that have not yet been added
  const addable = availableFilters.filter(
    (af) => !activeFilters.find((f) => f.filterId === af.id),
  );

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <Card className={cn('p-4', className)}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h4 className="font-semibold text-sm">Filters</h4>

          {/* Basic / Advanced toggle — matches reference: Button variants inside a bordered flex container */}
          <div className="flex items-center border rounded-md">
            <Button
              variant={mode === 'basic' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleModeChange('basic')}
              className="h-7 rounded-r-none border-r"
            >
              Basic
            </Button>
            <Button
              variant={mode === 'advanced' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleModeChange('advanced')}
              className="h-7 rounded-l-none"
            >
              Advanced
            </Button>
          </div>

          {/* Show "Press Enter" hint when there are unapplied text changes */}
          {hasUnappliedTextChanges && (
            <span className="text-xs text-amber-600 font-medium">
              Press Enter to apply
            </span>
          )}
        </div>

        {/* Right-side header actions */}
        <div className="flex items-center gap-2">
          {activeFilters.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearAll}
              className="h-7 px-2 text-xs text-primary border-primary/40 hover:bg-primary/10 hover:text-primary"
            >
              <X className="h-3 w-3 mr-1" />
              Clear all
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-1"
            onClick={() => {
              if (hasUnappliedTextChanges) {
                flushPendingFilters();
              }
              onClose();
            }}
            aria-label="Close filters"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* ── Active filter rows ──────────────────────────────────────────────── */}
      {pendingFilters.length > 0 && (
        <>
          <div className="space-y-3">
            {pendingFilters.map((f) => {
              const field = availableFilters.find((af) => af.id === f.filterId);
              if (!field) return null;
              return (
                <FilterRow
                  key={f.filterId}
                  filter={f}
                  field={field}
                  showOperator={mode === 'advanced'}
                  onChange={updateFilter}
                  onRemove={() => removeFilter(f.filterId)}
                  onEnterKey={handleEnterKey}
                />
              );
            })}
          </div>
        </>
      )}

      {/* ── Add filter row ──────────────────────────────────────────────────── */}
      {addable.length > 0 && (
        <>
        <Separator/>
          <div className="">
            <Select value="" onValueChange={addFilter}>
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Select filter to add…" />
              </SelectTrigger>
              <SelectContent>
                {addable.map((f) => (
                  <SelectItem key={f.id} value={f.id}>
                    {f.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </>
      )}
    </Card>
  );
}
