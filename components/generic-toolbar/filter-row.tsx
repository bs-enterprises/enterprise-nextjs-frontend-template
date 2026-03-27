'use client';

/**
 * components/generic-toolbar/filter-row.tsx
 *
 * A single active-filter row:
 *   [Field label]  [Operator select – advanced only]  [Value input]  [Remove ×]
 *
 * `showOperator` is false in "Basic" mode, true in "Advanced" mode.
 */

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X } from 'lucide-react';
import { FilterValueInput } from './filter-value-input';
import type { ActiveFilter, FilterField, FilterOperator } from './types';
import { OPERATOR_LABELS, OPERATORS_BY_FIELD_TYPE } from './types';

export interface FilterRowProps {
  filter: ActiveFilter;
  field: FilterField;
  /** When true the operator dropdown is rendered (Advanced mode). */
  showOperator?: boolean;
  onChange: (updated: ActiveFilter) => void;
  onRemove: () => void;
  onEnterKey?: () => void; // Callback when Enter is pressed in text fields
}

export function FilterRow({
  filter,
  field,
  showOperator = true,
  onChange,
  onRemove,
  onEnterKey,
}: FilterRowProps) {
  const operators = field.operators ?? OPERATORS_BY_FIELD_TYPE[field.type] ?? [];

  const handleOpChange = (op: FilterOperator) => {
    // Reset value based on operator to avoid invalid date errors
    let newValue: any = '';
    if (op === 'today') {
      newValue = '';
    } else if (op === 'between') {
      newValue = { from: '', to: '' };
    } else if (op === 'on' || op === '>=' || op === '<=') {
      newValue = '';
    }
    onChange({
      ...filter,
      operator: op,
      value: newValue,
    });
  };

  return (
    <div className="flex items-center gap-2">
      {/* Field label */}
      <div className="text-sm font-medium text-muted-foreground min-w-[120px]">
        {field.label}
      </div>

      {/* Operator — shown only in Advanced mode */}
      {showOperator && operators.length > 1 && (
        <Select
          value={filter.operator}
          onValueChange={(v) => handleOpChange(v as FilterOperator)}
        >
          <SelectTrigger className="h-9 w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {operators.map((op) => (
              <SelectItem key={op} value={op}>
                {OPERATOR_LABELS[op] ?? op}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Value input */}
      <div className="flex-1 min-w-0 flex items-center">
        <FilterValueInput filter={filter} field={field} onChange={onChange} onEnterKey={onEnterKey} />
      </div>

      {/* Remove button */}
      <Button
        variant="ghost"
        size="sm"
        className="h-9 px-2 shrink-0 text-muted-foreground hover:text-destructive"
        onClick={onRemove}
        aria-label={`Remove ${field.label} filter`}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
