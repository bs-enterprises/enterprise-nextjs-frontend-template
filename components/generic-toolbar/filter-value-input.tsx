'use client';

/**
 * components/generic-toolbar/filter-value-input.tsx
 *
 * Renders the value-input portion of a single filter row.
 * Extracted so FilterRow stays thin and this can be tested in isolation.
 */

import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { ActiveFilter, FilterField } from './types';

export interface FilterValueInputProps {
  filter: ActiveFilter;
  field: FilterField;
  onChange: (updated: ActiveFilter) => void;
  onEnterKey?: () => void; // Callback when Enter is pressed in text fields
}

export function FilterValueInput({ filter, field, onChange, onEnterKey }: FilterValueInputProps) {
  // No-value operators — only 'today' needs no value input
  const noValueOp = filter.operator === 'today';

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onEnterKey) {
      onEnterKey();
    }
  };

  if (noValueOp) {
    return (
      <span className="text-sm text-muted-foreground italic flex-1">
        (no value needed)
      </span>
    );
  }

  const { type, options = [], placeholder } = field;

  // ── Select / multi-select → pill chips ──────────────────────────────────────
  if (type === 'select' || type === 'multi_select') {
    return (
      <div className="flex flex-wrap gap-1 flex-1">
        {options.map((opt) => {
          const vals = ((filter.value as string[]) ?? []);
          const selected = vals.includes(opt.value);
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                const next = selected
                  ? vals.filter((v) => v !== opt.value)
                  : [...vals, opt.value];
                onChange({ ...filter, value: next });
              }}
              className={cn(
                'text-sm px-2.5 py-1 rounded-full border transition-colors',
                selected
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background border-border hover:border-primary/60',
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    );
  }

  // ── Boolean → Yes / No select ──────────────────────────────────────────────
  if (type === 'boolean') {
    return (
      <Select
        value={(filter.value as string) ?? ''}
        onValueChange={(v) => onChange({ ...filter, value: v })}
      >
        <SelectTrigger className="h-9 text-sm flex-1 min-w-[100px]">
          <SelectValue placeholder="Choose…" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="true" className="text-sm">Yes (true)</SelectItem>
          <SelectItem value="false" className="text-sm">No (false)</SelectItem>
        </SelectContent>
      </Select>
    );
  }

  // ── Date / datetime — use shadcn Calendar with UTC ISO strings ────────────
  if (type === 'date' || type === 'datetime') {
    if (filter.operator === 'between') {
      const range = (filter.value ?? {}) as { from?: string; to?: string };
      return (
        <div className="flex gap-2 flex-1">
          {/* Start date picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'h-9 justify-start text-left font-normal flex-1',
                  !range.from && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {range.from ? format(new Date(range.from), 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={range.from ? new Date(range.from) : undefined}
                onSelect={(date) =>
                  onChange({ ...filter, value: { ...range, from: date?.toISOString() || '' } })
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {/* End date picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'h-9 justify-start text-left font-normal flex-1',
                  !range.to && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {range.to ? format(new Date(range.to), 'PPP') : <span>End date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={range.to ? new Date(range.to) : undefined}
                onSelect={(date) =>
                  onChange({ ...filter, value: { ...range, to: date?.toISOString() || '' } })
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      );
    }

    // Single date picker for 'on', '>=', '<='
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'h-9 justify-start text-left font-normal flex-1',
              !filter.value && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {filter.value ? format(new Date(filter.value as string), 'PPP') : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={filter.value ? new Date(filter.value as string) : undefined}
            onSelect={(date) => onChange({ ...filter, value: date?.toISOString() || '' })}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    );
  }

  // ── Number ─────────────────────────────────────────────────────────────────
  if (type === 'number') {
    return (
      <Input
        type="number"
        className="h-9 text-sm flex-1"
        placeholder={placeholder ?? 'Value…'}
        value={(filter.value as string) ?? ''}
        onChange={(e) => onChange({ ...filter, value: e.target.value })}
      />
    );
  }

  // ── Text (default) ─────────────────────────────────────────────────────────
  return (
    <Input
      className="h-9 text-sm flex-1"
      placeholder={placeholder ?? `Filter by ${field.label}…`}
      value={(filter.value as string) ?? ''}
      onChange={(e) => onChange({ ...filter, value: e.target.value })}
      onKeyDown={handleKeyDown}
    />
  );
}
